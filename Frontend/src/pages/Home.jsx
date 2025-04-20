import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">
          WorldExplorer
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up">
          Embark on a journey to discover the world's countries, cultures, and wonders
        </p>
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 animate-pulse"
          >
            Start Exploring
          </Link>
          <Link
            to="/about"
            className="inline-block border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;