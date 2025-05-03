import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Details = () => {
  const { cca3 } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${cca3}`);
        if (!response.ok) throw new Error('Failed to fetch country details');
        const [data] = await response.json();
        setCountry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryDetails();
  }, [cca3]);

  // Helper functions
  const getCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol || ''})`)
      .join(', ');
  };

  const getLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  const getBorders = (borders) => {
    if (!borders || borders.length === 0) return 'None';
    return borders.join(', ');
  };

  const getCallingCodes = (idd) => {
    if (!idd || !idd.root) return 'N/A';
    return `${idd.root}${idd.suffixes?.[0] || ''}`;
  };

  const getDemonyms = (demonyms) => {
    if (!demonyms) return 'N/A';
    return demonyms.eng?.m || 'N/A';
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-gradient-to-br from-blue-700 to-purple-800 overflow-auto">
      {/* Header */}
      <header className="w-full bg-blue-500 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-0">Country Explorer</h1>
          <nav className="flex flex-wrap justify-center gap-3 md:gap-6">
            <Link to="/" className="text-white hover:text-blue-100 transition text-sm md:text-base">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-blue-100 transition text-sm md:text-base">Dashboard</Link>
            <Link to="/favorites" className="text-white hover:text-blue-100 transition text-sm md:text-base">Favorites</Link>
            <button className="bg-white text-blue-500 px-3 md:px-6 py-1 md:py-2 rounded-md hover:bg-blue-50 transition font-medium text-sm md:text-base">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-center text-white text-lg">Loading country details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-2xl mx-auto">
            <p className="font-medium">{error}</p>
            <Link 
              to="/dashboard" 
              className="mt-3 inline-block bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-100 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : country ? (
          <div 
            className={`bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 ${isHovered ? 'transform scale-[1.01]' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Flag and Basic Info */}
              <div className="lg:w-1/3">
                <div className="relative overflow-hidden rounded-lg shadow-md mb-4 aspect-video">
                  <img
                    src={country.flags?.png || "/api/placeholder/400/300"}
                    alt={`${country.name?.common} flag`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {country.coatOfArms?.png && (
                    <div className="absolute bottom-2 right-2 bg-white/80 p-1 rounded">
                      <img 
                        src={country.coatOfArms.png} 
                        alt="Coat of Arms" 
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{country.name?.common}</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  {country.region} {country.subregion && `• ${country.subregion}`}
                </p>
                
                {country.unMember && (
                  <div className="mt-2 inline-block bg-green-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full">
                    UN Member
                  </div>
                )}
              </div>

              {/* Detailed Information */}
              <div className="lg:w-2/3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Official Name</h3>
                    <p className="text-gray-600 text-sm md:text-base">{country.name?.official || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Capital</h3>
                    <p className="text-gray-600 text-sm md:text-base">{country.capital?.join(', ') || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Population</h3>
                    <p className="text-gray-600 text-sm md:text-base">{country.population?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Area</h3>
                    <p className="text-gray-600 text-sm md:text-base">{country.area?.toLocaleString()} km²</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Currency</h3>
                    <p className="text-gray-600 text-sm md:text-base">{getCurrencies(country.currencies)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Languages</h3>
                    <p className="text-gray-600 text-sm md:text-base">{getLanguages(country.languages)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Demonym</h3>
                    <p className="text-gray-600 text-sm md:text-base">{getDemonyms(country.demonyms)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Calling Code</h3>
                    <p className="text-gray-600 text-sm md:text-base">{getCallingCodes(country.idd)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Country Codes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                      <div>
                        <span className="text-xs text-gray-500">CCA2</span>
                        <p className="text-gray-600 text-sm md:text-base">{country.cca2 || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">CCA3</span>
                        <p className="text-gray-600 text-sm md:text-base">{country.cca3 || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">CCN3</span>
                        <p className="text-gray-600 text-sm md:text-base">{country.ccn3 || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">CIOC</span>
                        <p className="text-gray-600 text-sm md:text-base">{country.cioc || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Bordering Countries</h3>
                    <p className="text-gray-600 text-sm md:text-base break-words">{getBorders(country.borders)}</p>
                  </div>
                </div>

                {/* Map Link */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">Location</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <a
                      href={country.maps?.googleMaps || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm md:text-base"
                    >
                      Google Maps
                    </a>
                    {country.maps?.openStreetMaps && (
                      <a
                        href={country.maps.openStreetMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm md:text-base"
                      >
                        OpenStreetMap
                      </a>
                    )}
                  </div>
                </div>

                {/* Timezones and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Timezones</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {country.timezones?.join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Status</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {country.independent ? 'Independent' : 'Non-independent'}
                      {country.status && ` • ${country.status}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 flex justify-center sm:justify-start">
              <Link
                to="/dashboard"
                className="bg-blue-500 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-600 transition text-sm md:text-base"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Details;