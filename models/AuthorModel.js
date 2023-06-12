import { Schema, model } from "mongoose";

const AuthorSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator:(v) => {
                return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v)
            },
            message:(props) => {
                return props.value + " is not a validate email"
            } 
        }
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    avatar:{
        type:String,
        required:false,
        default:"https://picsum.photos/500/500"
    },
    password:{
        type:String,
        required:true
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }]
}, {timestamps:true});

const AuthorModel = model("Author", AuthorSchema, "authors")

export default AuthorModel;