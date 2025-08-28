'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Plus, Search, Heart, Users, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import AddResourceForm from '@/components/AddResourceForm';
import { Resource } from '@/lib/types';

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleResourceAdded = (resource: Resource) => {
    console.log('Resource added:', resource);
    setIsDialogOpen(false);
    // You could add a toast notification here
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Help When You Need It Most
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              HelpMap connects vulnerable populations with essential community resources including food banks, shelters, healthcare services, and blood donation centers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-3">
                <Link href="/map" className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Explore Resources</span>
                </Link>
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-3">
                    <div className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Add Resource</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                  </DialogHeader>
                  <AddResourceForm 
                    onResourceAdded={handleResourceAdded}
                    onClose={handleCloseDialog}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How HelpMap Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and reliable access to community aid resources
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Find Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Search and filter through food banks, shelters, healthcare services, and blood donation centers near you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Get Directions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  View detailed information and get directions to any resource location with a single click.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                    <Plus className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Add Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Help your community by adding new resources. No registration required - just provide the details.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Resource Types Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resource Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the help you need across these essential service categories
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Food</h3>
              </div>
              <p className="text-gray-600">Food banks, soup kitchens, meal programs, and emergency food assistance.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Shelter</h3>
              </div>
              <p className="text-gray-600">Homeless shelters, temporary housing, and emergency accommodation services.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Health</h3>
              </div>
              <p className="text-gray-600">Community health centers, free clinics, and medical assistance programs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Blood</h3>
              </div>
              <p className="text-gray-600">Blood donation centers, blood banks, and emergency blood services.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Community-Driven</h3>
              <p className="text-gray-600">Resources added and maintained by community members like you</p>
            </div>
            
            <div>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7 Access</h3>
              <p className="text-gray-600">Find help whenever you need it, day or night</p>
            </div>
            
            <div>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">No Registration</h3>
              <p className="text-gray-600">Access resources immediately without creating an account</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Help or Help Others?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of care and make a difference today
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-3">
            <Link href="/map" className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Get Started</span>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}