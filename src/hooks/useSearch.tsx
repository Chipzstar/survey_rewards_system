'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from '~/hooks/use-debounced-callback';

export function useSearch() {
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const { replace } = useRouter();

  /*const handleEqualCheck = (item: T, text: string): boolean => {
    if (typeof item === 'string') {
      return item.toLowerCase().includes(text.toLowerCase());
    } else if (typeof item === 'object' && item !== null) {
      return Boolean(_key && item[_key].includes(text));
    }
    return false;
  };*/

  const handleSearch = useDebouncedCallback((query: string) => {
    console.log('query', query);
    const params = new URLSearchParams(searchParams);
    if (query.length > 0) {
      params.set('query', query);
      setIsSearching(true);
    } else {
      params.delete('query');
      setIsSearching(false);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 250);

  const onChangeText = useCallback((text: string) => {
    setSearchText(text);
    handleSearch(text);
  }, []);

  return {
    isSearching,
    searchText,
    setSearchText,
    onChangeText
  };
}
