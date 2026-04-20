import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { Skeleton } from '../Skeleton/Skeleton';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

export interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  rowRenderer?: (params: {
    row: T;
    index: number;
    defaultRow: ReactNode;
    rowKey: string;
    columnCount: number;
  }) => ReactNode;
  responsive?: boolean;
}

function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full animate-pulse p-4">
      <div className="flex gap-4 mb-4 pb-3 border-b border-neutral-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`r-${r}`} className="flex gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={`c-${c}`} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Table<T extends object>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
  containerClassName,
  headerClassName,
  rowClassName,
  rowRenderer,
  responsive = true,
}: TableProps<T>) {
  const wrapperClass = containerClassName ?? className;
  const safeData = Array.isArray(data) ? data : [];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 940);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function getCellValue(col: TableColumn<T>, row: T): ReactNode {
    const value = row[col.key as keyof T];
    if (col.render) return col.render(value, row);
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return value as ReactNode;
  }

  if (loading) {
    return (
      <div className="bg-neutral-50 rounded-lg">
        <TableSkeleton columns={columns.length} />
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-neutral-50 rounded-lg text-neutral-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  if (responsive && isMobile) {
    return (
      <div className={cn('space-y-3', wrapperClass)}>
        {safeData.map((row, idx) => {
          const rowKey = keyExtractor(row, idx);
          const defaultCard = (
            <div
              key={`${rowKey}-card`}
              className="border border-neutral-100 rounded-lg overflow-hidden cursor-default"
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <div
                  key={String(col.key)}
                  className="flex gap-1 px-4 py-3 items-center border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
                >
                  <div className="w-1/2 text-xs font-semibold text-neutral-600">{col.label}</div>
                  <div className="w-1/2 text-sm text-neutral-700">{getCellValue(col, row)}</div>
                </div>
              ))}
            </div>
          );

          if (rowRenderer) {
            return (
              <div key={rowKey}>
                {rowRenderer({ row, index: idx, defaultRow: defaultCard, rowKey, columnCount: columns.length })}
              </div>
            );
          }
          return defaultCard;
        })}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto border border-neutral-200 rounded-lg', wrapperClass)}>
      <table className="w-full text-sm">
        <thead className={cn('bg-neutral-50 border-b border-neutral-200', headerClassName)}>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-6 py-3 font-semibold text-neutral-700',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                  col.width,
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={rowClassName}>
          {safeData.map((row, idx) => {
            const rowKey = keyExtractor(row, idx);
            const defaultRow = (
              <tr
                key={`${rowKey}-tr`}
                className={cn(
                  'border-b border-neutral-100 hover:bg-neutral-50 transition-colors',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      'px-6 py-4 text-neutral-700',
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    )}
                  >
                    {getCellValue(col, row)}
                  </td>
                ))}
              </tr>
            );

            if (rowRenderer) {
              return (
                <tr key={rowKey}>
                  <td colSpan={columns.length} style={{ padding: 0 }}>
                    {rowRenderer({ row, index: idx, defaultRow, rowKey, columnCount: columns.length })}
                  </td>
                </tr>
              );
            }
            return defaultRow;
          })}
        </tbody>
      </table>
    </div>
  );
}
