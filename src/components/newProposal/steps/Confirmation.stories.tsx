/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ProposalFormActions } from '@/src/components/newProposal/steps/Actions';
import { Confirmation } from '@/src/components/newProposal/steps/Confirmation';
import { ProposalFormMetadata } from '@/src/components/newProposal/steps/Metadata';
import { ProposalFormVotingSettings } from '@/src/components/newProposal/steps/Voting';
import { TokenType } from '@/src/lib/constants/tokens';
import { NewProposalFormProvider } from '@/src/pages/NewProposal';
import type { Meta, StoryObj } from '@storybook/react';
import { constants } from 'ethers';

const meta: Meta<typeof Confirmation> = {
  component: Confirmation,
};

export default meta;
type Story = StoryObj<typeof Confirmation>;

const FormProviderDecoratorFactory = (
  data1: ProposalFormMetadata | undefined,
  data2: ProposalFormVotingSettings | undefined,
  data3: ProposalFormActions | undefined
): any => {
  // eslint-disable-next-line react/display-name
  return (Story: any) => (
    <NewProposalFormProvider
      step={4}
      dataStep1={data1}
      dataStep2={data2}
      dataStep3={data3}
    >
      <Story />
    </NewProposalFormProvider>
  );
};

export const Primary: Story = {
  decorators: [
    FormProviderDecoratorFactory(
      {
        title: 'A nice title for a proposal with a rich description',
        description: 'This is a proposal ',
        body: '<p>This is richt text content</p><p><strong>This line is bold</strong></p><p><em>This is in italics</em></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.example.com">This is a link</a></p><ol><li><p>We even have lists</p></li><li><p>With multiple elements</p></li><li><p>This one is numbered</p></li></ol><p>But we can also have bullet point lists</p><ul><li><p>Bullet 1</p></li><li><p>Bullet 2</p></li><li><p>Last bullet 3</p></li></ul><p></p>',
        resources: [
          { name: 'Example resource 1', url: 'https:://www.example.com/1' },
          { name: 'Example resource 2', url: 'https:://www.example.com/2' },
        ],
      },
      {
        option: 'yes-no-abstain',
        start_time_type: 'now',
        end_time_type: 'duration',
        duration_minutes: 30,
        duration_hours: 3,
        duration_days: 1,
      },
      {
        actions: [
          {
            name: 'mint_tokens',
            wallets: [
              {
                address: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
                amount: '1',
              },
              {
                address: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
                amount: '3.141',
              },
              {
                address: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
                amount: '1000',
              },
            ],
          },
          {
            name: 'withdraw_assets',
            recipient: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
            tokenAddress: constants.AddressZero,
            amount: '3.141',
            tokenDecimals: '3',
            tokenType: TokenType.ERC20,
            daoAddress: '0x123',
          },
        ],
      }
    ),
  ],
};

export const Empty: Story = {
  decorators: [FormProviderDecoratorFactory(undefined, undefined, undefined)],
};
