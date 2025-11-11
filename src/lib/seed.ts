import { db } from './db';
import { departments, subjects, users } from './db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed departments
  const departmentData = [
    { name: 'Artificial Intelligence & Data Science', code: 'AIDS' },
    { name: 'Mechatronics', code: 'MECT' },
    { name: 'Food Technology', code: 'FOOD' },
    { name: 'Electrical Engineering', code: 'ELEC' },
    { name: 'Civil & Infrastructure', code: 'CIVL' },
  ];

  console.log('🏢 Creating departments...');
  for (const dept of departmentData) {
    await db.insert(departments).values(dept);
  }

  // Get department IDs
  const deptIds = await db.select().from(departments);
  const deptMap = new Map(deptIds.map(d => [d.code, d.id]));

  // Seed subjects for each department
  console.log('📚 Creating subjects...');
  
  const subjectsData = [
    // AI & DS Subjects
    { name: 'Machine Learning', code: 'AIDS101', departmentId: deptMap.get('AIDS')!, credits: 4, type: 'theory' as const },
    { name: 'Deep Learning Lab', code: 'AIDS102', departmentId: deptMap.get('AIDS')!, credits: 2, type: 'lab' as const },
    { name: 'Data Science Fundamentals', code: 'AIDS103', departmentId: deptMap.get('AIDS')!, credits: 3, type: 'theory' as const },
    { name: 'Python Programming', code: 'AIDS104', departmentId: deptMap.get('AIDS')!, credits: 3, type: 'lab' as const },
    { name: 'Big Data Analytics', code: 'AIDS105', departmentId: deptMap.get('AIDS')!, credits: 4, type: 'theory' as const },
    
    // Mechatronics Subjects
    { name: 'Robotics Engineering', code: 'MECT101', departmentId: deptMap.get('MECT')!, credits: 4, type: 'theory' as const },
    { name: 'Control Systems', code: 'MECT102', departmentId: deptMap.get('MECT')!, credits: 3, type: 'theory' as const },
    { name: 'Automation Lab', code: 'MECT103', departmentId: deptMap.get('MECT')!, credits: 2, type: 'lab' as const },
    { name: 'Mechanical Design', code: 'MECT104', departmentId: deptMap.get('MECT')!, credits: 3, type: 'theory' as const },
    
    // Food Technology Subjects
    { name: 'Food Processing', code: 'FOOD101', departmentId: deptMap.get('FOOD')!, credits: 3, type: 'theory' as const },
    { name: 'Food Chemistry Lab', code: 'FOOD102', departmentId: deptMap.get('FOOD')!, credits: 2, type: 'lab' as const },
    { name: 'Nutrition Science', code: 'FOOD103', departmentId: deptMap.get('FOOD')!, credits: 3, type: 'theory' as const },
    
    // Electrical Engineering Subjects
    { name: 'Circuit Theory', code: 'ELEC101', departmentId: deptMap.get('ELEC')!, credits: 4, type: 'theory' as const },
    { name: 'Digital Electronics Lab', code: 'ELEC102', departmentId: deptMap.get('ELEC')!, credits: 2, type: 'lab' as const },
    { name: 'Power Systems', code: 'ELEC103', departmentId: deptMap.get('ELEC')!, credits: 3, type: 'theory' as const },
    
    // Civil & Infrastructure Subjects
    { name: 'Structural Analysis', code: 'CIVL101', departmentId: deptMap.get('CIVL')!, credits: 4, type: 'theory' as const },
    { name: 'Construction Materials Lab', code: 'CIVL102', departmentId: deptMap.get('CIVL')!, credits: 2, type: 'lab' as const },
    { name: 'Infrastructure Planning', code: 'CIVL103', departmentId: deptMap.get('CIVL')!, credits: 3, type: 'theory' as const },
  ];

  for (const subject of subjectsData) {
    await db.insert(subjects).values(subject);
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await db.insert(users).values({
    email: 'admin@university.edu',
    name: 'System Administrator',
    password: adminPassword,
    role: 'admin' as const,
    employeeId: 'ADMIN001',
    designation: 'System Administrator',
    hourlyRate: 0,
  });

  // Create sample faculty users
  console.log('👥 Creating faculty users...');
  const facultyPassword = await bcrypt.hash('faculty123', 10);
  
  const facultyData = [
    {
      email: 'john.smith@university.edu',
      name: 'Dr. John Smith',
      password: facultyPassword,
      role: 'faculty' as const,
      departmentId: deptMap.get('AIDS')!,
      employeeId: 'FAC001',
      designation: 'Associate Professor',
      hourlyRate: 800,
    },
    {
      email: 'sarah.johnson@university.edu',
      name: 'Dr. Sarah Johnson',
      password: facultyPassword,
      role: 'faculty' as const,
      departmentId: deptMap.get('MECT')!,
      employeeId: 'FAC002',
      designation: 'Assistant Professor',
      hourlyRate: 700,
    },
    {
      email: 'michael.chen@university.edu',
      name: 'Prof. Michael Chen',
      password: facultyPassword,
      role: 'faculty' as const,
      departmentId: deptMap.get('FOOD')!,
      employeeId: 'FAC003',
      designation: 'Professor',
      hourlyRate: 900,
    },
    {
      email: 'emily.davis@university.edu',
      name: 'Dr. Emily Davis',
      password: facultyPassword,
      role: 'faculty' as const,
      departmentId: deptMap.get('ELEC')!,
      employeeId: 'FAC004',
      designation: 'Assistant Professor',
      hourlyRate: 750,
    },
    {
      email: 'david.wilson@university.edu',
      name: 'Dr. David Wilson',
      password: facultyPassword,
      role: 'faculty' as const,
      departmentId: deptMap.get('CIVL')!,
      employeeId: 'FAC005',
      designation: 'Associate Professor',
      hourlyRate: 800,
    },
  ];

  for (const faculty of facultyData) {
    await db.insert(users).values(faculty);
  }

  console.log('✅ Database seeded successfully!');
  console.log('📋 Test Accounts:');
  console.log('   Admin: admin@university.edu / admin123');
  console.log('   Faculty: john.smith@university.edu / faculty123');
  console.log('   Faculty: sarah.johnson@university.edu / faculty123');
}

seed().catch(console.error);