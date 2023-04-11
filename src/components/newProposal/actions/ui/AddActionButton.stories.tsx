/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { AddActionButton } from './AddActionButton';

const meta: Meta<typeof AddActionButton> = {
  component: AddActionButton,
};

export default meta;
type Story = StoryObj<typeof AddActionButton>;

export const Primary: Story = {
  render: () => (
    <AddActionButton
      append={() => {
        console.log('Adding action');
      }}
    />
  ),
};