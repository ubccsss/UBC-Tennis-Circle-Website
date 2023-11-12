import mongoose , { Schema , Types } from "mongoose"

export interface Comment{
    _id: string,
    comment: string,    
    reply: Types.ObjectId | Comment
}

mongoose.Promise = global.Promise;

const CommentModel = new Schema<Comment>({
    _id: { type : String , required : true },
    comment: { type : String , required : true },
    reply: { type: Schema.Types.ObjectId, ref: 'Comment' }
})

export const Comment = mongoose.models.Comment || mongoose.model<Comment>('Comment',CommentModel)