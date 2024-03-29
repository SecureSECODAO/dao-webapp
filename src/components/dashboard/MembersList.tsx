/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { Skeleton } from '@/src/components/ui/Skeleton';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { Member } from '@/src/hooks/useMembers';
import { TOKENS } from '@/src/lib/constants/tokens';

/**
 * @returns A card containg showing a DAO member's address, jazzicon and REP balance (the latter only if available)
 */
const MemberCard = ({ member }: { member: Member }) => {
  return (
    <Card
      size="sm"
      className="flex flex-row items-center justify-between bg-popover"
    >
      <Address address={member.address} hasLink replaceYou jazziconSize="md" />
      {member.bal !== null && (
        <TokenAmount
          amount={member.bal}
          tokenDecimals={TOKENS.rep.decimals}
          displayDecimals={0}
          symbol={TOKENS.rep.symbol}
        />
      )}
    </Card>
  );
};

/**
 * @returns An element containing a list of members, showing their address, jazzicon and REP balance
 */
const MembersList = ({
  members,
  loading,
  error,
}: {
  members: Member[];
  loading: boolean;
  error: string | null;
}) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        An error was encountered
      </p>
    );
  if (members === null || members.length === 0)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        No members found
      </p>
    );

  return (
    <div className="flex flex-col gap-y-2">
      {members.map((member) => (
        <MemberCard key={member.address} member={member} />
      ))}
    </div>
  );
};

export default MembersList;
