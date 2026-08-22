const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

dotenv.config({ path: require('path').resolve(__dirname, '.env') });

const seedUsersAndAttendance = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing demo users, attendance, and leave records...');
    await User.deleteMany({
      email: {
        $in: [
          'pradeep@dayflow.com',
          'kishore@dayflow.com',
          'tharun@dayflow.com',
          'ananya@dayflow.com',
          'rajesh@dayflow.com',
          'priya@dayflow.com',
          'admin@dayflow.com',
          'hr@dayflow.com',
          'alex.morgan@dayflow.com',
        ],
      },
    });
    await Attendance.deleteMany({});
    await Leave.deleteMany({});

    console.log('[Seed] Seeding Indian Workforce Accounts...');

    const users = await User.create([
      {
        employeeId: 'ADM-001',
        name: 'Pradeep S',
        email: 'pradeep@dayflow.com',
        password: 'adminpass123',
        role: 'admin',
        isEmailVerified: true,
        phone: '+91 98765 43210',
        address: '12 MG Road, Bengaluru, Karnataka 560001',
        jobTitle: 'System Administrator & HR Director',
        department: 'Executive Leadership',
        manager: 'Board of Directors',
        employmentType: 'Full-Time',
        workLocation: 'Bengaluru HQ',
        dateOfJoining: new Date('2020-01-15'),
        status: 'active',
        salaryStructure: {
          baseSalary: 1800000,
          housingAllowance: 250000,
          transportAllowance: 100000,
          bonus: 200000,
          deductions: 150000,
          paymentMethod: 'Direct Bank Transfer',
          bankAccount: '•••• •••• •••• 9901 (HDFC Bank)',
        },
        documents: [
          { name: 'Executive Employment Contract', type: 'Employment Agreement', uploadDate: new Date('2020-01-15'), status: 'Verified' },
          { name: 'Form 16 Tax Statement 2025', type: 'Tax Document', uploadDate: new Date('2026-01-20'), status: 'Verified' },
        ],
      },
      {
        employeeId: 'HR-001',
        name: 'Kishore M',
        email: 'kishore@dayflow.com',
        password: 'hrpass123',
        role: 'hr',
        isEmailVerified: true,
        phone: '+91 98765 12345',
        address: '45 Anna Salai, Chennai, Tamil Nadu 600002',
        jobTitle: 'Senior HR Manager',
        department: 'Human Resources',
        manager: 'Pradeep S',
        employmentType: 'Full-Time',
        workLocation: 'Chennai Campus',
        dateOfJoining: new Date('2021-06-01'),
        status: 'active',
        salaryStructure: {
          baseSalary: 1200000,
          housingAllowance: 180000,
          transportAllowance: 60000,
          bonus: 120000,
          deductions: 90000,
          paymentMethod: 'Direct Bank Transfer',
          bankAccount: '•••• •••• •••• 4421 (ICICI Bank)',
        },
        documents: [
          { name: 'HR Manager Offer Letter', type: 'Offer Letter', uploadDate: new Date('2021-06-01'), status: 'Verified' },
          { name: 'Aadhaar & PAN Verification', type: 'Identity Proof', uploadDate: new Date('2021-06-02'), status: 'Verified' },
        ],
      },
      {
        employeeId: 'EMP-1001',
        name: 'Tharun R',
        email: 'tharun@dayflow.com',
        password: 'emppass123',
        role: 'employee',
        isEmailVerified: true,
        phone: '+91 91234 56789',
        address: '74 Jubilee Hills, Hyderabad, Telangana 500033',
        jobTitle: 'Senior Software Engineer',
        department: 'Engineering & Product',
        manager: 'Pradeep S',
        employmentType: 'Full-Time',
        workLocation: 'Hyderabad Hub / Hybrid',
        dateOfJoining: new Date('2022-03-01'),
        status: 'active',
        salaryStructure: {
          baseSalary: 1100000,
          housingAllowance: 150000,
          transportAllowance: 50000,
          bonus: 100000,
          deductions: 80000,
          paymentMethod: 'Direct Bank Transfer',
          bankAccount: '•••• •••• •••• 8842 (Axis Bank)',
        },
        documents: [
          { name: 'Senior Software Engineer Offer Letter', type: 'Offer Letter', uploadDate: new Date('2022-03-01'), status: 'Verified' },
          { name: 'Passport & Identity Verification', type: 'Identity Proof', uploadDate: new Date('2022-03-02'), status: 'Verified' },
          { name: 'Form 12BB Investment Declaration', type: 'Tax Form', uploadDate: new Date('2022-03-05'), status: 'Verified' },
        ],
      },
      {
        employeeId: 'EMP-1002',
        name: 'Ananya Sharma',
        email: 'ananya@dayflow.com',
        password: 'emppass123',
        role: 'employee',
        isEmailVerified: true,
        phone: '+91 99887 76655',
        address: '88 Cyber City, Gurugram, Haryana 122002',
        jobTitle: 'UI/UX Product Designer',
        department: 'Design & User Experience',
        manager: 'Kishore M',
        employmentType: 'Full-Time',
        workLocation: 'Gurugram Office',
        dateOfJoining: new Date('2023-01-10'),
        status: 'active',
      },
      {
        employeeId: 'EMP-1003',
        name: 'Rajesh Kumar',
        email: 'rajesh@dayflow.com',
        password: 'emppass123',
        role: 'employee',
        isEmailVerified: true,
        phone: '+91 97766 55443',
        address: '55 Connaught Place, New Delhi 110001',
        jobTitle: 'DevOps & Cloud Engineer',
        department: 'Infrastructure',
        manager: 'Pradeep S',
        employmentType: 'Full-Time',
        workLocation: 'Remote',
        dateOfJoining: new Date('2023-04-15'),
        status: 'active',
      },
      {
        employeeId: 'EMP-1004',
        name: 'Priya Patel',
        email: 'priya@dayflow.com',
        password: 'emppass123',
        role: 'employee',
        isEmailVerified: true,
        phone: '+91 96655 44332',
        address: '101 SG Highway, Ahmedabad, Gujarat 380015',
        jobTitle: 'QA Lead Automation Specialist',
        department: 'Quality Assurance',
        manager: 'Kishore M',
        employmentType: 'Full-Time',
        workLocation: 'Ahmedabad Branch',
        dateOfJoining: new Date('2023-08-01'),
        status: 'active',
      },
    ]);

    console.log('[Seed] Seeding Attendance History Records...');

    const attendanceEntries = [];
    for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(0, 0, 0, 0);

      if (date.getDay() === 0 || date.getDay() === 6) continue;

      users.forEach((user, index) => {
        let status = 'Present';
        let checkIn = '09:00 AM';
        let checkOut = '06:00 PM';
        let workingHours = 8.5;

        if (dayOffset === 1 && index === 2) {
          status = 'Half-day';
          checkIn = '10:15 AM';
          checkOut = '03:30 PM';
          workingHours = 4.5;
        } else if (dayOffset === 2 && index === 3) {
          status = 'Leave';
          checkIn = null;
          checkOut = null;
          workingHours = 0;
        }

        attendanceEntries.push({
          user: user._id,
          employeeId: user.employeeId,
          employeeName: user.name,
          department: user.department || 'Engineering',
          date,
          checkIn,
          checkOut,
          workingHours,
          status,
          remarks: status === 'Leave' ? 'Approved Casual Leave' : status === 'Half-day' ? 'Late Arrival' : '',
        });
      });
    }

    await Attendance.insertMany(attendanceEntries);

    console.log('[Seed] Seeding Sample Leave Requests...');

    const tharun = users.find((u) => u.email === 'tharun@dayflow.com');
    const ananya = users.find((u) => u.email === 'ananya@dayflow.com');
    const rajesh = users.find((u) => u.email === 'rajesh@dayflow.com');

    await Leave.create([
      {
        user: tharun._id,
        employeeId: tharun.employeeId,
        employeeName: tharun.name,
        department: tharun.department,
        leaveType: 'Paid',
        startDate: new Date('2026-09-10'),
        endDate: new Date('2026-09-12'),
        daysCount: 3,
        reason: 'Attending family wedding in Chennai.',
        status: 'Pending',
      },
      {
        user: tharun._id,
        employeeId: tharun.employeeId,
        employeeName: tharun.name,
        department: tharun.department,
        leaveType: 'Sick',
        startDate: new Date('2026-08-05'),
        endDate: new Date('2026-08-06'),
        daysCount: 2,
        reason: 'Viral flu and doctor prescribed rest.',
        status: 'Approved',
        adminComment: 'Get well soon!',
        reviewedBy: 'Kishore M',
        reviewedAt: new Date('2026-08-05'),
      },
      {
        user: ananya._id,
        employeeId: ananya.employeeId,
        employeeName: ananya.name,
        department: ananya.department,
        leaveType: 'Paid',
        startDate: new Date('2026-09-15'),
        endDate: new Date('2026-09-19'),
        daysCount: 5,
        reason: 'Annual vacation to Kerala.',
        status: 'Pending',
      },
      {
        user: rajesh._id,
        employeeId: rajesh.employeeId,
        employeeName: rajesh.name,
        department: rajesh.department,
        leaveType: 'Unpaid',
        startDate: new Date('2026-08-25'),
        endDate: new Date('2026-08-26'),
        daysCount: 2,
        reason: 'Personal urgent business in Delhi.',
        status: 'Pending',
      },
    ]);

    console.log('[Seed] Seeding Complete! Accounts, Attendance & Leave Workspace Ready.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedUsersAndAttendance();
