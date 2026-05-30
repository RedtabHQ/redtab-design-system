import { forwardRef } from 'react';
import { Avatar, type AvatarProps } from '../Avatar';
import { cn } from '../../utils/cn';

export interface AvatarGroupItem {
  src?: string;
  initials?: string;
  alt?: string;
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[];
  maxVisible?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ items, maxVisible = 4, size = 'md', className }, ref) => {
    const visibleItems = items.slice(0, maxVisible);
    const overflowCount = items.length - visibleItems.length;

    return (
      <div ref={ref} className={cn('flex items-center', className)}>
        {visibleItems.map((item, index) => (
          <div key={`${item.alt ?? item.initials}-${index}`} className={cn(index > 0 ? '-ml-3' : '', 'inline-flex items-center')}> 
            <Avatar src={item.src} initials={item.initials} alt={item.alt} size={size} className="border-2 border-neutral-0" />
          </div>
        ))}
        {overflowCount > 0 ? (
          <div className="-ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 shadow-sm sm:h-12 sm:w-12">
            +{overflowCount}
          </div>
        ) : null}
      </div>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';
