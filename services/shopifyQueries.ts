// README
// Shopify Storefront API GraphQL queries.
// Features:
// - Defines reusable GraphQL queries for retrieving data from Shopify.
// - Uses Apollo Client's gql template literal for syntax highlighting and parsing.
// Notes:
// - This file currently contains only the `GET_PRODUCTS` query, which retrieves the first 10 products.
// - Adjust `first: 10` to change the number of products returned.
// - Queries here are intended for use with the Storefront API, not the Admin API.

// -------------------- Imports --------------------
import { gql } from "@apollo/client";

// -------------------- GraphQL Queries --------------------

// GET_PRODUCTS
// Retrieves the first 10 products from the Shopify Storefront API.
// For each product, the query fetches:
// - id, title, and description
// - First product image (URL)
// - First variant's price and currency
export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
