import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, DialogTitle, DialogContent, DialogFooter } from './Dialog';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Interactive/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the max-width of the dialog',
    },
    open: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
    },
    title: {
      control: 'text',
      description: 'Title text passed to the dialog',
    },
  },
  args: {
    open: false,
    size: 'md',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog {...args} open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to perform this action? This cannot be undone.</p>
          </DialogContent>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Small Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} size="sm">
          <DialogTitle>Quick Note</DialogTitle>
          <DialogContent>
            <p>This is a compact dialog for brief messages.</p>
          </DialogContent>
          <DialogFooter>
            <Button size="sm" onClick={() => setOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} size="lg">
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogContent>
            <p className="mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="mb-3">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </DialogContent>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button onClick={() => setOpen(false)}>Accept</Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const DestructiveAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete Account
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)} size="sm">
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <p className="text-error-700">
              This will permanently delete your account and all associated data. This action cannot
              be reversed.
            </p>
          </DialogContent>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const NoFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Info Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Information</DialogTitle>
          <DialogContent>
            <p>Click outside the dialog or press Escape to close it.</p>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};
