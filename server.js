const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
const config = require('config')
const express = require('express')

const typeDefs = require('./graphql/schema/schema')
const resolvers = require('./graphql/resolvers/index')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
})

const url = config.get('MongoURI')

mongoose.connect(url, {
    useCreateIndex: true, useNewUrlParser: true, 
    useUnifiedTopology: true, useFindAndModify: false
}).then(() => {
    console.log('MongoDB connected...')
}).catch((err) => {
    console.log(err)
})

const app = express()
server.applyMiddleware({ app })

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}${server.graphqlPath}`)
})