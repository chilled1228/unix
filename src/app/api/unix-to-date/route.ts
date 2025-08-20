import { NextRequest, NextResponse } from 'next/server';
import { format, fromUnixTime } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timestampParam = searchParams.get('timestamp');
    const timezone = searchParams.get('timezone') || 'UTC';
    const formatParam = searchParams.get('format') || 'iso';

    // Validate required timestamp parameter
    if (!timestampParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: timestamp' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Parse and validate timestamp
    const timestamp = parseInt(timestampParam);
    if (isNaN(timestamp)) {
      return NextResponse.json(
        { error: 'Invalid timestamp: must be a number' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check reasonable range (1970 to 2100)
    const minTimestamp = 0;
    const maxTimestamp = 4102444800; // Year 2100 in seconds
    if (timestamp < minTimestamp || timestamp > maxTimestamp) {
      return NextResponse.json(
        { error: 'Timestamp out of reasonable range (1970-2100)' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert timestamp to date
    // Handle both seconds and milliseconds automatically
    const date = timestamp > 9999999999 
      ? new Date(timestamp) 
      : fromUnixTime(timestamp);

    // Validate the resulting date
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid timestamp: could not convert to date' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Format the date based on the format parameter
    let formattedDate: string;
    try {
      switch (formatParam.toLowerCase()) {
        case 'iso':
          formattedDate = date.toISOString();
          break;
        case 'us':
          formattedDate = timezone === 'UTC' 
            ? format(date, 'MM/dd/yyyy hh:mm:ss a') + ' UTC'
            : formatInTimeZone(date, timezone, 'MM/dd/yyyy hh:mm:ss a zzz');
          break;
        case 'uk':
          formattedDate = timezone === 'UTC'
            ? format(date, 'dd/MM/yyyy HH:mm:ss') + ' UTC'
            : formatInTimeZone(date, timezone, 'dd/MM/yyyy HH:mm:ss zzz');
          break;
        case 'long':
          formattedDate = timezone === 'UTC'
            ? format(date, 'MMMM dd, yyyy hh:mm:ss a') + ' UTC'
            : formatInTimeZone(date, timezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
          break;
        default:
          // Treat as custom format string
          formattedDate = timezone === 'UTC'
            ? format(date, formatParam)
            : formatInTimeZone(date, timezone, formatParam);
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Invalid format parameter: ${formatParam}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Prepare timezone-specific date string
    const timezoneDate = timezone === 'UTC' 
      ? date.toISOString()
      : formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");

    // Return the response matching the documented format
    const response = {
      timestamp: timestamp > 9999999999 ? Math.floor(timestamp / 1000) : timestamp,
      date: timezoneDate,
      formatted: formattedDate,
      timezone: timezone
    };

    return NextResponse.json(response, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in unix-to-date API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
