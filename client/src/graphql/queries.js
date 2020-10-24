import { gql } from '@apollo/client'

export const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            username
            createdAt
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`

export const FETCH_SINGLE_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            username
            createdAt
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`