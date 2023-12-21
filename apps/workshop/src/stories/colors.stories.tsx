import { cn } from '@commonalityco/ui-design-system';
import { Meta, StoryObj } from '@storybook/react';

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-4 gap-4">{children}</div>;
}

function Chip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-md px-4 py-8 text-center', className)}>
      {children}
    </div>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Colors',
  component: Shell,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Shell>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Light: Story = {
  args: {
    children: (
      <>
        <Chip className="bg-primary">
          <p className="text-primary-foreground">Primary</p>
        </Chip>
        <Chip className="bg-secondary">
          <p className="text-secondary-foreground">Secondary</p>
        </Chip>
        <Chip className="bg-accent">
          <p className="text-accent-foreground">Accent</p>
        </Chip>
        <Chip className="bg-muted">
          <p className="text-muted-foreground">Muted</p>
        </Chip>
        <Chip className="bg-success">
          <p className="text-success-foreground">Success</p>
        </Chip>
        <Chip className="bg-destructive">
          <p className="text-destructive-foreground">Destructive</p>
        </Chip>
      </>
    ),
  },
};

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    children: (
      <>
        <Chip className="bg-primary dark">
          <p className="text-primary-foreground">Primary</p>
        </Chip>
        <Chip className="bg-secondary dark">
          <p className="text-secondary-foreground">Secondary</p>
        </Chip>
        <Chip className="bg-accent dark">
          <p className="text-accent-foreground">Accent</p>
        </Chip>
        <Chip className="bg-muted dark">
          <p className="text-muted-foreground">Muted</p>
        </Chip>
        <Chip className="bg-success dark">
          <p className="text-success-foreground">Success</p>
        </Chip>
        <Chip className="bg-destructive dark">
          <p className="text-destructive-foreground">Destructive</p>
        </Chip>
      </>
    ),
  },
};
