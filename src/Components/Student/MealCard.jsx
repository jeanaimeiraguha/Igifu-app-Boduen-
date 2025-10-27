import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FaBell, FaSearch, FaUtensils, FaWallet, FaGift, FaMoneyBill,
  FaEllipsisH, FaLock, FaQuestionCircle, FaFilter, FaMapMarkerAlt,
  FaHeart, FaRegHeart, FaCaretDown, FaRegClock, FaWalking
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
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

// Helpers
const formatK = (amount) => {
  if (amount >= 1000 && amount % 1000 === 0) return `${amount / 1000}k`;
  return amount.toLocaleString();
};
const getMinutes = (walkTime = "") => {
  const m = parseInt(String(walkTime).replace(/\D/g, ""), 10);
  return isNaN(m) ? 0 : m;
};

// --- Restaurant Card ---
const RestaurantCard = ({ restaurant, index, onToggleFav, onOrder, showToast }) => {
  const tap = tapAnimation;

  const handleOrderClick = () => {
    onOrder(restaurant);
    showToast(`Viewing plans for ${restaurant.name}…`, "info");
  };

  const planEntries = Object.entries(restaurant.priceInfo || {});
  const lowest = planEntries.length
    ? planEntries.reduce((acc, [period, amount]) => {
        if (!acc) return { period, amount };
        return amount < acc.amount ? { period, amount } : acc;
      }, null)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#1a1a15] rounded-3xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-white/10 p-5 relative overflow-hidden"
    >
      {/* Fav */}
      <motion.button
        whileTap={tap}
        onClick={() => onToggleFav(restaurant.id)}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        aria-label="Toggle favorite"
      >
        {restaurant.isFav ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-500 dark:text-gray-300 text-xl" />}
      </motion.button>

      {/* Responsive layout: column on mobile, row on larger screens */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-full h-40 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" loading="lazy" />
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
              {restaurant.name}
            </h3>
            {restaurant.verified && (
              <div className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider whitespace-nowrap">
                Verified
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="truncate">{restaurant.campus}</span>
          </div>

          {/* Plans: FRW per time */}
          <div className="text-xs sm:text-[13px] font-bold text-gray-800 dark:text-gray-200 space-y-1">
            {planEntries.map(([period, amount]) => (
              <div key={period} className="flex items-center gap-1">
                <FaMoneyBill className={`${lowest?.period === period ? "text-emerald-500" : "text-gray-500"}`} />
                <span className="truncate">
                  RWF {formatK(amount)} / {period}
                  {lowest?.period === period && (
                    <span className="ml-1 inline-flex items-center px-2 py-[2px] rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Best
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Meta + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-white/15">
            <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <FaWallet className="text-gray-400" /> RWF
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <FaRegClock className="text-gray-400" /> {restaurant.walkTime}
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <FaWalking className="text-gray-400" /> {restaurant.selfService ? "Self-service" : "Served"}
              </span>
            </div>
            <motion.button
              whileTap={tap}
              onClick={handleOrderClick}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-md shadow-blue-600/30 transition-colors"
            >
              View plans
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Reusable Filter Button ---
const FilterButton = ({ label, options, onSelectFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0] ?? label);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const tap = tapAnimation;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectFilter(label, option);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        ref={buttonRef}
        whileTap={tap}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-[#1a1a15] text-gray-700 dark:text-gray-300 font-medium text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {selectedOption} <FaCaretDown className="text-gray-500 text-xs" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute z-50 mt-2 w-56 sm:w-60 bg-white dark:bg-[#1a1a15] border border-gray-200 dark:border-white/20 rounded-2xl shadow-xl p-3"
          >
            {options.map((option) => (
              <motion.div
                key={option}
                whileTap={tap}
                onClick={() => handleOptionSelect(option)}
                className="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                {option}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Restoz Page ---
const RestozPage = ({ pageMotion, showToast, onOrder, headerH, tickerH }) => {
  const FILTER_KEYS = {
    Campus: "campus",
    Plan: "plan",
    "Price Sort": "priceSort",
    "Walk time": "walkTime",
    "Self Service": "selfService",
  };

  const [activeTab, setActiveTab] = useState("Browse");
  const [filterState, setFilterState] = useState({
    campus: "All Campuses",
    plan: "Any",
    priceSort: "None",
    walkTime: "All Times",
    selfService: "Any",
    allVerified: "All",
  });

  // Data: FRW per time (Month/Half-month), no Standard/Luxury, with verified flag
  const restaurantsSeed = useMemo(() => ([
    {
      id: 1, name: "Campus Bites", campus: "Huye Campus",
      priceInfo: { "Month": 30000, "Half-month": 16000 }, walkTime: "3 mins",
      selfService: false, isFav: true, verified: true,
      image: "https://images.unsplash.com/photo-1598214881505-038135566c06?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&mt=1677947264&w=300&h=300&fit=crop",
    },
    {
      id: 2, name: "Inka Kitchen", campus: "Remera Campus",
      priceInfo: { "Month": 50000, "Half-month": 28000 }, walkTime: "10 mins",
      selfService: true, isFav: false, verified: true,
      image: "https://images.unsplash.com/photo-1517210017847-d216481970c0?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&mt=1677947264&w=300&h=300&fit=crop",
    },
    {
      id: 3, name: "UR - Nyarugaenge Cafeteria", campus: "Nyarugaenge Campus",
      priceInfo: { "Month": 25000, "Half-month": 15000 }, walkTime: "5 mins",
      selfService: true, isFav: false, verified: false,
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80",
    },
    {
      id: 4, name: "RP - Tumba Bistro", campus: "Tumba Campus",
      priceInfo: { "Month": 20000 }, walkTime: "7 mins",
      selfService: false, isFav: true, verified: false,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63?w=400&q=80",
    },
    {
      id: 5, name: "Campus Canteen - Gishushu", campus: "Gishushu Campus",
      priceInfo: { "Month": 18000 }, walkTime: "15 mins",
      selfService: true, isFav: false, verified: true,
      image: "https://images.unsplash.com/photo-1565557597671-960612164106?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&mt=1677947264&w=300&h=300&fit=crop",
    }
  ]), []);

  const [restaurants, setRestaurants] = useState(restaurantsSeed);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantsSeed);

  useEffect(() => {
    let temp = [...restaurants];

    // Tab: favourites
    if (activeTab === "Favourites") temp = temp.filter(r => r.isFav);

    // Verified toggle
    if (filterState.allVerified === "Verified") temp = temp.filter(r => r.verified);

    // Campus
    if (filterState.campus && filterState.campus !== "All Campuses") {
      temp = temp.filter(r => r.campus === filterState.campus);
    }

    // Plan filter
    if (filterState.plan && filterState.plan !== "Any") {
      temp = temp.filter(r => r.priceInfo && r.priceInfo[filterState.plan] != null);
    }

    // Walk time
    if (filterState.walkTime && filterState.walkTime !== "All Times") {
      temp = temp.filter(r => {
        const m = getMinutes(r.walkTime);
        if (filterState.walkTime === "< 5 mins") return m < 5;
        if (filterState.walkTime === "5-10 mins") return m >= 5 && m <= 10;
        if (filterState.walkTime === "> 10 mins") return m > 10;
        return true;
      });
    }

    // Self service
    if (filterState.selfService && filterState.selfService !== "Any") {
      const want = filterState.selfService === "Yes";
      temp = temp.filter(r => !!r.selfService === want);
    }

    // Price Sort
    if (filterState.priceSort && filterState.priceSort !== "None") {
      temp.sort((a, b) => {
        const getPrice = (r) => {
          if (!r.priceInfo) return Number.MAX_SAFE_INTEGER;
          if (filterState.plan && filterState.plan !== "Any") {
            const v = r.priceInfo[filterState.plan];
            return v != null ? v : Number.MAX_SAFE_INTEGER;
          }
          return Math.min(...Object.values(r.priceInfo));
        };
        const pa = getPrice(a);
        const pb = getPrice(b);
        return filterState.priceSort === "Low to High" ? pa - pb : pb - pa;
      });
    }

    setFilteredRestaurants(temp);
  }, [restaurants, activeTab, filterState]);

  const toggleFav = (id) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, isFav: !r.isFav } : r))
    );
    showToast("Favorite status updated", "info");
  };

  const handleFilterClick = () => {
    showToast("Use the filter chips to refine results", "info");
  };

  const handleFilterSelect = (label, option) => {
    const key = FILTER_KEYS[label] || label;
    setFilterState(prev => ({ ...prev, [key]: option }));
  };

  return (
    <motion.section {...pageMotion} className="pb-28 min-h-[calc(100vh-var(--header-height)-var(--nav-height))]">
      {/* Header strip */}
      <div className="bg-blue-700 text-white px-4 py-4">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-lg sm:text-xl font-bold text-center mb-2">Choose your favorite Restaurant(s)</h1>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab("Browse")}
              className={`font-bold text-sm py-1.5 px-4 rounded-full transition-colors ${activeTab === "Browse" ? "bg-white text-blue-700 shadow-md" : "text-white/80"}`}
            >
              Browse all restoz
            </button>
            <button
              onClick={() => setActiveTab("Favourites")}
              className={`font-bold text-sm py-1.5 px-4 rounded-full transition-colors ${activeTab === "Favourites" ? "bg-white text-blue-700 shadow-md" : "text-white/80"}`}
            >
              Favourites
            </button>
          </div>
        </div>
      </div>

      {/* Filters (sticky under header + ticker) */}
      <div
        className="bg-white dark:bg-[#0b0b12] pt-4 px-4 pb-2 sticky z-20 shadow-sm border-b border-gray-200 dark:border-white/10"
        style={{ top: headerH + tickerH }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center justify-between mb-3">
            <motion.button
              whileTap={tapAnimation}
              onClick={handleFilterClick}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-colors"
            >
              <FaFilter className="text-sm" />
              Filters
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap pb-2">
            <FilterButton label="Campus" options={["All Campuses", "Huye Campus", "Remera Campus", "Nyarugaenge Campus", "Tumba Campus", "Gishushu Campus"]} onSelectFilter={handleFilterSelect} />
            <FilterButton label="Plan" options={["Any", "Month", "Half-month"]} onSelectFilter={handleFilterSelect} />
            <FilterButton label="Price Sort" options={["None", "Low to High", "High to Low"]} onSelectFilter={handleFilterSelect} />
            <FilterButton label="Walk time" options={["All Times", "< 5 mins", "5-10 mins", "> 10 mins"]} onSelectFilter={handleFilterSelect} />
            <FilterButton label="Self Service" options={["Any", "Yes", "NO"]} onSelectFilter={handleFilterSelect} />
          </div>

          <div className="text-center mt-3 mb-2">
            <span
              className={`font-bold text-sm mx-2 cursor-pointer transition-colors ${filterState.allVerified === 'All' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setFilterState(s => ({ ...s, allVerified: 'All' }))}
            >
              All
            </span>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <span
              className={`font-bold text-sm mx-2 cursor-pointer transition-colors ${filterState.allVerified === 'Verified' ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setFilterState(s => ({ ...s, allVerified: 'Verified' }))}
            >
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
              onToggleFav={toggleFav}
              onOrder={onOrder}
              showToast={showToast}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// --- Main App ---
function IgifuDashboardMainApp() {
  const [selectedCard, setSelectedCard] = useState(() => localStorage.getItem("selectedCard") || "No Card");
  const [activePage, setActivePage] = useState("MyIgifu");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [greeting, setGreeting] = useState("Hello");
  const [showSearch, setShowSearch] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [toast, setToast] = useState(null);
  const [balance, setBalance] = useState(() => parseInt(localStorage.getItem("balance")) || 12400);

  // Dynamic sticky offsets
  const headerRef = useRef(null);
  const tickerRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  const [tickerH, setTickerH] = useState(0);

  // Payment & Modal
  const [showPayment, setShowPayment] = useState(false);
  const [subMonths, setSubMonths] = useState(0.5); // 0.5 = Half-month
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [paymentPhone, setPaymentPhone] = useState("+250");
  const [processing, setProcessing] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [unlockProcessing, setUnlockProcessing] = useState(false);

  // Order
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planQty, setPlanQty] = useState(1);
  const [orderProcessing, setOrderProcessing] = useState(false);

  const PRICE_PER_MONTH = 32000;

  useEffect(() => {
    localStorage.setItem("selectedCard", selectedCard);
    localStorage.setItem("balance", balance.toString());
  }, [selectedCard, balance]);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning ☀️");
    else if (hours < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Measure header + ticker heights for sticky offsets
  useEffect(() => {
    const update = () => {
      setHeaderH(headerRef.current?.offsetHeight || 0);
      setTickerH(tickerRef.current?.offsetHeight || 0);
    };
    update();
    window.addEventListener("resize", update);

    let hObs, tObs;
    if (window.ResizeObserver) {
      hObs = new ResizeObserver(update);
      tObs = new ResizeObserver(update);
      headerRef.current && hObs.observe(headerRef.current);
      tickerRef.current && tObs.observe(tickerRef.current);
    }
    return () => {
      window.removeEventListener("resize", update);
      hObs?.disconnect();
      tObs?.disconnect();
    };
  }, []);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 2200);
  };

  // Pages
  const MyIgifuPage = () => (
    <motion.section {...pageMotion} className="px-4 py-5 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">| My Igifu</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Available cards:</label>
          <select className="w-full sm:w-auto border border-gray-300 dark:border-white/20 bg-white dark:bg-[#0e1015] text-sm px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600/60" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
            <option>No Card</option>
            <option>Meal Card</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0e1015] p-5 shadow-sm">
              <div className="absolute -top-16 -right-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
              <div className="flex items-start sm:items-center justify-between gap-3 relative">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Igifu <span className="font-extrabold">MealCard</span></h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedCard === "No Card" ? "No active card. Buy one to unlock all features." : "Active card detected. Enjoy cashless campus dining!"}</p>
                </div>
                <div className="shrink-0">
                  <div className="rounded-full border-2 border-dashed border-blue-500/70 p-4"><FaUtensils className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400" /></div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 relative z-10">
                {selectedCard === "No Card" ? (
                  <>
                    <motion.button whileTap={tapAnimation} onClick={() => setShowPayment(true)} className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md">Buy Meal Card</motion.button>
                    <motion.button whileTap={tapAnimation} onClick={() => showToast("Viewing plans…", "info")} className="px-4 py-2 rounded-full border border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">See Plans</motion.button>
                  </>
                ) : (
                  <>
                    <motion.button whileTap={tapAnimation} onClick={() => showToast("Topping up wallet…")} className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md">Top Up</motion.button>
                    <motion.button whileTap={tapAnimation} onClick={() => showToast("Card settings…", "info")} className="px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">Manage</motion.button>
                  </>
                )}
              </div>
              {selectedCard === "Meal Card" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">Balance: RWF {balance.toLocaleString()}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  const EarnPage = () => <motion.section {...pageMotion} className="px-4 py-6"><div className="mx-auto w-full max-w-6xl"><h2 className="font-bold text-lg text-gray-900 dark:text-white">🎁 Earn Rewards (Coming Soon)</h2></div></motion.section>;
  const LoansPage = () => <motion.section {...pageMotion} className="px-4 py-6"><div className="mx-auto w-full max-w-6xl"><h2 className="font-bold text-lg text-gray-900 dark:text-white">💰 Student Loans (Coming Soon)</h2></div></motion.section>;
  const MorePage = () => (
    <motion.section {...pageMotion} className="px-4 py-6">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">⚙️ Settings</h2>
        <div className="bg-white dark:bg-[#0e1015] rounded-2xl p-4 border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <span className="font-medium text-gray-800 dark:text-gray-100">Dark Mode</span>
          <motion.button whileTap={tapAnimation} onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
            <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );

  // --- Handlers ---
  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProcessing(false);
    const amount = subMonths * PRICE_PER_MONTH;
    setBalance(p => p + amount);
    showToast("Payment successful!", "success");
    setShowPayment(false);
    setShowUnlockModal(true);
  };

  const handleUnlock = async () => {
    if (pin.length < 4) return showToast("Enter 4-digit PIN", "warn");
    setUnlockProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    setUnlockProcessing(false);
    if (pin === "1234") {
       setSelectedCard("Meal Card"); setShowUnlockModal(false); setPin("");
       setActivePage("Restoz"); showToast("Unlocked! 🎉", "success");
    } else {
       setPinAttempts(p => p + 1); setPin(""); showToast("Wrong PIN", "warn");
    }
  };

  const handleOrder = (r) => {
    if (selectedCard !== "Meal Card") return showToast("Unlock Meal Card first", "warn");
    setSelectedRestaurant(r);
    const firstPlan = Object.keys(r.priceInfo || {})[0] || null;
    setSelectedPlan(firstPlan);
    setPlanQty(1);
    setShowOrderModal(true);
  };

  const handleOrderPlacement = async () => {
     if (!selectedRestaurant || !selectedPlan) return showToast("Select a plan", "warn");
     const price = selectedRestaurant.priceInfo[selectedPlan] || 0;
     const total = price * planQty;
     if (balance < total) return showToast("Insufficient balance", "warn");

     setOrderProcessing(true);
     await new Promise(r => setTimeout(r, 1200));
     setBalance(b => b - total);
     setOrderProcessing(false);
     setShowOrderModal(false);
     showToast(`Purchased ${planQty} × ${selectedPlan} plan at ${selectedRestaurant.name}`, "success");
  }

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#f5f8ff] text-[#1a1a1a] dark:bg-[#0b0b12] dark:text-gray-100 transition-colors duration-300 overflow-x-hidden" style={{ '--header-height': 'auto', '--nav-height': '72px' }}>
      {/* Header (sticky, measured) */}
      <header ref={headerRef} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <motion.div whileTap={tapAnimation} className="text-2xl bg-white/10 p-2 rounded-full">🍽️</motion.div>
          <div>
            <div className="text-xs opacity-90">{greeting}</div>
            <div className="text-sm font-bold">RichGuy</div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button whileTap={tapAnimation} onClick={() => setShowSearch(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><FaSearch /></motion.button>
          <motion.button whileTap={tapAnimation} onClick={() => setShowInbox(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative">
            <FaBell /><span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-blue-600" />
          </motion.button>
        </div>
      </header>

      {/* Ticker (sticky under header, measured) */}
      <div ref={tickerRef} className="bg-[#ffcd00] text-black px-4 py-2 text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 sticky z-20" style={{ top: headerH }}>
        <div className="mx-auto w-full max-w-6xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black/70 animate-pulse shrink-0" />
          <span className="truncate">| What’s new? Weekly bonus & new partner restaurants</span>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 z-10">
        <AnimatePresence mode="wait">
          {activePage === "MyIgifu" && <MyIgifuPage key="home" />}
          {activePage === "Restoz" && <RestozPage key="restoz" pageMotion={pageMotion} showToast={showToast} onOrder={handleOrder} headerH={headerH} tickerH={tickerH} />}
          {activePage === "Earn" && <EarnPage key="earn" />}
          {activePage === "Loans" && <LoansPage key="loans" />}
          {activePage === "More" && <MorePage key="more" />}
        </AnimatePresence>
      </main>

      {/* Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#0e1015]/90 backdrop-blur-md shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-200/50 dark:border-white/5 py-2 z-40">
        <div className="mx-auto w-full max-w-6xl flex justify-around">
          {[{n:"MyIgifu",i:<FaWallet/>},{n:"Restoz",i:<FaUtensils/>},{n:"Earn",i:<FaGift/>},{n:"Loans",i:<FaMoneyBill/>},{n:"More",i:<FaEllipsisH/>}].map(t => {
            const isActive = activePage === t.n;
            return (
              <motion.button key={t.n} onClick={() => setActivePage(t.n)} whileTap={tapAnimation} className={`flex flex-col items-center p-2 relative ${isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-400"}`}>
                <span className="text-lg sm:text-xl mb-0.5">{t.i}</span>
                <span className="text-[10px] font-bold hidden xs:inline">{t.n}</span>
                {isActive && <motion.div layoutId="nav_pill" className="absolute bottom-0 w-8 h-1.5 bg-blue-600 rounded-t-full" />}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {/* Payment */}
        {showPayment && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" onClick={() => !processing && setShowPayment(false)}>
            <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e=>e.stopPropagation()} className="w-full max-w-[92vw] sm:max-w-md bg-[#181a20] rounded-3xl p-6 text-white shadow-2xl border border-white/5">
              <h3 className="text-center text-lg sm:text-xl font-extrabold mb-6 tracking-tight">Confirm your Igifu purchase</h3>

              {/* Duration picker */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                 <span className="font-bold mr-1 text-gray-300">Duration:</span>
                 <motion.button whileTap={tapAnimation} onClick={()=>setSubMonths(m=>m+0.5)} className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-green-500/20">+</motion.button>
                 <div className="bg-[#262a34] px-4 h-12 flex items-center justify-center rounded-xl font-bold min-w-[140px] text-base sm:text-lg border border-white/5">
                   {subMonths === 0.5 ? "Half-month" : `${subMonths} Month${subMonths > 1 ? "s" : ""}`}
                 </div>
                 <motion.button whileTap={tapAnimation} onClick={()=>setSubMonths(m=>Math.max(0.5, m-0.5))} className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-500/20">−</motion.button>
                 <FaQuestionCircle className="text-yellow-400 ml-1 opacity-80"/>
              </div>

              <div className="space-y-3 mb-6 px-2 bg-[#1c1f26] p-4 rounded-2xl border border-white/5">
                 <div className="flex justify-between text-sm font-medium"><span className="text-gray-400">Plan Price (RWF):</span><span className="font-bold">{(subMonths * PRICE_PER_MONTH).toLocaleString()}</span></div>
                 <div className="flex justify-between text-sm font-medium"><span className="text-gray-400">Fees (RWF):</span><span className="font-bold text-green-400">0</span></div>
                 <div className="h-px bg-white/10 my-2"/>
                 <div className="flex justify-between text-lg font-extrabold"><span className="text-yellow-400">Total (RWF):</span><span className="text-yellow-400">{(subMonths * PRICE_PER_MONTH).toLocaleString()}</span></div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-3 mb-1.5 block uppercase tracking-wider">Pay with</label>
                  <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} className="w-full h-14 px-4 bg-[#262a34] rounded-2xl border-r-[16px] border-transparent outline-none font-bold text-gray-200 focus:ring-2 focus:ring-yellow-400/50 transition-all">
                    <option>MTN Mobile Money</option><option>Airtel Money</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-3 mb-1.5 block uppercase tracking-wider">Payment number</label>
                  <input type="tel" value={paymentPhone} onChange={e=>setPaymentPhone(e.target.value)} className="w-full h-14 px-4 bg-[#262a34] rounded-2xl outline-none font-bold placeholder-gray-500 text-gray-200 focus:ring-2 focus:ring-yellow-400/50 transition-all" placeholder="+250"/>
                </div>
              </div>

              <p className="text-center text-xs text-gray-500 mb-6">By paying, I agree to <span className="text-yellow-400 underline">Terms</span> and <span className="text-yellow-400 underline">Privacy</span></p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button whileTap={tapAnimation} onClick={()=>setShowPayment(false)} className="flex-1 h-12 sm:h-14 bg-[#991b1b] hover:bg-[#7f1d1d] rounded-2xl font-bold text-base sm:text-lg transition-colors">Cancel</motion.button>
                <motion.button whileTap={tapAnimation} onClick={handlePay} disabled={processing} className="flex-[1.5] h-12 sm:h-14 bg-[#65a30d] hover:bg-[#4d7c0f] rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-green-500/20">
                  {processing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : `Pay ${(subMonths * PRICE_PER_MONTH).toLocaleString()} RWF`}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Unlock */}
        {showUnlockModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" className="w-full max-w-[92vw] sm:max-w-sm bg-[#181a20] rounded-3xl p-6 sm:p-8 text-center border border-white/10 shadow-2xl">
               <FaLock className="text-4xl sm:text-5xl text-yellow-400 mx-auto mb-4"/>
               <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Unlock Card</h3>
               <input type="password" value={pin} onChange={e=>setPin(e.target.value.slice(0,4))} maxLength={4} autoFocus className="w-full h-14 sm:h-16 text-center text-3xl sm:text-4xl font-mono tracking-[0.8em] sm:tracking-[1em] bg-black/40 rounded-2xl border-2 border-white/10 focus:border-yellow-400 text-white outline-none mb-6 transition-colors"/>
               <motion.button whileTap={tapAnimation} onClick={handleUnlock} disabled={unlockProcessing} className="w-full h-12 sm:h-14 bg-yellow-400 text-black font-black rounded-xl flex items-center justify-center gap-2">{unlockProcessing ? "..." : "UNLOCK"}</motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Order: Buy restaurant plan */}
        {showOrderModal && selectedRestaurant && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" onClick={()=>setShowOrderModal(false)}>
             <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e=>e.stopPropagation()} className="w-full max-w-[92vw] sm:max-w-md bg-white dark:bg-[#181a20] rounded-3xl p-6 shadow-xl">
               <h3 className="text-lg sm:text-xl font-bold dark:text-white mb-4">Plans at {selectedRestaurant.name}</h3>

               {/* Plan selector */}
               <div className="flex flex-wrap gap-2 mb-4">
                 {Object.entries(selectedRestaurant.priceInfo || {}).map(([plan, amount]) => (
                   <button
                     key={plan}
                     onClick={() => setSelectedPlan(plan)}
                     className={`px-3 py-2 rounded-full text-sm font-bold border transition-colors ${
                       selectedPlan === plan
                         ? "bg-blue-600 text-white border-blue-600"
                         : "bg-transparent text-gray-800 dark:text-gray-100 border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
                     }`}
                   >
                     {plan} • {formatK(amount)} RWF
                   </button>
                 ))}
               </div>

               {/* Quantity */}
               <div className="flex items-center justify-between bg-gray-100 dark:bg-[#262a34] p-4 rounded-2xl mb-4">
                 <span className="font-bold dark:text-white">Quantity:</span>
                 <div className="flex items-center gap-3">
                   <motion.button whileTap={tapAnimation} onClick={()=>setPlanQty(q=>Math.max(1,q-1))} className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold dark:text-white">−</motion.button>
                   <span className="text-xl font-black dark:text-white w-8 text-center">{planQty}</span>
                   <motion.button whileTap={tapAnimation} onClick={()=>setPlanQty(q=>q+1)} className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">+</motion.button>
                 </div>
               </div>

               {/* Total */}
               <div className="mb-6 text-sm dark:text-gray-300 flex justify-between font-medium">
                 <span>Total Cost:</span>
                 <span className="font-bold text-blue-600 dark:text-blue-400">
                   {(() => {
                     const price = selectedPlan ? (selectedRestaurant.priceInfo[selectedPlan] || 0) : 0;
                     return (price * planQty).toLocaleString();
                   })()} RWF
                 </span>
               </div>

               <motion.button whileTap={tapAnimation} onClick={handleOrderPlacement} disabled={orderProcessing || !selectedPlan} className="w-full h-12 sm:h-14 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center disabled:opacity-60">
                 {orderProcessing ? "..." : "CONFIRM PURCHASE"}
               </motion.button>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{y:50,opacity:0,scale:0.9}} animate={{y:0,opacity:1,scale:1}} exit={{y:20,opacity:0,scale:0.9}} className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] px-4 sm:px-6 py-3 rounded-full shadow-2xl font-bold text-white flex items-center gap-2 ${toast.tone==='warn'?'bg-red-500':'bg-green-600'}`}>
            {toast.tone==='warn'?'⚠️':'✅'} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IgifuDashboardMainApp;