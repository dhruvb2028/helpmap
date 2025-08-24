'use client';

import { useState, useCallback } from 'react';
import { Plus, Filter, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFiltersProps {
  onFilter: (type: string) => void;
  onAddResource: () => void;
  onLocationSearch?: (lat: number, lng: number, name: string) => void;
  resourceCount: number;
}

export default function SearchFilters({ onFilter, onAddResource, onLocationSearch, resourceCount }: SearchFiltersProps) {
  const [locationSearch, setLocationSearch] = useState('');
  const [type, setType] = useState('all');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const handleTypeChange = useCallback((value: string) => {
    setType(value);
    onFilter(value);
  }, [onFilter]);

  const generateSampleResourcesNearLocation = (lat: number, lng: number, locationName: string) => {
    const sampleTypes: ('Food' | 'Shelter' | 'Health' | 'Blood')[] = ['Food', 'Shelter', 'Health', 'Blood'];
    const resourceTemplates: Record<'Food' | 'Shelter' | 'Health' | 'Blood', Array<{ name: string; description: string; icon: string }>> = {
      Food: [
        { name: 'Community Food Bank', description: 'Emergency food assistance and nutrition programs', icon: '🍽️' },
        { name: 'Local Soup Kitchen', description: 'Hot meals served daily at noon', icon: '🥣' },
        { name: 'Mobile Food Pantry', description: 'Fresh produce and pantry items', icon: '🚛' }
      ],
      Shelter: [
        { name: 'Emergency Shelter', description: 'Temporary housing for individuals and families', icon: '🏠' },
        { name: 'Family Housing Center', description: 'Safe housing for families with children', icon: '🏘️' },
        { name: 'Youth Shelter', description: 'Housing services for young adults', icon: '🛏️' }
      ],
      Health: [
        { name: 'Community Health Center', description: 'Free and low-cost medical care', icon: '🏥' },
        { name: 'Mental Health Clinic', description: 'Counseling and mental health services', icon: '🧠' },
        { name: 'Mobile Health Unit', description: 'Health screenings and basic medical care', icon: '🚑' }
      ],
      Blood: [
        { name: 'Blood Donation Center', description: 'Blood donation center open daily', icon: '🩸' },
        { name: 'Community Blood Drive', description: 'Regular blood drives and donation events', icon: '❤️' },
        { name: 'Hospital Blood Bank', description: 'Emergency blood services', icon: '🏥' }
      ]
    };

    const samples: Array<{
      id: string;
      name: string;
      type: 'Food' | 'Shelter' | 'Health' | 'Blood';
      address: string;
      description: string;
      contact: string;
      email: string;
      website: string;
      hours: string;
      services: string;
      eligibility: string;
      languages: string;
      latitude: number;
      longitude: number;
      created_at: string;
    }> = [];
    
    // Generate 2-3 resources of each type near the searched location
    sampleTypes.forEach((resourceType, typeIndex) => {
      const templates = resourceTemplates[resourceType];
      const numResources = Math.floor(Math.random() * 2) + 2; // 2-3 resources per type
      
      for (let i = 0; i < numResources && i < templates.length; i++) {
        const template = templates[i];
        // Add some random offset (within ~2km radius)
        const latOffset = (Math.random() - 0.5) * 0.02; // ~1.1km
        const lngOffset = (Math.random() - 0.5) * 0.02;
        
        samples.push({
          id: `sample-${resourceType.toLowerCase()}-${i}-${Date.now()}`,
          name: `${template.name} near ${locationName}`,
          type: resourceType,
          address: `${Math.floor(Math.random() * 999) + 1} ${locationName} Street, Local Area`,
          description: template.description,
          contact: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          email: `info@${template.name.toLowerCase().replace(/\s+/g, '')}.org`,
          website: `https://www.${template.name.toLowerCase().replace(/\s+/g, '')}.org`,
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
          services: template.description,
          eligibility: 'Open to all community members',
          languages: 'English, Spanish',
          latitude: lat + latOffset,
          longitude: lng + lngOffset,
          created_at: new Date().toISOString()
        });
      }
    });

    return samples;
  };

  const handleLocationSearch = useCallback(async () => {
    if (!locationSearch.trim() || !onLocationSearch) return;

    setIsSearchingLocation(true);
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: locationSearch }),
      });

      if (response.ok) {
        const data = await response.json();
        // Generate sample resources near this location
        const sampleResources = generateSampleResourcesNearLocation(data.latitude, data.longitude, locationSearch);
        
        // Trigger location search with the coordinates and sample resources
        onLocationSearch(data.latitude, data.longitude, locationSearch);
        
        // Store sample resources in sessionStorage so Map component can access them
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('locationBasedResources', JSON.stringify(sampleResources));
          
          // Trigger a custom event to notify the map component
          window.dispatchEvent(new CustomEvent('locationResourcesGenerated', { 
            detail: { resources: sampleResources, location: { lat: data.latitude, lng: data.longitude, name: locationSearch } }
          }));
        }
      } else {
        console.error('Location search failed');
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Location search error:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setIsSearchingLocation(false);
    }
  }, [locationSearch, onLocationSearch]);

  const handleLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Location Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search any location worldwide (e.g., 'Times Square', 'London', 'Tokyo')..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyPress={handleLocationKeyPress}
            className="pl-10 w-full"
          />
        </div>
        <Button 
          onClick={handleLocationSearch}
          disabled={!locationSearch.trim() || isSearchingLocation}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSearchingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span className="ml-2">Find Resources</span>
        </Button>
      </div>

      {/* Filter and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Shelter">Shelter</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Blood">Blood</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count and Add Button */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm text-gray-600">
            {resourceCount} resource{resourceCount !== 1 ? 's' : ''} found
          </span>
          <Button 
            onClick={onAddResource}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </Button>
        </div>
      </div>
      
      {/* Help Text */}
      <div className="text-sm text-gray-500 text-center">
        💡 Search for any location to discover community resources nearby
      </div>
    </div>
  );
}