const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "supersecretkey";


const app = express();
const PORT = 3000;
const users = [];


app.use(express.json());

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorizaton;

    if (!authHeader) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // for every req
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
})

app.post("/register", (req, res) => {

    const userInfo = req.body;
    const { email, password } = userInfo;

    // validate
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter email or password" });
    }

    //existence
    const exitstingUser = users.find(u => u.email == email);

    if (exitstingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    // Save
    users.push({ email, password });
    res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {

    const userInfo = req.body;
    const { email, password } = userInfo;

    // validate
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter email or password" });
    }

    // existence
    const existingUser = users.find(u => u.email === email);

    if (!existingUser) {
        return res.status(401).json({ message: "User not exits" });
    }

    if (existingUser.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { email: existingUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({
        message: "User loggin sucessfully",
        token: token
    });

});

app.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "This is a protected route",
        user: req.user
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});