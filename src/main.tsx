/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@/src/components/layout/Layout';
import Dashboard from '@/src/pages/Dashboard';
import ErrorPage from '@/src/pages/ErrorPage';
import Governance from '@/src/pages/Governance';
import Query from '@/src/pages/Query';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import '@/src/index.css';
import { DepositAssets } from '@/src/components/finance/DepositAssets';
import { Toaster } from '@/src/components/ui/Toaster';
import { TooltipProvider } from '@/src/components/ui/Tooltip';
import { DiamondSDKWrapper } from '@/src/context/DiamondGovernanceSDK';
import Finance from '@/src/pages/Finance';
import { Mining } from '@/src/pages/Mining';
import NewProposal from '@/src/pages/NewProposal';
import Settings from '@/src/pages/Settings';
import Swap from '@/src/pages/Swap';
import Verification from '@/src/pages/Verification';
import ViewProposal from '@/src/pages/ViewProposal';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// 1. Get projectID at https://cloud.walletconnect.com
if (!import.meta.env.VITE_APP_PROJECT_ID) {
  throw new Error('You need to provide VITE_APP_PROJECT_ID env variable');
}
const projectId = import.meta.env.VITE_APP_PROJECT_ID;

// 2. Configure wagmi client
const chains = [polygonMumbai, polygon];

const { provider } = configureChains(chains, [
  import.meta.env.PROD || import.meta.env.VITE_USE_GANACHE !== 'true'
    ? (w3mProvider({ projectId }) as any)
    : // DEV NOTE: This is a local testnet on Ganache. Make sure you have it running
      // on port 65534, and deploy the necessary contracts to it.
      jsonRpcProvider({
        rpc: () => ({
          http: 'http://localhost:65534',
        }),
      }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  logger: { warn: import.meta.env.DEV ? (m) => console.warn(m) : null },
  provider,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    id: 'root',
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: '/governance',
        children: [
          {
            path: '',
            element: <Governance />,
          },
          {
            path: '/governance/new-proposal',
            element: <NewProposal />,
          },
          {
            path: '/governance/proposals/:id',
            element: <ViewProposal />,
          },
        ],
      },
      {
        path: '/finance',
        children: [
          {
            path: '',
            element: <Finance />,
          },
          {
            path: '/finance/new-deposit',
            element: <DepositAssets />,
          },
        ],
      },
      {
        path: '/verification',
        element: <Verification />,
      },
      {
        path: '/query',
        element: <Query />,
      },
      {
        path: '/mining',
        element: <Mining />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/swap',
        element: <Swap />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster />
    <WagmiConfig client={wagmiClient}>
      <DiamondSDKWrapper>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </DiamondSDKWrapper>
    </WagmiConfig>

    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode={'dark'}
    />
  </React.StrictMode>
);
