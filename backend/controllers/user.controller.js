import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get current authenticated user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Get all users in the database except the authenticated one, also do not include the password field

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
