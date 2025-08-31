import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, isSupabaseServerAvailable } from '@/lib/supabaseServer';
import { sampleResources } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');

    // Check if Supabase is available
    if (!isSupabaseServerAvailable()) {
      console.log('Supabase not configured, using sample data');
      let filteredData = [...sampleResources];
      
      // Apply filters to sample data
      if (type && type !== 'all') {
        filteredData = filteredData.filter(resource => resource.type === type);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(resource =>
          resource.name.toLowerCase().includes(searchLower) ||
          resource.address.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower)
        );
      }
      
      return NextResponse.json(filteredData);
    }

    // Try to fetch from database
    const supabase = supabaseServer();
    if (!supabase) {
      throw new Error('Failed to create Supabase client');
    }

    let query = supabase.from('resources').select('*');

    // Filter by type if specified
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    // Search functionality
    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    // If database error, fall back to sample data
    if (error) {
      console.log('Database error, using sample data:', error.message);
      let filteredData = [...sampleResources];
      
      // Apply filters to sample data
      if (type && type !== 'all') {
        filteredData = filteredData.filter(resource => resource.type === type);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(resource => 
          resource.name.toLowerCase().includes(searchLower) ||
          resource.address.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Add IDs and created_at fields to match expected format
      const dataWithIds = filteredData.map((resource, index) => ({
        id: `sample-${index + 1}`,
        ...resource,
        created_at: new Date().toISOString()
      }));
      
      return NextResponse.json(dataWithIds);
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      type, 
      address, 
      description, 
      contact, 
      email,
      website,
      hours,
      services,
      eligibility,
      languages,
      latitude, 
      longitude 
    } = body;

    // Validate required fields
    if (!name || !type || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields: name, type, address, and location coordinates' }, { status: 400 });
    }

    // Ensure at least one contact method is provided
    if (!contact && !email) {
      return NextResponse.json({ error: 'Please provide at least one contact method (phone or email)' }, { status: 400 });
    }

    const resourceData = {
      name: name.trim(),
      type,
      address: address.trim(),
      description: description?.trim() || '',
      contact: contact?.trim() || '',
      email: email?.trim() || '',
      website: website?.trim() || '',
      hours: hours?.trim() || '',
      services: services?.trim() || '',
      eligibility: eligibility?.trim() || '',
      languages: languages?.trim() || '',
      latitude,
      longitude,
    };

    // Check if Supabase is available
    if (!isSupabaseServerAvailable()) {
      // Database not available - return success but explain limitation
      return NextResponse.json({ 
        message: 'Resource submitted successfully! Note: This is a demo - in production, this would be saved to the database.',
        id: `demo-${Date.now()}`,
        ...resourceData,
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    const supabase = supabaseServer();
    if (!supabase) {
      throw new Error('Failed to create Supabase client');
    }

    const { data, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Fall back to demo response
      return NextResponse.json({ 
        message: 'Resource submitted successfully! Note: Database unavailable, this is a demo submission.',
        id: `demo-${Date.now()}`,
        ...resourceData,
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}