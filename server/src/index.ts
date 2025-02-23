

import cors from "cors";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { CommentResolver } from "./resolvers/CommentResolver";

import { connectDB } from "./config/db";

async function startServer() {
    const app = express();

    app.use(cors()); // ✅ Разрешаем CORS

    await connectDB();

    const schema = await buildSchema({ resolvers: [UserResolver, PostResolver, CommentResolver] });

    const server = new ApolloServer({ schema });
    await server.start();

    server.applyMiddleware({ app });

    app.listen(4000, () => console.log("GraphQL API 🚀 http://localhost:4000/graphql"));
}

startServer();
