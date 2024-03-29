/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode } from 'react';
import { MembershipStatus } from '@/src/components/dashboard/MembershipStatus';
import Navbar from '@/src/components/layout/Navbar';
import { Outlet } from 'react-router';

const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex min-h-full w-full justify-center bg-background pb-20 text-foreground">
      <div className="w-full max-w-7xl px-2 sm:px-4 md:px-10 lg:px-6">
        <div className="mb-4 flex w-full items-center justify-center">
          <Navbar />
        </div>

        <main className="space-y-6">
          <MembershipStatus />
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
