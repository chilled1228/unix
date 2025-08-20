import { NextRequest, NextResponse } from 'next/server';
import { getUnixTime, parseISO } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

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
    const dateParam = searchParams.get('date');
    const timezone = searchParams.get('timezone') || 'UTC';

    // Validate required date parameter
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: date' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Parse the date string
    let date: Date;
    try {
      // Check if it's in ISO format or similar structured format
      if (dateParam.includes("T") || dateParam.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateParam);
      } else {
        // Try to parse as a general date string
        date = new Date(dateParam);
      }

      // Validate the parsed date
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Please use ISO format (YYYY-MM-DDTHH:mm:ssZ) or a standard date string.' },
          { status: 400, headers: corsHeaders }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use ISO format (YYYY-MM-DDTHH:mm:ssZ) or a standard date string.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle timezone conversion if not UTC
    let utcDate: Date;
    if (timezone !== 'UTC') {
      try {
        // If the input date doesn't have timezone info, treat it as being in the specified timezone
        // and convert to UTC
        utcDate = fromZonedTime(date, timezone);
      } catch (error) {
        return NextResponse.json(
          { error: `Invalid timezone: ${timezone}` },
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      utcDate = date;
    }

    // Check reasonable date range (1970 to 2100)
    const minDate = new Date('1970-01-01T00:00:00Z');
    const maxDate = new Date('2100-01-01T00:00:00Z');
    
    if (utcDate < minDate || utcDate > maxDate) {
      return NextResponse.json(
        { error: 'Date out of reasonable range (1970-2100)' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert to Unix timestamp
    const timestamp = getUnixTime(utcDate);
    const milliseconds = utcDate.getTime();

    // Return the response matching the documented format
    const response = {
      date: utcDate.toISOString(),
      timestamp: timestamp,
      milliseconds: milliseconds,
      timezone: timezone
    };

    return NextResponse.json(response, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in date-to-unix API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
