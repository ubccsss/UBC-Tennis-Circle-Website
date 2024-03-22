import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeTeamFields {
    name: EntryFieldTypes.Symbol;
    role: EntryFieldTypes.Symbol;
    headshot: EntryFieldTypes.AssetLink;
}

export type TypeTeamSkeleton = EntrySkeletonType<TypeTeamFields, "team">;
export type TypeTeam<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeTeamSkeleton, Modifiers, Locales>;
