/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useTokenFetch } from '@/src/hooks/useTokenFetch';
import { TokenType } from '@/src/lib/constants/tokens';
import { TokenInfo } from '@/src/lib/utils/token';

export type useTokenInfoProps = {
  address: string;
  tokenType?: TokenType;
  enabled?: boolean;
};

/**
 * Hook to fetch token info for a given address using the `getTokenInfo` function.
 * @param address The address of the token.
 * @param tokenType The type of token to fetch info for (either erc20 or erc721). Defaults to erc20.
 * @param enabled Whether to enable the hook or not (will not fetch when disabled).
 * @returns An object containing the token info, loading state and error state.
 * @see fetchTokenInfo
 */
export const useTokenInfo = ({
  address,
  enabled = true,
  tokenType,
}: useTokenInfoProps) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getTokenInfo } = useTokenFetch();

  const updateTokenInfo = async () => {
    setError(null);
    setLoading(true);
    try {
      const info = await getTokenInfo(address, tokenType);
      if (!info) setError('Could not load token info');
      setTokenInfo(info);
    } catch (e) {
      console.error(e);
      setError('Could not load token info');
      setTokenInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      updateTokenInfo();
    } else {
      setLoading(false);
      setError(null);
      setTokenInfo(null);
    }
  }, [address, tokenType]);

  return { tokenInfo, loading, error };
};
