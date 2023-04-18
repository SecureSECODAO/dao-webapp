/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Loading from '@/src/components/icons/Loading';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { cn } from '@/src/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { format } from 'date-fns';
import { createElement } from 'react';
import { HiCheckCircle, HiCube, HiXCircle } from 'react-icons/hi2';

// The icon and label of the milestone get the text colors defined in this variant
// the rest of the text/content of gets the default subtext color
const variants = cva('flex flex-row gap-x-2 items-start', {
  variants: {
    variant: {
      loading: 'text-slate-500 dark:text-slate-400',
      done: 'text-slate-500 dark:text-slate-400',
      executed: 'text-green-400 dark:text-green-300',
      failed: 'text-red-400 dark:text-red-300',
    },
  },
  defaultVariants: {
    variant: 'loading',
  },
});

const proposalMilestoneIcon = {
  loading: Loading,
  done: HiCheckCircle,
  executed: HiCheckCircle,
  failed: HiXCircle,
};

export interface ProposalMilestoneProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  label: string;
  date?: Date | null;
  blockNumber?: number | null;
}

const ProposalMilestone = ({
  className,
  variant,
  label,
  date = null,
  blockNumber = null,
  ...props
}: ProposalMilestoneProps) => {
  const icon = createElement(
    proposalMilestoneIcon[variant as keyof typeof proposalMilestoneIcon],
    { className: 'w-5 h-5 shrink-0' }
  );

  return (
    <div {...props} className={cn(variants({ variant }), className)}>
      {/* #202a3c is the background color, slate-700/50, but without transparency */}
      <div className="mt-0.5 rounded-full bg-white dark:bg-[#202a3c]">
        {icon}
      </div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="font-medium">{label}</p>
          {blockNumber && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="hover:cursor-help">
                  <div className="flex flex-row items-center gap-x-1 text-slate-400 dark:text-slate-500">
                    <p className="text-sm">{blockNumber.toLocaleString()}</p>
                    <HiCube className="h-4 w-4 shrink-0" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Transaction block number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {date && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {format(date, 'Pp O')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProposalMilestone;
