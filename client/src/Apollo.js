import React from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import App from './App'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({
    uri: 'https://trense-blog.herokuapp.com/graphql'
})

const authLink = setContext((operation, prevContext) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : null
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

const Apollo = () => {
    return (
        <ApolloProvider client={client} >
            <App />
        </ApolloProvider>
    )
}

export default Apollo