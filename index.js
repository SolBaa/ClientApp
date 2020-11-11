const {ApolloServer, gql} = require('apollo-server')
const typeDefs = require('./apollo/schema')
const resolvers= require('./apollo/resolvers')
const conectarDB = require('./config/db')

// Conectar DB 
conectarDB();

// Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
 
});


// Start the server
server.listen().then(({url}) => {
    console.log(`Servidor iniciado en ${url}`)
});