/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectValue,
} from './Select';
import { ErrorWrapper } from './ErrorWrapper';

function generateUtcOptions(): string[] {
  const utcOptions: string[] = [];

  for (let i = -12; i <= 14; i++) {
    if (i === 0) {
      utcOptions.push('UTC+0');
      continue;
    }

    const sign = i < 0 ? '-' : '+';
    const hour = Math.abs(i);
    const hourString = hour.toString();
    utcOptions.push(`UTC${sign}${hourString}`);

    if (hour === 3 && sign === '-') {
      // Newfoundland Standard Time (UTC-3:30)
      utcOptions.push(`UTC${sign}${hourString}:30`);
    } else if (hour === 8 && sign === '+') {
      // Australian Central Western Standard Time (UTC+8:45)
      utcOptions.push(`UTC${sign}${hourString}:45`);
    } else if (hour === 5 && sign === '+') {
      // Indian Standard Time (UTC+5:30)
      utcOptions.push(`UTC${sign}${hourString}:30`);
    }
  }

  return utcOptions;
}

export const TimezoneSelector = ({
  control,
  error,
  name,
  id,
}: {
  control: any;
  error?: FieldError;
  name: string;
  id?: string;
}) => (
  <ErrorWrapper name={name} error={error} id={id}>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, name, value } }) => (
        <Select defaultValue={value} onValueChange={onChange} name={name}>
          <SelectTrigger>
            <SelectValue placeholder="Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>UTC</SelectLabel>
              {generateUtcOptions().map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  </ErrorWrapper>
);