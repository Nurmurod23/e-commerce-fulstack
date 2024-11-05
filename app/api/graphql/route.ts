import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) return {};

    try {
      const decoded = verify(token, JWT_SECRET) as { userId: string };
      return { user: { id: decoded.userId } };
    } catch {
      return {};
    }
  },
});

export { handler as GET, handler as POST };