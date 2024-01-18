import {useContext} from 'react';
import {AuthContext} from '@contexts';

export const useAuth = () => {
  const {user, loading} = useContext(AuthContext);
  return {user, loading};
};
