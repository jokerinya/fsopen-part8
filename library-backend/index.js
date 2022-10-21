// 3rd party
// http server
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const http = require('http');
// ws
const { execute, subscribe } = require('graphql');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
// db
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// config
const {
    DB_USER_NAME,
    DB_USER_PASSWORD,
    DB_CLUSTER_ADDRESS,
    DB_NAME,
    JWT_SECRET,
    PORT,
} = require('./utils/config');
// models
const User = require('./models/user');

// Connect to db
(async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER_NAME}:${DB_USER_PASSWORD}@${DB_CLUSTER_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`
        );
        console.log('Connected to db');
    } catch (error) {
        console.log(error);
    }
})();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// server setup is now with function

const start = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    });
    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        context: async ({ req }) => {
            const auth = req ? req.headers.authorization : null;
            if (auth && auth.toLowerCase().startsWith('bearer ')) {
                const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
                const currentUser = await User.findById(decodedToken.id);
                return { currentUser };
            }
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/',
    });

    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}`)
    );
};

// start the server
start();
