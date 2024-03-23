export interface TennisEvent {
  id: string;
  name: string;
  location: string;
  ticket_price: number;
  date: string;
  cover_image: string;
  description: string;
  available_tickets: number;
  opening_status: string;
  reserved: boolean;
  purchased: boolean;
  attendees: Array<{
    profile: string;
    instagram: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    skill: string;
  }>;
}
