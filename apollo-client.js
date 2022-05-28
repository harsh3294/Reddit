import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client'
const client = new ApolloClient({
  uri: 'https://waconia.stepzen.net/api/invited-grasshopper/__graphql',
  headers: {
    Authorization: `Apiket ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`,
  },
  cache: new InMemoryCache(),
})

export default client
