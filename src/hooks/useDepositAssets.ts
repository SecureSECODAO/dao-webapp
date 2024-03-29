/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { erc20ABI } from '@/src/lib/constants/erc20ABI';
import { anyNullOrUndefined, isNullOrUndefined } from '@/src/lib/utils';
import { DiamondGovernanceClient } from '@secureseco-dao/diamond-governance-sdk';
import { BigNumber, constants } from 'ethers';
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';

export const pools = [
  'General',
  'Mining reward',
  'Verification reward',
] as const;
export type Pools = (typeof pools)[number];

export type TokenData = {
  address: Address;
  isNativeToken: boolean;
  decimals: number;
};

export type useDepositAssetsProps = {
  token?: TokenData;
  pool?: Pools;
  amount?: BigNumber;
};

/**
 * Hook to deposit assets to the DAO that the current Diamond Governance client has been instantiated with.
 * @param props The properties to configure the hook.
 * @param props.token The token to deposit.
 * @param props.pool The pool to deposit to.
 * @param props.amount The amount to deposit.
 * @returns An object containing the loading state, error state, approval state and a method to deposit assets.
 * @see useDiamondSDKContext
 */
export const useDepositAssets = ({
  token,
  pool,
  amount,
}: useDepositAssetsProps) => {
  // ==================================
  // Hook state
  // ==================================
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // ==================================
  // Context
  // ==================================
  const { address } = useAccount();
  const { client, daoAddress, secoinAddress } = useDiamondSDKContext();
  const debouncedTokenId = useDebounce(
    [amount ?? BigNumber.from(0), token?.address],
    1000
  );

  // ==================================
  // Hooks for contract interaction
  // ==================================
  // === Contract interactions to send tokens to a pool ===
  // ERC20 tokens to general
  const {
    config: configERC20,
    isLoading: loadingERC20,
    error: errorERC20,
  } = usePrepareContractWrite({
    address: token?.address,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [daoAddress as Address, amount ?? BigNumber.from(0)],
    enabled:
      Boolean(debouncedTokenId) && !token?.isNativeToken && pool === 'General',
  });

  const { writeAsync: sendERC20 } = useContractWrite(configERC20);

  // Native tokens (MATIC) to general
  const {
    config: configNative,
    isLoading: loadingNative,
    error: errorNative,
  } = usePrepareSendTransaction({
    request: { to: daoAddress as string, value: amount ?? BigNumber.from(0) },
    chainId: PREFERRED_NETWORK_METADATA.id,
    enabled:
      Boolean(debouncedTokenId) && token?.isNativeToken && pool === 'General',
  });
  const { sendTransactionAsync: sendNative } = useSendTransaction(configNative);

  // SECOIN to specific pool
  const sendToPool = async (
    client: DiamondGovernanceClient,
    amount: BigNumber
  ) => {
    if (pool === 'Mining reward') {
      const miniPool = await client.pure.IMiningRewardPoolFacet();
      return miniPool.donateToMiningRewardPool(amount!);
    }
    if (pool === 'Verification reward') {
      const veriPool = await client.pure.IVerificationRewardPoolFacet();
      return veriPool.donateToVerificationRewardPool(amount!);
    }
    throw new Error();
  };

  // === Contract interactions to read and set allowance (in the case of SECOIN to specific pool) ===
  // Read if the allowance is enough
  const { data: approvedAmountU } = useContractRead({
    address: secoinAddress as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as Address, client?.pure.pluginAddress as Address],
    enabled: pool !== 'General' && client !== null && address !== null,
    watch: true,
  });
  const approvedAmount = approvedAmountU as BigNumber | undefined;

  // Write to contract to set allowance
  const { config: approveConfig } = usePrepareContractWrite({
    address: secoinAddress as Address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      client?.pure.pluginAddress as Address,
      amount ?? constants.MaxUint256,
    ],
    enabled: pool !== 'General' && client !== null && address !== null,
  });
  const { writeAsync: writeApproveAsync } = useContractWrite(approveConfig);

  // === Contract interactions to get user balance ===
  const { data: _balance } = useBalance({
    address: address as `0x${string}` | undefined,
    // When the provided token address is undefined, the native balance will be fetched.
    token: token?.isNativeToken
      ? undefined
      : (token?.address as `0x${string}` | undefined),
    chainId: PREFERRED_NETWORK_METADATA.id,
    enabled: token !== undefined,
    watch: true,
  });

  // ==================================
  // Exported methods/constants to abstract contract calls
  // ==================================
  const depositAssets = () => {
    if (!client) throw new Error();
    if (isNullOrUndefined(amount)) throw new Error();
    if (isNullOrUndefined(pool)) throw new Error();
    if (isNullOrUndefined(token)) throw new Error();

    if (pool !== 'General') {
      return sendToPool(client, amount);
    }
    if (token.isNativeToken && sendNative) {
      return sendNative();
    }
    if (sendERC20) {
      return sendERC20();
    }
    throw new Error();
  };

  const approve = () => {
    if (!writeApproveAsync) throw new Error();
    return writeApproveAsync();
  };

  const balance = anyNullOrUndefined(pool, token) ? undefined : _balance;

  // ==================================
  // Effects to update hook state
  // ==================================
  // Keep error state updated
  useEffect(() => {
    const errorMsg = 'Can not perform transaction';
    if (error !== null && error !== errorMsg) return;

    if (
      (pool === 'General' && token?.isNativeToken && errorNative) ||
      (pool === 'General' && !token?.isNativeToken && errorERC20)
    ) {
      setError(errorMsg);
    } else {
      setError(null);
    }
  }, [errorERC20, errorNative]);

  // Keep loading state updated
  useEffect(() => {
    //Could be more efficient, but this is more readable
    const loading =
      (loadingNative && token?.isNativeToken && pool === 'General') ||
      (loadingERC20 && !token?.isNativeToken && pool === 'General') ||
      client === null;
    setIsLoading(loading);
  }, [loadingERC20, loadingNative, client, pool, token]);

  // Keep approval state updated
  useEffect(() => {
    const approvalNotNeeded = pool === 'General' || pool === undefined;
    const amountUnkownButApprovedMoreThanZero =
      isNullOrUndefined(amount) && approvedAmount?.gt(constants.Zero);
    const approvedMoreThanAmount =
      amount !== undefined && approvedAmount?.gte(amount);
    const approved =
      approvalNotNeeded ||
      amountUnkownButApprovedMoreThanZero ||
      approvedMoreThanAmount ||
      false;

    setIsApproved(approved);
  }, [pool, amount, approvedAmount]);

  return { isLoading, error, balance, isApproved, depositAssets, approve };
};

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
