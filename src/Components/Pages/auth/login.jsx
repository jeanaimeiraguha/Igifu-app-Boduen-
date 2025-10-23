import React, { useState } from 'react';
import { FaArrowLeft, FaLock, FaEnvelope, FaUser, FaUtensils } from 'react-icons/fa';

const LogInPage = () => {
  const [currentStep, setCurrentStep] = useState('roleSelection'); // 'roleSelection' or 'login'
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    pin: '',
    rememberMe: false,
  });

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentStep('login');
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('roleSelection');
    setSelectedRole('');
    setFormData({ email: '', pin: '', rememberMe: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', { ...formData, role: selectedRole });
    // Add your login logic here
  };

  // Role Selection Screen
  if (currentStep === 'roleSelection') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        {/* Back Button */}
        <div className="w-full max-w-md mb-6">
          <button className="flex items-center text-blue-600 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        {/* Role Selection Card */}
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome to Igifu</h2>
          <p className="text-center text-gray-500 mb-8">Choose your login type</p>

          <div className="space-y-4">
            {/* Student Option */}
            <button
              onClick={() => handleRoleSelection('student')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <FaUser className="text-blue-600 text-xl" />
              <span className="text-lg font-medium text-gray-700">Login as Student</span>
            </button>

            {/* Restaurant Owner Option */}
            <button
              onClick={() => handleRoleSelection('restaurant')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <FaUtensils className="text-blue-600 text-xl" />
              <span className="text-lg font-medium text-gray-700">Login as Restaurant Owner</span>
            </button>
          </div>

          {/* Registration Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login Form Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Back Button */}
      <div className="w-full max-w-md mb-6">
        <button 
          onClick={handleBackToRoleSelection}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to role selection
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        {/* Title with Role Indicator */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            {selectedRole === 'student' ? (
              <FaUser className="text-blue-600 text-2xl mr-2" />
            ) : (
              <FaUtensils className="text-blue-600 text-2xl mr-2" />
            )}
            <h2 className="text-2xl font-bold">
              {selectedRole === 'student' ? 'Student' : 'Restaurant Owner'} Login
            </h2>
          </div>
          <p className="text-gray-500">Access your Igifu account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-blue-500">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label htmlFor="pin" className="block text-gray-700 mb-1">
              PIN
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-blue-500">
              <input
                type="password"
                id="pin"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter PIN"
                className="w-full outline-none text-gray-700"
                required
              />
              <FaLock className="text-gray-400 ml-2" />
            </div>
          </div>

          {/* Forgot PIN */}
          <div className="text-right">
            <a href="/forgot-pin" className="text-blue-600 text-sm hover:underline">
              Forgot PIN?
            </a>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Log In as {selectedRole === 'student' ? 'Student' : 'Restaurant Owner'}
          </button>

          {/* Registration Link */}
          <p className="text-center text-gray-500 text-sm mt-4">
            {selectedRole === 'restaurant' ? (
              <>
                Want to register your restaurant?{' '}
                <a href="/contact" className="text-blue-600 hover:underline">
                  Contact Us
                </a>
              </>
            ) : (
              <>
                Don't have a student account?{' '}
                <a href="/register" className="text-blue-600 hover:underline">
                  Sign up here
                </a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogInPage;