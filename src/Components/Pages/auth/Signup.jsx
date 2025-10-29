import React, { useState } from "react";
// --- NEW IMPORTS ---
import {
  FaLock,
  FaArrowRight,
  FaQuestionCircle,
  FaUser,
  FaUtensils,
  FaSpinner, // Icon for loading
  FaCheck, // Icon for success
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// --- NEW IMPORTS ---
import toast, { Toaster } from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("roleSelection"); // 'roleSelection', 'form'
  const [selectedRole, setSelectedRole] = useState("");
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

  // --- NEW STATE FOR ANIMATIONS ---
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentStep("form");
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep("roleSelection");
    setSelectedRole("");
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
    setIsLoading(true); // Start loading animation
    setLoginSuccess(false); // Reset success state

    // A small delay to simulate a network request and show the animation
    setTimeout(() => {
      if (isLogin) {
        let isSuccess = false;
        let path = "/";

        if (selectedRole === "student") {
          if (formData.pin === "student") {
            console.log("Student login successful");
            toast.success("Login Successful! Redirecting...");
            isSuccess = true;
            path = "/igifu-dashboard";
          } else {
            toast.error("Incorrect PIN for student.");
          }
        } else if (selectedRole === "restaurant") {
          if (formData.pin === "restaurent") {
            console.log("Restaurant owner login successful");
            toast.success("Login Successful! Redirecting...");
            isSuccess = true;
            path = "/restaurentdashboard";
          } else {
            toast.error("Incorrect PIN for restaurant owner.");
          }
        }

        if (isSuccess) {
          setLoginSuccess(true); // Trigger success animation on button
          setIsLoading(false); // Stop loading spinner
          // Wait for success animation to show, then navigate
          setTimeout(() => {
            navigate(path);
          }, 1500); // 1.5 second delay
        } else {
          setIsLoading(false); // Stop loading on failure
        }
      } else {
        // Sign Up Logic
        if (selectedRole === "student" && formData.pin !== formData.confirmPin) {
          toast.error("PINs do not match! Please re-enter.");
          setIsLoading(false); // Stop loading
          return;
        }

        console.log("Sign Up Data:", { ...formData, role: selectedRole });
        toast.success("Sign Up Submitted! You can now log in.");
        setIsLoading(false); // Stop loading
        setIsLogin(true); // Switch to login form
      }
    }, 1000); // 1-second simulated delay
  };

  // Role Selection Screen
  if (currentStep === "roleSelection") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative py-6 font-sans">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition flex items-center"
        >
          <span className="mr-2">←</span> Back
        </button>

        {/* Header */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Igifu
          </h2>
          <p className="text-gray-500 text-sm">
            Choose how you want to join us
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="w-full max-w-md mt-8 space-y-4 px-4">
          <button
            onClick={() => handleRoleSelection("student")}
            className="w-full p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaUser className="text-blue-600 text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  I'm a Student
                </h3>
                <p className="text-gray-500 text-sm">
                  Join to order food from restaurants
                </p>
              </div>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={() => handleRoleSelection("restaurant")}
            className="w-full p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaUtensils className="text-blue-600 text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  I'm a Restaurant Owner
                </h3>
                <p className="text-gray-500 text-sm">
                  Register your restaurant with us
                </p>
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
  // Form Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative py-6 font-sans">
      {/* --- THIS COMPONENT IS REQUIRED FOR TOASTS TO APPEAR --- */}
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={handleBackToRoleSelection}
        className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition flex items-center"
      >
        <span className="mr-2">←</span> Back to role selection
      </button>

      {/* Header with Role Context */}
      <div className="text-center mt-12">
        <div className="flex items-center justify-center mb-2">
          {selectedRole === "student" ? (
            <FaUser className="text-blue-600 text-2xl mr-2" />
          ) : (
            <FaUtensils className="text-blue-600 text-2xl mr-2" />
          )}
          <h4 className="font-bold">
            <button
              className={`mr-2 ${
                !isLogin ? "text-blue-600" : "text-gray-800"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>{" "}
            |{" "}
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
            ? `Welcome back, ${
                selectedRole === "student" ? "Student" : "Restaurant Owner"
              }!`
            : `${
                selectedRole === "student" ? "Student" : "Restaurant Owner"
              } - Sign up for Free :)`}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mt-6 bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        {!isLogin && (
          <>
            {/* Input fields for sign-up */}
          </>
        )}

        {/* ... (Your other input fields remain the same) ... */}
        {/* I'm collapsing them here for brevity but keep them in your code */}

        {!isLogin && (
          <>
            <input type="text" placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
            <input type="text" placeholder="Other name(s)" name="otherNames" value={formData.otherNames} onChange={handleChange} className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
            <div className="relative">
              <input type="text" placeholder={selectedRole === 'student' ? 'Username' : 'Restaurant Name'} name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 rounded-full border border-gray-300 pr-10 focus:ring-2 focus:ring-blue-500" required />
              <FaQuestionCircle className="absolute top-1/2 right-3 -translate-y-1/2 text-yellow-500" />
            </div>
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          </>
        )}

        {isLogin && (
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={selectedRole === 'student' ? 'Username or Email' : 'Restaurant Name or Email'} name="username" value={formData.username} onChange={handleChange} className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          </div>
        )}

        <div className="relative flex items-center">
          <FaLock className="absolute left-3 text-green-500" />
          <input type="password" placeholder={isLogin ? "Enter PIN" : "Create PIN"} name="pin" value={formData.pin} onChange={handleChange} className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <FaQuestionCircle className="absolute right-3 text-yellow-500" />
        </div>

        {!isLogin && selectedRole === 'student' && (
          <div className="relative flex items-center">
            <FaLock className="absolute left-3 text-green-500" />
            <input type="password" placeholder="Retype PIN" name="confirmPin" value={formData.confirmPin} onChange={handleChange} className="w-full px-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
            <FaQuestionCircle className="absolute right-3 text-yellow-500" />
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleCheckboxChange} className="w-4 h-4 accent-blue-600" />
          <span className="text-gray-700 text-sm">Remember me</span>
        </label>


        {/* --- ANIMATED SUBMIT BUTTON --- */}
        <button
          type="submit"
          disabled={isLoading || loginSuccess} // Disable button when loading or on success
          className={`w-full py-2 rounded-full font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center 
            ${loginSuccess ? "bg-green-500" : "bg-blue-600"} 
            ${!isLoading && !loginSuccess ? "hover:bg-blue-700" : ""}
            ${isLoading || loginSuccess ? "cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin text-xl" />
          ) : loginSuccess ? (
            <FaCheck className="text-xl" />
          ) : (
            `${isLogin ? "Log In" : "Sign Up"} as ${
              selectedRole === "student" ? "Student" : "Restaurant Owner"
            }`
          )}
        </button>

        {/* ... (The rest of your code remains the same) ... */}
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
        {selectedRole === "student" ? (
          <p className="text-gray-500 text-sm">
            Are you a restaurant owner?{" "}
            <button
              onClick={() => handleRoleSelection("restaurant")}
              className="text-blue-600 font-semibold underline hover:text-blue-700"
            >
              Switch to restaurant registration
            </button>
          </p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-2">
              Need help with restaurant registration? We do all the work for
              you.
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