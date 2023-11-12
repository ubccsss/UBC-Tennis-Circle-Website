import mongoose , { Schema , Types } from "mongoose"
import { Comment } from "./Comment"

export interface Event{
    _id: string,
    date_created: Date,
    open: boolean,
    name: string,
    attendees: string[],
    hosted_by: string,
    location: string,
    date_time: string,
    skill_level: number,
    comments: Types.ObjectId[] | Comment[]
}

mongoose.Promise = global.Promise;

const EventModel = new Schema<Event>({
    _id: { type : String , required : true },
    date_created: { type : Date , required : true },
    open: { type : Boolean , required : true },
    name: { type : String , required : true },
    attendees: [{ type : String , required : true }],
    hosted_by: { type : String , required : true },
    location: { type : String , required : true },
    date_time: { type : String , required : true },
    skill_level: { type : Number , required : true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

export const Event = mongoose.models.Event || mongoose.model<Event>('Event',EventModel)