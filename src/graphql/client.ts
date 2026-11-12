import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { auth } from '@/utils/firebase';

const httpLink = new HttpLink({ uri: import.meta.env.WXT_API_URL });

const firebaseAuthLink = new SetContextLink(async (previousContext) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  return {
    headers: {
      ...previousContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([firebaseAuthLink, httpLink]),
  cache: new InMemoryCache(),
});
