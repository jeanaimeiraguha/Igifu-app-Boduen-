import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importing all page components
import Home from './Components/WelcomePages/Home.jsx'
import LoginPage from './Components/WelcomePages/Loginpage.jsx'
import SignupPage from './Components/WelcomePages/Signup.jsx'
import MealPage from './Components/WelcomePages/MealPage.jsx'
import NotFoundPage from './Components/Notfound.jsx'

import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home / WelcomePage Route */}
        <Route path="/" element={<Home />} />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Signup Page Route */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Meal Page Route */}
        <Route path="/meals" element={<MealPage />} />
          <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  )
}

export default App
