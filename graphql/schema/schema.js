const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    
    type Comment {
        id: ID!
        username: String!
        body: String!
        createdAt: String!
    }
    
    type Like {
        id: ID!
        username: String!,
        createdAt: String!
    }
    
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String!
        token: String!
    }

    type Query {
        getPost(postId: ID!): Post
        getPosts: [Post]
        sayHi: String!
    }
    
    type Mutation {
        registerUser(username: String!, email: String!, password: String!, confirmPassword: String!): User!
        loginUser(email: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
`

module.exports = typeDefs