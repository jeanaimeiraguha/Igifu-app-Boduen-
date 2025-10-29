import React, { useState } from "react";
import { FaLock, FaArrowRight, FaQuestionCircle, FaUser, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('roleSelection'); // 'roleSelection', 'form'
  const [selectedRole, setSelectedRole] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    otherNames: "",
    username: "",
    email: "",
    pin: "",
    confirmPin: "",
    rememberMe: false,
  });

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentStep('form');
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('roleSelection');
    setSelectedRole('');
    setFormData({
      firstName: "",
      otherNames: "",
      username: "",
      email: "",
      pin: "",
      confirmPin: "",
      rememberMe: false,
    });
    setIsLogin(false);
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

    if (isLogin) {
      // --- NEW FEATURE: Specific PIN check for login ---
      if (selectedRole === 'student') {
        if (formData.pin === 'student') {
          console.log("Student login successful");
          navigate("/igifu-dashboard");
        } else {
          alert("Incorrect PIN for student. Please use 'student' to log in.");
        }
      } else if (selectedRole === 'restaurant') {
        if (formData.pin === 'restaurent') {
          console.log("Restaurant owner login successful");
          navigate("/restaurentdashboard");
        } else {
          alert("Incorrect PIN for restaurant owner. Please use 'restaurent' to log in.");
        }
      }
    } else {
      // --- NEW FEATURE: PIN confirmation only for students on sign-up ---
      if (selectedRole === 'student' && formData.pin !== formData.confirmPin) {
        alert("PINs do not match! Please re-enter.");
        return; // Stop the form submission
      }
      
      console.log("Sign Up Data:", { ...formData, role: selectedRole });
      alert("Sign Up Submitted! You can now log in using the specific PIN for your role.");
      setIsLogin(true); // Switch to login form
    }
  };

  // Role Selection Screen
  if (currentStep === 'roleSelection') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative py-6 font-sans">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition flex items-center"
        >
          <span className="mr-2">←</span> Back
        </button>

        {/* Header */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Igifu</h2>
          <p className="text-gray-500 text-sm">Choose how you want to join us</p>
        </div>

        {/* Role Selection Cards */}
        <div className="w-full max-w-md mt-8 space-y-4 px-4">
          {/* Student Option */}
          <button
            onClick={() => handleRoleSelection('student')}
            className="w-full p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaUser className="text-blue-600 text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">I'm a Student</h3>
                <p className="text-gray-500 text-sm">Join to order food from restaurants</p>
              </div>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Restaurant Owner Option */}
          <button
            onClick={() => handleRoleSelection('restaurant')}
            className="w-full p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaUtensils className="text-blue-600 text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">I'm a Restaurant Owner</h3>
                <p className="text-gray-500 text-sm">Register your restaurant with us</p>
              </div>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-2">
            Need help? We're here to assist you.
          </p>
          <button className="bg-transparent border border-blue-600 text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition flex items-center mx-auto">
            Contact Us <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Form Screen (existing form with role context)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative py-6 font-sans">
      {/* Back Button */}
      <button onClick={handleBackToRoleSelection} className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition flex items-center" >
        <span className="mr-2">←</span> Back to role selection
      </button>

      {/* Header with Role Context */}
      <div className="text-center mt-12">
        <div className="flex items-center justify-center mb-2">
          {selectedRole === 'student' ? (
            <FaUser className="text-blue-600 text-2xl mr-2" />
          ) : (
            <FaUtensils className="text-blue-600 text-2xl mr-2" />
          )}
          <h4 className="font-bold">
            <button
              className={`mr-2 ${!isLogin ? "text-blue-600" : "text-gray-800"}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            |
            <button
              className={`ml-2 ${isLogin ? "text-blue-600" : "text-gray-800"}`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
          </h4>
        </div>
        <p className="text-gray-500 text-sm">
          {isLogin
            ? `Welcome back, ${selectedRole === 'student' ? 'Student' : 'Restaurant Owner'}!`
            : `${selectedRole === 'student' ? 'Student' : 'Restaurant Owner'} - Sign up for Free :)`
          }
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mt-6 bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Other name(s)"
              name="otherNames"
              value={formData.otherNames}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative">
              <input
                type="text"
                placeholder={selectedRole === 'student' ? 'Username' : 'Restaurant Name'}
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 pr-10 focus:ring-2 focus:ring-blue-500"
                required
              />
              <FaQuestionCircle className="absolute top-1/2 right-3 -translate-y-1/2 text-yellow-500" />
            </div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </>
        )}

        {isLogin && (
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={selectedRole === 'student' ? 'Username or Email' : 'Restaurant Name or Email'}
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div className="relative flex items-center">
          <FaLock className="absolute left-3 text-green-500" />
          <input
            type="password"
            placeholder={isLogin ? "Enter PIN" : "Create PIN"}
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
          <FaQuestionCircle className="absolute right-3 text-yellow-500" />
        </div>

        {/* --- NEW FEATURE: This "Retype PIN" field only shows for students on sign-up --- */}
        {!isLogin && selectedRole === 'student' && (
          <div className="relative flex items-center">
            <FaLock className="absolute left-3 text-green-500" />
            <input
              type="password"
              placeholder="Retype PIN"
              name="confirmPin"
              value={formData.confirmPin}
              onChange={handleChange}
              className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required // This 'required' only applies when the field is visible
            />
            <FaQuestionCircle className="absolute right-3 text-yellow-500" />
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleCheckboxChange}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-gray-700 text-sm">Remember me</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold text-lg hover:bg-blue-700 transition"
        >
          {isLogin ? "Log In" : "Sign Up"} as {selectedRole === 'student' ? 'Student' : 'Restaurant Owner'}
        </button>

        {!isLogin && (
          <p className="text-center text-gray-500 text-xs">
            By submitting, you agree to the{" "}
            <a href="/terms" className="text-blue-600 font-semibold underline">
              Terms of Use
            </a>
          </p>
        )}
      </form>

      {/* Role-specific footer message */}
      <div className="text-center mt-4">
        {selectedRole === 'student' ? (
          <p className="text-gray-500 text-sm">
            Are you a restaurant owner?{" "}
            <button
              onClick={() => handleRoleSelection('restaurant')}
              className="text-blue-600 font-semibold underline hover:text-blue-700"
            >
              Switch to restaurant registration
            </button>
          </p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-2">
              Need help with restaurant registration? We do all the work for you.
            </p>
            <button className="bg-transparent border border-blue-600 text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition flex items-center mx-auto">
              Contact Us <FaArrowRight className="ml-2" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;