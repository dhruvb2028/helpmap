import { supabaseBrowser, isSupabaseBrowserAvailable } from './supabaseBrowser';

// Function to generate scattered coordinates around a center point
const generateScatteredCoordinates = (centerLat: number, centerLng: number, radiusKm: number = 5) => {
  // Convert radius to degrees (roughly 1 degree = 111km)
  const radiusDeg = radiusKm / 111;
  
  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusDeg;
  
  // Calculate offset
  const latOffset = distance * Math.cos(angle);
  const lngOffset = distance * Math.sin(angle);
  
  return {
    latitude: centerLat + latOffset,
    longitude: centerLng + lngOffset
  };
};

// Base resource templates for generating varied resources
const resourceTemplates = {
  Food: [
    {
      name: "Community Food Bank",
      description: "Free groceries and hot meals available Monday-Friday 9AM-5PM. No documentation required.",
    },
    {
      name: "Local Food Pantry", 
      description: "Emergency food assistance for families in need. Open Tuesday and Thursday 10AM-2PM.",
    },
    {
      name: "Salvation Army Kitchen",
      description: "Hot meals served daily at noon. Weekend food pantry available.",
    }
  ],
  Shelter: [
    {
      name: "Emergency Shelter",
      description: "Safe overnight accommodation for individuals and families experiencing homelessness.",
    },
    {
      name: "Family Housing Center",
      description: "Short-term housing for families with children. Meals and childcare provided.",
    },
    {
      name: "Transitional Housing",
      description: "Temporary housing with support services to help individuals get back on their feet.",
    }
  ],
  Health: [
    {
      name: "Community Health Center",
      description: "Free and low-cost medical care. Walk-ins welcome. Sliding scale fees available.",
    },
    {
      name: "Mobile Health Clinic",
      description: "Free health screenings and basic medical care. Rotates between multiple locations.",
    },
    {
      name: "Mental Health Services",
      description: "Counseling and mental health support services. Crisis intervention available 24/7.",
    }
  ],
  Blood: [
    {
      name: "Blood Donation Center",
      description: "Regular blood donation drives. All blood types needed. Walk-ins welcome.",
    },
    {
      name: "Red Cross Blood Drive",
      description: "Mobile blood collection unit. Scheduled donation appointments available.",
    }
  ]
};

// Generate initial scattered sample resources
const generateInitialSampleResources = () => {
  const resources: any[] = [];
  const centerPoints = [
    { lat: 40.7128, lng: -74.0060, area: "Manhattan" },
    { lat: 40.6782, lng: -73.9442, area: "Brooklyn" }, 
    { lat: 40.7831, lng: -73.9712, area: "Upper Manhattan" },
    { lat: 40.7505, lng: -73.9934, area: "Midtown" }
  ];

  centerPoints.forEach((center, centerIndex) => {
    Object.entries(resourceTemplates).forEach(([type, templates]) => {
      templates.forEach((template, templateIndex) => {
        const coords = generateScatteredCoordinates(center.lat, center.lng, 3);
        
        resources.push({
          name: `${template.name} - ${center.area}`,
          type: type as 'Food' | 'Shelter' | 'Health' | 'Blood',
          address: `${Math.floor(Math.random() * 999) + 1} ${center.area} Street, New York, NY`,
          description: template.description,
          contact: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          email: `info@${template.name.toLowerCase().replace(/\s+/g, '')}.org`,
          website: `https://www.${template.name.toLowerCase().replace(/\s+/g, '')}.org`,
          hours: "Monday-Friday: 9:00 AM - 5:00 PM",
          services: template.description,
          eligibility: "Open to all community members",
          languages: "English, Spanish",
          latitude: coords.latitude,
          longitude: coords.longitude,
          created_at: new Date().toISOString()
        });
      });
    });
  });

  return resources;
};

export const sampleResources = generateInitialSampleResources();

export async function insertSampleData() {
  if (!isSupabaseBrowserAvailable()) {
    console.log('Supabase not available, using client-side sample data');
    return;
  }
  
  const supabase = supabaseBrowser();
  if (!supabase) {
    console.log('Could not create Supabase browser client');
    return;
  }
  
  try {
    // Check if sample data already exists
    const { data: existingData } = await supabase
      .from('resources')
      .select('id')
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      console.log('Sample data already exists');
      return;
    }

    // Insert the sample data
    const { error } = await supabase
      .from('resources')
      .insert(sampleResources);

    if (error) {
      console.error('Error inserting sample data:', error);
    } else {
      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error checking/inserting sample data:', error);
  }
}
