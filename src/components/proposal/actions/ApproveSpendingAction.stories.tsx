/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Accordion } from '@/src/components/ui/Accordion';
import { dummyApproveSpendingAction } from '@/src/hooks/useProposal';
import type { Meta, StoryObj } from '@storybook/react';

import { ApproveSpendingAction } from './ApproveSpendingAction';

const meta = {
  component: ApproveSpendingAction,
  argTypes: {
    action: {
      table: {
        disable: true,
      },
    },
    asChild: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ApproveSpendingAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'first',
    action: dummyApproveSpendingAction,
  },
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible>
        <Story />
      </Accordion>
    ),
  ],
};
