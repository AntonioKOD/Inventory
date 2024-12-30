const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value){
                    if(this.role === 'admin'){
                        const genericDomains = [
                            'gmail.com',
                            'yahoo.com',
                            'icloud.com',
                            'hotmail.com',
                            'outlook.com',
                            'aol.com'
                        ]
                        const domain = value.split('@')[1]
                        return !genericDomains.includes(domain)
                    }
                    return true;
                },
                message: (props) => 
                    `${props.value} is a generic email address`
            },
            match: [/.+@.+\..+/, 'Valid Email Required'],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        }
    },
    {
        toJSON: {
            virtuals: true,
        }
    }
)
userSchema.pre('save', async function (next){
    if(this.isNew || this.isModified('password')){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds)
    }
    next()
})

userSchema.methods.isCorrectPassword = async function(password){
    return bcrypt.compare(password, this.password)
}
userSchema.virtual('associatedRestaurants', {
    ref: 'Restaurant',
    localField: '_id',
    foreignField: 'admin', // Matches the admin field in the Restaurant schema
});

const User = model('User', userSchema)

module.exports  = User