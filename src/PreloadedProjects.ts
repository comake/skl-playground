import files from './assets/schemas/files.json';
import events from './assets/schemas/events.json';
import { Entity } from '@comake/skl-js-engine';
import { NodeObject } from 'jsonld';

export interface Project {
  id: string;
  name: string;
  description?: string;
  schemas: Record<string, Entity>;
  loaded: boolean;
  unframedSchemas?: NodeObject;
}

export const preloadedProjects: Project[] = [
  {
    id: 'filesExample',
    name: 'Share',
    description: 'Integrates with Google Drive, Dropbox, Box, & Asana',
    schemas: {},
    loaded: false,
    unframedSchemas: files as NodeObject,
  },
  {
    id: 'eventsExample',
    name: 'Search Events',
    description: 'Integrates with Ticketmaster, Stuhhub & SeatGeek',
    schemas: {},
    loaded: false,
    unframedSchemas: events as NodeObject,
  }
]