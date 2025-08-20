import { NextRequest, NextResponse } from 'next/server';
import { format, fromUnixTime, getUnixTime, parseISO } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface BatchConvertRequest {
  type: 'unix-to-date' | 'date-to-unix';
  values: (string | number)[];
  timezone?: string;
  format?: string;
}

interface BatchConvertResult {
  input: string | number;
  output: string;
  error?: string;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchConvertRequest = await request.json();

    // Validate request body
    if (!body.type || !body.values || !Array.isArray(body.values)) {
      return NextResponse.json(
        { error: 'Invalid request body. Required fields: type, values (array)' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!['unix-to-date', 'date-to-unix'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "unix-to-date" or "date-to-unix"' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (body.values.length === 0) {
      return NextResponse.json(
        { error: 'Values array cannot be empty' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Limit batch size to prevent abuse
    if (body.values.length > 1000) {
      return NextResponse.json(
        { error: 'Batch size too large. Maximum 1000 values allowed.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const timezone = body.timezone || 'UTC';
    const formatParam = body.format || 'iso';
    const results: BatchConvertResult[] = [];

    // Process each value
    for (const value of body.values) {
      try {
        if (body.type === 'unix-to-date') {
          const result = convertUnixToDate(value, timezone, formatParam);
          results.push(result);
        } else {
          const result = convertDateToUnix(value, timezone);
          results.push(result);
        }
      } catch (error) {
        results.push({
          input: value,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({ results }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in batch-convert API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

function convertUnixToDate(value: string | number, timezone: string, formatParam: string): BatchConvertResult {
  try {
    const timestamp = typeof value === 'string' ? parseInt(value) : value;
    
    if (isNaN(timestamp)) {
      return {
        input: value,
        output: '',
        error: 'Invalid timestamp: must be a number'
      };
    }

    // Check reasonable range
    const minTimestamp = 0;
    const maxTimestamp = 4102444800; // Year 2100 in seconds
    if (timestamp < minTimestamp || timestamp > maxTimestamp) {
      return {
        input: value,
        output: '',
        error: 'Timestamp out of reasonable range (1970-2100)'
      };
    }

    // Convert timestamp to date
    const date = timestamp > 9999999999 
      ? new Date(timestamp) 
      : fromUnixTime(timestamp);

    if (isNaN(date.getTime())) {
      return {
        input: value,
        output: '',
        error: 'Invalid timestamp: could not convert to date'
      };
    }

    // Format the date
    let output: string;
    switch (formatParam.toLowerCase()) {
      case 'iso':
        output = date.toISOString();
        break;
      case 'us':
        output = timezone === 'UTC' 
          ? format(date, 'MM/dd/yyyy hh:mm:ss a') + ' UTC'
          : formatInTimeZone(date, timezone, 'MM/dd/yyyy hh:mm:ss a zzz');
        break;
      case 'uk':
        output = timezone === 'UTC'
          ? format(date, 'dd/MM/yyyy HH:mm:ss') + ' UTC'
          : formatInTimeZone(date, timezone, 'dd/MM/yyyy HH:mm:ss zzz');
        break;
      case 'long':
        output = timezone === 'UTC'
          ? format(date, 'MMMM dd, yyyy hh:mm:ss a') + ' UTC'
          : formatInTimeZone(date, timezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
        break;
      default:
        // Treat as custom format string
        output = timezone === 'UTC'
          ? format(date, formatParam)
          : formatInTimeZone(date, timezone, formatParam);
    }

    return {
      input: value,
      output: output
    };

  } catch (error) {
    return {
      input: value,
      output: '',
      error: error instanceof Error ? error.message : 'Conversion failed'
    };
  }
}

function convertDateToUnix(value: string | number, timezone: string): BatchConvertResult {
  try {
    const dateString = String(value);
    
    // Parse the date string
    let date: Date;
    if (dateString.includes("T") || dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      date = parseISO(dateString);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return {
        input: value,
        output: '',
        error: 'Invalid date format'
      };
    }

    // Handle timezone conversion
    let utcDate: Date;
    if (timezone !== 'UTC') {
      utcDate = fromZonedTime(date, timezone);
    } else {
      utcDate = date;
    }

    // Check reasonable date range
    const minDate = new Date('1970-01-01T00:00:00Z');
    const maxDate = new Date('2100-01-01T00:00:00Z');
    
    if (utcDate < minDate || utcDate > maxDate) {
      return {
        input: value,
        output: '',
        error: 'Date out of reasonable range (1970-2100)'
      };
    }

    const timestamp = getUnixTime(utcDate);

    return {
      input: value,
      output: timestamp.toString()
    };

  } catch (error) {
    return {
      input: value,
      output: '',
      error: error instanceof Error ? error.message : 'Conversion failed'
    };
  }
}
