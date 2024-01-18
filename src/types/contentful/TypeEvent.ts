import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful';

export interface TypeEventFields {
  name: EntryFieldTypes.Symbol;
  location: EntryFieldTypes.Location;
  ticketPrice: EntryFieldTypes.Number;
  date: EntryFieldTypes.Date;
  coverImage: EntryFieldTypes.AssetLink;
  description: EntryFieldTypes.RichText;
}

export type TypeEventSkeleton = EntrySkeletonType<TypeEventFields, 'event'>;
export type TypeEvent<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeEventSkeleton, Modifiers, Locales>;
