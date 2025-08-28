const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const sampleResources = [
  // Food Resources
  {
    name: "Downtown Food Bank",
    type: "Food",
    address: "123 Main Street, New York, NY 10001",
    description: "Free groceries and hot meals available Monday-Friday 9AM-5PM. No documentation required.",
    contact: "(555) 123-4567",
    latitude: 40.7505,
    longitude: -73.9934
  },
  {
    name: "Community Kitchen",
    type: "Food",
    address: "456 Broadway, New York, NY 10013",
    description: "Hot meals served daily at noon. Weekend food pantry available.",
    contact: "info@communitykitchen.org",
    latitude: 40.7209,
    longitude: -74.0007
  },
  {
    name: "Salvation Army Food Pantry",
    type: "Food",
    address: "789 Church Street, New York, NY 10007",
    description: "Emergency food assistance for families in need. Open Tuesday and Thursday 10AM-2PM.",
    contact: "(555) 234-5678",
    latitude: 40.7127,
    longitude: -74.0059
  },
  {
    name: "Harlem Food Distribution Center",
    type: "Food",
    address: "321 Lenox Avenue, New York, NY 10027",
    description: "Fresh produce and pantry items. Serves 200+ families weekly.",
    contact: "(555) 345-6789",
    latitude: 40.8176,
    longitude: -73.9482
  },

  // Shelter Resources
  {
    name: "Safe Haven Shelter",
    type: "Shelter",
    address: "567 Park Avenue, New York, NY 10016",
    description: "Emergency overnight shelter for individuals and families. 24/7 intake.",
    contact: "(555) 456-7890",
    latitude: 40.7589,
    longitude: -73.9851
  },
  {
    name: "Women's Crisis Center",
    type: "Shelter",
    address: "890 East 14th Street, New York, NY 10003",
    description: "Safe housing for women and children escaping domestic violence. Confidential location.",
    contact: "(555) 567-8901",
    latitude: 40.7308,
    longitude: -73.9776
  },
  {
    name: "Veterans Housing Program",
    type: "Shelter",
    address: "234 West 42nd Street, New York, NY 10036",
    description: "Transitional housing for homeless veterans. Case management and job placement services.",
    contact: "(555) 678-9012",
    latitude: 40.7580,
    longitude: -73.9855
  },
  {
    name: "Family Emergency Shelter",
    type: "Shelter",
    address: "678 Amsterdam Avenue, New York, NY 10025",
    description: "Short-term housing for families with children. Meals and childcare provided.",
    contact: "(555) 789-0123",
    latitude: 40.7831,
    longitude: -73.9712
  },

  // Health Resources
  {
    name: "Community Health Center",
    type: "Health",
    address: "345 First Avenue, New York, NY 10010",
    description: "Free and low-cost medical care. Walk-ins welcome. Sliding scale fees available.",
    contact: "(555) 890-1234",
    latitude: 40.7282,
    longitude: -73.9776
  },
  {
    name: "Mobile Health Clinic",
    type: "Health",
    address: "456 Second Avenue, New York, NY 10003",
    description: "Free health screenings and basic medical care. Rotates between multiple locations.",
    contact: "(555) 901-2345",
    latitude: 40.7260,
    longitude: -73.9857
  },
  {
    name: "Mental Health Support Center",
    type: "Health",
    address: "789 Third Avenue, New York, NY 10017",
    description: "Free counseling and mental health services. Crisis intervention available 24/7.",
    contact: "(555) 012-3456",
    latitude: 40.7505,
    longitude: -73.9751
  },
  {
    name: "Dental Care Clinic",
    type: "Health",
    address: "123 Fourth Avenue, New York, NY 10003",
    description: "Free dental cleanings and basic dental care for uninsured patients.",
    contact: "(555) 123-4567",
    latitude: 40.7282,
    longitude: -73.9897
  },

  // Blood Resources
  {
    name: "Red Cross Blood Center",
    type: "Blood",
    address: "567 Fifth Avenue, New York, NY 10017",
    description: "Blood donation center open daily. Walk-ins welcome. Free health screening included.",
    contact: "(555) 234-5678",
    latitude: 40.7549,
    longitude: -73.9840
  },
  {
    name: "NYC Blood Services",
    type: "Blood",
    address: "890 Sixth Avenue, New York, NY 10001",
    description: "Plasma and blood donation facility. Appointments preferred but not required.",
    contact: "(555) 345-6789",
    latitude: 40.7505,
    longitude: -73.9934
  },
  {
    name: "Hospital Blood Bank",
    type: "Blood",
    address: "234 Seventh Avenue, New York, NY 10011",
    description: "Emergency blood services and donation center. 24/7 emergency blood needs.",
    contact: "(555) 456-7890",
    latitude: 40.7390,
    longitude: -74.0026
  },
  {
    name: "Community Blood Drive Center",
    type: "Blood",
    address: "678 Eighth Avenue, New York, NY 10019",
    description: "Regular blood drives and donation events. Check schedule for mobile unit locations.",
    contact: "(555) 567-8901",
    latitude: 40.7614,
    longitude: -73.9776
  }
];

async function initDatabase() {
  try {
    console.log('🚀 Initializing database with sample data...');
    
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('resources')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing data:', checkError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log('✅ Sample data already exists in database');
      return;
    }

    // Insert sample data
    const { data, error } = await supabase
      .from('resources')
      .insert(sampleResources)
      .select();

    if (error) {
      console.error('❌ Error inserting sample data:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} sample resources`);
    console.log('🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error in database initialization:', error);
  }
}

initDatabase();
