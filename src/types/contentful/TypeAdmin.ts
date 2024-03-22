import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeAdminFields {
    name: EntryFieldTypes.Symbol;
    emailAddress: EntryFieldTypes.Symbol;
}

export type TypeAdminSkeleton = EntrySkeletonType<TypeAdminFields, "admin">;
export type TypeAdmin<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeAdminSkeleton, Modifiers, Locales>;
