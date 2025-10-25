import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaChartBar,
  FaClipboardCheck,
  FaUtensils,
  FaEdit,
  FaArrowLeft,
  FaUsers,
  FaSearch,
  FaFilter,
  FaDownload,
  FaSync,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCamera,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaBox,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";

const RestaurantDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  
  // Simulated real-time data
  const [orders, setOrders] = useState([
    { id: "001", customer: "John Doe", items: "Beef & Rice", status: "pending", amount: 15000, time: "2 mins ago", table: "T-04" },
    { id: "002", customer: "Jane Smith", items: "Chicken & Chips", status: "pending", amount: 12000, time: "5 mins ago", table: "T-12" },
    { id: "003", customer: "Mike Wilson", items: "Pizza Margherita", status: "preparing", amount: 18000, time: "10 mins ago", table: "T-08" },
    { id: "004", customer: "Sarah Johnson", items: "Burger & Fries", status: "ready", amount: 16000, time: "15 mins ago", table: "T-02" },
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Beef & Rice", price: 15000, stock: 45, category: "Main", image: "🥘", status: "available" },
    { id: 2, name: "Chicken & Chips", price: 12000, stock: 30, category: "Main", image: "🍗", status: "available" },
    { id: 3, name: "Pizza Margherita", price: 18000, stock: 5, category: "Pizza", image: "🍕", status: "low" },
    { id: 4, name: "Burger & Fries", price: 16000, stock: 0, category: "Fast Food", image: "🍔", status: "out" },
  ]);

  const [dailyStats, setDailyStats] = useState({
    date: new Date().toLocaleDateString(),
    platesServed: 82,
    worth: 123000,
    avgOrderTime: "12 mins",
    peakHour: "13:00",
  });

  const [monthlyStats] = useState({
    month: "Jan 2025",
    revenue: 6660000,
    customers: 74,
    growth: 6,
    averageOrderValue: 90000,
    topSellingItem: "Beef & Rice",
  });

  // Simulate data refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setDailyStats(prev => ({
        ...prev,
        platesServed: prev.platesServed + Math.floor(Math.random() * 5),
        worth: prev.worth + Math.floor(Math.random() * 10000),
      }));
      setRefreshing(false);
    }, 1500);
  };

  // Simulate real-time order updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNotifications(prev => prev + 1);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { name: "Confirm Orders", icon: <FaClipboardCheck className="text-lg" />, page: "orders", color: "blue", badge: orders.filter(o => o.status === "pending").length },
    { name: "Performance Report", icon: <FaChartBar className="text-lg" />, page: "report", color: "purple" },
    { name: "Update Stock & Menu", icon: <FaEdit className="text-lg" />, page: "stock", color: "green", badge: menuItems.filter(m => m.status === "low").length },
    { name: "Inventory Management", icon: <FaBox className="text-lg" />, page: "inventory", color: "orange" },
  ];

  const sidebarItems = [
    { icon: <FaHome />, name: "Dashboard", page: "dashboard" },
    { icon: <FaClipboardCheck />, name: "Orders", page: "orders" },
    { icon: <FaUtensils />, name: "Menu", page: "stock" },
    { icon: <FaBox />, name: "Inventory", page: "inventory" },
    { icon: <FaChartBar />, name: "Analytics", page: "report" },
    { icon: <FaMoneyBillWave />, name: "Finance", page: "finance" },
    { icon: <FaUsers />, name: "Customers", page: "customers" },
    { icon: <FaCog />, name: "Settings", page: "settings" },
  ];

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleOrderConfirm = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "preparing" } : order
    ));
    setNotifications(prev => Math.max(0, prev - 1));
  };

  const handleOrderCancel = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans flex">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:block w-64 bg-white shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inka Kitchen
          </h1>
          <p className="text-xs text-gray-500 mt-1">Restaurant </p>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1
                ${activePage === item.page 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex justify-between items-center p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome back, Manager!</h2>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-all ${refreshing ? 'animate-spin' : ''}`}
              >
                <FaSync className="text-gray-600" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <FaBell className="text-gray-600 text-xl" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>
                {showNotificationPanel && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FaClipboardCheck className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New order received</p>
                            <p className="text-xs text-gray-500">Table 5 - 2 items</p>
                            <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-100 p-2 rounded-lg">
                            <FaExclamationTriangle className="text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Low stock alert</p>
                            <p className="text-xs text-gray-500">Pizza Margherita - Only 5 left</p>
                            <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">Trust </p>
                  <p className="text-xs text-gray-500">Restaurant Manager</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  JM
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            {activePage === "dashboard" && (
              <motion.div key="dashboard" {...pageTransition} transition={{ duration: 0.3 }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Today's Orders</p>
                        <FaClipboardCheck className="text-blue-500" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">{dailyStats.platesServed}</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                        <HiTrendingUp /> +12% from yesterday
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Today's Revenue</p>
                        <FaMoneyBillWave className="text-green-500" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">₣{dailyStats.worth.toLocaleString()}</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                        <HiTrendingUp /> +8% from target
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Avg Order Time</p>
                        <FaClock className="text-purple-500" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">{dailyStats.avgOrderTime}</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                        <HiTrendingDown /> -2 mins improvement
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Active Tables</p>
                        <FaUsers className="text-orange-500" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">14/20</h3>
                      <p className="text-xs text-gray-600 mt-2">Peak hour: {dailyStats.peakHour}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActivePage(action.page)}
                      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left relative overflow-hidden hover:shadow-lg transition-all`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br 
                        ${action.color === 'blue' ? 'from-blue-100 to-blue-50' : ''}
                        ${action.color === 'purple' ? 'from-purple-100 to-purple-50' : ''}
                        ${action.color === 'green' ? 'from-green-100 to-green-50' : ''}
                        ${action.color === 'orange' ? 'from-orange-100 to-orange-50' : ''}
                        rounded-full -mr-12 -mt-12`}></div>
                      <div className="relative">
                        <div className={`inline-flex p-3 rounded-lg mb-3 
                          ${action.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                          ${action.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                          ${action.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                          ${action.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}`}>
                          {action.icon}
                        </div>
                        {action.badge > 0 && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                            {action.badge}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-800">{action.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Click to manage</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Recent Orders */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Order ID</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Customer</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Items</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Table</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Status</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 3).map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 text-sm font-medium">#{order.id}</td>
                            <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                            <td className="py-3 text-sm text-gray-600">{order.items}</td>
                            <td className="py-3 text-sm text-gray-600">{order.table}</td>
                            <td className="py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm font-medium">₣{order.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Monthly Performance */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mt-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Monthly Performance</h2>
                    <select className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-sm backdrop-blur">
                      <option>{monthlyStats.month}</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm opacity-80">Total Revenue</p>
                      <h3 className="text-2xl font-bold">₣{(monthlyStats.revenue / 1000000).toFixed(1)}M</h3>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Customers</p>
                      <h3 className="text-2xl font-bold">{monthlyStats.customers}</h3>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Growth</p>
                      <h3 className="text-2xl font-bold">+{monthlyStats.growth}%</h3>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Top Item</p>
                      <h3 className="text-lg font-bold">{monthlyStats.topSellingItem}</h3>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Enhanced Orders Page */}
            {activePage === "orders" && (
              <motion.div key="orders" {...pageTransition} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
                    onClick={() => setActivePage("dashboard")}
                  >
                    <FaArrowLeft /> Back to Dashboard
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                  <p className="text-gray-500 mt-1">Manage and track all restaurant orders</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeTab === "pending" 
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Pending ({orders.filter(o => o.status === "pending").length})
                      </button>
                      <button
                        onClick={() => setActiveTab("preparing")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeTab === "preparing" 
                            ? "bg-blue-100 text-blue-700 border border-blue-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Preparing ({orders.filter(o => o.status === "preparing").length})
                      </button>
                      <button
                        onClick={() => setActiveTab("ready")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeTab === "ready" 
                            ? "bg-green-100 text-green-700 border border-green-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Ready ({orders.filter(o => o.status === "ready").length})
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      <FaFilter /> Filter
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders
                    .filter(order => activeTab === "all" || order.status === activeTab)
                    .map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{order.time}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Customer:</span>
                          <span className="font-medium">{order.customer}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Table:</span>
                          <span className="font-medium">{order.table}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Items:</span>
                          <span className="font-medium">{order.items}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-gray-800">₣{order.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleOrderConfirm(order.id)}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                            >
                              <FaCheckCircle /> Confirm
                            </button>
                            <button
                              onClick={() => handleOrderCancel(order.id)}
                              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                              <FaTimesCircle /> Cancel
                            </button>
                          </>
                        )}
                        {order.status === "preparing" && (
                          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
                            Mark as Ready
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-all">
                            Complete Order
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Stock & Menu Management */}
            {activePage === "stock" && (
              <motion.div key="stock" {...pageTransition} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
                    onClick={() => setActivePage("dashboard")}
                  >
                    <FaArrowLeft /> Back to Dashboard
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">Menu & Stock Management</h2>
                  <p className="text-gray-500 mt-1">Manage your restaurant menu and track inventory</p>
                </div>

                {/* Add New Item Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500">
                      <option>Select Category</option>
                      <option>Main Course</option>
                      <option>Appetizer</option>
                      <option>Dessert</option>
                      <option>Beverage</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price (₣)"
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Initial Stock"
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      <FaCamera /> Add Image
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-4xl">{item.image}</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'available' ? 'bg-green-100 text-green-700' :
                          item.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'out' ? 'Out of Stock' : 
                           item.status === 'low' ? 'Low Stock' : 'Available'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold text-gray-800">₣{item.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-600">Stock: {item.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                          <FaEdit /> Edit
                        </button>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                          <FaPlus />
                        </button>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                          <FaMinus />
                        </button>
                        <button className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Performance Report */}
            {activePage === "report" && (
              <motion.div key="report" {...pageTransition} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
                    onClick={() => setActivePage("dashboard")}
                  >
                    <FaArrowLeft /> Back to Dashboard
                  </button>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
                      <p className="text-gray-500 mt-1">Comprehensive business insights and performance metrics</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                      <FaDownload /> Export Report
                    </button>
                  </div>
                </div>

                {/* Date Range Selector */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input type="date" className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
                    <span className="self-center">to</span>
                    <input type="date" className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500">
                      <option>All Categories</option>
                      <option>Main Course</option>
                      <option>Beverages</option>
                      <option>Desserts</option>
                    </select>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                      Apply Filters
                    </button>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">📈 Revenue chart visualization</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">📊 Popular items chart</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
                      <h4 className="text-3xl font-bold text-gray-800">₣{monthlyStats.averageOrderValue.toLocaleString()}</h4>
                      <p className="text-xs text-green-600 mt-2">+15% from last month</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Customer Retention</p>
                      <h4 className="text-3xl font-bold text-gray-800">78%</h4>
                      <p className="text-xs text-green-600 mt-2">+5% improvement</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Table Turnover</p>
                      <h4 className="text-3xl font-bold text-gray-800">3.2x</h4>
                      <p className="text-xs text-yellow-600 mt-2">Same as last month</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {sidebarItems.slice(0, 5).map((item) => (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activePage === item.page ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default RestaurantDashboard;