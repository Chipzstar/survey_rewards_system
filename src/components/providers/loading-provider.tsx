'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Image from 'next/image';
import Loader from '~/components/layout/loader';

const LoadingContext = createContext({
  loading: false,
  setLoading: (loading: boolean) => {}
});

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Loader display={loading} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
