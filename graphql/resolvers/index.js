const postResolvers = require('./postResolvers')
const userResolvers = require('./userResolvers')
const commentResolvers = require('./commentResolvers')
const likeResolvers = require('./likeResolvers')

const resolver = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...postResolvers.Mutation,
        ...userResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation
    }
}

module.exports = resolver