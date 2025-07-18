import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  receiverEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;