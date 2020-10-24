import React, { useState, useEffect } from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { LIKE_POST_MUTATION } from '../../graphql/mutations'

const LikeButton = ({ post: {id, likeCount, likes}, user }) => {
    
    const [liked, setLiked] = useState(false)
    
    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true)
        }
        else {
            setLiked(false)
        }
    }, [user, likes])
    
    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id},
        onError(err) {
            console.log(err)
        }
    })
    
    const likeBtn = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to='/login' color='teal' basic>
            <Icon name='heart' />
        </Button>
    )
    
    return (
        <Popup
            content='like' inverted
            trigger={
                <Button 
                    as='div' labelPosition='right' 
                    className='post-button' onClick={likePost}
                >
                    {likeBtn}
                    <Label as='a' basic color='teal' pointing='left'>
                        {likeCount}
                    </Label>
                </Button>
            }
        />
    )
}

export default LikeButton
