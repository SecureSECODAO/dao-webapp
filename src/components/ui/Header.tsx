/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { cn } from '@/src/lib/utils';

interface HeaderProps
  extends React.PropsWithChildren<
    Omit<React.HTMLAttributes<HTMLHeadingElement>, 'level'>
  > {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Header = ({ className, children, level = 1, ...props }: HeaderProps) => {
  const headerClasses = [
    'text-5xl font-bold leading-10',
    'text-2xl font-bold leading-6',
    'text-xl font-bold',
    'text-lg font-bold',
    'text-base font-bold',
    'text-sm font-bold',
  ];

  const headerTag = `h${level}`;

  // returns a header tag with the appropriate level (h1, h2, etc.), the appropriate class, the rest of the props and the children

  return React.createElement(
    headerTag,
    { className: cn(headerClasses[level - 1], className), ...props },
    children
  );
};

export default Header;
