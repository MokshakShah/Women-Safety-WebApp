import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
    message: String,
    audioPath: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SOS", sosSchema);
