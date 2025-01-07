const {Schema, model} = require('mongoose')


const emptySchema = new Schema(
    {
        date: {
            type: Date,
            default: Date.now(),
            required: true
        },
        emptyBottles: [
            {
            liquor: {
            type: Schema.Types.ObjectId, 
            ref: 'Liquor'
        },
        quantity: {
            type: Number,
            required:true,
        }
    }],
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    },
    {
        timestamps: true
    }
)

const Empty = model('Empty', emptySchema)

module.exports = Empty