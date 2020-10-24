import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import './App.css'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import Menubar from './components/layouts/Menubar'
import AuthState from './context/authContext/AuthState';
import AuthRoute from './routes/AuthRoute'
import SinglePost from './components/pages/SinglePost'

const App = () => {
  return (
    <AuthState>
      <Router>
        <Container>
        <Menubar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path='/posts/:postId' component={SinglePost} />
        </Container>
      </Router>
    </AuthState>
  )
}

export default App;
