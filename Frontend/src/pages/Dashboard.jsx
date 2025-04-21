import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const userName = "Hettiarachchi";
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all countries or by region
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError('');
      try {
        let url = 'https://restcountries.com/v3.1/all';
        if (region) {
          url = `https://restcountries.com/v3.1/region/${region}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [region]);

  // Handle search by country name
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setRegion('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}`);
      if (!response.ok) throw new Error('Country not found');
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      setError(err.message);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get currency names
  const getCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol || ''})`)
      .join(', ');
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-gradient-to-br from-blue-700 to-purple-800 overflow-auto">
      {/* Fixed Header */}
      <header className="w-full bg-blue-500 text-white shadow-md fixed top-0 z-50">
        <div className="w-full px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white">Country Explorer</h1>
            <div className="flex space-x-1 ml-4">
              <img src="https://flagcdn.com/w20/us.png" alt="USA" className="h-4 w-6 rounded-sm shadow-sm" title="United States"/>
              <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="h-4 w-6 rounded-sm shadow-sm" title="United Kingdom"/>
              <img src="https://flagcdn.com/w20/fr.png" alt="France" className="h-4 w-6 rounded-sm shadow-sm" title="France"/>
              <img src="https://flagcdn.com/w20/jp.png" alt="Japan" className="h-4 w-6 rounded-sm shadow-sm" title="Japan"/>
              <img src="https://flagcdn.com/w20/br.png" alt="Brazil" className="h-4 w-6 rounded-sm shadow-sm" title="Brazil"/>
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-blue-100 transition">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-blue-100 transition">Dashboard</Link>
            <button className="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-blue-50 transition font-medium">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full p-6 pt-24">
        {/* Welcome Banner */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Welcome, {userName}!</h2>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex justify-between items-center gap-4">
          {/* Search Box */}
          <div className="flex w-80">
            <input
              type="text"
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-1.5 border rounded-l focus:outline-none text-sm"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-r hover:bg-blue-600 transition text-sm"
            >
              Search
            </button>
          </div>
          
          {/* Filter Box */}
          <div className="flex items-center">
            <select
              value={region}
              onChange={(e) => {
                setSearchTerm('');
                setRegion(e.target.value);
              }}
              className="px-4 py-1.5 border rounded focus:outline-none text-sm"
            >
              <option value="">Filter by Region</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>
        
        {/* Error Message */}
        {error && <p className="text-white bg-red-500 p-3 rounded mb-4 text-center">{error}</p>}
        
        {/* Countries Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <p className="text-center text-white text-xl">Loading countries...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {countries.map((country) => (
              <div 
                key={country.cca3} 
                className="relative bg-white rounded-xl shadow-lg h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden"
              >
                {/* Flag with creative border */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={country.flags?.png || "/api/placeholder/400/200"}
                    alt={`${country.name?.common} flag`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {country.name?.common}
                    </h3>
                    <p className="text-white/90 text-sm">{country.region}</p>
                  </div>
                </div>
                
                {/* Country Details - appears on hover */}
                <div className="p-4 transition-all duration-300 group-hover:bg-blue-50">
                  <div className="text-gray-700 space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium w-24">Capital:</span>
                      <span>{country.capital?.[0] || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-24">Population:</span>
                      <span>{country.population?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-24">Currency:</span>
                      <span>{getCurrencies(country.currencies)}</span>
                    </div>
                  </div>
                  
                  {/* Animated "Learn More" button */}
                  <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600">
                    Learn More
                  </button>
                </div>
                
                {/* Ribbon for special countries */}
                {country.unMember && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    UN Member
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;