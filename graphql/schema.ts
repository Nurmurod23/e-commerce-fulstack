import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    orders: [Order!]!
    cartItems: [CartItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String!
    category: String!
    createdAt: String!
    updatedAt: String!
  }

  type CartItem {
    id: ID!
    quantity: Int!
    product: Product!
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem!]!
    total: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    id: ID!
    quantity: Int!
    price: Float!
    product: Product!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    products(category: String): [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
    cart: [CartItem!]!
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    addToCart(productId: ID!, quantity: Int!): CartItem!
    updateCartItem(productId: ID!, quantity: Int!): CartItem
    removeFromCart(productId: ID!): Boolean!
    createOrder: Order!
    updateOrderStatus(id: ID!, status: String!): Order!
  }
`;