const {Schema, model} = require('mongoose')

const liquorSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        toJSON: {
            virtuals: true
        },
        timestamps: true,
    }
)

liquorSchema.virtual('totalValue').get(function() {
    return this.stock * this.price
})

const Liquor = model('Liquor', liquorSchema)

module.exports = Liquor