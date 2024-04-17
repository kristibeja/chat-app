import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// sign up function
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body; //user inputs
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10); //creating the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save(); //saving the new user to the database

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      }); //returning the needed data as a response when a user is saved successfully
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in sign up", error.message);
    res.status(500).json({ error: `"Internal Server Error" ${error.message}` });
  }
};

// log in function
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); //check if the user exists
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); // compare the password from the input with the password this user has in the database (or an empty string to not throw an error in case the user does not exist)

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login in", error.message);
    res.status(500).json({ error: `"Internal Server Error" ${error.message}` });
  }
};

// log out function
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // clear cookies
    res.status(200).json({ message: "User logged out successfully" }); // send response
  } catch (error) {
    console.log("Error in log out", error.message);
    res.status(500).json({ error: `"Internal Server Error" ${error.message}` });
  }
};
