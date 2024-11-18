const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

const users = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email ||!password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'secw121', { expiresIn: 1 * 60 * 60});
    
        res.json({ message: 'Logged in successfully', token, user });
    } catch (error) {
        console.error(error);
    }
})

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email ||!password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error)
    }
})

app.use(express.static(path.join(__dirname, '../spabuild/spaapp/browser')));

// Перехват всех маршрутов и возврат index.html (Angular SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../spabuild/spaapp/browser', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

