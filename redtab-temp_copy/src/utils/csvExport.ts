/**
 * CSV Export Utility
 * Provides functionality to export data arrays to CSV format
 */

import { formatDateTime } from './dateFormatter';
import { formatCurrencyForCSV as formatCurrencyUtil } from './currencyFormatter';

export interface CSVExportOptions {
  filename?: string;
  headers?: string[];
  keys?: string[];
  dateFields?: string[];
  numberFields?: string[];
}

/**
 * Convert an array of objects to CSV string
 */
export function arrayToCSV<T extends object>(
  data: T[],
  options: CSVExportOptions = {}
): string {
  if (!data || data.length === 0) {
    return '';
  }

  const { headers, keys, dateFields = [], numberFields = [] } = options;

  // If keys not provided, use all keys from first object
  const dataKeys = keys || Object.keys(data[0] as Record<string, unknown>);

  // If headers not provided, use keys as headers (capitalize first letter)
  const csvHeaders = headers || dataKeys.map(key =>
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );

  // Build CSV rows
  const rows: string[] = [];

  // Add header row
  rows.push(csvHeaders.map(h => `"${h}"`).join(','));

  // Add data rows
  for (const item of data) {
    const record = item as Record<string, unknown>;
    const values = dataKeys.map(key => {
      let value = record[key];

      // Handle null/undefined
      if (value === null || value === undefined) {
        return '""';
      }

      // Handle dates
      if (dateFields.includes(key) && value) {
        value = formatDateTime(value as string);
      }

      // Handle numbers
      if (numberFields.includes(key) && typeof value === 'number') {
        return value.toString();
      }

      // Handle objects/arrays - stringify them
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      // Escape quotes and wrap in quotes
      const stringValue = String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    });

    rows.push(values.join(','));
  }

  return rows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'export.csv'): void {
  // Create blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV file
 */
export function exportToCSV<T extends object>(
  data: T[],
  options: CSVExportOptions = {}
): void {
  const filename = options.filename || `export_${Date.now()}.csv`;
  const csvContent = arrayToCSV(data, options);
  downloadCSV(csvContent, filename);
}

/**
 * Format date for CSV export
 * Uses standard format: HH:mm:ss MM/DD/YYYY
 */
export function formatDateForCSV(date: string | Date | null | undefined): string {
  return formatDateTime(date);
}

/**
 * Format currency for CSV export
 * @deprecated Use formatCurrencyUtil from currencyFormatter instead
 */
export function formatCurrencyForCSV(
  amount: number | null | undefined,
  currency: string = 'USD',
  symbol: string = '$'
): string {
  return formatCurrencyUtil(amount, currency, symbol);
}
