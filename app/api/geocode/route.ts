import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LOCATIONIQ_ACCESS_TOKEN = process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    if (!LOCATIONIQ_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'LocationIQ token not configured' }, { status: 500 });
    }

    const encodedAddress = encodeURIComponent(address);
    const geocodingUrl = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_ACCESS_TOKEN}&q=${encodedAddress}&format=json&limit=1`;

    const response = await fetch(geocodingUrl);
    const data = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);

    return NextResponse.json({ latitude, longitude });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}