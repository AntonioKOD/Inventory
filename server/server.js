const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const cors = require('cors'); // Import CORS


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Add CORS middleware
app.use(cors({
    origin: '*', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, headers, etc.)
}));


const startApolloServer = async () => {
    await server.start();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`Server running on localhost:${PORT}`);
            console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    });
};

startApolloServer();