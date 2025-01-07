const {User, Restaurant, Liquor, Empty} = require('../models')
const {signToken} = require('../utils/auth')
const bcrypt  = require('bcryptjs')

const resolvers = {
    Query: {
        getBottles: async(parent, {date}, context)=>{
            const bottles = await Empty.find(date)
                .populate('emptyBottles')
            
            return bottles
        },
        getLiquors: async(parent, {restaurantId}, context)=> {
            const restaurant = await Restaurant.findOne({
                _id: restaurantId
            })
            .populate('liquors')
            if(!restaurant){
                throw new Error('Restaurant not found')
            }
            return restaurant.liquors
            
        },
        me: async (parent, args, context) => {
            if (!context.user) {
                throw new Error('Authentication required');
            }
        
            // Fetch the user from the database
            const user = await User.findOne({_id:context.user._id})
            if (!user) {
                throw new Error('User not found');
            }
            // Fetch the restaurant based on user role
          
            return user;
        },
        getRestaurant: async (_, __, context) => {
            
            if(!context.user){
                throw new Error('Auth required')
            }
        
            const user = await User.findOne({_id: context.user._id})
            let query = {};
            if (user.role === 'admin') {
                query = { admin: user._id };
            } else if (user.role === 'manager') {
                query = { managers: { $in: [user._id] } };
            }
            const restaurant = await Restaurant.findOne(query)
            .populate('admin', 'username email role') // Ensure 'username' is included
            .populate('managers', '_id username email role')
            .populate('liquors', '_id name stock price');
            return restaurant
        },
        getLiquor: async (parent, { searchTerm, restaurantId }) => {
            try {
                const restaurant = await Restaurant.findById(restaurantId)
                if (!restaurant) {
                    throw new Error('Restaurant not found');
                }

                const liquors = await Liquor.find({
                    name: { $regex: new RegExp(searchTerm, "i") },
                    restaurant: restaurant._id
                });
                return liquors;
            } catch (error) {
                console.error("Error in getLiquor resolver:", error);
                throw new Error("Failed to fetch liquor details.");
            }
        },
        getEmptyRecords: async(parent, {restaurantId}, context)=> {

            const restaurant = await Restaurant.findById(restaurantId)
            if(!restaurant){
                throw new Error('Restaurant not found')
            }
            const empty = await Empty.find({restaurant: restaurantId}).populate('emptyBottles.liquor')
            return empty
        }

        
        
    },
    Mutation: {
        addLiquor: async(parent, {input, restaurantId}, context)=>{
            
            const user = await User.findOne({_id: context.user._id})

            const restaurant = await Restaurant.findOne({_id: restaurantId})
            
            
            const newLiquor = await Liquor.create({...input,
                restaurant: restaurant._id
            })
            console.log(newLiquor)
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
            const restaurant = await Restaurant.findOne({ admin: user._id })
            .populate('admin', '_id username email role')
            .populate('managers', '_id username email role')
            .populate('liquors', '_id name stock price')
        
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
            const populatedRestaurant = await Restaurant.findById(newRestaurant._id).populate('admin', 'username email role');
        
            return { token, user: newUser, restaurant: populatedRestaurant };
        },
        createUserAsAdmin: async(parent, {username, email, password, role, restaurantId}, context)=> {
            const requestingUser = await User.findOne({_id: context.user._id});
            if(!requestingUser || requestingUser.role !== 'admin' ){
                throw new Error('You must be an admin to create a user')
            }
            const restaurant = await Restaurant.findOne({_id: restaurantId})
            if(!restaurant){
                throw new Error('Restaurant not Found')
            }

            if(String(restaurant.admin) !== String(requestingUser._id)){
                throw new Error('You are not authorized to manage users')
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
                restaurant: restaurant._id
            })

            if(role === 'manager'){
                restaurant.managers.push(newUser._id)
            }

            await restaurant.save()

            return newUser

        },
        setEmptyBottles: async (parent, { input, restaurantId }, context) => {
            const now = new Date();
            let effectiveDate = new Date(now);
        
            if (now.getHours() < 2) {
                effectiveDate.setDate(now.getDate() - 1);
            }
            effectiveDate.setHours(0, 0, 0, 0);
        
            try {
                // Verify the restaurant exists
                const restaurant = await Restaurant.findById(restaurantId);
                if (!restaurant) {
                    throw new Error('Restaurant not found');
                }
        
                // Find or create the Empty record for the specific restaurant
                let emptyRecord = await Empty.findOne({ date: effectiveDate, restaurant: restaurantId });
                if (!emptyRecord) {
                    emptyRecord = await Empty.create({
                        date: effectiveDate,
                        restaurant: restaurantId,
                        emptyBottles: []
                    });
                    if (!emptyRecord._id) {
                        throw new Error('Failed to create Empty record. Missing _id.');
                    }
                }
        
                const bottleMap = new Map(
                    emptyRecord.emptyBottles.map((bottle) => [String(bottle.liquor), bottle])
                );
        
                // Process input
                for (const { liquorId, emptyBottles } of input) {
                    if (typeof emptyBottles !== 'number' || emptyBottles < 0) {
                        throw new Error('Invalid value for empty bottles. Must be a non-negative number.');
                    }
        
                    const liquor = await Liquor.findById(liquorId);
                    if (!liquor) {
                        throw new Error(`Liquor with ID ${liquorId} not found`);
                    }
        
                    if (liquor.stock < emptyBottles) {
                        throw new Error(`Insufficient stock for liquor ID ${liquorId}`);
                    }
        
                    liquor.stock -= emptyBottles;
                    await liquor.save();
        
                    if (bottleMap.has(String(liquorId))) {
                        bottleMap.get(String(liquorId)).quantity += emptyBottles;
                    } else {
                        emptyRecord.emptyBottles.push({
                            liquor: liquorId,
                            quantity: emptyBottles,
                        });
                    }
                }
        
                // Save the updated Empty record
                await emptyRecord.save();
        
                // Populate and return the record
                const populatedRecord = await Empty.findById(emptyRecord._id).populate('emptyBottles.liquor');
                if (!populatedRecord._id) {
                    throw new Error('Failed to fetch Empty record. Missing _id.');
                }
        
                return [populatedRecord];
            } catch (error) {
                console.error('Error in setEmptyBottles:', error);
                throw new Error('Failed to update empty bottles.');
            }
        },
        removeLiquor: async(parent, {_id}, context)=> {
           

            const deleteLiquor = await Liquor.findById({_id})


            await Liquor.deleteOne({_id})
            return deleteLiquor
        },
        updateStock: async(parent, {stock, id},context)=> {
            const liquor = await Liquor.findByIdAndUpdate( id, {
                 stock
            },
            {new: true}
        )
    
            return liquor

        }

       

        
    }
    
}

module.exports = resolvers