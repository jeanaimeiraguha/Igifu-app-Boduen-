import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// fimport React from "react";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800 font-sans flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-5 px-8 bg-white shadow-md fixed top-0 z-50">
        <h1 className="text-2xl font-bold text-green-700">🌿 Igifu Platform</h1>
        <ul className="hidden md:flex space-x-8 font-medium">
          <li><a href="#home" className="hover:text-green-600 transition">Home</a></li>
          <li><a href="#about" className="hover:text-green-600 transition">About</a></li>
          <li><a href="#services" className="hover:text-green-600 transition">Services</a></li>
          <li><a href="#contact" className="hover:text-green-600 transition">Contact</a></li>
        </ul>
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col items-center justify-center text-center mt-32 px-6"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-green-700 mb-4">
          Welcome to Igifu Platform
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mb-8">
          Empowering communities through technology and innovation. Explore how
          Igifu Platform connects people, ideas, and sustainable growth across
          Rwanda and beyond.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-green-700 transition-transform hover:scale-105">
            Join Now
          </button>
          <button className="border border-green-600 text-green-600 px-8 py-3 rounded-full hover:bg-green-50 transition-transform hover:scale-105">
            Learn More
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-5xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">About Us</h2>
        <p className="text-gray-600 leading-relaxed">
          Igifu Platform is a digital hub that promotes innovation, technology,
          and collaboration. We aim to empower individuals, startups, and
          organizations by providing access to resources, mentorship, and
          cutting-edge digital solutions.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white w-full py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Digital Solutions</h3>
              <p className="text-gray-600">
                Web, mobile, and blockchain-based systems designed to improve
                connectivity and sustainability.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Training & Mentorship</h3>
              <p className="text-gray-600">
                We equip youth and professionals with practical digital skills
                and guidance to thrive in modern industries.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Innovation Programs</h3>
              <p className="text-gray-600">
                Supporting creative minds and startups to build impactful
                solutions that drive real-world change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-5xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-8">
          Have questions or want to collaborate? Let’s work together to build
          something great.
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-green-700 transition">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="w-full bg-green-700 text-white text-center py-6 mt-10">
        <p className="text-sm">
          © {new Date().getFullYear()} Igifu Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
