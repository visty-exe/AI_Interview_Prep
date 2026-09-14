import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { name, skills, targetRole } = req.body

        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = name || user.name
        user.skills = skills || user.skills
        user.targetRole = targetRole || user.targetRole

        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                targetRole: user.targetRole
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const uploadResume=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                message: "Please upload a resume"
            });
        }

        const user= await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.resume= req.file.path
        await user.save();

        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: user.resume
        });

    } catch (error) {
        console.error("Resume upload error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};