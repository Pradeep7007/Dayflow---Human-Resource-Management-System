const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing demo users...');
    await User.deleteMany({ email: { $in: ['admin@dayflow.com', 'hr@dayflow.com', 'alex.morgan@dayflow.com'] } });

    console.log('[Seed] Creating seed accounts...');
    
    await User.create([
      {
        employeeId: 'ADM-001',
        name: 'Sarah Jenkins',
        email: 'admin@dayflow.com',
        password: 'adminPass123!',
        role: 'admin',
        isEmailVerified: true,
      },
      {
        employeeId: 'HR-001',
        name: 'Rachel Adams',
        email: 'hr@dayflow.com',
        password: 'hrPass123!',
        role: 'hr',
        isEmailVerified: true,
      },
      {
        employeeId: 'EMP-1001',
        name: 'Alex Morgan',
        email: 'alex.morgan@dayflow.com',
        password: 'empPass123!',
        role: 'employee',
        isEmailVerified: true,
      },
    ]);

    console.log('[Seed] Seed Users Created Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedUsers();
