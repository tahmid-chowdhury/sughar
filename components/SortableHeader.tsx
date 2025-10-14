import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from './icons';
import { SortConfig } from '../hooks/useTable';

interface SortableHeaderProps<T> {
  children: React.ReactNode;
  // FIX: Constrain column key to be a string.
  columnKey: keyof T & string;
  sortConfig: SortConfig<T>;
  // FIX: Constrain sort key to be a string.
  requestSort: (key: keyof T & string) => void;
  className?: string;
}

// FIX: Constraining T to Record<string, any> to help with type inference and resolve errors in consuming components.
export const SortableHeader = <T extends Record<string, any>>({
  children,
  columnKey,
  sortConfig,
  requestSort,
  className = ''
}: SortableHeaderProps<T>) => {
  const isSorted = sortConfig?.key === columnKey;
  const direction = isSorted ? sortConfig.direction : undefined;

  const getSortIcon = () => {
    if (!isSorted) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    if (direction === 'ascending') {
      return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
    return <ArrowDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <th
      scope="col"
      className={`px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group ${className}`}
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        <span>{children}</span>
        <span className="ml-2">{getSortIcon()}</span>
      </div>
    </th>
  );
};
