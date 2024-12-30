const {User, Restaurant, Liquor, Empty} = require('../models')
const {signToken} = require('../utils/auth')

const resolvers = {
    Query: {
        getBottles: async(parent, {date}, context)=>{
            const bottles = await Empty.find(date)
                .populate('emptyBottles')
            
            return bottles
        },
        getLiquors: async()=> {
            const liquor = await Liquor.find()
            return liquor
        },
        me: async(parent, args, context)=> {
            if(context.user){
                const user = await User.findOne({_id: context.user._id})
                const restaurant = await Restaurant({addmin: context.user._id})
                    .populate('managers')
                    .populate('liquors')   
                return {user, restaurant}
            }
        }
    },
    Mutation: {
        addLiquor: async(parent, {input, restaurantId}, context)=>{
            

            const restaurant = await Restaurant.findById(restaurantId)
            
            const newLiquor = await Liquor.create(input)

            restaurant.liquors.push(newLiquor._id)
            await restaurant.save()

            return newLiquor
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('No user was found');
            }
        
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new Error('Incorrect password or email');
            }
        
            // Fetch the restaurant linked to this admin
            const restaurant = await Restaurant.findOne({ admin: user._id }).populate('admin', 'username email');
        
            const token = signToken(user);
        
            return { token, user, restaurant }; // Return a single restaurant
        },
        registerUserAndRestaurant: async (parent, { input }) => {
            const { username, email, password, name, address, state } = input;
        
            // Check for generic email domains
            const genericDomains = [
                'gmail.com', 'yahoo.com', 'icloud.com', 'hotmail.com', 'outlook.com', 'aol.com',
            ];
            const domain = email.split('@')[1];
            if (genericDomains.includes(domain)) {
                throw new Error('Admins must use a business email to create an account');
            }
        
            // Check if a restaurant already exists with the same address
            const existingRestaurant = await Restaurant.findOne({ address });
            if (existingRestaurant) {
                throw new Error('A restaurant is already registered with this address');
            }
        
            // Create a new admin user
            const newUser = await User.create({
                username,
                email,
                password,
                role: 'admin', // Assign the role explicitly
            });
        
            // Create a single restaurant assigned to this admin
            const newRestaurant = await Restaurant.create({
                name,
                address,
                state,
                admin: newUser._id, // Link admin to the restaurant
            });
        
            // Generate a token for the admin
            const token = signToken(newUser);
        
            // Populate the admin field for the restaurant before returning
            const populatedRestaurant = await Restaurant.findById(newRestaurant._id).populate('admin', 'username email');
        
            return { token, user: newUser, restaurant: populatedRestaurant };
        },
        createUserAsAdmin: async(parent, {username, email, password, role, restaurantId}, context)=> {
            const requestingUser = context.user;
            if(!requestingUser || requestingUser.role !== 'admin' ){
                throw new Error('You must be an admin to create a user')
            }
            const restaurant = await Restaurant.findById(restaurantId)
            if(!restaurant){
                throw new Error('Restaurant not Found')
            }

            if(String(restaurant.admin) !== String(requestingUser._id)){
                throw new Error('You are now authorized to manage users')
            }

            const existingUser = await User.findOne({email})

            if(existingUser){
                throw new Error('A user with this email already exists')
            }

            const newUser = await User.create({
                username, 
                email, 
                password,
                role,
            })

            if(role === 'manager'){
                restaurant.managers.push(newUser._id)
            }

            await restaurant.save()

            return newUser

        },
        setEmptyBottles: async (parent, { input }, context) => {
           // if (!context.user) {
             //   throw new Error('You need to be logged in to set the empty bottles');
            //}
        
            const now = new Date();
            let effectiveDate = new Date(now);
        
            // Adjust date if time is between midnight and 2 AM
            if (now.getHours() < 2) {
                effectiveDate.setDate(now.getDate() - 1);
            }
        
            effectiveDate.setHours(0, 0, 0, 0);
        
            // Check if an empty record exists for the effective date
            let emptyRecord = await Empty.findOne({ date: effectiveDate });
            if (!emptyRecord) {
                emptyRecord = await Empty.create({
                    date: effectiveDate,
                    emptyBottles: [],
                });
            }
        
            // Update or add empty bottles for each liquor
            for (const { liquorId, emptyBottles } of input) {
                const liquor = await Liquor.findById(liquorId);
                if (!liquor) {
                    throw new Error(`Liquor with ID ${liquorId} is not found`);
                }

                liquor.stock -= emptyBottles;
                await liquor.save()
        
                const liquorEntry = emptyRecord.emptyBottles.find(
                    (bottle) => String(bottle.liquor) === String(liquor._id)
                );
        
                if (liquorEntry) {
                    liquorEntry.quantity += emptyBottles;
                } else {
                    emptyRecord.emptyBottles.push({
                        liquor: liquor._id,
                        quantity: emptyBottles,
                    });
                }
            }
        
            await emptyRecord.save();
            const populatedRecord = await Empty.findById(emptyRecord._id).populate('emptyBottles.liquor');

            return [populatedRecord];
        },
        removeLiquor: async(parent, {_id}, context)=> {
           

            const deleteLiquor = await Liquor.findById({_id})


            await Liquor.deleteOne({_id})
            return deleteLiquor
        },
        updateStock: async(parent, {stock, _id},context)=> {
            const liquor = await Liquor.findByIdAndUpdate( _id, {
                 stock
            },
            {new: true}
        )
            

            return liquor

        }

       

        
    }
    
}

module.exports = resolvers