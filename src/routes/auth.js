const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");


authRouter.post("/logout", (req, res) => {

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Successful");
}
)


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordMatch = await user.checkPassword(password);
        if (!isPasswordMatch) {
            throw new Error("Invalid Credentials");
        }

        const token = user.getJWT();
        res.cookie("token", token);
        const { _id, firstName, lastName, photoUrl, about, skills } = user;
        res.json({
            message: "User logged in successfully",
            data: {
                _id,
                firstName,
                lastName,
                photoUrl,
                about,
                skills
            }
        });

    } catch (err) {
        console.error("Error details:", err.message);
        res.status(400).send("Error in login: " + err.message);
    }
});

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const { firstName, lastName, email, age, gender, photoUrl, about, skills } = req.body;
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
            skills
        });
        await newUser.save();
        
        const token = await newUser.getJWT();
        res.cookie("token", token);
        res.json({
            message: "User created successfully",
            data: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                photoUrl: newUser.photoUrl,
                about: newUser.about,
                skills: newUser.skills,
                _id: newUser._id
            }
        });
    } catch (err) {
        res.status(400).send("Error while creating user: " + err.message);
    }
});


module.exports = { authRouter };