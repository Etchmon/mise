import { Schema, model, models } from "mongoose";

const commentSchema = new Schema({
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: Schema.Types.ObjectId
});

const Comment = models.Comment || model('Comment', commentSchema);

export default Comment;