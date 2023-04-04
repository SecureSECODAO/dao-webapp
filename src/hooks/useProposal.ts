import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import {
  TokenVotingClient,
  ProposalStatus,
  TokenType,
  VoteValues,
  TokenVotingProposal,
} from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

export type DetailedProposal = TokenVotingProposal;

export type UseProposalData = {
  loading: boolean;
  error: string | null;
  proposal: DetailedProposal | null;
};

export type UseProposalProps = {
  id: string | undefined;
  useDummyData?: boolean;
};

const dummyProposal: DetailedProposal = {
  id: '0x1234567890123456789012345678901234567890_0x0',
  dao: {
    address: import.meta.env.VITE_DAO_ADDRESS,
    name: 'SecureSECO dummy DAO',
  },
  creatorAddress: '0x1234567890123456789012345678901234567890',
  metadata: {
    title: 'Test Proposal',
    summary: 'test proposal summary',
    description: 'this is a long description',
    resources: [
      {
        url: 'https://dicord.com/...',
        name: 'Discord',
      },
      {
        url: 'https://docs.com/...',
        name: 'Document',
      },
    ],
    media: {
      header: 'https://.../image.jpeg',
      logo: 'https://.../image.jpeg',
    },
  },
  startDate: new Date('2023-03-16T00:10:00.000Z'),
  endDate: new Date('2023-03-23T00:00:00.000Z'),
  creationDate: new Date('2023-03-16T00:00:00.000Z'),
  creationBlockNumber: 812345,
  executionDate: null,
  executionBlockNumber: 812345,
  actions: [
    {
      to: '0xD6E6C74C6054AD232C7A9833E89714EA39734A0F',
      value: 0n,
      data: new Uint8Array([
        64, 193, 15, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 134, 140, 142,
        209, 46, 173, 55, 239, 118, 69, 126, 123, 100, 67, 25, 46, 35, 20, 66,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        13, 224, 182, 179, 167, 100, 0, 0,
      ]),
    },
  ],
  result: {
    yes: 700000n,
    no: 300000n,
    abstain: 0n,
  },
  settings: {
    minParticipation: 0.5,
    supportThreshold: 0.25,
    duration: 7200,
  },
  token: {
    address: '0x1234567890123456789012345678901234567890',
    name: 'The Token',
    symbol: 'TOK',
    decimals: 18,
    type: TokenType.ERC20,
  },
  usedVotingWeight: 1000000n,
  totalVotingWeight: 1000000n,
  executionTxHash: null,
  votes: [
    {
      address: '0x123456789123456789123456789123456789',
      vote: VoteValues.YES,
      voteReplaced: false,
      weight: 1000000000000000000n,
    },
    {
      address: '0x234567891234567891234567891234567890',
      vote: VoteValues.NO,
      voteReplaced: false,
      weight: 1000000000000000000n,
    },
  ],
  status: ProposalStatus.ACTIVE,
};

export const useProposal = ({
  id,
  useDummyData = false,
}: UseProposalProps): UseProposalData => {
  const [proposal, setProposal] = useState<DetailedProposal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingClient } = useAragonSDKContext();

  const fetchProposal = async (client: TokenVotingClient) => {
    if (!id) {
      setError('Proposal not found');
      setLoading(false);
      return;
    }

    try {
      const daoProposal: DetailedProposal = (await client.methods.getProposal(
        id
      )) as DetailedProposal;

      if (daoProposal) {
        // Check if the proposal is from the correct DAO
        if (daoProposal.dao.address !== import.meta.env.VITE_DAO_ADDRESS) {
          setError('That proposal does not exist in this DAO');
        } else {
          setProposal(daoProposal);
          setError(null);
        }
        setLoading(false);
      } else {
        setError('Proposal not found');
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
      setLoading(false);
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setProposal(dummyProposal);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!votingClient) return;
    setLoading(true);
    fetchProposal(votingClient);
  }, [votingClient, id]);

  return {
    loading,
    error,
    proposal,
  };
};