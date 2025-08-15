// README
// Shopify GraphQL API client configuration.
// Features:
// - Uses Apollo Client to interact with Shopify's Storefront GraphQL API.
// - Configured with store-specific endpoint and access token.
// - Includes caching via InMemoryCache for improved performance.
// Notes:
// - Storefront access token should be kept secure (consider using environment variables in production).
// - Update the API version in the URI as needed when upgrading Shopify API.
// - This client is intended for frontend queries to Shopify's Storefront API only,
//   not for Admin API calls.

// -------------------- Imports --------------------
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// -------------------- Apollo Client Setup --------------------
const client = new ApolloClient({
  // HTTP link to Shopify's Storefront GraphQL endpoint
  link: new HttpLink({
    uri: "https://0hyx14-11.myshopify.com/api/2025-07/graphql.json", // Storefront API endpoint
    headers: {
      // Storefront API access token (must be enabled in Shopify admin)
      "X-Shopify-Storefront-Access-Token": "44b56686341a6aa520889e8eafd09b64",
      "Content-Type": "application/json", // Required for GraphQL requests
    },
  }),
  // Cache layer for Apollo to avoid unnecessary network requests
  cache: new InMemoryCache(),
});

// -------------------- Export --------------------
export default client;
