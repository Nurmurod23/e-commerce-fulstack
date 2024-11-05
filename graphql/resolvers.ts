import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { statements } from "@/lib/db";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return statements.getUserById.get(user.id);
    },
    products: async (_, { category }) => {
      if (category && category !== "All") {
        return statements.getProductsByCategory.all(category);
      }
      return statements.getAllProducts.all();
    },
    product: async (_, { id }) => {
      return statements.getProductById.get(id);
    },
    orders: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const orders = statements.getOrders.all(user.id);
      return orders.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }));
    },
    order: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const order = statements.getOrderById.get(id, user.id);
      if (!order) return null;
      return {
        ...order,
        items: JSON.parse(order.items)
      };
    },
    cart: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return statements.getCartItems.all(user.id);
    },
  },
  Mutation: {
    signUp: async (_, { input: { name, email, password } }) => {
      const existingUser = statements.getUserByEmail.get(email);
      if (existingUser) throw new Error("Email already in use");

      const hashedPassword = await hash(password, 10);
      const id = randomUUID();

      statements.createUser.run(id, name, email, hashedPassword);
      const user = statements.getUserById.get(id);

      const token = sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
    signIn: async (_, { input: { email, password } }) => {
      const user = statements.getUserByEmail.get(email);
      if (!user) throw new Error("Invalid credentials");

      const valid = await compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
    addToCart: async (_, { productId, quantity }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const id = randomUUID();
      statements.addToCart.run(id, user.id, productId, quantity);
      return statements.getCartItems.get(user.id, productId);
    },
    updateCartItem: async (_, { productId, quantity }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      if (quantity <= 0) {
        statements.removeFromCart.run(user.id, productId);
        return null;
      }

      statements.updateCartItem.run(quantity, user.id, productId);
      return statements.getCartItems.get(user.id, productId);
    },
    removeFromCart: async (_, { productId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      statements.removeFromCart.run(user.id, productId);
      return true;
    },
    createOrder: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const cartItems = statements.getCartItems.all(user.id);
      if (cartItems.length === 0) throw new Error("Cart is empty");

      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const orderId = randomUUID();
      
      statements.createOrder.run(orderId, user.id, total);

      for (const item of cartItems) {
        statements.addOrderItem.run(
          randomUUID(),
          orderId,
          item.product_id,
          item.quantity,
          item.price
        );
      }

      statements.clearCart.run(user.id);

      const order = statements.getOrderById.get(orderId, user.id);
      return {
        ...order,
        items: JSON.parse(order.items)
      };
    },
    updateOrderStatus: async (_, { id, status }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      statements.updateOrderStatus.run(status, id);
      
      const order = statements.getOrderById.get(id, user.id);
      return {
        ...order,
        items: JSON.parse(order.items)
      };
    },
  },
};