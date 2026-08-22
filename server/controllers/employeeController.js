const User = require('../models/User');

// GET All Employees (Admin & HR only)
exports.getAllEmployees = async (req, res) => {
  try {
    const { search, department, role, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
      ];
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const sortOptions = {};
    if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'dateOfJoining') {
      sortOptions.dateOfJoining = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'department') {
      sortOptions.department = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const employees = await User.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: employees.length,
      employees: employees.map((emp) => emp.toAuthJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employees list.' });
  }
};

// GET Employee Profile
exports.getProfile = async (req, res) => {
  try {
    const targetId = req.params.id || req.user.id;
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    // Protect salary information if non-admin/hr tries to view another employee's profile
    const isSelf = req.user.id === targetId || req.user.id === user._id.toString();
    const isAdminOrHr = req.user.role === 'admin' || req.user.role === 'hr';

    const profileData = user.toAuthJSON();
    if (!isSelf && !isAdminOrHr) {
      delete profileData.salaryStructure;
    }

    res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

// UPDATE Employee Profile
exports.updateProfile = async (req, res) => {
  try {
    const targetId = req.params.id || req.user.id;
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    const isSelf = req.user.id === targetId || req.user.id === user._id.toString();
    const isAdminOrHr = req.user.role === 'admin' || req.user.role === 'hr';

    if (!isSelf && !isAdminOrHr) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges.' });
    }

    const {
      name,
      phone,
      address,
      dob,
      gender,
      emergencyContact,
      avatarUrl,
      jobTitle,
      department,
      manager,
      employmentType,
      workLocation,
      dateOfJoining,
      status,
      salaryStructure,
    } = req.body;

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    if (isAdminOrHr) {
      if (name !== undefined) user.name = name;
      if (dob !== undefined) user.dob = dob;
      if (gender !== undefined) user.gender = gender;
      if (jobTitle !== undefined) user.jobTitle = jobTitle;
      if (department !== undefined) user.department = department;
      if (manager !== undefined) user.manager = manager;
      if (employmentType !== undefined) user.employmentType = employmentType;
      if (workLocation !== undefined) user.workLocation = workLocation;
      if (dateOfJoining !== undefined) user.dateOfJoining = dateOfJoining;
      if (status !== undefined) user.status = status;
      if (salaryStructure !== undefined) {
        user.salaryStructure = { ...user.salaryStructure, ...salaryStructure };
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully.',
      profile: user.toAuthJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update profile.' });
  }
};

// DELETE / DEACTIVATE Employee (Admin & HR Only)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Prevent self-deletion
    if (req.user.id === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own active account.' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Employee account (${user.name}) deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete employee account.' });
  }
};

// ADD Document to Profile
exports.addDocument = async (req, res) => {
  try {
    const targetId = req.params.id || req.user.id;
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const { name, type, fileUrl } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Document name and type are required.' });
    }

    const newDoc = {
      name,
      type,
      fileUrl: fileUrl || '#',
      status: 'Verified',
      uploadDate: new Date(),
    };

    user.documents.push(newDoc);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully.',
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add document.' });
  }
};

// DELETE Document
exports.deleteDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const user = await User.findById(id || req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    user.documents = user.documents.filter((doc) => doc._id.toString() !== docId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully.',
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete document.' });
  }
};

// CREATE Employee Account (Admin / HR Only)
exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, password, role, department, jobTitle, phone, workLocation } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Employee ID, Name, Email and Password are required.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }

    const existingId = await User.findOne({ employeeId });
    if (existingId) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists.' });
    }

    const newUser = await User.create({
      employeeId,
      name,
      email,
      password,
      role: role || 'employee',
      department: department || 'Engineering',
      jobTitle: jobTitle || 'Software Engineer',
      phone: phone || '',
      workLocation: workLocation || 'Office',
      status: 'active',
      isEmailVerified: true,
    });

    res.status(201).json({
      success: true,
      message: `${newUser.role.toUpperCase()} account created successfully for ${newUser.name}.`,
      employee: newUser.toAuthJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create employee account.' });
  }
};

// GET Payroll Breakdown for All Employees (Admin & HR Only)
exports.getPayrollAll = async (req, res) => {
  try {
    const employees = await User.find().sort({ name: 1 });

    const payrollList = employees.map((emp) => {
      const s = emp.salaryStructure || {};
      const baseSalary = s.baseSalary || 100000;
      const housingAllowance = s.housingAllowance || 15000;
      const transportAllowance = s.transportAllowance || 5000;
      const bonus = s.bonus || 0;
      const deductions = s.deductions || 8000;

      const grossSalary = baseSalary + housingAllowance + transportAllowance + bonus;
      const netSalary = Math.max(0, grossSalary - deductions);

      return {
        id: emp._id,
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        jobTitle: emp.jobTitle,
        department: emp.department,
        status: emp.status,
        salaryStructure: {
          baseSalary,
          housingAllowance,
          transportAllowance,
          bonus,
          deductions,
          grossSalary,
          netSalary,
          paymentMethod: s.paymentMethod || 'Direct Bank Transfer',
          bankAccount: s.bankAccount || '•••• •••• 8842',
        },
      };
    });

    res.status(200).json({
      success: true,
      count: payrollList.length,
      payroll: payrollList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll list.' });
  }
};

// UPDATE Salary Structure (Admin & HR Only)
exports.updateSalaryStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const { baseSalary, housingAllowance, transportAllowance, bonus, deductions, paymentMethod, bankAccount } = req.body;

    user.salaryStructure = {
      baseSalary: Number(baseSalary) || user.salaryStructure?.baseSalary || 0,
      housingAllowance: Number(housingAllowance) || user.salaryStructure?.housingAllowance || 0,
      transportAllowance: Number(transportAllowance) || user.salaryStructure?.transportAllowance || 0,
      bonus: Number(bonus) || user.salaryStructure?.bonus || 0,
      deductions: Number(deductions) || user.salaryStructure?.deductions || 0,
      paymentMethod: paymentMethod || user.salaryStructure?.paymentMethod || 'Direct Bank Transfer',
      bankAccount: bankAccount || user.salaryStructure?.bankAccount || '',
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: `Salary structure updated for ${user.name}.`,
      salaryStructure: user.salaryStructure,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update salary structure.' });
  }
};
