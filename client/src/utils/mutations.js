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
            restaurant {
      liquors {
        _id
        category
        name
        price
        stock
      }
      address
      _id
      admin {
        email
        _id
        username
        role
      }
      managers {
        username
        role
        email
        _id
      }
      name
      state
    }
    token
    user {
      _id
      email
      role
      username
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
    mutation createUserAsAdmin($username: String!, $email: String!, $password: String!, $role: String!){
        createUserAsAdmin(username: $username, email: $email, password: $password, role: $role){
            _id
            email
            password
            role
            username
        }
    }
`

export const EMPTY_BOTTLES = gql`
    mutation setEmptyBottles($input: [EmptyBottles!]!){
        setEmptyBottles(input: $input){
            _id
            emptyBottles
        }
    }
`