/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BigNumber } from 'ethers';

import OneTimeRewardCard from './OneTimeRewardCard';

const meta = {
  component: OneTimeRewardCard,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof OneTimeRewardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reward: [BigNumber.from('0x4563918244F40000'), BigNumber.from(5).pow(18)],
    claimReward() {
      return Promise.resolve({} as any);
    },
    refetch() {
      return Promise.resolve();
    },
  },
};
