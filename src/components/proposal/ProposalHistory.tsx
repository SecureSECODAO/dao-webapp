/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import History from '@/src/components/icons/History';
import ProposalMilestone, {
  ProposalMilestoneProps,
} from '@/src/components/proposal/ProposalMilestone';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  Proposal,
  ProposalStatus,
} from '@secureseco-dao/diamond-governance-sdk';
import { compareAsc } from 'date-fns';

/**
 * Extract the milestones of a proposal, depending on its status. The following milestones are returned per status:
 * - Pending: Published, Pending
 * - Active: Published, Started, Running
 * - Succeeded: Published, Started, Succeeded, Awaiting execution
 * - Defeated: Published, Started, Defeated
 * - Executed: Published, Started, Succeeded, Executed
 * @param proposal Proposal to extract milestones from
 * @returns A list of ProposalMilestoneProps to be passed to a ProposalMilestone component
 */
const getProposalMilestones = (proposal: Proposal) => {
  const res: ProposalMilestoneProps[] = [];

  res.push({
    label: 'Published',
    variant: 'done',
    date: proposal.creationDate,
    blockNumber: proposal.data.parameters.snapshotBlock.toNumber(),
  });

  if (proposal.status !== ProposalStatus.Pending)
    res.push({
      label: 'Started',
      variant: 'done',
      date: proposal.startDate,
    });

  switch (proposal.status) {
    case ProposalStatus.Pending:
      res.push({
        label: 'Pending',
        variant: 'loading',
        date: proposal.startDate,
      });
      break;
    case ProposalStatus.Active:
      res.push({
        label: 'Running',
        variant: 'loading',
        date: proposal.endDate,
      });
      break;
    case ProposalStatus.Succeeded:
      res.push({
        label: 'Succeeded',
        variant: 'done',
        // If the executionDate is earlier than endDate, there was an early execution, so executionDate is also the end date
        // Note that in general, the exectionDate will not be defined if the proposal status is unequal to Executed
        date:
          proposal.executionDate &&
          compareAsc(proposal.executionDate, proposal.endDate) === -1
            ? proposal.executionDate
            : proposal.endDate,
      });
      if (proposal.actions.length > 0)
        res.push({
          label: 'Awaiting execution',
          variant: 'loading',
        });
      break;
    case ProposalStatus.Defeated:
      res.push({
        label: 'Defeated',
        variant: 'failed',
        date: proposal.endDate,
      });
      break;
    case ProposalStatus.Executed:
      res.push(
        {
          label: 'Succeeded',
          variant: 'done',
          date: proposal.endDate,
        },
        {
          label: 'Executed',
          variant: 'executed',
          date: proposal.executionDate,
          blockNumber: proposal.data.executed.toNumber(),
        }
      );
      break;
  }

  return res;
};

/**
 * Shows the history of a proposal, including milestones and dates, in a MainCard
 * @param props.proposal Proposal to show the history of
 * @param props.loading Whether the proposal is loading
 * @returns MainCard component with the history of a proposal
 */
const ProposalHistory = ({
  proposal,
  loading = false,
  className,
}: {
  proposal: Proposal | null;
  loading?: boolean;
  className?: string;
}) => {
  return (
    <MainCard
      loading={loading}
      className={className}
      icon={History}
      header="History"
    >
      <div className="relative">
        <div className="absolute bottom-6 left-[0.5625rem] top-2 w-0.5 bg-popover-foreground/60" />
        <div className="relative z-10 flex flex-col gap-y-6">
          {proposal &&
            getProposalMilestones(proposal).map((milestone, i) => (
              <ProposalMilestone key={i} {...milestone} className="" />
            ))}
        </div>
      </div>
    </MainCard>
  );
};

export default ProposalHistory;
