const User = require('../../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { UserInputError } = require('apollo-server-express')
const { registerValidation, loginValidation } = require('../../validation/authValidation')

const transformUser = (user) => {
    const token = jwt.sign(
        {id: user.id, username: user.username, email: user.email},
        config.get('SecretKey'),
        {expiresIn: '1h'}
    )
    return {...user._doc, id: user.id, token: token}
}

const userResolvers = {
    Mutation: {
        registerUser: (parent, args) => {
            
            const { username, email, password, confirmPassword } = args
            const { errors, valid } = registerValidation(username, email, password, confirmPassword)
            
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }
            
            return User.findOne({email: email}).then((user) => {
                if (user) {
                    throw new UserInputError('Email already exists', {
                        errors: {
                            email: 'Email already exists'
                        }
                    })
                }
                return User.findOne({username: username}).then((user) => {
                    if (user) {
                        throw new UserInputError('Username already exists', {
                            errors: {
                                username: 'Username is already taken'
                            }
                        })
                    }
                    return bcrypt.hash(password, 15).then((hashed) => {
                        const newUser = new User({
                            username: username,
                            email: email,
                            password: hashed,
                            createdAt: new Date().toISOString()
                        })
                        return newUser.save().then((user) => {
                            return transformUser(user)
                        }).catch((err) => {
                            throw err
                        })
                    }).catch((err) => {
                        throw err
                    })
                }).catch((err) => {
                    throw err
                })
            }).catch((err) => {
                throw err
            })
        },
        loginUser: (parent, args) => {
            const { email, password } = args
            const { errors, valid } = loginValidation(email, password)
            
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }
            
            return User.findOne({email: email}).then((user) => {
                if (!user) {
                    errors.general = 'User does not exist'
                    throw new UserInputError('User does not exist', {errors})
                }
                return bcrypt.compare(password, user.password).then((isMatch) => {
                    if (!isMatch) {
                        errors.general = 'Invalid Credentials'
                        throw new UserInputError('Invalid Credentials', {errors})
                    }
                    return transformUser(user)
                }).catch((err) => {
                    throw err
                })
            }).catch((err) => {
                throw err
            })
        }
    }
}

module.exports = userResolvers