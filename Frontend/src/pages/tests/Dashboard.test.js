import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useNavigate } from 'react-router-dom';
import useFavorites from '../../context/useFavorites';

// Mock the useFavorites hook
jest.mock('../../context/useFavorites');

// Mock react-router-dom components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock the fetch API
beforeAll(() => {
  global.fetch = jest.fn();
});

// Mock the window.scrollTo function
beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe('Dashboard Component', () => {
  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States' },
      flags: { png: 'https://flagcdn.com/w320/us.png' },
      region: 'Americas',
      capital: ['Washington, D.C.'],
      population: 329484123,
      currencies: { USD: { name: 'United States dollar', symbol: '$' } },
      unMember: true,
    },
    {
      cca3: 'GBR',
      name: { common: 'United Kingdom' },
      flags: { png: 'https://flagcdn.com/w320/gb.png' },
      region: 'Europe',
      capital: ['London'],
      population: 67215293,
      currencies: { GBP: { name: 'British pound', symbol: '£' } },
      unMember: true,
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock for useFavorites
    useFavorites.mockImplementation(() => ({
      favorites: [],
      toggleFavorite: jest.fn(),
    }));

    // Setup mock for useNavigate
    useNavigate.mockReturnValue(jest.fn());

    // Setup default mock for fetch
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCountries,
    });
  });

  test('renders dashboard with welcome message', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/Welcome, Hettiarachchi!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for a country/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Region/i)).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Loading countries/i)).toBeInTheDocument();
  });

  test('displays countries after successful fetch', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    await act(async () => {
      render(<Dashboard />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  test('handles search functionality', async () => {
    const searchResponse = [mockCountries[0]]; // Only return US
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries, // Initial load
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => searchResponse, // Search response
    });
    
    await act(async () => {
      render(<Dashboard />);
    });
    
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    const searchButton = screen.getByText('Search');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'United States' } });
      fireEvent.click(searchButton);
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('United States'));
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.queryByText('United Kingdom')).not.toBeInTheDocument();
    });
  });

  test('handles region filtering', async () => {
    const regionResponse = [mockCountries[0]]; // Only return US
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries, // Initial load
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => regionResponse, // Region filter response
    });
    
    await act(async () => {
      render(<Dashboard />);
    });
    
    const regionFilter = screen.getByRole('combobox');
    
    await act(async () => {
      fireEvent.change(regionFilter, { target: { value: 'Americas' } });
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('Americas'));
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.queryByText('United Kingdom')).not.toBeInTheDocument();
    });
  });

  test('toggles favorite status', async () => {
    const mockToggleFavorite = jest.fn();
    useFavorites.mockImplementation(() => ({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    }));
    
    await act(async () => {
      render(<Dashboard />);
    });
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
    
    // Get all star icons (favorite buttons)
    const starIcons = screen.getAllByTestId('star-icon');
    expect(starIcons.length).toBe(2);
    
    await act(async () => {
      fireEvent.click(starIcons[0]); // Click first star icon (USA)
    });
    
    expect(mockToggleFavorite).toHaveBeenCalledWith('USA');
  });

  test('shows favorite count in navigation', () => {
    useFavorites.mockImplementation(() => ({
      favorites: ['USA', 'GBR'],
      toggleFavorite: jest.fn(),
    }));
    
    render(<Dashboard />);
    expect(screen.getByText(/Favorites \(2\)/i)).toBeInTheDocument();
  });

  test('displays UN member badge for UN member countries', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    
    await waitFor(() => {
      const unBadges = screen.getAllByText('UN Member');
      expect(unBadges.length).toBe(2); // Both mock countries are UN members
    });
  });

  test('handles missing country data gracefully', async () => {
    const countryWithMissingData = {
      cca3: 'TST',
      name: { common: 'Testland' },
      flags: { png: 'test-flag.png' },
      region: 'Test Region',
      // Missing capital, population, currencies
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [countryWithMissingData],
    });
    
    await act(async () => {
      render(<Dashboard />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Testland')).toBeInTheDocument();
      expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
    });
  });
});