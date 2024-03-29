/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview ProposalVotes.tsx
 * MainCard component that will show the votes for a proposal, including which addresses voted for specific option in an accordion
 * and allow the user to submit their own vote if the proposal is active (and they are eligible to vote).
 */

import VotesContent from '@/src/components/proposal/VotesContent';
import { Button } from '@/src/components/ui/Button';
import CategoryList, { Category } from '@/src/components/ui/CategoryList';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { CanVote } from '@/src/hooks/useProposal';
import { calcBigNumberPercentage, cn } from '@/src/lib/utils';
import {
  AddressVotes,
  Proposal,
  ProposalStatus,
} from '@secureseco-dao/diamond-governance-sdk';
import { format } from 'date-fns';
import { BigNumber } from 'ethers';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

interface ProposalVotesProps {
  proposal: Proposal | null;
  votes: AddressVotes[] | null;
  loading: boolean;
  className?: string;
  refetch: () => void;
  canVote: CanVote;
  totalVotingWeight: BigNumber;
}

/**
 * Get the list of categories that describe the voting details to be passed to the CategoryList component
 * @param proposal The proposal to show the voting details for
 * @returns List of Category objects to be passed to the CategoryList component
 */
const getCategories = (
  proposal: Proposal | null,
  currentParticipation: number,
  totalVotingWeight: BigNumber
): Category[] => {
  if (!proposal) return [];

  const uniqueVoters = proposal.data.voterList.reduce(
    (acc, vote) => acc.add(vote),
    new Set<string>()
  ).size;

  const minParticipation = calcBigNumberPercentage(
    proposal.data.parameters.minParticipationThresholdPower,
    totalVotingWeight
  );

  return [
    {
      title: 'Decision rules',
      items: [
        {
          label: 'Approval threshold',
          value: `≥ ${
            // Converts the supportThreshold from integer to percentage (e.g. 500000000 -> 50%)
            // Necessary because this number has to be stored as an integer on the blockchain, so cannot have decimals
            proposal.data.parameters.supportThreshold / 10 ** 4
          }% Yes`,
        },
        {
          label: 'Minimum participation / quorum',
          value: `≥ ${minParticipation}%`,
        },
      ],
    },
    {
      title: 'Voting activity',
      items: [
        {
          label: 'Current participation',
          value: `${currentParticipation}%`,
        },
        {
          label: 'Unique voters',
          value: uniqueVoters.toString(),
        },
      ],
    },
    {
      title: 'Voting period',
      items: [
        {
          label: 'Start',
          value: format(new Date(proposal.startDate), 'Pp'),
        },
        {
          label: 'End',
          value: format(new Date(proposal.endDate), 'Pp'),
        },
      ],
    },
  ];
};

/**
 * MainCard component showing the votes of a proposal, other details and allowing user to vote (if eligible)
 * @param props.proposal The proposal to show the votes for
 */
const ProposalVotes = ({
  proposal,
  votes,
  loading,
  className,
  ...props
}: ProposalVotesProps) => {
  const currentParticipation = proposal
    ? calcBigNumberPercentage(
        proposal.data.tally.yes
          .add(proposal.data.tally.no)
          .add(proposal.data.tally.abstain),
        props.totalVotingWeight
      )
    : 0;

  return (
    <MainCard
      loading={loading}
      className={cn(
        'col-span-full flex flex-col gap-y-4 lg:col-span-4',
        className
      )}
      icon={HiChatBubbleLeftRight}
      header={
        <DefaultMainCardHeader
          value={proposal?.data.voterList.length ?? 0}
          label="votes"
        />
      }
      aside={
        <div className="flex items-center gap-x-2">
          <p
            className={cn(
              'text-highlight-foreground/80 leading-4',
              proposal?.status === ProposalStatus.Active && 'ml-6'
            )}
          >
            <span className="hidden xs:inline-block">Participation:</span>{' '}
            {currentParticipation}%
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="subtle" label="View details" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Voting details</DialogTitle>
                <DialogDescription asChild>
                  <CategoryList
                    categories={getCategories(
                      proposal,
                      currentParticipation,
                      props.totalVotingWeight
                    )}
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <div className="flex items-end justify-end">
                  <Button variant="subtle" label="Close" className="self-end" />
                </div>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {proposal && (
        <VotesContent proposal={proposal} votes={votes ?? []} {...props} />
      )}
    </MainCard>
  );
};

export default ProposalVotes;
