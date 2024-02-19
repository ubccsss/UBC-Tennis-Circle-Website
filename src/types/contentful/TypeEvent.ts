import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful';

export interface TypeEventFields {
  name: EntryFieldTypes.Symbol;
  ticketPrice: EntryFieldTypes.Number;
  date: EntryFieldTypes.Date;
  coverImage: EntryFieldTypes.AssetLink;
  location: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
}

export type TypeEventSkeleton = EntrySkeletonType<TypeEventFields, 'event'>;
export type TypeEvent<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeEventSkeleton, Modifiers, Locales>;
