const { model, Schema } = require('mongoose')

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
            creator: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
            creator: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = Post = model('Post', postSchema)