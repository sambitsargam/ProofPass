// Event store for managing events and ticketing

import { Event, Ticket } from '@/types';

interface EventStore {
  events: Event[];
  selectedEvent: Event | null;
  userTickets: Ticket[];

  // Actions
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  addTicket: (ticket: Ticket) => void;
  setUserTickets: (tickets: Ticket[]) => void;
}

// Local in-memory store (replace with proper state management if needed)
let eventStoreState: EventStore = {
  events: [],
  selectedEvent: null,
  userTickets: [],
  setEvents: (events) => {
    eventStoreState.events = events;
  },
  setSelectedEvent: (event) => {
    eventStoreState.selectedEvent = event;
  },
  addEvent: (event) => {
    eventStoreState.events.push(event);
  },
  updateEvent: (event) => {
    const index = eventStoreState.events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      eventStoreState.events[index] = event;
    }
  },
  addTicket: (ticket) => {
    eventStoreState.userTickets.push(ticket);
  },
  setUserTickets: (tickets) => {
    eventStoreState.userTickets = tickets;
  },
};

export const useEventStore = (): EventStore => eventStoreState;

export const getEventStore = (): EventStore => eventStoreState;
