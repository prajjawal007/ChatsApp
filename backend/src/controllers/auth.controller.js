import cloudinary from "../lib/cloudinary.js";
import { registrationTemplate } from "../lib/registrationEmailTemplate.js";
import sendEmail from "../lib/sendEmail.js";
import { sendOtpTemplate } from "../lib/sendOtpTemplate.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already" });

    //This is for hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({  
      fullName: fullName,
      email: email, 
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      const email = newUser.email;
      const subject = 'Welcome to ChatsApp';
      const html = registrationTemplate({username: newUser.fullName});
      await sendEmail(email, subject, html);    

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  // Implement logout logic here
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in Update Profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in Check Auth", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req,res)=>{
  try {
      const {email} = req.body;
      
      const user = await User.findOne({email});
      if(!user){
          return res.status(404).json({
                      success: false,
                      error: true,
                      message: 'Email not registered'
          });
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireTime = Date.now() + 300000; // 5 minutes

      const updatedUser = await User.findByIdAndUpdate(user._id,{
          forgotPasswordOtp:otp,
          forgotPasswordOtpExpiry:expireTime
      })

      const subject = 'OTP for password reset';
      const text = sendOtpTemplate({otp});
      await sendEmail(email, subject, text);
      return res.status(200).json({
                  success: true,
                  error: false,
                  message: 'Check your email for OTP',
      });

  } catch (error) {
      return res.status(500).json({
                  success: false,
                  error: true,
                  message: 'Error sending OTP',
                  details: error.message
      });
      
  }
}

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
      const { email, otp } = req.body;

      console.log("Received data:", { email, otp }); // Debugging output

      if (!email || !otp) {
          return res.status(400).json({
              message: "Provide required fields: email, otp.",
              error: true,
              success: false
          });
      }

      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({
              message: "Email not registered",
              error: true,
              success: false
          });
      }

      console.log("Stored OTP:", user.forgotPasswordOtp, "Received OTP:", otp);

      // Check if OTP has expired
      if (Date.now() > user.forgotPasswordOtpExpiry) {
          return res.status(400).json({
              message: "OTP expired",
              error: true,
              success: false
          });
      }

      // Convert both to string for comparison
      if(user.forgotPasswordOtp !== Number(otp)){
        return res.status(400).json({
            message : "Wrong OTP",
            error : true,
            success : false
        })
    }

      return res.status(200).json({
          message: "OTP verified successfully",
          error: false,
          success: true
      });
  } catch (error) {
      console.error("Error verifying OTP:", error); // Debugging output
      return res.status(500).json({
          success: false,
          error: true,
          message: "Error verifying OTP",
          details: error.message
      });
  }
};



export const resetPassword = async (req,res)=>{
  try {
      const { email, otp, newPassword } = req.body;
      if(!email || !otp || !newPassword){
          return res.status(400).json({
              message : "Provide required field email, otp, newPassword.",
              error : true,
              success : false
          })
      }
      const user = await User.findOne({email});
      if(!user){
          return res.status(404).json({
              message : "Email not registered",
              error : true,
              success : false
          })
      }
      const currentTime = Date.now();
      if(currentTime > user.forgotPasswordOtpExpiry){
          return res.status(400).json({
              message : "OTP expired",
              error : true,
              success : false
          })
      }

      if(user.forgotPasswordOtp !== Number(otp)){
          return res.status(400).json({
              message : "Wrong OTP",
              error : true,
              success : false
          })
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(user._id,{
          password: hashedPassword,
          forgotPasswordOtp: null,
          forgotPasswordOtpExpiry: null
      })
      return res.status(200).json({
          message : "Password reset successfully",
          error : false,
          success : true
      })
  } catch (error) {
      return res.status(500).json({
                  success: false,
                  error: true,
                  message: 'Error resetting password',
                  details: error.message
      });
  }
}