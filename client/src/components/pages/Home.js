import React, { useContext } from 'react'
import { Grid, Transition, Card } from 'semantic-ui-react'
import { useQuery } from '@apollo/client'
import { FETCH_POSTS_QUERY } from '../../graphql/queries'
import PostCard from '../posts/PostCard'
import AuthContext from '../../context/authContext/AuthContext'
import PostForm from '../posts/PostForm'

const Home = () => {
    
    const { user } = useContext(AuthContext)
    const { loading, data } = useQuery(FETCH_POSTS_QUERY)
    var posts
    if (data) {
        posts = data.getPosts
    }
    return (
        <Grid columns={3}>
            <Grid.Row className='page-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )
                }
                {
                    loading 
                    ? (
                        <Card>
                            <Card.Content>
                                <Card.Header>Loading...</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <h3>Loading Posts.....</h3>
                            </Card.Content>
                        </Card>
                    )
                    : posts.length > 0 ? (
                        <Transition.Group animation='zoom' duration={600}>
                            {
                                posts && posts.map((post) => (
                                    <Grid.Column key={post.id} style={{marginBottom: '1.5rem'}}>
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ))
                            }
                        </Transition.Group>
                    )
                    : (
                        <Card>
                            <Card.Content>
                                <Card.Header>No Posts</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                {user ? <h4>Create a post for others to view</h4> : <h4>Login or register to create a post</h4>}
                            </Card.Content>
                        </Card>
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

export default Home
