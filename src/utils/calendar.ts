import { Capacitor } from '@capacitor/core';

export interface CalendarEvent {
  title: string;
  location?: string;
  notes?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  url?: string;
  calendarId?: string;
}

// Web fallback - generates calendar files
const generateICS = (event: CalendarEvent): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Olaya Together//Calendar//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
  ];

  if (event.location) {
    lines.push(`LOCATION:${event.location}`);
  }

  if (event.notes) {
    lines.push(`DESCRIPTION:${event.notes}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
};

const downloadICS = (event: CalendarEvent) => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const calendar = {
  // Create calendar event
  createEvent: async (event: CalendarEvent): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback - download ICS file
      try {
        downloadICS(event);
        return true;
      } catch (error) {
        console.error('Error creating calendar event:', error);
        return false;
      }
    }

    // For native, would need @capacitor-community/calendar plugin
    // This is a placeholder for when the plugin is available
    console.log('Native calendar integration requires additional plugin');
    downloadICS(event); // Fallback to ICS download
    return true;
  },

  // Check if calendar access is available
  hasCalendarAccess: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      return true; // Web can always download ICS
    }

    // Native calendar check would go here
    return true;
  },

  // Request calendar permissions (native only)
  requestPermissions: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      return true; // Web doesn't need permissions for ICS download
    }

    // Native permission request would go here
    return true;
  },

  // Create anniversary event
  createAnniversaryEvent: async (
    anniversaryDate: Date,
    coupleNames?: string
  ): Promise<boolean> => {
    const title = coupleNames 
      ? `${coupleNames} Anniversary` 
      : 'Our Anniversary';

    const event: CalendarEvent = {
      title,
      startDate: anniversaryDate,
      endDate: new Date(anniversaryDate.getTime() + 24 * 60 * 60 * 1000),
      allDay: true,
      notes: 'Celebrate your special day together! 💕',
    };

    return calendar.createEvent(event);
  },

  // Create date event
  createDateEvent: async (
    title: string,
    date: Date,
    duration: number = 2, // hours
    location?: string,
    notes?: string
  ): Promise<boolean> => {
    const endDate = new Date(date.getTime() + duration * 60 * 60 * 1000);

    const event: CalendarEvent = {
      title,
      location,
      notes,
      startDate: date,
      endDate,
    };

    return calendar.createEvent(event);
  }
};
