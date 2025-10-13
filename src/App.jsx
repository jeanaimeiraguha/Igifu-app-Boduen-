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
import IgifuPurchase from "./Components/WelcomePages/Pyment30";
import IgifuPurchase60 from "./Components/WelcomePages/Payment60";
import UnlockPage from "./Components/WelcomePages/Unlockpage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Welcome */}
        <Route path="/" element={<WelcomePage />} />

        {/* Authentication */}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Meal Wallet */}
        <Route path="/mealwallet" element={<MealWallet />} />
        <Route path="/mealwalletapp" element={<MealWalletApp />} />
        <Route path="/mealwallethome" element={<MealWalletApphome />} />
        <Route path="/mealwallet10" element={<MealWalletpage10 />} />
        <Route path="/mealwallet14" element={<MealWalletpage14 />} />
        <Route path="/mealwallet14b" element={<MealWallet14 />} />
        <Route path="/mealwallet14d" element={<MealWallet14d />} />

        {/* Meal / Restaurant */}
        <Route path="/favourites" element={<FavouritesScreen />} />
        <Route path="/browse" element={<RestaurantBrowseApp />} />
        <Route path="/igifu-mealcard" element={<IgifuMealCard />} />
        <Route path="/mealpage" element={<MealPage />} />

        {/* Payment */}
        <Route path="/purchase30" element={<IgifuPurchase />} />
        <Route path="/purchase60" element={<IgifuPurchase60 />} />

        {/* Unlock */}
        <Route path="/unlock" element={<UnlockPage />} />

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
