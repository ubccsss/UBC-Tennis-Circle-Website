'use client';
import {useAuth} from '@hooks';

interface AuthComponentProps {
  loading: JSX.Element;
  authenticated: JSX.Element;
  unauthenticated: JSX.Element;
}

// use this component if you need a loading state, an authenticated state, and an unauthenticated state
// do not use this component for protected routes (that is taken care of by the (protected)/ layout)
export const AuthComponent = (props: AuthComponentProps): JSX.Element => {
  const {loading, user} = useAuth();

  if (loading) {
    return props.loading;
  }

  if (user) {
    return props.authenticated;
  } else {
    return props.unauthenticated;
  }
};
