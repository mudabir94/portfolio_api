const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    email: {
        type:String,
        required : true,
        trim : true,
        lowercasse : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type : String,
        required : true,
        minlength : 7,
        trim : true,
        validate (value) {
            if (value.toLowerCase().includes('password')){
                throw new Error ("Passowrd cannot contain password")
            }
        }
    },
    age: {
        type : Number,
        default : 0,
        validate (value){
            if (value < 0){
                throw new Error ("Age must be a postive number")
            }
        }
    },
    tokens: [{
        token: {
            type : String,
            required : true,
        }
    }]
},
{
    timestamps: true,
})

userSchema.methods.toJson = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},"authtoken")
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}
userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if (!user){
        console.log(("Unable to Login"))
        throw new Error ("Unable to Login")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch){
        console.log("Unable to Login")
        throw new Error("Unable to Login")
    }
    return user
}

userSchema.pre("save",async function (next) {
    const user=this
    if (user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)

    }
    next()

})

const User=mongoose.model("Users",userSchema)
module.exports = User