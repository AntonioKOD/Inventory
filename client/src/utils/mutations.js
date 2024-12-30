import {gql} from '@apollo/client'

export const ADD_LIQUOR = gql `
    mutation addLiquor($input: LiquorInput!){
        addLiquor(input: $input){
            _id
            name
            category
            price
            stock
        }
    }
`

export const LOGIN = gql`
mutation Login($email: String!, $password: String!){
    login(email: $email, password: $password){
        token
        user{
            _id
            username
        }
    }
}
`

export const REGISTER = gql`
    mutation registerUserAndRestaurant($input: restaurantInput){
        registerUserAndRestaurant(input: $input){
            restaurant{
                _id
                address
                admin{
                    username
                    _id
                    email
                }
                liquors{
                    _id
                    category
                    name
                    price
                    stock

                }
                managers{
                    username
                    _id
                    email
                }
                name
                state
            }
            token
            user{
                _id
                username
                role
                email
            }

        }
    }
`

export const DELETE_LIQUOR = gql`
 mutation deleteLiquor($_id: ID!){
    removeLiquor(_id: $_id){
        _id
    }
 }
`

export const EMPTY_BOTTLES = gql`
    mutation setEmptyBottles($input: [EmptyBottles!]!){
        setEmptyBottles(input: $input){
            _id 
            date
            emptyBottles{
                liquor{
                    _id
                    category
                    name
                    price
                    stock

                }
                quantity
            }
        }
    }
`

export const UPDATE_STOCK = gql`
    mutation updateStock($stock: Int!, $id: ID!){
        updateStock(stock: $stock, _id: $id){
            _id 
            category
            name
            price
            stock

        }
    }
`

export const CREATE_USER = gql`
    mutation createUserAsAdmin($username: String!, $email: String!, $password: String!, $role: String!, $restaurantId: ID!){
        createUserAsAdmin(username: $username, email: $email, password: $password, role: $role, restaurantId: $restaurantId){
            _id
            email
            password
            role
            username
        }
    }
`
