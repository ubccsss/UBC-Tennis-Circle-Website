import z from "zod"
import { connectToDatabase } from "@lib/mongoose"
import { validDate } from "@helpers"
import { NextRequest } from "next/server"
import { ServerResponse } from "@helpers"
import { getSession } from "@helpers"
import Filter from "bad-words"

const EventSchema = z.object({
    open: z
        .boolean({
            required_error: "Event being open is required"
        }),
    name: z
        .string({
            required_error: "Name of the event is required"
        }),
    attendees: z
        .string()
        .array()
        .nonempty("At least 1 attendee is required for your events"),
    location: z
        .string({
            required_error: "Location of event is required"
        }),
    date_time: z
        .date({
            required_error: "Date and time of the event is required"
        })
        .refine((val) => validDate(val, {years: 1}), {
            message: "Date has to be after current date, and cannot be more than a year ahead"
        }),
    skill_number: z
        .number()
        .refine((val) => 1 <= val && val << 5, {
            message: "Skill level has to be between 1 and 5"
        })
})

type Event = z.infer<typeof EventSchema>

export const POST = async (request: NextRequest) => {
    await connectToDatabase()

    const body: Event = await request.json()

    const session = getSession(request);

    if (!session) {
        ServerResponse.unauthorizedError();
    }


    // type validation
    const zodValidation = EventSchema.safeParse(body)

    if(zodValidation.success){
        const filter = new Filter()
        if (filter.isProfane(body.name)){
            return ServerResponse.userError("Please do not use profanity in the event name")
        } else {
            return ServerResponse.success("Event created successfully")
        }
    }
    else{
        return ServerResponse.validationError(zodValidation)
    }

}