/**
 * Components that are used to add new actions to the 3th step of the new proposal form.
 */
import { Card } from '@/src/components/ui/Card';
import { HiPlus, HiArrowRight, HiOutlineBolt } from 'react-icons/hi2';
import {
  emptyActionWithdrawFormData,
  emptyActionMintTokenFormData,
  ActionFormData,
} from '../../lib/Actions';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';

/**
 * @param append function that is called with ActionFormData to be appended to some parent-like component.
 * @returns A button-like component to add proposal actions.
 */
export const AddActionButton = ({
  append,
}: {
  // eslint-disable-next-line no-unused-vars
  append: (fn: ActionFormData) => void;
}) => {
  const handleAddWithdrawAssetsAction = () =>
    append(emptyActionWithdrawFormData);

  const handleAddMintTokensAction = () => {
    append(emptyActionMintTokenFormData);
  };

  return (
    <Dialog>
      <DialogTrigger className="h-10 w-fit rounded border border-slate-300 bg-slate-100 py-2 px-4 text-slate-900 hover:bg-slate-200 focus:ring-primary-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/50 dark:focus:ring-primary-400">
        <div className="flex w-fit flex-row items-center gap-x-2">
          <HiPlus className="h-5 w-5" />
          Add action
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add action</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogClose
          className="flex h-10 w-fit flex-col gap-2 bg-slate-100 py-2 px-4 text-slate-900 hover:bg-slate-200 focus:ring-primary-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/50 dark:focus:ring-primary-400"
          onClick={handleAddWithdrawAssetsAction}
        >
          <div className="flex w-fit flex-row items-center gap-x-2">
            <HiArrowRight />
            Withdraw assets
          </div>
        </DialogClose>
        <DialogClose
          className="flex h-10 w-fit flex-col gap-2 bg-slate-100 py-2 px-4 text-slate-900 hover:bg-slate-200 focus:ring-primary-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/50 dark:focus:ring-primary-400"
          onClick={handleAddMintTokensAction}
        >
          <div className="flex w-fit flex-row items-center gap-x-2">
            <HiArrowRight />
            Mint tokens
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

/**
 * @param append function that is called with ActionFormData to be appended to some parent-like component.
 * @returns A card component to add proposal-actions.
 */
export const AddActionCard = ({
  append,
}: {
  // eslint-disable-next-line no-unused-vars
  append: (fn: ActionFormData) => void;
}) => (
  <Card
    variant="light"
    className="flex max-w-4xl flex-col items-center gap-4 self-center"
  >
    <HiOutlineBolt className="h-20 w-16" />
    <h2 className="text-4xl">Add action</h2>
    <p className="max-w-xl text-center text-lg leading-6">
      This action will execute if the vote passes. A common automatic action is
      transferring funds to a guild or person if their proposal passes a vote.
    </p>
    <AddActionButton append={append} />
  </Card>
);