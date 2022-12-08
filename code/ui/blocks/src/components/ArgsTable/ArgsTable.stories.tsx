import React from 'react';
import { action } from '@storybook/addon-actions';
import { styled } from '@storybook/theming';
import { ArgsTable, ArgsTableError } from './ArgsTable';
import { NoControlsWarning } from './NoControlsWarning';
import * as ArgRow from './ArgRow.stories';

export default {
  component: ArgsTable,
  title: 'Components/ArgsTable/ArgsTable',
  args: {
    updateArgs: action('updateArgs'),
    resetArgs: action('resetArgs'),
  },
};
const propsSection = {
  category: 'props ',
};
const eventsSection = {
  category: 'events ',
};
const componentSubsection = {
  subcategory: 'MyComponent ',
};
const htmlElementSubsection = {
  subcategory: 'HTMLElement',
};
const stringType = ArgRow.String.args.row;
const numberType = ArgRow.Number.args.row;
const longEnumType = ArgRow.LongEnum.args.row;

export const Loading = {
  args: {
    isLoading: true,
  },
};

export const Normal = {
  args: {
    rows: {
      stringType,
      numberType,
    },
  },
};

export const Compact = {
  args: { ...Normal.args, compact: true },
};

const AddonPanelLayout = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  background: theme.background.content,
}));

export const InAddonPanel = {
  args: { ...Normal.args, inAddonPanel: true },
  decorators: [(storyFn: any) => <AddonPanelLayout>{storyFn()}</AddonPanelLayout>],
};

export const InAddonPanelWithWarning = {
  render: (args: any) => (
    <>
      <NoControlsWarning />
      <ArgsTable {...args} />
    </>
  ),
  // @ts-expect-error (not strict)
  args: { ...InAddonPanel.args, updateArgs: null },
  decorators: InAddonPanel.decorators,
};

export const Sections = {
  args: {
    rows: {
      a: { ...stringType, table: { ...stringType.table, ...propsSection } },
      b: { ...numberType, table: { ...stringType.table, ...propsSection } },
      c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
    },
  },
};

export const SectionsCompact = {
  args: { ...Sections.args, compact: true },
};

export const SectionsAndSubsections = {
  args: {
    rows: {
      a: { ...stringType, table: { ...stringType.table, ...propsSection, ...componentSubsection } },
      b: { ...numberType, table: { ...stringType.table, ...propsSection, ...componentSubsection } },
      c: {
        ...stringType,
        table: { ...stringType.table, ...eventsSection, ...componentSubsection },
      },
      d: {
        ...stringType,
        table: { ...stringType.table, ...eventsSection, ...htmlElementSubsection },
      },
    },
  },
};

export const SubsectionsOnly = {
  args: {
    rows: {
      a: { ...stringType, table: { ...stringType.table, ...componentSubsection } },
      b: { ...numberType, table: { ...stringType.table, ...componentSubsection } },
      c: { ...stringType, table: { ...stringType.table, ...componentSubsection } },
      d: { ...stringType, table: { ...stringType.table, ...htmlElementSubsection } },
    },
  },
};

export const AllControls = {
  args: {
    rows: {
      array: ArgRow.ArrayOf.args.row,
      boolean: ArgRow.Boolean.args.row,
      color: ArgRow.Color.args.row,
      date: ArgRow.Date.args.row,
      string: ArgRow.String.args.row,
      number: ArgRow.Number.args.row,
      range: ArgRow.Number.args.row,
      radio: ArgRow.Radio.args.row,
      inlineRadio: ArgRow.InlineRadio.args.row,
      check: ArgRow.Check.args.row,
      inlineCheck: ArgRow.InlineCheck.args.row,
      select: ArgRow.Select.args.row,
      multiSelect: ArgRow.MultiSelect.args.row,
      object: ArgRow.ObjectOf.args.row,
      func: ArgRow.Func.args.row,
    },
  },
};

export const Error = {
  args: {
    error: ArgsTableError.NO_COMPONENT,
  },
};

export const Empty = {
  args: {
    rows: {},
  },
};

export const WithDefaultExpandedArgs = {
  args: {
    rows: {
      longEnumType,
    },
    initialExpandedArgs: true,
  },
};
