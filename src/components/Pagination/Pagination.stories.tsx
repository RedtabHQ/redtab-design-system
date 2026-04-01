import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Interactive/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    siblingCount: {
      control: 'number',
    },
    showEdges: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    size: 'md',
    siblingCount: 1,
    showEdges: false,
  },
};

export const SmallSize: Story = {
  render: (args) => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
  args: {
    totalPages: 20,
    size: 'sm',
    siblingCount: 1,
  },
};

export const LargeSize: Story = {
  render: (args) => {
    const [page, setPage] = useState(3);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
  args: {
    totalPages: 10,
    size: 'lg',
    siblingCount: 1,
  },
};

export const WithEdgeButtons: Story = {
  render: (args) => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
  args: {
    totalPages: 20,
    size: 'md',
    siblingCount: 1,
    showEdges: true,
  },
};

export const WideSiblingCount: Story = {
  render: (args) => {
    const [page, setPage] = useState(10);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
  args: {
    totalPages: 20,
    size: 'md',
    siblingCount: 2,
  },
};

export const FewPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(2);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
  args: {
    totalPages: 4,
    size: 'md',
    siblingCount: 1,
  },
};

export const AllSizes: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <div className="flex flex-col gap-4 items-center">
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} size="sm" />
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} size="md" />
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} size="lg" />
      </div>
    );
  },
};
