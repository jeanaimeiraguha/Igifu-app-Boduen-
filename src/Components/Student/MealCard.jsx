import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaLock, FaQuestionCircle, FaFilter, FaMapMarkerAlt,
  FaHeart, FaRegHeart, FaCaretDown, FaRegClock, FaWalking,
  FaCheckCircle, FaStar, FaShoppingCart, FaCreditCard, FaQrcode,
  FaHistory, FaUserCircle, FaTimes, FaChevronRight, FaInfoCircle,
  FaArrowLeft, FaPlus, FaMinus, FaCog, FaSignOutAlt, FaHeadset,
  FaCalendar, FaCheck, FaSquare, FaCheckSquare, FaBookOpen, FaRedo
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants & Helpers (No changes) ---
const pageMotion = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
};
const modalMotion = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};
const tapAnimation = { scale: 0.95 };

// HINDURA: Iyi ni component nshya y'ikarita nkuru yerekana amafunguro yose n'utuboxi.
const MealWalletCard = ({ wallet, onBuyMeals }) => {
  const { totalMeals, usedCount } = wallet;
  const remaining = totalMeals - usedCount;
  const isCompleted = totalMeals > 0 && remaining <= 0;
  const needsPurchase = totalMeals === 0;

  if (needsPurchase) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
        <FaWallet className="text-5xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Your Meal Wallet is Empty</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-5">Buy meal packs to start eating at any partner restaurant.</p>
        <motion.button whileTap={tapAnimation} onClick={onBuyMeals} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg">
          <FaShoppingCart className="inline mr-2" />
          Buy Meal Pack
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className={`p-6 bg-gradient-to-r ${isCompleted ? 'from-gray-500 to-gray-600' : 'from-blue-600 to-indigo-600'}`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold text-lg">My Meal Wallet</h3>
          <div className="text-white font-bold text-3xl">{remaining} <span className="text-lg opacity-70">Meals Left</span></div>
        </div>
        <div className="bg-white/20 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(usedCount / totalMeals) * 100}%` }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      <div className="p-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Meal Tracker ({usedCount}/{totalMeals})</h4>
        <div className="grid grid-cols-10 gap-2 mb-6">
          {Array.from({ length: totalMeals }).map((_, index) => {
            const isUsed = index < usedCount;
            return (
              <div
                key={index}
                title={`Meal ${index + 1}`}
                className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isUsed
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600'
                }`}
              >
                {isUsed ? <FaCheck className="text-sm" /> : <FaSquare className="text-transparent text-sm" />}
              </div>
            );
          })}
        </div>
        {isCompleted && (
          <div className="text-center bg-gray-100 dark:bg-gray-700 p-5 rounded-xl">
             <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">All Meals Used!</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-4">Time to reload your wallet to continue enjoying meals.</p>
             <motion.button whileTap={tapAnimation} onClick={onBuyMeals} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg">
                <FaShoppingCart className="inline mr-2" />
                Buy More Meals
             </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};


// HINDURA: Modal yo kugura amafunguro (meal packs)
const BuyMealsModal = ({ onClose, onPurchase, processing }) => {
  const MEAL_PRICE = 1000;
  const [mealCount, setMealCount] = useState(15);
  const quickOptions = [10, 15, 30];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Buy Meal Pack</h3>
        <div className="mb-6">
          <label className="text-sm font-bold mb-3 block text-gray-700 dark:text-gray-300">Choose Pack Size</label>
          <div className="grid grid-cols-3 gap-3">
            {quickOptions.map(count => (
              <motion.button key={count} whileTap={tapAnimation} onClick={() => setMealCount(count)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${mealCount === count ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{count}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Meals</div>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white text-base">Total Price</span>
            <span className="font-bold text-xl text-blue-600">RWF {(mealCount * MEAL_PRICE).toLocaleString()}</span>
          </div>
        </div>
        <motion.button whileTap={tapAnimation} onClick={() => onPurchase(mealCount, mealCount * MEAL_PRICE)} disabled={processing}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg disabled:opacity-50">
          {processing ? "Processing..." : `Pay & Add ${mealCount} Meals`}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};


// HINDURA: Modal yerekana amakuru ya restaurant n'ibyo bateka
const RestaurantDetailsModal = ({ restaurant, onClose, onUseMealHere, processing }) => {
  if (!restaurant) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="relative h-48 flex-shrink-0">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <motion.button whileTap={tapAnimation} onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"><FaTimes className="text-xl" /></motion.button>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-3xl font-bold drop-shadow-lg">{restaurant.name}</h2>
            <div className="flex items-center gap-4 text-sm"><span className="flex items-center gap-1.5"><FaStar className="text-yellow-400" /> {restaurant.rating}</span><span className="flex items-center gap-1.5"><FaWalking className="text-green-300" /> {restaurant.walkTime}</span></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">About {restaurant.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{restaurant.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FaBookOpen className="text-blue-500" /> What's on the Menu Today</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {restaurant.menu.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
          <motion.button whileTap={tapAnimation} onClick={() => onUseMealHere(restaurant)} disabled={processing} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
            {processing ? "Using Meal..." : <><FaUtensils /> Use a Meal Here</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// HINDURA: RestaurantCard ubu ifite akabuto ko gukoresha ifunguro ako kanya n'akandi ko kureba details
const RestaurantCard = ({ restaurant, index, onToggleFav, onViewDetails, onUseMealHere }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-[#1a1a15] rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden group">
      <div className="relative h-40 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <motion.button whileTap={tapAnimation} onClick={() => onToggleFav(restaurant.id)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">{restaurant.isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}</motion.button>
        <div className="absolute bottom-3 left-4 text-white z-10">
          <h3 className="text-xl font-bold line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-sm"><FaMapMarkerAlt className="text-xs" /> {restaurant.campus}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5 text-sm"><FaStar className="text-yellow-400" /> <span className="font-bold">{restaurant.rating}</span></div>
          <div className="flex items-center gap-1.5 text-sm"><FaWalking className="text-green-500" /> <span>{restaurant.walkTime}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <motion.button whileTap={tapAnimation} onClick={() => onViewDetails(restaurant)} className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <FaBookOpen /> Details
          </motion.button>
          <motion.button whileTap={tapAnimation} onClick={() => onUseMealHere(restaurant)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <FaUtensils /> Use Meal
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main App Component ---
function IgifuDashboardMainApp() {
  const [activePage, setActivePage] = useState("MyIgifu");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [toast, setToast] = useState(null);

  // HINDURA: Twavanyeho `purchasedPlans`, dushyiramo `mealWallet` imwe.
  const [mealWallet, setMealWallet] = useState(() => {
    const saved = localStorage.getItem("mealWallet");
    return saved ? JSON.parse(saved) : { totalMeals: 0, usedCount: 0 };
  });

  // Modals
  const [showRestaurantDetails, setShowRestaurantDetails] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showBuyMealsModal, setShowBuyMealsModal] = useState(false);
  
  const [processing, setProcessing] = useState(false);
  
  // Data y'ama restaurant
  const allRestaurants = useMemo(() => ([
    { id: 1, name: "Campus Bites", campus: "Huye Campus", walkTime: "3 mins", isFav: true, rating: 4.8, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80", description: "The most popular spot in Huye for a quick, delicious, and affordable meal. Known for its vibrant atmosphere.", menu: [{ name: "Rice and Beans", description: "With a side of fresh vegetables" }, { name: "Kawunga & Meat Stew", description: "Hearty and fulfilling local dish" }] },
    { id: 2, name: "Inka Kitchen", campus: "Remera Campus", walkTime: "10 mins", isFav: false, rating: 4.5, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80", description: "A premium self-service restaurant offering a wide range of continental and local dishes.", menu: [{ name: "Beef Burger & Fries", description: "Classic burger with our special sauce" }, { name: "Pizza (Margherita)", description: "Freshly baked with local cheese" }] },
  ]), []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("mealWallet", JSON.stringify(mealWallet));
  }, [mealWallet]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };
  
  // HINDURA: Iyi function yo kugura amafunguro. Yoroheje.
  const handleBuyMeals = async (count) => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment
    
    setMealWallet(prev => ({
      ...prev,
      totalMeals: prev.totalMeals + count
    }));
    
    setProcessing(false);
    setShowBuyMealsModal(false);
    showToast(`Successfully added ${count} meals to your wallet!`, "success");
    setActivePage("MyIgifu");
  };

  // HINDURA: Iyi function yo gukoresha ifunguro. Yoroheje.
  const handleUseMeal = async (restaurant) => {
    if (mealWallet.usedCount >= mealWallet.totalMeals) {
      showToast("Your wallet is empty. Please buy more meals.", "warn");
      setShowBuyMealsModal(true);
      return;
    }

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMealWallet(prev => ({
      ...prev,
      usedCount: prev.usedCount + 1
    }));
    
    setProcessing(false);
    if(showRestaurantDetails) setShowRestaurantDetails(false);
    showToast(`Meal used at ${restaurant.name}! Enjoy! 🍽️`, "success");
  };

  const handleViewDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantDetails(true);
  };
  
  // --- Pages ---
  const MyIgifuPage = () => (
    <motion.section {...pageMotion} className="px-4 py-6 pb-28">
      <div className="mx-auto w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Igifu Card</h2>
        <MealWalletCard wallet={mealWallet} onBuyMeals={() => setShowBuyMealsModal(true)} />
      </div>
    </motion.section>
  );

  const RestozPage = () => {
    const [restaurants, setRestaurants] = useState(allRestaurants);
    const toggleFav = (id) => setRestaurants(prev => prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r)));
    return (
      <motion.section {...pageMotion} className="pb-28 min-h-screen">
          <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant, index) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} onToggleFav={toggleFav} onViewDetails={handleViewDetails} onUseMealHere={handleUseMeal} />
                  ))}
              </div>
          </div>
      </motion.section>
    );
  };
  
  // Other pages (Earn, Loans, More) can be simple placeholders
  const EarnPage = () => <motion.div {...pageMotion} className="p-6">Earn Page Coming Soon</motion.div>;
  const LoansPage = () => <motion.div {...pageMotion} className="p-6">Loans Page Coming Soon</motion.div>;
  const MorePage = () => <motion.div {...pageMotion} className="p-6">More Options Page Coming Soon</motion.div>;

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-[#0b0b12]">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-40 shadow-lg">
        {/* Header content unchanged */}
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
          {activePage === "Restoz" && <RestozPage key="restoz" />}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && <MorePage key="more" />}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 py-2 z-40">
        <div className="mx-auto flex justify-around">
          {[{ n: "MyIgifu", i: <FaWallet />, l: "Card" }, { n: "Restoz", i: <FaUtensils />, l: "Restos" }, { n: "Earn", i: <FaGift />, l: "Rewards" }, { n: "More", i: <FaEllipsisH />, l: "More" }].map(t => (
            <motion.button key={t.n} onClick={() => setActivePage(t.n)} whileTap={tapAnimation} className={`flex flex-col items-center p-2 relative transition-colors w-20 ${activePage === t.n ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
              <div className="text-2xl mb-1">{t.i}</div>
              <span className="text-[10px] font-bold">{t.l}</span>
              {activePage === t.n && <motion.div layoutId="nav_indicator" className="absolute bottom-0 h-1 w-12 bg-blue-600 rounded-full" />}
            </motion.button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {showRestaurantDetails && <RestaurantDetailsModal restaurant={selectedRestaurant} onClose={() => setShowRestaurantDetails(false)} onUseMealHere={handleUseMeal} processing={processing} />}
        {showBuyMealsModal && <BuyMealsModal onClose={() => setShowBuyMealsModal(false)} onPurchase={handleBuyMeals} processing={processing} />}
        {toast && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold text-white flex items-center gap-3 ${toast.tone === 'warn' ? 'bg-red-500' : 'bg-green-500'}`}>
            <span>{toast.tone === 'warn' ? '⚠️' : '✅'}</span><span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IgifuDashboardMainApp;