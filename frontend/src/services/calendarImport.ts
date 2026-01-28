import type { Holiday } from '../types/holiday';

type HolidayWithoutId = Omit<Holiday, 'id'>;

// Color options for imported events
const COLORS: Holiday['color'][] = ['emerald', 'sky', 'indigo', 'teal', 'pink', 'orange'];

// Map common event keywords to categories
function detectCategory(summary: string, description?: string): Holiday['category'] {
  const text = `${summary} ${description || ''}`.toLowerCase();
  
  if (text.includes('birthday') || text.includes('bday')) {
    return 'birthday';
  }
  if (text.includes('travel') || text.includes('trip') || text.includes('vacation') || text.includes('flight') || text.includes('hotel')) {
    return 'travel';
  }
  if (text.includes('holiday') || text.includes('celebration') || text.includes('party') || text.includes('anniversary')) {
    return 'celebration';
  }
  
  return 'custom';
}

// Map categories to icons
function getIconForCategory(category: Holiday['category']): string {
  switch (category) {
    case 'birthday':
      return 'cake';
    case 'travel':
      return 'flight';
    case 'celebration':
      return 'celebration';
    default:
      return 'event';
  }
}

// Get a random color
function getRandomColor(): Holiday['color'] {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/**
 * Parse an ICS (iCalendar) file and extract events
 */
export function parseICSFile(content: string): HolidayWithoutId[] {
  const events: HolidayWithoutId[] = [];
  
  // Split into lines and normalize line endings
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  
  let inEvent = false;
  let currentEvent: {
    summary?: string;
    description?: string;
    dtstart?: string;
    rrule?: string;
  } = {};
  
  // Handle line folding (lines starting with space/tab are continuations)
  const unfoldedLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unfoldedLines.length > 0) {
        unfoldedLines[unfoldedLines.length - 1] += line.slice(1);
      }
    } else {
      unfoldedLines.push(line);
    }
  }
  
  for (const line of unfoldedLines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
      continue;
    }
    
    if (trimmedLine === 'END:VEVENT') {
      inEvent = false;
      
      // Create holiday from event
      if (currentEvent.summary && currentEvent.dtstart) {
        const date = parseICSDate(currentEvent.dtstart);
        if (date) {
          const category = detectCategory(currentEvent.summary, currentEvent.description);
          
          events.push({
            name: currentEvent.summary,
            date,
            icon: getIconForCategory(category),
            category,
            description: currentEvent.description,
            recurrence: parseRecurrence(currentEvent.rrule),
            source: 'ics-import',
            color: getRandomColor(),
          });
        }
      }
      
      currentEvent = {};
      continue;
    }
    
    if (inEvent) {
      // Parse property
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex > 0) {
        const propertyPart = trimmedLine.slice(0, colonIndex);
        const value = trimmedLine.slice(colonIndex + 1);
        
        // Extract property name (before any parameters)
        const propertyName = propertyPart.split(';')[0].toUpperCase();
        
        switch (propertyName) {
          case 'SUMMARY':
            currentEvent.summary = unescapeICSValue(value);
            break;
          case 'DESCRIPTION':
            currentEvent.description = unescapeICSValue(value);
            break;
          case 'DTSTART':
            currentEvent.dtstart = value;
            break;
          case 'RRULE':
            currentEvent.rrule = value;
            break;
        }
      }
    }
  }
  
  return events;
}

/**
 * Parse ICS date formats
 * Supports: YYYYMMDD, YYYYMMDDTHHmmss, YYYYMMDDTHHmmssZ
 */
function parseICSDate(dateStr: string): Date | null {
  try {
    // Remove any timezone identifier at the end
    const cleanDate = dateStr.replace(/Z$/, '');
    
    if (cleanDate.length === 8) {
      // YYYYMMDD format (all-day event)
      const year = parseInt(cleanDate.slice(0, 4), 10);
      const month = parseInt(cleanDate.slice(4, 6), 10) - 1;
      const day = parseInt(cleanDate.slice(6, 8), 10);
      return new Date(year, month, day);
    }
    
    if (cleanDate.length >= 15 && cleanDate.includes('T')) {
      // YYYYMMDDTHHmmss format
      const year = parseInt(cleanDate.slice(0, 4), 10);
      const month = parseInt(cleanDate.slice(4, 6), 10) - 1;
      const day = parseInt(cleanDate.slice(6, 8), 10);
      const hour = parseInt(cleanDate.slice(9, 11), 10);
      const minute = parseInt(cleanDate.slice(11, 13), 10);
      const second = parseInt(cleanDate.slice(13, 15), 10);
      return new Date(year, month, day, hour, minute, second);
    }
    
    // Try standard Date parsing as fallback
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Parse RRULE to determine recurrence
 */
function parseRecurrence(rrule?: string): Holiday['recurrence'] {
  if (!rrule) return 'none';
  
  const upper = rrule.toUpperCase();
  
  if (upper.includes('FREQ=YEARLY')) {
    return 'yearly';
  }
  if (upper.includes('FREQ=MONTHLY')) {
    return 'monthly';
  }
  if (upper.includes('FREQ=WEEKLY')) {
    return 'weekly';
  }
  
  return 'none';
}

/**
 * Unescape ICS property values
 */
function unescapeICSValue(value: string): string {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

export interface CSVParseResult {
  events: HolidayWithoutId[];
  errors: string[];
  warnings: string[];
}

/**
 * Parse a CSV file and extract events
 * Expected columns: name, date, description (optional), category (optional)
 */
export function parseCSVFile(content: string): CSVParseResult {
  const result: CSVParseResult = {
    events: [],
    errors: [],
    warnings: [],
  };
  
  // Check if content is empty
  if (!content.trim()) {
    result.errors.push('The file is empty');
    return result;
  }
  
  // Split into lines
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
  
  if (lines.length === 0) {
    result.errors.push('The file is empty');
    return result;
  }
  
  if (lines.length === 1) {
    result.errors.push('The file only contains a header row with no data');
    return result;
  }
  
  // Parse header
  const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  
  // Find column indices
  const nameIndex = header.findIndex(h => h === 'name' || h === 'title' || h === 'event' || h === 'summary');
  const dateIndex = header.findIndex(h => h === 'date' || h === 'start' || h === 'start_date' || h === 'startdate');
  const descIndex = header.findIndex(h => h === 'description' || h === 'desc' || h === 'notes');
  const categoryIndex = header.findIndex(h => h === 'category' || h === 'type');
  
  // Validate required columns
  const missingColumns: string[] = [];
  if (nameIndex === -1) {
    missingColumns.push('"name" (or "title", "event", "summary")');
  }
  if (dateIndex === -1) {
    missingColumns.push('"date" (or "start", "start_date")');
  }
  
  if (missingColumns.length > 0) {
    result.errors.push(`Missing required column${missingColumns.length > 1 ? 's' : ''}: ${missingColumns.join(' and ')}`);
    return result;
  }
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1; // 1-based row number for user-friendly messages
    const values = parseCSVLine(lines[i]);
    
    const name = values[nameIndex]?.trim();
    const dateStr = values[dateIndex]?.trim();
    const description = descIndex >= 0 ? values[descIndex]?.trim() : undefined;
    const categoryStr = categoryIndex >= 0 ? values[categoryIndex]?.trim().toLowerCase() : undefined;
    
    // Validate name
    if (!name) {
      result.warnings.push(`Row ${rowNum}: Missing event name, skipped`);
      continue;
    }
    
    // Validate date
    if (!dateStr) {
      result.warnings.push(`Row ${rowNum}: Missing date for "${name}", skipped`);
      continue;
    }
    
    const date = parseFlexibleDate(dateStr);
    if (!date) {
      result.warnings.push(`Row ${rowNum}: Invalid date "${dateStr}" for "${name}", skipped`);
      continue;
    }
    
    // Determine category
    let category: Holiday['category'] = 'custom';
    if (categoryStr) {
      if (['celebration', 'travel', 'birthday', 'custom'].includes(categoryStr)) {
        category = categoryStr as Holiday['category'];
      } else {
        result.warnings.push(`Row ${rowNum}: Unknown category "${categoryStr}" for "${name}", using "custom"`);
      }
    } else {
      category = detectCategory(name, description);
    }
    
    result.events.push({
      name,
      date,
      icon: getIconForCategory(category),
      category,
      description: description || undefined,
      recurrence: 'none',
      source: 'csv-import',
      color: getRandomColor(),
    });
  }
  
  if (result.events.length === 0 && result.warnings.length > 0) {
    result.errors.push('No valid events found in the file');
  }
  
  return result;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

/**
 * Parse dates in various formats
 */
function parseFlexibleDate(dateStr: string): Date | null {
  try {
    // Try ISO format first
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Try common formats
    // MM/DD/YYYY
    const usFormat = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (usFormat) {
      return new Date(parseInt(usFormat[3]), parseInt(usFormat[1]) - 1, parseInt(usFormat[2]));
    }
    
    // DD/MM/YYYY
    const euFormat = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (euFormat) {
      // Ambiguous, assume MM/DD/YYYY was already tried
      return new Date(parseInt(euFormat[3]), parseInt(euFormat[2]) - 1, parseInt(euFormat[1]));
    }
    
    // YYYY-MM-DD
    const isoFormat = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoFormat) {
      return new Date(parseInt(isoFormat[1]), parseInt(isoFormat[2]) - 1, parseInt(isoFormat[3]));
    }
    
    // DD-MM-YYYY
    const dashFormat = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dashFormat) {
      return new Date(parseInt(dashFormat[3]), parseInt(dashFormat[2]) - 1, parseInt(dashFormat[1]));
    }
    
    return null;
  } catch {
    return null;
  }
}
