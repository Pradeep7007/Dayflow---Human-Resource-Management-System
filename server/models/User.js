const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Offer Letter', 'Tax Document', 'Identity Proof'
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Verified' },
  fileUrl: { type: String, default: '#' },
});

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'hr', 'employee'],
        message: '{VALUE} is not a valid role. Allowed: admin, hr, employee',
      },
      default: 'employee',
      lowercase: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    address: {
      type: String,
      default: '742 Evergreen Terrace, Springfield, OR 97477',
    },
    dob: {
      type: Date,
      default: () => new Date('1992-05-15'),
    },
    gender: {
      type: String,
      default: 'Female',
    },
    emergencyContact: {
      name: { type: String, default: 'Mark Morgan' },
      phone: { type: String, default: '+1 (555) 987-6543' },
      relation: { type: String, default: 'Spouse' },
    },
    // Job Information
    jobTitle: {
      type: String,
      default: 'Senior Software Engineer',
    },
    department: {
      type: String,
      default: 'Engineering & Product',
    },
    manager: {
      type: String,
      default: 'Sarah Jenkins (Director)',
    },
    employmentType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'],
      default: 'Full-Time',
    },
    workLocation: {
      type: String,
      default: 'San Francisco HQ / Hybrid',
    },
    dateOfJoining: {
      type: Date,
      default: () => new Date('2022-03-01'),
    },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'inactive', 'pending'],
      default: 'active',
    },
    // Salary Structure
    salaryStructure: {
      baseSalary: { type: Number, default: 125000 },
      housingAllowance: { type: Number, default: 15000 },
      transportAllowance: { type: Number, default: 5000 },
      bonus: { type: Number, default: 10000 },
      deductions: { type: Number, default: 8000 },
      paymentMethod: { type: String, default: 'Direct Bank Transfer' },
      bankAccount: { type: String, default: '•••• •••• •••• 8842 (Chase Bank)' },
    },
    // Documents
    documents: [documentSchema],

    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to format user response safely
userSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    employeeId: this.employeeId,
    name: this.name,
    email: this.email,
    role: this.role,
    avatarUrl: this.avatarUrl,
    phone: this.phone,
    address: this.address,
    dob: this.dob,
    gender: this.gender,
    emergencyContact: this.emergencyContact,
    jobTitle: this.jobTitle,
    department: this.department,
    manager: this.manager,
    employmentType: this.employmentType,
    workLocation: this.workLocation,
    dateOfJoining: this.dateOfJoining,
    status: this.status,
    salaryStructure: this.salaryStructure,
    documents: this.documents,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
