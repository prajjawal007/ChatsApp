import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type: String,
        default:"",
    },
    forgotPasswordOtp:{
        type: Number,
        default: null
    },
    forgotPasswordOtpExpiry:{
        type: Date,
        default: null
    }
},{timestamps:true}); //timestamps will give create_at & updated_at

const User = mongoose.model("User",userSchema);
export default User;
