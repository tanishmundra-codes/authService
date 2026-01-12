const express = require('express');

const app = express();
const PORT = 3000;
const user = [];


app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
})

app.post("/register", (req, res) => {

    const userInfo = req.body;
    const {email, password} = userInfo;

    // validate
    if(!email || !password){
        return res.status(400).json({message: "Please enter email or password"});
    }

    //existence
    const exitstingUser = user.find(u => u.email == email);

    if(exitstingUser){
        return res.status(409).json({message : "User already exists"});
    }

    // Save
    user.push({email, password});
    res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {

    const userInfo = req.body;
    const {email, password} = userInfo;

    // validate
    if(!email || !password){
        return res.status(409).json({message: "Please enter email or password"});
    }

    // existence
    const existingUser = user.find(u => u.email === email);

    if(!existingUser){
       res.status(401).json({message : "User not exits"});
    }

    if(existingUser.password !== password){
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});