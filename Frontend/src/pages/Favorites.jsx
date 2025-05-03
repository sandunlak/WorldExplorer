import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavorites from '../context/useFavorites';

const Favorites = () => {
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();

  // Load favorite countries data
  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      setFavoriteCountries([]);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          favorites.map(code => 
            fetch(`https://restcountries.com/v3.1/alpha/${code}`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch country ${code}`);
                return res.json();
              })
              .then(data => data[0])
              .catch(error => {
                console.error(error);
                return null;
              })
          )
        );
        // Filter out any failed requests
        const validCountries = responses.filter(country => country !== null);
        if (validCountries.length !== favorites.length) {
          setError(`Could not load all favorites (${favorites.length - validCountries.length} failed)`);
        }
        setFavoriteCountries(validCountries);
      } catch (error) {
        console.error("Error fetching favorite countries:", error);
        setError("Failed to load favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [favorites]);

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
              <img src="https://flagcdn.com/w20/us.png" alt="USA" className="h-3 w-5 md:h-4 md:w-6 rounded-sm shadow-sm" title="United States"/>
              <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="h-3 w-5 md:h-4 md:w-6 rounded-sm shadow-sm" title="United Kingdom"/>
              <img src="https://flagcdn.com/w20/fr.png" alt="France" className="h-3 w-5 md:h-4 md:w-6 rounded-sm shadow-sm" title="France"/>
              <img src="https://flagcdn.com/w20/jp.png" alt="Japan" className="h-3 w-5 md:h-4 md:w-6 rounded-sm shadow-sm" title="Japan"/>
              <img src="https://flagcdn.com/w20/br.png" alt="Brazil" className="h-3 w-5 md:h-4 md:w-6 rounded-sm shadow-sm" title="Brazil"/>
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
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Your Favorite Countries</h2>
          <Link 
            to="/dashboard" 
            className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm md:text-base"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-center text-white text-lg">Loading your favorites...</p>
          </div>
        ) : favoriteCountries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white/10 rounded-lg max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl text-white mt-4 text-center">No favorites yet</h3>
            <p className="text-white/80 mt-2 text-center">Click the star icon on countries to add them to your favorites</p>
            <Link 
              to="/dashboard" 
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Browse Countries
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCountries.map((country) => (
              <div 
                key={country.cca3} 
                className="relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFavorite(country.cca3)}
                  className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full"
                  aria-label="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
                
                <div className="relative overflow-hidden h-48">
                  <img
                    src={country.flags?.png || "/api/placeholder/400/200"}
                    alt={`${country.name?.common} flag`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
                
                <div className="p-4">
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
                    className="mt-4 block w-full py-2 bg-blue-500 text-white rounded-md text-center hover:bg-blue-600 transition text-sm md:text-base"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;