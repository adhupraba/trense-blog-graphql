import React, { Fragment } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../../hooks/useForm'
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION } from '../../graphql/mutations';
import { FETCH_POSTS_QUERY } from '../../graphql/queries';

const PostForm = () => {
    
    const initialState = {
        body: ''
    }
    const { values, changeHandler, submitHandler } = useForm(postCreate, initialState)
    
    var error
    
    const [createPost] = useMutation(CREATE_POST_MUTATION, {
        update(proxy, result) {
            // console.log(result.data)
            
            // * read the getPosts cached object from apollo cache (you can see this in the apollo dev tools)
            const cachedData = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            // console.log(cachedData)
            
            // * we do not send another request to server for fetching posts after creating one...
            // * so what we do is update the getPosts cache by adding the newly added post data
            // * to the front of the cache so when getPosts cache is altered the Home Page automatically
            // * fetches the newly added post from the cache and renders that one alone
            
            // * THE CLIENT GETS DATA FROM THE SERVER IN INITIAL RENDER AND AFTER CREATING A POST THAT POST 
            // * IS FETCHED FROM THE CACHE SO THE COMMUNICATION TO THE SERVER BECOMES LESS AND APP IS EFFICIENT
            
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY, 
                // this getPosts object is from cached data, we destructure and use it
                data: {getPosts: [result.data.createPost, ...cachedData.getPosts]},
            })
            
            // ! we could have also used the refetchQueries property but that results in additional fetching from server
            
            values.body = ''
        },
        variables: values,
        onError(err) {
            error = err
        }
    })
    
    function postCreate() {
        createPost()
    }
    
    const { body } = values
    return (
        <Fragment>
            <Form onSubmit={submitHandler}>
                <h2>Create a post</h2>
                <Form.Field>
                    <Form.Input 
                        placeholder='Hello World' name='body'
                        value={body} onChange={changeHandler}
                        error={error ? true : false}
                    />
                    <Button type='submit' color='teal'>Create</Button>
                </Form.Field>
            </Form>
            {
                error && (
                    <div className='ui error message' style={{marginBottom: '1rem'}}>
                        <ul className="list">
                            <li>{error.graphQLErrors[0].message}</li>
                        </ul>
                    </div>
                )
            }
        </Fragment>
    )
}

export default PostForm
