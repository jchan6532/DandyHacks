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

const bcrypt = require('bcrypt');

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



