/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useState } from 'react';
import { toast } from '@/src/hooks/useToast';
import { BigNumber, ContractTransaction } from 'ethers';
import { MainCard } from '@/src/components/ui/MainCard';
import { HiGift } from 'react-icons/hi2';
import { TOKENS } from '@/src/lib/constants/tokens';
import TokenAmount from '@/src/components/ui/TokenAmount';

/**
 * @returns A card that allows the users to claim their reward for verifying
 */
const OneTimeRewardCard = ({
  reward,
  claimReward,
  refetch,
}: {
  reward: BigNumber | null;
  claimReward: () => Promise<ContractTransaction>;
  refetch: () => void;
}) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimReward = async () => {
    if (isClaiming) return;

    setIsClaiming(true);
    toast.contractTransaction(claimReward, {
      success: 'Successfully claimed reward!',
      error: (err: any) => ({
        title: 'Failed to claim reward',
        description: err.message,
      }),
      onFinish() {
        setIsClaiming(false);
        refetch();
      },
    });
  };

  return (
    <MainCard
      className="flex flex-col gap-y-2"
      icon={HiGift}
      header="Verification reward"
    >
      <p>
        You are eligible to claim a onetime verification reward for verifying
        your wallet with one or more providers.
      </p>
      <Card variant="outline" className="flex flex-row items-center gap-x-2">
        Claimable amount:
        <strong>
          <TokenAmount
            amount={reward}
            tokenDecimals={TOKENS.rep.decimals}
            symbol={TOKENS.rep.symbol}
          />
        </strong>
      </Card>
      <Button
        label="Claim reward"
        onClick={handleClaimReward}
        disabled={isClaiming}
      />
    </MainCard>
  );
};

export default OneTimeRewardCard;
