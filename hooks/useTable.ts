import { useState, useMemo } from 'react';

export type SortConfig<T> = {
  // FIX: Constrain key to be a string to avoid type errors with `keyof T` resolving to symbol.
  key: keyof T & string;
  direction: 'asc' | 'desc';
} | null;

export const useTable = <T extends Record<string, any>>(
  items: T[],
  // FIX: Constrain search keys to be strings.
  searchKeys: (keyof T & string)[],
  defaultSortConfig: SortConfig<T> = null
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(defaultSortConfig);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedAndFilteredItems = useMemo(() => {
    let processableItems = [...items];
    
    // Filtering
    if (searchQuery) {
        processableItems = processableItems.filter(item => {
            return searchKeys.some(key => {
                const value = item[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    // FIX: Use String() constructor to avoid TypeScript error on generic type.
                    return String(value).toLowerCase().includes(searchQuery.toLowerCase());
                }
                return false;
            });
        });
    }

    // Sorting
    if (sortConfig !== null) {
      processableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (aVal < bVal) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return processableItems;
  }, [items, sortConfig, searchQuery, searchKeys]);

  // FIX: Constrain key to be a string.
  const requestSort = (key: keyof T & string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedAndFilteredItems, requestSort, sortConfig, searchQuery, setSearchQuery };
};
