import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeEventFields {
    name: EntryFieldTypes.Symbol;
    openingStatus: EntryFieldTypes.Symbol<"Coming Soon" | "Open">;
    ticketPrice: EntryFieldTypes.Number;
    date: EntryFieldTypes.Date;
    coverImage: EntryFieldTypes.AssetLink;
    location: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    amountOfTickets: EntryFieldTypes.Integer;
}

export type TypeEventSkeleton = EntrySkeletonType<TypeEventFields, "event">;
export type TypeEvent<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeEventSkeleton, Modifiers, Locales>;
