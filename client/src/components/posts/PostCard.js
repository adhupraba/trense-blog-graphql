import React, { useContext } from 'react'
import { Card, Image, Popup, Icon, Label, Button } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import AuthContext from './../../context/authContext/AuthContext'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

const PostCard = ({post}) => {
    
    const { user } = useContext(AuthContext)
    const {id, body, createdAt, username, likes, likeCount, commentCount} = post
    
    return (
        <div>
            <Card fluid>
                <Card.Content as={Link} to={`/posts/${id}`}>
                    <Image 
                        floated='right' size='mini' 
                        src='https://semantic-ui.com/images/avatar2/large/elyse.png' 
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{body}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <LikeButton user={user} post={{ id, likes, likeCount }} />
                    <Popup
                        content='Comment' inverted
                        trigger={
                            <Button 
                                labelPosition='right'
                                as={Link} to={`/posts/${id}`}
                                className='post-button'
                            >
                                <Button color='blue' basic>
                                    <Icon name='comments' />
                                </Button>
                                <Label basic color='blue' pointing='left'>
                                    {commentCount}
                                </Label>
                            </Button>
                        }
                    />
                    {
                        user && user.username === username && <DeleteButton postId={id} />
                    }
                </Card.Content>
            </Card>
        </div>
        
    )
}

export default PostCard
