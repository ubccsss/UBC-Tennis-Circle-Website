import {createContext} from 'react';
import {User} from 'lucia';

export interface AuthContext {
  user?: User | null;
  loading?: boolean;
}

export const AuthContext = createContext<AuthContext>({});
