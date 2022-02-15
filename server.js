const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");

const typeDefs = require("./graphql/schema/schema");
const resolvers = require("./graphql/resolvers/index");

const { env } = require("./utils/env");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

mongoose
    .connect(env.mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
server.applyMiddleware({ app });

if (env.nodeEnv === "production") {
    app.use(express.static("client/build"));
    app.get("*", function (req, res) {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = env.port;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
