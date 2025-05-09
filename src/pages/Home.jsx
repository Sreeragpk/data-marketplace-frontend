import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black transition-colors">
      {/* Navbar */}
      <header className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 shadow-md gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-teal-400 text-center sm:text-left">
          Factyes Data Marketplace
        </h1>
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full transition hover:scale-105"
            title="Toggle dark mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
          <nav className="space-x-2">
            <Link
              to="/Login"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400"
            >
              Login
            </Link>
            <Link
              to="/Signup"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center px-4 sm:px-6 py-16 sm:py-20 w-full max-w-screen-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6 leading-tight">
            Discover, Buy, and Sell Quality Datasets
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
            A trusted marketplace for data enthusiasts, researchers, and businesses. Upload, monetize, or access valuable datasets with ease.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition"
          >
            Get Started
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 pb-16 sm:pb-20 w-full max-w-screen-xl mx-auto">
          {[
            {
              title: "Secure Uploads",
              description: "Upload datasets in CSV, JSON, Excel formats securely to the cloud.",
              icon: "📁",
            },
            {
              title: "Flexible Payments",
              description: "Monetize your data with Stripe, PayPal, or Razorpay integration.",
              icon: "💳",
            },
            {
              title: "Smart Search",
              description: "Easily find datasets by category, tags, format, or price.",
              icon: "🔍",
            },
          ].map(({ title, description, icon }) => (
            <div
              key={title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full">
        © {new Date().getFullYear()} Micrologic. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;


// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-blue-900 text-white">
//       {/* Animated Navbar */}
//       <header className="w-full flex justify-between items-center px-8 py-6 bg-transparent backdrop-blur-md border-b border-blue-800 fixed z-50">
//         <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
//           Micrologic<span className="text-blue-300">Data</span>
//         </h1>
//         <nav className="space-x-6">
//           <Link 
//             to="/Login" 
//             className="text-blue-200 hover:text-white transition-all duration-300 hover:scale-105"
//           >
//             Login
//           </Link>
//           <Link 
//             to="/Signup" 
//             className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
//           >
//             Join Marketplace
//           </Link>
//         </nav>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow pt-32">
//         {/* Hero Section with Particles */}
//         <section className="relative text-center px-6 py-20 w-full max-w-screen-xl mx-auto">
//           <div className="absolute inset-0 overflow-hidden opacity-20">
//             {[...Array(20)].map((_, i) => (
//               <div 
//                 key={i}
//                 className="absolute rounded-full bg-blue-400"
//                 style={{
//                   width: Math.random() * 10 + 2 + 'px',
//                   height: Math.random() * 10 + 2 + 'px',
//                   top: Math.random() * 100 + '%',
//                   left: Math.random() * 100 + '%',
//                   animation: `float ${Math.random() * 10 + 5}s linear infinite`,
//                 }}
//               />
//             ))}
//           </div>
          
//           <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-300">
//               The Future of Data
//             </span><br />
//             <span className="text-xl md:text-2xl font-light text-blue-200 mt-4 block">
//               Trade in the world's most valuable commodity
//             </span>
//           </h1>
          
//           <p className="text-lg text-blue-100 mb-10 max-w-3xl mx-auto">
//             A decentralized marketplace where data scientists, AI researchers, and businesses 
//             converge to exchange high-quality datasets with blockchain-backed security and 
//             transparent transactions.
//           </p>
          
//           <div className="flex justify-center gap-6">
//             <Link 
//               to="/signup" 
//               className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105"
//             >
//               Start Trading Data
//             </Link>
//             <Link 
//               to="/explore" 
//               className="border-2 border-blue-400 text-blue-100 px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-900/30 transition-all duration-300"
//             >
//               Explore Datasets
//             </Link>
//           </div>
          
//           <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
//             {['CSV', 'JSON', 'SQL', 'Parquet'].map(format => (
//               <div 
//                 key={format}
//                 className="bg-blue-900/30 backdrop-blur-sm border border-blue-800 rounded-xl p-4 hover:border-teal-400 transition-all duration-300"
//               >
//                 <div className="text-3xl mb-2">
//                   {format === 'CSV' && '📊'}
//                   {format === 'JSON' && '🔣'}
//                   {format === 'SQL' && '🗃️'}
//                   {format === 'Parquet' && '📁'}
//                 </div>
//                 <div className="font-mono text-blue-300">{format}</div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Data Flow Visualization */}
//         <section className="relative py-20 overflow-hidden">
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
//           </div>
          
//           <div className="relative grid grid-cols-3 gap-16 max-w-5xl mx-auto px-6">
//             {[
//               { icon: '🧑‍💻', title: 'Upload', desc: 'Data scientists share datasets' },
//               { icon: '⚡', title: 'Process', desc: 'AI models verify quality' },
//               { icon: '💰', title: 'Monetize', desc: 'Earn from your contributions' }
//             ].map((step, i) => (
//               <div 
//                 key={step.title} 
//                 className="bg-gray-800/50 backdrop-blur-sm border border-blue-900 rounded-2xl p-6 text-center z-10 hover:border-teal-400 transition-all duration-500 hover:scale-105"
//               >
//                 <div className="text-4xl mb-4">{step.icon}</div>
//                 <h3 className="text-xl font-bold text-teal-300 mb-2">{step.title}</h3>
//                 <p className="text-blue-100">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Featured Datasets Preview */}
//         <section className="py-20 px-6 bg-gradient-to-b from-blue-900/30 to-gray-900/0">
//           <div className="max-w-screen-xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-16">
//               <span className="border-b-2 border-teal-400 pb-2">Featured Data Collections</span>
//             </h2>
            
//             <div className="grid md:grid-cols-3 gap-8">
//               {[
//                 { category: 'Financial', items: 1243, color: 'from-purple-600 to-blue-600' },
//                 { category: 'Healthcare', items: 872, color: 'from-emerald-600 to-teal-600' },
//                 { category: 'Geospatial', items: 531, color: 'from-amber-600 to-orange-600' }
//               ].map((collection) => (
//                 <div 
//                   key={collection.category}
//                   className={`bg-gradient-to-br ${collection.color} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
//                 >
//                   <h3 className="text-2xl font-bold mb-2">{collection.category}</h3>
//                   <p className="text-blue-100 mb-4">{collection.items.toLocaleString()} datasets</p>
//                   <div className="h-2 bg-white/20 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-white/70 rounded-full" 
//                       style={{ width: `${Math.min(100, collection.items / 15)}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Glowing Footer */}
//       <footer className="text-center py-12 bg-gray-900/50 backdrop-blur-md border-t border-blue-900 relative overflow-hidden">
//         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
//         <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-600 rounded-full filter blur-3xl opacity-20"></div>
        
//         <div className="relative z-10">
//           <h3 className="text-2xl font-bold mb-6">
//             Ready to join the <span className="text-teal-300">data revolution</span>?
//           </h3>
//           <Link 
//             to="/signup" 
//             className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mb-8"
//           >
//             Create Free Account
//           </Link>
//           <div className="text-blue-300 text-sm">
//             © {new Date().getFullYear()} Micrologic Data Marketplace • Secure • Transparent • Decentralized
//           </div>
//         </div>
//       </footer>

//       {/* Global Styles */}
//       <style jsx>{`
//         @keyframes float {
//           0% { transform: translateY(0) translateX(0); }
//           50% { transform: translateY(-20px) translateX(10px); }
//           100% { transform: translateY(0) translateX(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home;