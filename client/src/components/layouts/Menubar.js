import React, { useState, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import AuthContext from './../../context/authContext/AuthContext';

const Menubar = () => {
    
    const { user, logout } = useContext(AuthContext)
    
    const pathname = window.location.pathname
    const path = pathname === '/' ? 'home' : pathname.substr(1)
    
    const [activeItem, setActiveItem] = useState(path)
    
    const itemClickHandler = (e, {name}) => {
        setActiveItem(name)
    }
    
    const menubar = user ? (
        <Menu pointing secondary color='teal'>
            <Menu.Item name={user.username} active as={Link} to='/' />
            <h2 className='right menu menu-header'>tReNsE bLoG</h2>
            <Menu.Menu position='right'>
                <Menu.Item name='logout' onClick={logout} className='logout-color' />
            </Menu.Menu>
        </Menu>
    ) : (
        <Menu pointing secondary color='teal'>
            <Menu.Item 
                name='home' active={activeItem === 'home'} 
                onClick={itemClickHandler} as={Link} to='/'
            />
            <h2 className='right menu menu-header'>tReNsE bLoG</h2>
            <Menu.Menu position='right'>
            <Menu.Item 
                name='register' active={activeItem === 'register'} 
                onClick={itemClickHandler} as={Link} to='/register' 
            />
            <Menu.Item 
                name='login' active={activeItem === 'login'} 
                onClick={itemClickHandler} as={Link} to='/login' 
            />
            </Menu.Menu>
        </Menu>
    )
    
    return menubar
}

export default Menubar
