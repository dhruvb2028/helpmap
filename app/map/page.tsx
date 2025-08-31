'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import AddResourceForm from '@/components/AddResourceForm';
import SearchFilters from '@/components/SearchFilters';
import { Resource } from '@/lib/types';

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [locationBasedResources, setLocationBasedResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [allDisplayResources, setAllDisplayResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const fetchResources = useCallback(async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data);
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
    return [];
  }, []);

  const initializeData = useCallback(async () => {
    // Insert sample data if needed - use dynamic import to avoid SSR issues
    if (typeof window !== 'undefined') {
      try {
        const { insertSampleData } = await import('@/lib/sample-data');
        await insertSampleData();
      } catch (error) {
        console.error('Failed to insert sample data:', error);
      }
    }
    // Then fetch all resources
    const fetchedResources = await fetchResources();
    setFilteredResources(fetchedResources);
    setAllDisplayResources(fetchedResources);
  }, [fetchResources]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Listen for location-based resources generation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleLocationResources = (event: CustomEvent) => {
      const newLocationResources = event.detail.resources;
      setLocationBasedResources(newLocationResources);
      
      // Combine original resources with location-based ones
      const combined = [...resources, ...newLocationResources];
      setAllDisplayResources(combined);
      setFilteredResources(combined);
    };

    window.addEventListener('locationResourcesGenerated', handleLocationResources as EventListener);
    
    return () => {
      window.removeEventListener('locationResourcesGenerated', handleLocationResources as EventListener);
    };
  }, [resources]);

  const handleResourceAdded = (newResource: Resource) => {
    const updatedResources = [newResource, ...resources];
    setResources(updatedResources);
    
    // Update combined resources
    const combined = [...updatedResources, ...locationBasedResources];
    setAllDisplayResources(combined);
    setFilteredResources(combined);
    setShowForm(false);
  };

  const handleFilter = (type: string) => {
    let filtered = allDisplayResources;

    if (type !== 'all') {
      filtered = filtered.filter(resource => resource.type === type);
    }

    setFilteredResources(filtered);
  };

  const handleLocationSearch = (lat: number, lng: number, name: string) => {
    setSearchLocation({ lat, lng, name });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-screen flex flex-col">
        {/* Controls */}
        <div className="bg-white border-b shadow-sm p-4">
          <div className="max-w-7xl mx-auto">
            <SearchFilters 
              onFilter={handleFilter}
              onAddResource={() => setShowForm(true)}
              onLocationSearch={handleLocationSearch}
              resourceCount={filteredResources.length}
            />
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <Map resources={filteredResources} searchLocation={searchLocation} />
          
          {/* Add Resource Form Overlay */}
          {showForm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <AddResourceForm
                  onResourceAdded={handleResourceAdded}
                  onClose={() => setShowForm(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}