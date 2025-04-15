import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      {user?.photo && (
        <img 
          src={`http://localhost:7001/uploads/${user.photo}`} 
          alt="Profile" 
          className="profile-photo"
        />
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;