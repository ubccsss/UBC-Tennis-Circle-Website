import { add , isAfter , isBefore , Duration } from "date-fns"

// function makes sure input date is > current date and < specified cutoff.
// Cutoff date is based on the time ahead from the current date and so format is 
// e.g. {years: 1} meaning one year after current date
export const validDate = (inputDate: Date, cutoff?: Duration): Boolean => {
    const isAfterCurrent = isBefore(new Date(), inputDate)
    
    if (cutoff){
        const cutoffDate = add(new Date(), cutoff)
        return isAfter(cutoffDate, inputDate) && isAfterCurrent
    }

    return isAfterCurrent
}