const { User, Restaurant, Liquor, Empty } = require('../models');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcryptjs');

const resolvers = {
  Query: {
    getBottles: async (parent, { date }) => {
      try {
        return await Empty.find(date).populate('emptyBottles');
      } catch (error) {
        console.error('Error fetching bottles:', error);
        throw new Error('Failed to fetch bottles');
      }
    },
    getLiquors: async (parent, { restaurantId }) => {
      try {
        const restaurant = await Restaurant.findById(restaurantId)
          .select('liquors')
          .populate('liquors', 'name stock price category');
        if (!restaurant) throw new Error('Restaurant not found');
        return restaurant.liquors;
      } catch (error) {
        console.error('Error fetching liquors:', error);
        throw new Error('Failed to fetch liquors');
      }
    },
    me: async (parent, args, context) => {
      if (!context.user) throw new Error('Authentication required');
      try {
        const user = await User.findById(context.user._id);
        if (!user) throw new Error('User not found');
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
      }
    },
    getRestaurant: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');
      try {
        const user = await User.findById(context.user._id);
        const query = user.role === 'admin'
          ? { admin: user._id }
          : { managers: { $in: [user._id] } };

        const restaurant = await Restaurant.findOne(query)
          .populate('admin', 'username email role')
          .populate('managers', '_id username email role')
          .populate('liquors', '_id name stock price');

        return restaurant;
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        throw new Error('Failed to fetch restaurant');
      }
    },
    getLiquor: async (parent, { searchTerm, restaurantId }) => {
      try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');

        return await Liquor.find({
          name: { $regex: new RegExp(searchTerm, 'i') },
          restaurant: restaurant._id,
        });
      } catch (error) {
        console.error('Error fetching liquor:', error);
        throw new Error('Failed to fetch liquor');
      }
    },
    getEmptyRecords: async (parent, { restaurantId }) => {
      try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');
        return await Empty.find({ restaurant: restaurantId }).populate('emptyBottles.liquor');
      } catch (error) {
        console.error('Error fetching empty records:', error);
        throw new Error('Failed to fetch empty records');
      }
    },
  },

  Mutation: {
    addLiquor: async (parent, { input, restaurantId }, context) => {
      try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');

        const newLiquor = await Liquor.create({ ...input, restaurant: restaurant._id });
        restaurant.liquors.push(newLiquor._id);
        await restaurant.save();

        return newLiquor;
      } catch (error) {
        console.error('Error adding liquor:', error);
        throw new Error('Failed to add liquor');
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('No user found');
        if (!(await user.isCorrectPassword(password))) throw new Error('Incorrect credentials');

        const restaurant = await Restaurant.findOne({ admin: user._id })
          .populate('admin', '_id username email role')
          .populate('managers', '_id username email role')
          .populate('liquors', '_id name stock price');

        return { token: signToken(user), user, restaurant };
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Failed to log in');
      }
    },
    registerUserAndRestaurant: async (parent, { input }) => {
      const { username, email, password, name, address, state } = input;

      try {
        // Validate email domain
        const genericDomains = ['gmail.com', 'yahoo.com', 'icloud.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        if (genericDomains.includes(email.split('@')[1])) throw new Error('Use a business email');

        // Check if a restaurant already exists at the address
        if (await Restaurant.findOne({ address })) throw new Error('Restaurant already exists at this address');

        // Create admin user and restaurant
        const newUser = await User.create({ username, email, password, role: 'admin' });
        const newRestaurant = await Restaurant.create({ name, address, state, admin: newUser._id });

        const populatedRestaurant = await Restaurant.findById(newRestaurant._id).populate('admin', 'username email role');

        return { token: signToken(newUser), user: newUser, restaurant: populatedRestaurant };
      } catch (error) {
        console.error('Error registering user and restaurant:', error);
        throw new Error('Failed to register user and restaurant');
      }
    },
    createUserAsAdmin: async (parent, { username, email, password, role, restaurantId }, context) => {
      try {
        const requestingUser = await User.findById(context.user._id);
        if (!requestingUser || requestingUser.role !== 'admin') throw new Error('Admin privileges required');

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');
        if (String(restaurant.admin) !== String(requestingUser._id)) throw new Error('Unauthorized');

        if (await User.findOne({ email })) throw new Error('User with this email already exists');

        const newUser = await User.create({ username, email, password, role, restaurant: restaurant._id });
        if (role === 'manager') restaurant.managers.push(newUser._id);
        await restaurant.save();

        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },
    setEmptyBottles: async (parent, { input, restaurantId }, context) => {
      try {
        const effectiveDate = new Date();
        effectiveDate.setHours(0, 0, 0, 0);

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');

        let emptyRecord = await Empty.findOne({ date: effectiveDate, restaurant: restaurantId });
        if (!emptyRecord) {
          emptyRecord = await Empty.create({ date: effectiveDate, restaurant: restaurantId, emptyBottles: [] });
        }

        const bottleMap = new Map(emptyRecord.emptyBottles.map((b) => [String(b.liquor), b]));
        for (const { liquorId, emptyBottles } of input) {
          if (typeof emptyBottles !== 'number' || emptyBottles < 0) throw new Error('Invalid bottle count');

          const liquor = await Liquor.findById(liquorId);
          if (!liquor) throw new Error(`Liquor ID ${liquorId} not found`);
          if (liquor.stock < emptyBottles) throw new Error('Insufficient stock');

          liquor.stock -= emptyBottles;
          await liquor.save();

          if (bottleMap.has(liquorId)) {
            bottleMap.get(liquorId).quantity += emptyBottles;
          } else {
            emptyRecord.emptyBottles.push({ liquor: liquorId, quantity: emptyBottles });
          }
        }
        await emptyRecord.save();
        return await Empty.findById(emptyRecord._id).populate('emptyBottles.liquor');
      } catch (error) {
        console.error('Error setting empty bottles:', error);
        throw new Error('Failed to set empty bottles');
      }
    },
    removeLiquor: async (parent, { _id }) => {
      try {
        const deletedLiquor = await Liquor.findByIdAndDelete(_id);
        return deletedLiquor;
      } catch (error) {
        console.error('Error removing liquor:', error);
        throw new Error('Failed to remove liquor');
      }
    },
    updateStock: async (parent, { stock, id }) => {
      try {
        return await Liquor.findByIdAndUpdate(id, { stock }, { new: true });
      } catch (error) {
        console.error('Error updating stock:', error);
        throw new Error('Failed to update stock');
      }
    },
  },
};

module.exports = resolvers;