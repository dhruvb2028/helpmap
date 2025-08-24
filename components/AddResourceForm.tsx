'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Loader2, Phone, Mail, Clock, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Resource } from '@/lib/types';

interface AddResourceFormProps {
  onResourceAdded: (resource: Resource) => void;
  onClose: () => void;
}

export default function AddResourceForm({ onResourceAdded, onClose }: AddResourceFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    description: '',
    contact: '',
    email: '',
    website: '',
    hours: '',
    services: '',
    eligibility: '',
    languages: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem('helpmap-resource-draft');
      if (draft) {
        try {
          setFormData(JSON.parse(draft));
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, []);

  // Save draft to localStorage when form data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('helpmap-resource-draft', JSON.stringify(formData));
    }
  }, [formData]);

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('helpmap-resource-draft');
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        return !!(formData.name && formData.type && formData.address);
      case 1: // Contact & Details
        return !!(formData.contact || formData.email);
      case 2: // Additional Info
        return true; // Optional step
      default:
        return true;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');

    // Address suggestions (mock implementation - in real app would use geocoding API)
    if (field === 'address' && value.length > 3) {
      // Simple mock suggestions - in real app would call geocoding API
      const mockSuggestions = [
        `${value} Street, New York, NY`,
        `${value} Avenue, New York, NY`,
        `${value} Boulevard, New York, NY`,
      ];
      setAddressSuggestions(mockSuggestions);
    } else if (field === 'address') {
      setAddressSuggestions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(0)) {
      setError('Please fill in all required fields: Name, Type, and Address');
      return;
    }

    if (!validateStep(1)) {
      setError('Please provide at least one contact method (phone or email)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, geocode the address
      const geocodeResponse = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: formData.address }),
      });

      if (!geocodeResponse.ok) {
        const errorData = await geocodeResponse.json();
        throw new Error(errorData.error || 'Failed to find address location. Please check the address and try again.');
      }

      const { latitude, longitude } = await geocodeResponse.json();

      // Prepare resource data with all fields
      const resourceData = {
        name: formData.name.trim(),
        type: formData.type,
        address: formData.address.trim(),
        description: formData.description.trim() || `${formData.type} resource providing ${formData.services || 'community services'}.`,
        contact: formData.contact.trim() || formData.email.trim(),
        email: formData.email.trim(),
        website: formData.website.trim(),
        hours: formData.hours.trim(),
        services: formData.services.trim(),
        eligibility: formData.eligibility.trim(),
        languages: formData.languages.trim(),
        latitude,
        longitude,
      };

      // Then, add the resource
      const resourceResponse = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData),
      });

      if (!resourceResponse.ok) {
        const errorData = await resourceResponse.json();
        throw new Error(errorData.error || 'Failed to add resource');
      }

      const newResource = await resourceResponse.json();
      
      // Show success state
      setSuccess(true);
      clearDraft();
      
      // Close after short delay to show success
      setTimeout(() => {
        onResourceAdded(newResource);
      }, 1500);
      
    } catch (error) {
      console.error('Error adding resource:', error);
      setError(error instanceof Error ? error.message : 'Failed to add resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
      setError('');
    } else {
      setError('Please complete all required fields before continuing');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError('');
  };

  const handleClose = () => {
    if (Object.values(formData).some(value => value.trim())) {
      if (typeof window !== 'undefined') {
        const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close? Your draft will be saved.');
        if (confirmClose) {
          onClose();
        }
      } else {
        onClose();
      }
    } else {
      clearDraft();
      onClose();
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Resource Added Successfully!</h2>
        <p className="text-gray-600 mb-4">Thank you for contributing to the community. Your resource is now available on the map.</p>
        <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
          View on Map
        </Button>
      </div>
    );
  }

  const steps = [
    { title: 'Basic Information', description: 'Name, type, and location' },
    { title: 'Contact Details', description: 'How people can reach you' },
    { title: 'Additional Info', description: 'Hours, services, and more' }
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Add New Resource</h2>
          <p className="text-sm text-gray-600 mt-1">
            Step {currentStep + 1} of 3: {steps[currentStep].description}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={`text-sm font-medium ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 0: Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Resource Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Downtown Food Bank, Community Health Center"
                disabled={loading}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                Resource Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select the type of resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">🍽️ Food - Food banks, pantries, soup kitchens</SelectItem>
                  <SelectItem value="Shelter">🏠 Shelter - Emergency housing, transitional housing</SelectItem>
                  <SelectItem value="Health">🏥 Health - Medical care, mental health, clinics</SelectItem>
                  <SelectItem value="Blood">🩸 Blood - Blood donation, blood drives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address *
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Main Street, City, State, ZIP Code"
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
              {addressSuggestions.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        handleChange('address', suggestion);
                        setAddressSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Contact & Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@example.org"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Website (Optional)
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.example.org"
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the services provided, who is eligible, and any important details..."
                rows={4}
                disabled={loading}
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a clear description of services, eligibility requirements, and how to access help.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Additional Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hours" className="text-sm font-medium text-gray-700">
                Operating Hours
              </Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="hours"
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleChange('hours', e.target.value)}
                  placeholder="Mon-Fri 9AM-5PM, Sat 10AM-2PM"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="services" className="text-sm font-medium text-gray-700">
                Services Provided
              </Label>
              <Textarea
                id="services"
                value={formData.services}
                onChange={(e) => handleChange('services', e.target.value)}
                placeholder="e.g., Hot meals, groceries, case management, referrals..."
                rows={3}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="eligibility" className="text-sm font-medium text-gray-700">
                Eligibility Requirements
              </Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility}
                onChange={(e) => handleChange('eligibility', e.target.value)}
                placeholder="e.g., No requirements, Income verification needed, Must be 18+..."
                rows={2}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="languages" className="text-sm font-medium text-gray-700">
                Languages Spoken
              </Label>
              <Input
                id="languages"
                type="text"
                value={formData.languages}
                onChange={(e) => handleChange('languages', e.target.value)}
                placeholder="English, Spanish, French..."
                disabled={loading}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 0 ? handleClose : prevStep}
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>

          {currentStep < 2 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={loading || !validateStep(currentStep)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading || !validateStep(0) || !validateStep(1)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Resource...
                </>
              ) : (
                'Add Resource'
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for adding a great resource:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Be specific about services and eligibility requirements</li>
          <li>• Include current operating hours and contact information</li>
          <li>• Mention any documentation or appointment requirements</li>
          <li>• Note if services are free or if there are any costs</li>
        </ul>
      </div>
    </div>
  );
}
