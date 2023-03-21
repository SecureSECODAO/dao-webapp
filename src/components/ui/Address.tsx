// Address.tsx
import React from 'react';
import { HiClipboardCopy } from 'react-icons/hi';

//TODO improve this (hidde will make it way better later)

type AddressProps = {
  address: string;
  maxLength: number;
  hasLink: boolean;
  showCopy: boolean;
};

const truncateMiddle = (address: string, maxLength: number) => {
  if (address.length <= maxLength) return address;
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
}) => {
  const etherscanURL = `https://etherscan.io/address/${address}`;
  const truncatedAddress = truncateMiddle(address, maxLength);

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
          {truncatedAddress}
        </a>
      ) : (
        <span>{truncatedAddress}</span>
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
