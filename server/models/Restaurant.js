const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')

const restaurantSchema = new Schema (
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
            unique: true,
        },
        state: {
            type: String,
            required: true,
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        managers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        liquors: [{
            type: Schema.Types.ObjectId,
            ref: 'Liquor'
        }],
    },
    {
        toJSON: {
            virtuals: true
        }
    }
)

const Restaurant = model('Restaurant', restaurantSchema)

module.exports = Restaurant;