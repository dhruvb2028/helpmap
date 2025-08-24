'use client';

import { X, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Resource } from '@/lib/types';

interface ResourcePopupProps {
  resource: Resource;
  onClose: () => void;
}

export default function ResourcePopup({ resource, onClose }: ResourcePopupProps) {
  const getDirectionsUrl = () => {
    const address = encodeURIComponent(resource.address);
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Food': return 'bg-green-100 text-green-800';
      case 'Shelter': return 'bg-blue-100 text-blue-800';
      case 'Health': return 'bg-red-100 text-red-800';
      case 'Blood': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl max-w-sm w-full p-6 z-40">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resource.name}
          </h3>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
            {resource.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Address */}
      <div className="flex items-start space-x-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <span className="text-sm text-gray-700">{resource.address}</span>
      </div>

      {/* Contact */}
      {resource.contact && (
        <div className="flex items-start space-x-2 mb-3">
          <Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700">{resource.contact}</span>
        </div>
      )}

      {/* Description */}
      {resource.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-700">{resource.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(getDirectionsUrl(), '_blank');
            }
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Directions
        </Button>
      </div>

      {/* Timestamp */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Added {new Date(resource.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}