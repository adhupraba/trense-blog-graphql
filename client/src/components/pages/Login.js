import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import { LOGIN_USER_MUTATION } from '../../graphql/mutations'
import { useForm } from '../../hooks/useForm'
import AuthContext from '../../context/authContext/AuthContext'

const Login = (props) => {
    
    const authContext = useContext(AuthContext)
    
    const [errors, setErrors] = useState({})
    const initialState = {
        email: '',
        password: ''
    }
    // we are using custom hook because we don't need the same duplicate in register component
    const { changeHandler, submitHandler, values } = useForm(login, initialState)
    
    const [loginUser, {loading}] = useMutation(LOGIN_USER_MUTATION, {
        // userData is an alias for loginUser object
        update(proxy, {data: {loginUser: userData}}) {
            authContext.login(userData)
            // 'replace' replaces the current path with '/'
            // so when user clicks back button in chrome tab
            // they cannot go to login page
            props.history.replace('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })
    
    // reason why we put function keyword instead of arrow function
    // is explained in youtube channel "Classed" - React GraphQL App playlist
    // video #4 time(22.35 min)
    function login() {
        loginUser()
    }
    
    const { email, password } = values
    
    return (
        <div className='form-container'>
            <Form onSubmit={submitHandler} noValidate className={loading ? 'loading': ''}>
                <div className='page-title'>
                    <h1>Login</h1>
                </div>
                <Form.Input 
                    label='E-mail' placeholder='E-mail' name='email'
                    error={errors.email ? true : false}
                    type='email' value={email} onChange={changeHandler}
                />
                <Form.Input 
                    label='Password' placeholder='Password' name='password'
                    error={errors.password ? true : false}
                    type='password' value={password} onChange={changeHandler}
                />
                <Button type='submit' primary>Login</Button>
            </Form>
            {
                Object.keys(errors).length > 0 &&
                <div className='ui error message'>
                    <ul className='list'>
                        {
                            Object.values(errors).map((error) => {
                                // we give key the error message because each message is unique
                                return <li key={error}>{error}</li>
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    )
}

export default Login
