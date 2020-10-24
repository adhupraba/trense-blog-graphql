import { gql } from '@apollo/client'

export const REGISTER_USER_MUTATION = gql`
    mutation RegisterUser($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
        registerUser(username: $username, email: $email, password: $password, confirmPassword: $confirmPassword) {
            id
            username
            email
            createdAt
            token
        }
    }
`

export const LOGIN_USER_MUTATION = gql`
    mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            id
            username
            email
            createdAt
            token
        }
    }
`

export const CREATE_POST_MUTATION = gql`
    mutation CreatePost($body: String!) {
        createPost(body: $body) {
            id
            body
            username
            createdAt
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

export const LIKE_POST_MUTATION = gql`
    mutation LikePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
                createdAt
            }
            likeCount
        }
    }
`

export const DELETE_POST_MUTATION = gql`
    mutation DeletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

export const DELETE_COMMENT_MUTATION = gql`
    mutation DeleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

export const CREATE_COMMENT_MUTATION = gql`
    mutation CreateComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`