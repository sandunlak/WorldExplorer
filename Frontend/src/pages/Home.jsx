import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Explore Countries
        </h1>
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a country..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>
          </div>
          <select
            value={region}
            onChange={(e) => {
              setSearchTerm('');
              setRegion(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by Region</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <Link
                key={country.cca3}
                to={`/country/${country.cca3}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={country.flags.png}
                  alt={`${country.name.common} flag`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {country.name.common}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Region:</strong> {country.region}
                  </p>
                  <p className="text-gray-600">
                    <strong>Population:</strong>{' '}
                    {country.population.toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Languages:</strong>{' '}
                    {country.languages
                      ? Object.values(country.languages).join(', ')
                      : 'N/A'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;