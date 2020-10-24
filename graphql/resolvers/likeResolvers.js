const Post = require('../../model/Post')
const auth = require('../../middleware/auth')
const { UserInputError } = require('apollo-server-express')

const likeResolvers = {
    Mutation: {
        likePost: (parent, args, context) => {
            const { postId } = args
            const authorized = auth(context)
            
            return Post.findById(postId).then((post) => {
                if (post) {
                    if (post.likes.find((like) => like.creator.toString() === authorized.id)) {
                        // post is already liked, so unlike it
                        post.likes = post.likes.filter((like) => like.creator.toString() !== authorized.id)
                    }
                    else {
                        // post is unlinked , so like it
                        post.likes.push({
                            username: authorized.username,
                            createdAt: new Date().toISOString(),
                            creator: authorized.id
                        })
                    }
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
        }
    }
}

module.exports = likeResolvers