'use client';

import React, { useMemo, type ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Use state to hold services so they persist across re-renders
  const [services, setServices] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize only on the client
    const initialized = initializeFirebase();
    setServices(initialized);
    setIsInitialized(true);
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={services?.firebaseApp}
      auth={services?.auth}
      firestore={services?.firestore}
    >
      {/* 
        We render children immediately to avoid blocking SSR, 
        but useUser hooks will handle the loading state internally.
      */}
      {children}
    </FirebaseProvider>
  );
}
