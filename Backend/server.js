const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
    username: String,
    age: Number,
    password: String,
    name: String
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
        const hashedPassword = await bcrypt.hash(password, 10);

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
app.post('/login', async (req, res) => {
    console.log(req.body);
    console.log(req.body.username, req.body.password);
    
    let username = req.body.username;
    let password = req.body.password;

    console.log(password);

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

        res.json({status: true, message: 'Login successful'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error'});
    }
});



