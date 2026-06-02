import { ReactNode } from 'react';

/**
 * Standard column definition for tables
 * Supports all common table column use cases
 */
export interface TableColumnDef<T> {
  /**
   * Unique identifier for the column
   */
  id: string;

  /**
   * Header text or ReactNode
   */
  header: string | ReactNode;

  /**
   * Field name in the data object (supports dot notation for nested fields)
   * e.g. "user.name"
   */
  accessorKey?: keyof T | string;

  /**
   * Custom render function for cell content
   */
  cell?: (value: unknown, row: T) => ReactNode;

  /**
   * Custom render function for header
   */
  headerCell?: () => ReactNode;

  /**
   * CSS class for column alignment
   * @default 'text-left'
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Column width (can be pixels or percentage)
   * @default 'auto'
   */
  width?: string;

  /**
   * Whether column is sortable
   * @default false
   */
  sortable?: boolean;

  /**
   * Whether column is filterable
   * @default false
   */
  filterable?: boolean;

  /**
   * Whether column is visible
   * @default true
   */
  visible?: boolean;

  /**
   * Minimum width for responsive tables
   */
  minWidth?: string;

  /**
   * CSS classes for the cell
   */
  className?: string;

  /**
   * CSS classes for the header cell
   */
  headerClassName?: string;
}

/**
 * Standard table configuration
 */
export interface TableConfig<T> {
  columns: TableColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  pageSize?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  className?: string;
}

/**
 * Utility function to get nested value from object
 */
export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split('.').reduce((current, part) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj as unknown);
};

/**
 * Utility function to render column cell
 */
export const renderColumnCell = <T,>(
  column: TableColumnDef<T>,
  row: T
): ReactNode => {
  if (column.cell) {
    const value = column.accessorKey
      ? getNestedValue(row as Record<string, unknown>, column.accessorKey as string)
      : undefined;
    return column.cell(value, row);
  }

  if (column.accessorKey) {
    return getNestedValue(row as Record<string, unknown>, column.accessorKey as string) as ReactNode;
  }

  return null;
};
