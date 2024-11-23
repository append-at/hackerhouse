'use client';

import { createContext, useContext } from 'react';
import type { Tables } from '@/database.types';

type User = Tables<'user'>;
export const UserContext = createContext<User | null>(null);
export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) throw new Error('UserContext is not provided');
  return user;
};

type UserContextProviderProps = {
  value: User;
  children: React.ReactNode;
};

export const UserContextProvider = ({
  value,
  children,
}: UserContextProviderProps) => (
  <UserContext.Provider value={value}>{children}</UserContext.Provider>
);
