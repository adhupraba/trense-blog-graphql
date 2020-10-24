const Post = require('../../model/Post')
const auth = require('../../middleware/auth')
const { AuthenticationError } = require('apollo-server-express')

const postResolvers = {
    Query: {
        getPosts: () => {
            return Post.find().sort({createdAt: -1}).then((posts) => {
                // console.log('getPosts')
                return posts
            }).catch((err) => {
                throw err
            })
        },
        getPost: (parent, args) => {
            const { postId } = args
            
            return Post.findById(postId).then((post) => {
                if (post) {
                    return post
                } 
                else {
                    throw new Error('Post not found')
                }
            }).catch((err) => {
                throw err
            })
        }
    },
    Mutation: {
        createPost: (parent, args, context) => {
            // console.log('createPost')
            const { body } = args
            const authorized = auth(context)
            // console.log(authorized)
            
            if (body.trim() === '') {
                throw new Error('Post body must not be empty')
            }
            const newPost = new Post({
                body,
                username: authorized.username,
                createdAt: new Date().toISOString(),
                creator: authorized.id
            })
            return newPost.save().then((post) => {
                return post
            }).catch((err) => {
                throw err
            })
        },
        deletePost: (parent, args, context) => {
            const { postId } = args
            const authorized = auth(context)
            
            return Post.findById(postId).then((post) => {
                // ! here we convert creator id to string it is mongo object id data type
                // ! and the request header id is string type... === checks for data type also..
                // ! so we convert creator id to string for strict checking
                if (authorized.id === post.creator.toString()) {
                    return post.deleteOne().then(() => {
                        return 'Post Deleted'
                    }).catch((err) => {
                        throw err
                    })
                }
                throw new AuthenticationError('You are not the creator of this post')
            }).catch((err) => {
                throw err
            })
        }
    }
}

module.exports = postResolvers