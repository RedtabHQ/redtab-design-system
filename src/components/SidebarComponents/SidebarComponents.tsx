import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface SidebarBrandProps {
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  collapsed?: boolean;
  className?: string;
}

export const SidebarBrand = forwardRef<HTMLDivElement, SidebarBrandProps>(
  ({ logo, title, subtitle, collapsed, className }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 p-4 sm:p-6', collapsed && 'justify-center', className)}>
      {logo && <div className="flex-shrink-0">{logo}</div>}
      {!collapsed && (
        <div className="hidden sm:flex flex-col min-w-0">
          {title && <span className="text-lg font-bold tracking-tight text-neutral-900 leading-none">{title}</span>}
          {subtitle && <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest mt-1">{subtitle}</span>}
        </div>
      )}
    </div>
  ),
);

SidebarBrand.displayName = 'SidebarBrand';

export interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
  collapsed?: boolean;
  className?: string;
}

export const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ title, children, collapsed, className }, ref) => (
    <div ref={ref} className={cn(collapsed ? 'space-y-2' : 'space-y-1 sm:space-y-1', className)}>
      {title && !collapsed && (
        <h3 className="hidden sm:block px-8 mb-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
          {title}
        </h3>
      )}
      {children}
    </div>
  ),
);

SidebarSection.displayName = 'SidebarSection';

export interface SidebarItemProps {
  icon?: ReactNode;
  label: string;
  isActive?: boolean;
  collapsed?: boolean;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ icon, label, isActive, collapsed, tooltip, onClick, className }, ref) => (
    <div className="relative group/tooltip">
      <button
        ref={ref}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 px-8 py-2.5 w-full transition-all duration-200',
          isActive
            ? 'text-primary-0 bg-primary-600 font-semibold shadow-sm'
            : 'text-neutral-500 hover:text-error-900 hover:bg-error-50',
          collapsed && 'justify-center px-2',
          className,
        )}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        {!collapsed && <span className="hidden sm:inline text-sm">{label}</span>}
      </button>

      {/* Tooltip */}
      {collapsed && (
        <div className="hidden sm:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-neutral-900 text-neutral-0 text-xs font-semibold rounded-lg whitespace-nowrap z-50 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-opacity duration-200 pointer-events-none">
          {tooltip || label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
        </div>
      )}
    </div>
  ),
);

SidebarItem.displayName = 'SidebarItem';
