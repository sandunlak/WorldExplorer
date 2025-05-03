import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFavorites from '../context/useFavorites';

const Dashboard = () => {
  const userName = "Hettiarachchi";
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

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
      {/* Header */}
      <header className="w-full bg-blue-500 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-3 md:mb-0 w-full md:w-auto justify-between md:justify-start">
            <h1 className="text-xl md:text-2xl font-bold text-white">Country Explorer</h1>
            <div className="flex space-x-1 md:ml-4">
              <img src="https://flagcdn.com/w20/us.png" alt="USA" className="h-4 w-6 rounded-sm shadow-sm" title="United States"/>
              <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="h-4 w-6 rounded-sm shadow-sm" title="United Kingdom"/>
              <img src="https://flagcdn.com/w20/fr.png" alt="France" className="h-4 w-6 rounded-sm shadow-sm" title="France"/>
              <img src="https://flagcdn.com/w20/jp.png" alt="Japan" className="h-4 w-6 rounded-sm shadow-sm" title="Japan"/>
              <img src="https://flagcdn.com/w20/br.png" alt="Brazil" className="h-4 w-6 rounded-sm shadow-sm" title="Brazil"/>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center items-center gap-2 md:gap-6 w-full md:w-auto">
            <Link to="/" className="text-white hover:text-blue-100 transition text-sm md:text-base">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-blue-100 transition text-sm md:text-base">Dashboard</Link>
            <Link to="/favorites" className="text-white hover:text-blue-100 transition text-sm md:text-base">Favorites ({favorites.length})</Link>
            <button className="bg-white text-blue-500 px-3 md:px-6 py-1 md:py-2 rounded-md hover:bg-blue-50 transition font-medium text-sm md:text-base">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Welcome, {userName}!</h2>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearch} className="w-full sm:w-80">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-l focus:outline-none text-sm w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition text-sm"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="w-full sm:w-auto flex justify-end">
            <select
              value={region}
              onChange={(e) => {
                setSearchTerm('');
                setRegion(e.target.value);
              }}
              className="px-4 py-2 border rounded focus:outline-none text-sm bg-white text-gray-700 w-full sm:w-40"
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
        
        {error && <p className="text-white bg-red-500 p-3 rounded mb-4 text-center">{error}</p>}
        
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
              <p className="text-white text-center">Loading countries...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((country) => (
              <div 
                key={country.cca3} 
                className="relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden"
              >
                <button 
                  onClick={() => toggleFavorite(country.cca3)}
                  className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full"
                  aria-label={favorites.includes(country.cca3) ? "Remove from favorites" : "Add to favorites"}
                >
                  {favorites.includes(country.cca3) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                </button>
                
                <div className="relative overflow-hidden h-48">
                  <img
                    src={country.flags?.png || "/api/placeholder/400/200"}
                    alt={`${country.name?.common} flag`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {country.name?.common}
                    </h3>
                    <p className="text-white/90 text-sm">{country.region}</p>
                  </div>
                </div>
                
                <div className="p-4 transition-all duration-300 group-hover:bg-blue-50">
                  <div className="text-gray-700 space-y-2">
                    <div className="flex flex-wrap">
                      <span className="font-medium w-24">Capital:</span>
                      <span className="flex-1">{country.capital?.[0] || 'N/A'}</span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="font-medium w-24">Population:</span>
                      <span className="flex-1">{country.population?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="font-medium w-24">Currency:</span>
                      <span className="flex-1">{getCurrencies(country.currencies)}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/details/${country.cca3}`}
                    className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600 block text-center"
                  >
                    Learn More
                  </Link>
                </div>
                
                {country.unMember && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
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