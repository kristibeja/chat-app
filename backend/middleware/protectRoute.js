import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Authorization function
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // get the token from cookies in the browser
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // to verify the token, decode the token if it exists

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // find the user with the decoded token, remove password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // the user in the request is the user that we have in the database

    next(); // call the next function, next to where protectRoute is called
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
