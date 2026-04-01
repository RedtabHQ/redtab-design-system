import type { ReactNode } from 'react';

export interface ColorSwatchProps {
  name: string;
  hex: string;
  children?: ReactNode;
}

export function ColorSwatch({ name, hex }: ColorSwatchProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 p-2">
      <div
        className="h-10 w-10 rounded-md border border-neutral-200"
        style={{ backgroundColor: hex }}
      />
      <div>
        <div className="text-sm font-medium text-neutral-900">{name}</div>
        <div className="text-xs text-neutral-500">{hex}</div>
      </div>
    </div>
  );
}
