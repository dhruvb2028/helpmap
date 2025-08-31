export type Resource = {
  id: string;
  name: string;
  type: 'Food' | 'Shelter' | 'Health' | 'Blood';
  address: string;
  description: string;
  contact: string;
  email?: string;
  website?: string;
  hours?: string;
  services?: string;
  eligibility?: string;
  languages?: string;
  latitude: number;
  longitude: number;
  created_at: string;
};
