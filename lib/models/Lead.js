import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  model: String,
  city: String,

  makeId: Number,
  modelId: Number,

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "RETRY_SUCCESS", "RETRY_FAILED"],
    default: "SUCCESS"
  },

  retryCount: {
    type: Number,
    default: 0
  },

  error: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);