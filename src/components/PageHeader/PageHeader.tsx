import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  backHref,
}) => {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          to={backHref}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 w-fit"
        >
          <ChevronLeft size={16} />
          Back
        </Link>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            {icon}
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 font-medium">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">{actions}</div>
        )}
      </div>
    </div>
  );
};

