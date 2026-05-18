import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { UserRole, LeadStatus, LeadSource } from '../types';
import { env } from '../config/env';

const DEMO_USERS = [
  {
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: 'Admin@123',
    role: UserRole.ADMIN,
  },
  {
    name: 'Sales User',
    email: 'sales@smartleads.com',
    password: 'Sales@123',
    role: UserRole.SALES,
  },
];

const LEAD_NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Arjun Singh', 'Neha Gupta', 'Vikram Mehta',
  'Ananya Reddy', 'Karan Malhotra', 'Sanya Iyer', 'Rohan Joshi', 'Divya Kumar',
  'Aditya Verma', 'Pooja Nair', 'Suresh Pillai', 'Meena Krishnan', 'Rajesh Bose',
  'Sunita Chatterjee', 'Manish Tiwari', 'Kavita Rao', 'Deepak Pandey', 'Rekha Sinha',
];

const LEAD_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io', 'business.com'];

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateLeads = (createdById: mongoose.Types.ObjectId) => {
  return LEAD_NAMES.map((name, i) => {
    const [first, last] = name.toLowerCase().split(' ');
    return {
      name,
      email: `${first}.${last}${i}@${randomFrom(LEAD_DOMAINS)}`,
      status: randomFrom(Object.values(LeadStatus)),
      source: randomFrom(Object.values(LeadSource)),
      createdBy: createdById,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    };
  });
};

const seed = async (): Promise<void> => {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Lead.deleteMany({});
  console.log('Cleared existing data');

  const users = await User.create(DEMO_USERS);
  console.log(`Created ${users.length} users`);

  const adminUser = users.find((u) => u.role === UserRole.ADMIN);
  if (!adminUser) throw new Error('Admin user not found');

  const leads = generateLeads(adminUser._id);
  await Lead.create(leads);
  console.log(`Created ${leads.length} leads`);

  console.log('\n✅ Seed completed!');
  console.log('Demo credentials:');
  console.log('  Admin: admin@smartleads.com / Admin@123');
  console.log('  Sales: sales@smartleads.com / Sales@123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
