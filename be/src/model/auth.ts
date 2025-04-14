import mongoose from "mongoose";
const AuthSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20,
    }
}, {
    timestamps: true, versionKey: false
})
const Auth = mongoose.model("Auth", AuthSchema);
export default Auth;