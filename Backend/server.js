const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dandyhacks', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("Connected to the database");
});

const User = mongoose.model('User', new mongoose.Schema({ 
    _id: String,
    id: Number,
    username: String,
    password: String,
    name: String,
    age: Number
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

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


/* Signup api */
const bcrypt = require('bcrypt');
app.post('/signup', async function(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;

    try {

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            res.status(400).send('User already exists');
            return;
        }

        // Hash the password 
        const hashedPassword = await bcrypt.hash(password);

        // Create new user 
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            id: id,
            username: username,
            password: hashedPassword,
            age: age,
            name: name
        });

        // Save user to database
        await user.save();

        // Send success message to client side
        res.send('User created successfully');
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error'});
    }
});

/* Login api for authentication of credidentials */
app.post('/login', async function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const user = await User.findOne({ username: username });

        // if user doesn't exist, send error
        if (!user) {
            res.status(401).json({ status: false, message: 'Invalid Username or password'});
            return;
        }
         
        // Authenticate password
        const match = await bcrypt.compare(password, user.password);

        // If password is incorrect, send error
        if (!match) {
            res.status(401).json({ status: false, message: 'Invalid Username or password'});
            return;
        }

        res.json({status: true, message: 'Login successful'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error'});
    }
});



