import {gql} from '@apollo/client'

export const ME = gql`
    query me{
        me{
            _id
            username
            email
            role
        }
    }
`


export const RESTAURANT = gql`
   query getRestaurant{
    getRestaurant {
        _id
        name
        address
        state
        admin {
            _id
            username
            email
        }
        managers {
            _id
            username
            email
            role
        }
        liquors {
            _id
            name
            stock
            price
        }
    }
}
`


export const GET_LIQUORS = gql`
    query getLiquors{
        getLiquors{
            _id
            category
            name
            stock
            price
        }
    }
`

export const GET_LIQUOR = gql`
    query getLiquor($searchTerm: String!){
        getLiquor(searchTerm: $searchTerm){
            _id
            name
            stock
            price
            category
        }
    }
`

export const GET_EMPTY = gql`
    query getEmptyRecords{
        getEmptyRecords{
            _id 
            date
            emptyBottles{
                liquor{
                    _id
                    name
                    price
                    category
                }
                quantity
            }
        }
    }
`


