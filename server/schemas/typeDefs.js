const typeDefs = `

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        role: String!
    }

    type Restaurant {
        _id: ID!
        name: String!
        address: String!
        state: String!
        admin: User!
        managers: [User]
        liquors: [Liquor]
        
    }
    
    type Auth {
        token: ID!
        user: User
        restaurant: Restaurant
    }

    type Liquor {
        _id: ID!
        category: String!
        name: String!
        price: Float!
        stock: Int
    }

    type Empty{ 
        _id: ID!
        date: String!
        emptyBottles: [EmptyBottle!]!
    }

    type EmptyBottle {
        liquor: Liquor!
        quantity: Int!    
    }


    type Query{
        getBottles(date: String): [Empty]
        me: User
        getLiquors(restaurantId: ID!): [Liquor]
        getRestaurant: Restaurant
        getLiquor(searchTerm: String!, restaurantId: ID!): [Liquor]
        getEmptyRecords(restaurantId: ID!): [Empty]

    }

    input LiquorInput{
        category: String!
        name: String!
        price: Float!
        stock: Int
    }
    
    input restaurantInput{
        username: String!
        email: String!
        password: String!
        name: String!
        address: String!
        state: String!
    }
    input EmptyBottles {
        liquorId: ID!
        emptyBottles: Int!
    }

    type Mutation { 

        addLiquor(input: LiquorInput!, restaurantId: ID!): Liquor
        login(email: String!, password: String!): Auth
        registerUserAndRestaurant(input: restaurantInput): Auth
        removeLiquor(_id: ID!): Liquor
        setEmptyBottles(input: [EmptyBottles!]!, restaurantId: ID!): [Empty!]!
        createUserAsAdmin(username:String!, email: String!,password: String!, role: String!, restaurantId: ID!): User
        updateStock(id: ID!, stock: Int!): Liquor
        setEmptyBottle(liquorId: ID!, emptyBottles: Int!, restaurantId: ID!): Empty
    }

`


module.exports = typeDefs