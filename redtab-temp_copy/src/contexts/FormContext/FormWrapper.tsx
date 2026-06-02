import React, { ReactElement, ReactNode } from 'react';

interface FormWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Wrapper component for consistent form styling
 */
export const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  title,
  description,
  className = '',
}): ReactElement => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          {title && (
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-2xs text-gray-400 mt-2">{description}</p>
          )}
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};