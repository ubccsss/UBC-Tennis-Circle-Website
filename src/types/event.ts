export interface PublicEventUser {
  _id: string;
  profile: string;
  instagram: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  skill: string;
  time: string;
}

export interface InternalEventUser extends PublicEventUser {
  email_address: string;
}

export interface TimeSlot {
  reserved: boolean;
  purchased: boolean;
  attendees: Array<string>;
  available_tickets: number;
}

export interface TennisEvent {
  id: string;
  name: string;
  location: string;
  ticket_price: number;
  date: string;
  cover_image: string;
  description: string;
  opening_status: string;
  attendees: Array<PublicEventUser | InternalEventUser>;
  time_slots: Record<1 | 2, TimeSlot>;
  status: "open" | "closed";
}
