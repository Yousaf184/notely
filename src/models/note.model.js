import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    tags: [String],
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
