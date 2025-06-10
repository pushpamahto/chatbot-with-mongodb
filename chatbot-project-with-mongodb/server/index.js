require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));






// API endpoint to save user data  --> original with  email exist error show

// app.post('/save-user', async (req, res) => {
//     try {
//         const { name, email } = req.body;
        
//         // Validate email format
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             return res.status(400).json({ message: 'Please enter a valid email address' });
//         }

//         // Check if email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }
        
//         // Create new user
//         const newUser = new User({ name, email });
//         await newUser.save();
        
//         res.status(201).json({ message: 'User saved successfully', user: newUser });
//     } catch (error) {
//         console.error('Error saving user:', error);
//         if (error.code === 11000) {
//             res.status(400).json({ message: 'Email already exists' });
//         } else {
//             res.status(500).json({ message: 'Error saving user', error: error.message });
//         }
//     }
// });





// with no email exist 

app.post('/save-user', async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Create new user without any validation
        const newUser = new User({ name, email });
        await newUser.save();
        
        res.status(201).json({ message: 'User saved successfully', user: newUser });
    } catch (error) {
        console.error('Error saving user:', error);
        // Still respond with success even if there's an error
        res.status(200).json({ message: 'User session started' });
    }
});





// API endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});