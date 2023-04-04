// Address.tsx
import { cva } from 'class-variance-authority';
import React from 'react';
import { HiClipboardCopy } from 'react-icons/hi';
import { useAccount } from 'wagmi';

//TODO improve this (hidde will make it way better later)
export enum AddressLength {
  Small = 10,
  Medium = 20,
  Large = 40,
  Full = -1, // no trunction
}

type AddressProps = {
  address: string;
  maxLength: AddressLength;
  hasLink: boolean;
  showCopy: boolean;
  replaceYou?: boolean;
};

const truncateMiddle = (address: string, maxLength: number) => {
  if (address.length <= maxLength || maxLength < 0) return address;
  const lengthToKeep = maxLength - 2;
  const start = address.slice(0, lengthToKeep / 2);
  const end = address.slice(-lengthToKeep / 2);
  return `${start}…${end}`;
};

const copyToClipboard = (address: string) => {
  navigator.clipboard.writeText(address);
};

export const Address: React.FC<AddressProps> = ({
  address,
  maxLength,
  hasLink,
  showCopy,
  replaceYou = true,
}) => {
  const { address: currentUser } = useAccount();
  const etherscanURL = `https://etherscan.io/address/${address}`;
  const content =
    address.toLowerCase() === currentUser?.toLowerCase() && replaceYou
      ? 'you'
      : truncateMiddle(address, maxLength);

  const handleClick = () => {
    if (showCopy) {
      copyToClipboard(address);
    }
  };

  return (
    <div className="flex items-center">
      {hasLink ? (
        <a
          href={etherscanURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          {content}
        </a>
      ) : (
        <span>{content}</span>
      )}

      {showCopy && (
        <button
          onClick={handleClick}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <HiClipboardCopy size={18} />
        </button>
      )}
    </div>
  );
};
