/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @file PendingVerificationCard - Component that displays information about an ongoing verification
 * Contains a button to verify, and additional information about the verification
 */

import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import {
  PendingVerification,
  StampInfo,
  VerificationHistory,
  availableStamps,
  verificationAddress,
} from '@/src/pages/Verification';
import { HiCalendar, HiClock, HiQuestionMarkCircle } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { verificationAbi } from '@/src/assets/verificationAbi';
import { useState } from 'react';
import { useToast } from '@/src/hooks/useToast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import CategoryList, { Category } from '@/src/components/ui/CategoryList';

/**
 * @returns A Card element containing information about a previous verification
 */
const PendingVerificationCard = ({
  verification,
  refetch,
  pendingVerifications,
  setPendingVerifications,
}: {
  verification: PendingVerification;
  refetch: () => void;
  pendingVerifications: PendingVerification[];
  setPendingVerifications: (
    pendingVerifications: PendingVerification[]
  ) => void;
}) => {
  const fallBackStampInfo = {
    id: 'unknown',
    displayName: 'Unknown',
    url: 'https://www.google.com',
    icon: <HiQuestionMarkCircle />,
  } as StampInfo;

  // Find the stamp info for the verification
  const stampId = verification.providerId;
  const stampInfo: StampInfo =
    availableStamps.find((stampInfo) => stampInfo.id === stampId) ??
    fallBackStampInfo;

  const { addressToVerify, hash, timestamp, providerId, sig } = verification;

  // This function is used to write to the contract
  const {
    config,
    isError: isPrepareError,
    error: prepareError,
  } = usePrepareContractWrite({
    address: verificationAddress,
    abi: verificationAbi,
    functionName: 'verifyAddress',
    args: [addressToVerify, hash, parseInt(timestamp ?? ''), providerId, sig],
  });

  const { data, writeAsync: write } = useContractWrite(config);

  // This hook allows us to wait for the transaction to be completed
  const { isLoading, isSuccess, isError, error } = useWaitForTransaction({
    hash: data?.hash,
  });

  const [isBusy, setIsBusy] = useState(false);
  const { promise: promiseToast } = useToast();

  // We calculate how much time is left for the verification to expire
  const timeLeft = Math.max(
    0,
    // 1 hour to verify
    parseInt(timestamp ?? '') + 3600 - Math.floor(Date.now() / 1000)
  );

  /**
   * Actually makes a write call to the contract to verify the address
   * @returns {Promise<void>} Promise that resolves when the verification settles
   */
  const verify = async (): Promise<void> => {
    setIsBusy(true);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!write) {
        setIsBusy(false);
        return reject('Contract write not ready');
      }

      try {
        const txResult = await write();

        txResult
          .wait()
          .then(() => {
            setIsBusy(false);
            refetch();

            // Remove from pendingVerifications
            setPendingVerifications(
              pendingVerifications.filter(
                (pendingVerification) => pendingVerification.hash !== hash
              )
            );

            resolve();
          })
          .catch((error: any) => {
            console.error(
              'FinishVerifcation ~ verify ~ txResult.catch ~ Verification failed',
              error
            );
            setIsBusy(false);
            refetch();
            reject(error);
          });
      } catch (error) {
        console.error(error);
        setIsBusy(false);
        refetch();
        reject(error);
      }
    });
  };

  // Creates categories from verification fields
  function getCategories(verification: any): Category[] {
    const categories: Category[] = [];
    for (const category in verification) {
      categories.push({
        title: category,
        items: [
          {
            label: 'Value',
            value:
              verification[category].length < 32
                ? verification[category]
                : verification[category].substring(0, 32) + '...',
          },
        ],
      });
    }

    return categories;
  }

  return (
    <Card variant="light" className="flex flex-col gap-y-2 font-normal">
      <div className="flex items-center gap-x-2">
        {stampInfo.icon}
        <Header level={3}>{stampInfo.displayName}</Header>
      </div>
      <div className="flex items-center gap-x-2 text-popover-foreground/80">
        <HiClock className="h-5 w-5 shrink-0" />
        <p className="font-normal">
          {timeLeft > 0
            ? `Expires in ${Math.floor(timeLeft / 60)} minutes`
            : 'Expired'}
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="subtle" label="View details" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verification details</DialogTitle>
              <DialogDescription asChild>
                <CategoryList categories={getCategories(verification)} />
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <div className="flex items-end justify-end">
                <Button variant="subtle" label="Close" className="self-end" />
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => {
            promiseToast(verify(), {
              loading: 'Verifying, please wait...',
              success: 'Successfully verified!',
              error: (e) => ({
                title: 'Verification failed',
                description: e.message,
              }),
            });
          }}
          disabled={
            !write || isBusy || isLoading || isSuccess || isPrepareError
          }
        >
          {isLoading
            ? 'Verifying...'
            : isSuccess
            ? 'Transaction Sent'
            : isError
            ? 'Verification failed: ' + error?.message
            : 'Verify Account'}
        </Button>
      </div>
    </Card>
  );
};

export default PendingVerificationCard;
