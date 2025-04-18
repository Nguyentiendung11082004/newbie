import mongoose from "mongoose";
const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
});

export default mongoose.model("BlacklistedToken", blacklistedTokenSchema);