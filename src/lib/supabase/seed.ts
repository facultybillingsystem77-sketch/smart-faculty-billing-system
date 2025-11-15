import { supabase } from './client';

export async function seedDatabase() {
  console.log('🌱 Seeding Supabase database...');

  try {
    const departmentsData = [
      { name: 'Artificial Intelligence & Data Science', code: 'AIDS' },
      { name: 'Mechatronics', code: 'MECT' },
      { name: 'Food Technology', code: 'FOOD' },
      { name: 'Electrical Engineering', code: 'ELEC' },
      { name: 'Civil & Infrastructure', code: 'CIVL' },
    ];

    console.log('🏢 Creating departments...');
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .insert(departmentsData)
      .select();

    if (deptError) {
      console.error('Error creating departments:', deptError);
      return;
    }

    console.log(`✅ Created ${departments.length} departments`);

    console.log('📅 Creating academic year...');
    const { data: academicYears, error: ayError } = await supabase
      .from('academic_years')
      .insert([
        {
          year_name: '2024-2025',
          start_date: '2024-07-01',
          end_date: '2025-06-30',
          semester: 'odd',
          is_current: true,
          is_active: true,
        },
      ])
      .select();

    if (ayError) {
      console.error('Error creating academic year:', ayError);
      return;
    }

    console.log('✅ Created academic year');

    console.log('📚 Creating subjects...');
    const subjectsData = [
      {
        name: 'Machine Learning',
        code: 'AIDS101',
        department_id: departments.find((d) => d.code === 'AIDS')?.id,
        credits: 4,
        type: 'theory',
        max_lecture_hours: 60,
        max_practical_hours: 0,
        max_tutorial_hours: 20,
      },
      {
        name: 'Deep Learning Lab',
        code: 'AIDS102',
        department_id: departments.find((d) => d.code === 'AIDS')?.id,
        credits: 2,
        type: 'lab',
        max_lecture_hours: 0,
        max_practical_hours: 40,
        max_tutorial_hours: 0,
      },
      {
        name: 'Robotics Engineering',
        code: 'MECT101',
        department_id: departments.find((d) => d.code === 'MECT')?.id,
        credits: 4,
        type: 'theory',
      },
      {
        name: 'Automation Lab',
        code: 'MECT103',
        department_id: departments.find((d) => d.code === 'MECT')?.id,
        credits: 2,
        type: 'lab',
      },
      {
        name: 'Food Processing',
        code: 'FOOD101',
        department_id: departments.find((d) => d.code === 'FOOD')?.id,
        credits: 3,
        type: 'theory',
      },
    ];

    const { data: subjects, error: subError } = await supabase
      .from('subjects')
      .insert(subjectsData)
      .select();

    if (subError) {
      console.error('Error creating subjects:', subError);
      return;
    }

    console.log(`✅ Created ${subjects.length} subjects`);

    console.log('💰 Creating default salary rate configuration...');
    const { data: rateConfig, error: rateError } = await supabase
      .from('salary_rate_configurations')
      .insert([
        {
          config_name: 'Default Rate 2024-2025',
          lecture_rate: 800.0,
          practical_rate: 600.0,
          tutorial_rate: 400.0,
          is_default: true,
          effective_from: '2024-07-01',
          is_active: true,
        },
      ])
      .select();

    if (rateError) {
      console.error('Error creating rate configuration:', rateError);
    } else {
      console.log('✅ Created default salary rate configuration');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Create users through Supabase Auth');
    console.log('   2. Assign faculty to subjects');
    console.log('   3. Start logging workload entries');
    console.log('\n💡 Use Supabase Dashboard to create your first admin user');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

if (require.main === module) {
  seedDatabase();
}
