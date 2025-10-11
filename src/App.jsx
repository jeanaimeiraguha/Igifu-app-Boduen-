import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomePage from "./Components/WelcomePages/Home";
import LogInPage from "./Components/WelcomePages/Loginpage";
import SignUpPage from "./Components/WelcomePages/Signup";
import MealWallet from "./Components/WelcomePages/14cpage";
import MealWalletApp from "./Components/WelcomePages/15page";
import FavouritesScreen from "./Components/WelcomePages/c";
import RestaurantBrowseApp from "./Components/WelcomePages/fo";
import IgifuMealCard from "./Components/WelcomePages/Home7";
import MealWalletApphome from "./Components/WelcomePages/Home8";
import MealPage from "./Components/WelcomePages/MealPage";
import MealWalletpage10 from "./Components/WelcomePages/page10";
import MealWalletpage14 from "./Components/WelcomePages/Page14";
import MealWallet14 from "./Components/WelcomePages/page14b";
import MealWallet14d from "./Components/WelcomePages/page14d";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Auth Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* ✅ Meal and Wallet Pages */}
        <Route path="/meal-wallet" element={<MealWallet />} />
        <Route path="/meal-wallet-app" element={<MealWalletApp />} />
        <Route path="/meal-page" element={<MealPage />} />

        {/* ✅ Restaurant & Favourites */}
        <Route path="/favourites" element={<FavouritesScreen />} />
        <Route path="/browse" element={<RestaurantBrowseApp />} />

        {/* ✅ Igifu Home Pages */}
        <Route path="/igifu-card" element={<IgifuMealCard />} />
        <Route path="/home-wallet" element={<MealWalletApphome />} />
        <Route path="/wallet-page10" element={<MealWalletpage10 />} />
        <Route path="/wallet-page14" element={<MealWalletpage14 />} />
        <Route path="/wallet14" element={<MealWallet14 />} />
        <Route path="/wallet14d" element={<MealWallet14d />} />
      </Routes>
    </Router>
  );
}

export default App;
