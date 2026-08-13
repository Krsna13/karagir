import type { ArtisanUser } from '../types';

export const ARTISAN_DATABASE: ArtisanUser[] = [
  {
    id: 'artisan-01',
    name: 'Ramesh Sharma',
    phone: '9876543210',
    password: '12345',
    craftSpecialty: 'Woodworking',
    location: 'Saharanpur, UP',
    isVerified: true,
    registeredAt: new Date().toISOString()
  },
  {
    id: 'artisan-02',
    name: 'Prakash Suthar',
    phone: '9812345678',
    password: '12345',
    craftSpecialty: 'Mandir Specialist',
    location: 'Jodhpur, RJ',
    isVerified: true,
    registeredAt: new Date().toISOString()
  },
  {
    id: 'artisan-03',
    name: 'Vikram Jagtap',
    phone: '9988776655',
    password: '12345',
    craftSpecialty: 'Custom Joinery',
    location: 'Nashik, MH',
    isVerified: true,
    registeredAt: new Date().toISOString()
  }
];
