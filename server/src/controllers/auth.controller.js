import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt, { truncates } from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        const user = await User.findOne({ email })

        if (user) return res.status(400).json({ message: "Email already exists" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            })
        } else {
            res.send(400).json({ message: "Invalide user data" })
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        })
    } catch (error) {
        console.log("Error in login controller:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body
        const userId = req.user._id
        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePicture)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server error" })
    }
}