const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost:27017/dandyhacks', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("Connected to the database");
});

// Users schema
const User = mongoose.model('User', new mongoose.Schema({ 
    username: String,
    age: Number,
    password: String,
    userPastPerformance: Object
}));

// Courses schema
const Course = mongoose.model('Course', new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userPastPerformance: {
      main_topic: {
        type: String,
        required: true
      },
      subtopics: [{
        name: {
          type: String,
          required: true
        },
        performance: {
          type: Number,
          required: true
        }
      }]
    }
  }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// GET homepage
app.get('/', async (req, res) => {
    try {
        const user = await User.findOne({ name: 'justin chan' });
        console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.send(courses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})


// POST sign up
app.post('/signup', async function(req, res) {
    let age = req.body.age;
    let username = req.body.username;
    let password = req.body.password;
    console.log(age, username, password);
    try {

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            res.status(400).json({status: false, message: 'User already exists'});
            return;
        }

        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user 
        const user = new User({
            username: username,
            password: hashedPassword,
            age: age
        });

        // Save user to database
        await user.save();

        // Send success message to client side
        res.send({
            "status": true,
            "username": username
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error'});
    }
});

/* Login api for authentication of credidentials */
app.post('/login', async (req, res) => {
    
    let username = req.body.username;
    let password = req.body.password;

    try {
        const user = await User.findOne({ username: username });

        // if user doesn't exist, send error
        if (!user) {
            res.status(401).json({ status: false, message: 'Invalid Username'});
            return;
        }
        console.log(user);
        const hashedpassword = await bcrypt.hash(user.password, 10);
        // Authenticate password
        const match = await bcrypt.compare(password, hashedpassword );

        // If password is incorrect, send error
        if (!match) {
            res.status(401).json({ status: false, message: 'Invalid password'});
            return;
        }

        res.json({
            status: true, 
            message: 'Login successful',
            username: user.username
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error', username: ''});
    }
});



