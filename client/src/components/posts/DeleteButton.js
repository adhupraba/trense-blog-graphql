import React, { useState, Fragment } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import { DELETE_POST_MUTATION, DELETE_COMMENT_MUTATION } from '../../graphql/mutations'
import { FETCH_POSTS_QUERY } from '../../graphql/queries'

const DeleteButton = ({postId, callback, commentId}) => {
    
    const [confirmOpen, setConfirmOpen] = useState(false)
    
    const MUTATION = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    
    const [deletePostOrComment] = useMutation(MUTATION, {
        update(proxy, result) {
            setConfirmOpen(false)
            
            if (!commentId) {
                // remove post from cache
                const cachedData = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {getPosts: cachedData.getPosts.filter((post) => post.id !== postId)}
                })
            }
            
            if (callback) {
                callback()
            }
        },
        variables: {postId, commentId}
    })
    
    return (
        <Fragment>
            <Popup
                content={commentId ? 'delete comment' : 'delete post'} inverted
                trigger={
                    <Button 
                        as='div' color='red' floated='right' 
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Icon name='trash' style={{margin: 0}} />
                    </Button>
                }
            />
            <Confirm 
                open={confirmOpen} 
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            >
                
            </Confirm>
        </Fragment>
    )
}

export default DeleteButton
