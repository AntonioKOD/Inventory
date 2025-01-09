import {gql} from '@apollo/client'

export const ADD_LIQUOR = gql `
    mutation addLiquor($input: LiquorInput!, $restaurantId: ID!){
        addLiquor(input: $input, restaurantId: $restaurantId){
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
   mutation UpdateStock($id: ID!, $stock: Int!) {
    updateStock(id: $id, stock: $stock) {
        _id
        name
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
export const EMPTY_BOTTLES = gql`
  # Mutation to set the empty bottles for liquors
  # Input: Array of EmptyBottles objects, each with liquorId and emptyBottles count
  # Returns: Updated Empty record with date and emptyBottles details
  mutation SetEmptyBottles($input: [EmptyBottles!]!, $restaurantId: ID!) {
    setEmptyBottles(input: $input, restaurantId: $restaurantId) {
      _id          # ID of the Empty record
      date         # Date for the record
      emptyBottles {
        liquor {   # Liquor details for each empty bottle entry
          _id
          name
          category
          price
          stock
        }
        quantity   # Number of empty bottles for the liquor
      }
    }
  }
`;

export const ADD_SINGLE_EMPTY_BOTTLE = gql`
  mutation setEmptyBottle($liquorId: ID!, $emptyBottles: Int!, $restaurantId: ID!) {
    setEmptyBottle(liquorId: $liquorId, emptyBottles: $emptyBottles, restaurantId: $restaurantId) {
      _id          # ID of the Empty record
      date         # Date for the record
      emptyBottles {
        liquor {   # Liquor details for each empty bottle entry
          _id
          name
          category
          price
          stock
        }
        quantity   # Number of empty bottles for the liquor
      }
    }
  }
`;

export const UPDATE_MANAGER = gql`
  mutation UpdateManager(
    $restaurantId: ID!
    $userId: ID!
    $email: String
    $username: String
    $role: String
  ) {
    updateManager(
      restaurantId: $restaurantId
      userId: $userId
      email: $email
      username: $username
      role: $role
    ) {
      _id
      name
      managers {
        _id
        username
        email
        role
      }
    }
  }
`;

export const REMOVE_MANAGER = gql` 
    mutation RemoveManager($restaurantId: ID!, $userId: ID!){
        removeManager(restaurantId: $restaurantId, userId: $userId){
            _id
            name
            managers{
                _id
                username
                email
                role
            }
        }
    }
`
