import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://0hyx14-11.myshopify.com/api/2025-07/graphql.json',
        headers: {
            'X-Shopify-Storefront-Access-Token': '44b56686341a6aa520889e8eafd09b64',
            'Content-Type': 'application/json',
        },
    }),
    cache: new InMemoryCache(),
});

export default client;