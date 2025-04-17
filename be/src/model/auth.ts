import mongoose from "mongoose";
const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 20,
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'teacher'],
    default: 'student',
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
});


const Auth = mongoose.model("Auth", AuthSchema);
export default Auth;
