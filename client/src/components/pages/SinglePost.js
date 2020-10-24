import React, { useContext, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FETCH_SINGLE_POST_QUERY } from '../../graphql/queries'
import { Grid, Card, Image, Button, Icon, Label, Transition, Form, Popup } from 'semantic-ui-react'
import moment from 'moment'
import AuthContext from '../../context/authContext/AuthContext'
import LikeButton from '../posts/LikeButton'
import DeleteButton from '../posts/DeleteButton'
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations'

const SinglePost = (props) => {
    
    const { user } = useContext(AuthContext)
    const postId = props.match.params.postId
    const [comment, setComment] = useState('')
    const commentRef = useRef(null)
    
    const { data, loading } = useQuery(FETCH_SINGLE_POST_QUERY, {
        variables: {postId}
    })
    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(proxy, result) {
            setComment('')
            // unfocus the comment input after submitting
            commentRef.current.blur()
        },
        variables: {postId, body: comment}
    })
    
    const deletePostCallback = () => {
        // 'replace' replaces the current path with '/'
        // so when user clicks back button in chrome tab
        // they cannot go to the deleted page path
        props.history.replace('/')
    }
    
    let postMarkup
    
    if (loading) {
        postMarkup = <p>Loading Post....</p>
    }
    else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src='https://semantic-ui.com/images/avatar2/large/elyse.png' 
                            size='small' float='right' 
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}} />
                                <Popup
                                    content='comment' inverted
                                    trigger= {
                                        <Button as='div' labelPosition='right' onClick={() => commentRef.current.focus()}>
                                            <Button basic color='blue'>
                                                <Icon name='comments' />
                                            </Button>
                                            <Label basic color='blue' pointing='left'>
                                                {commentCount}
                                            </Label>
                                        </Button>
                                    }
                                />
                                {
                                    user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />
                                }
                            </Card.Content>
                        </Card>
                        <h1>Comments</h1>
                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a comment</p>
                                        <Form>
                                            <div className='ui action input fluid'>
                                                <input 
                                                    type="text" placeholder='Comment...' 
                                                    name='comment' value={comment}
                                                    onChange={(e) => setComment(e.target.value)} 
                                                    ref={commentRef}
                                                />
                                                <button 
                                                    type='submit' className='ui button teal'
                                                    disabled={comment.trim() === ''}
                                                    onClick={createComment}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }
                        {
                            comments.length > 0 ? (
                                <Transition.Group animation='scale' duration={400}>
                                    {
                                        comments.map((comment) => (
                                            <Card fluid key={comment.id}>
                                                <Card.Content>
                                                    {
                                                        user && ((user.username === comment.username) || (user.username === username)) && (
                                                            <DeleteButton postId={id} commentId={comment.id} />
                                                        )
                                                    }
                                                    <Card.Header>{comment.username}</Card.Header>
                                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                                    <Card.Description>{comment.body}</Card.Description>
                                                </Card.Content>
                                            </Card>
                                        ))
                                    }
                                </Transition.Group>
                            ) : (
                                <h2 style={{color: 'gray', textAlign: 'center'}}>No Comments</h2>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    
    return postMarkup
}

export default SinglePost
