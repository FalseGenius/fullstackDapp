import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please tell us your name!"]
    },
    email:{
        type:String,
        required:[true, "Enter your email"],
        unique:true,
        lowercase:true
    },
    role:{
        type:String,
        enum:["user", "admin"]
    },
    password:{
        type:String,
        required:[true, "Please enter your password"]
    },
    passwordConfirm:{
        type:String,
        required:[true, "Please confirm your password"],
        validate:{
            validator: (el) => {
                return el == this.password;
            },
            message:"Passwords are not the same!"
        }
    },
})


// This hook/middleware will run when user tries to create his account
// It first checks if user has modified or changed their password or not. If yes, then it would call next() which would take
// user to next middleware.
userSchema.pre("save", (next) => {
    
    if (!this.isModified("password")) return next();

    // Hash password
    this.password = bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})

userSchema.pre("save", () => {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, (next) => {
    this.find({active:{$ne:false}});
    next();
})

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = (jwtTimeStamp) => {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return jwtTimeStamp < changedTimestamp;
    }

    return false;
}

const User = mongoose.model("User", userSchema);

export default User;