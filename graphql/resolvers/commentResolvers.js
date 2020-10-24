const Post = require('../../model/Post')
const auth = require('../../middleware/auth')
const { commentValidation } = require('../../validation/commentValidation')
const { UserInputError, AuthenticationError } = require('apollo-server-express')

const commentResolvers = {
    Mutation: {
        createComment: (parent, args, context) => {
            const { postId, body } = args
            const authorized = auth(context)
            const { errors, valid } = commentValidation(body)
            
            if (!valid) {
                throw new UserInputError('Empty Comment', {errors})
            }
            
            return Post.findById(postId).then((post) => {
                if (post) {
                    post.comments.unshift({
                        body,
                        username: authorized.username,
                        createdAt: new Date().toISOString(),
                        creator: authorized.id
                    })
                    return post.save().then((post) => {
                        return post
                    }).catch((err) => {
                        throw err
                    })
                }
                throw new UserInputError('Post not found')
            }).catch((err) => {
                throw err
            })
        },
        deleteComment: (parent, args, context) => {
            const { postId, commentId } = args
            const authorized = auth(context)
            
            return Post.findById(postId).then((post) => {
                if (post) {
                    const commentIndex = post.comments.findIndex((c) => c.id === commentId)

                    if (post.comments[commentIndex].creator.toString() === authorized.id || post.creator.toString() === authorized.id) {
                        post.comments.splice(commentIndex, 1)
                        return post.save().then((post) => {
                            return post
                        }).catch((err) => {
                            throw err
                        })
                    }
                    throw new AuthenticationError('You cannot delete this comment')
                }
                throw new UserInputError('Post not found')
            }).catch((err) => {
                throw err
            })
        }
    }
}

module.exports = commentResolvers