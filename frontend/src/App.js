import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchRooms } from './store/slices/roomsSlice';
import { fetchSecurity } from './store/slices/securitySlice';
import { fetchEnergy } from './store/slices/energySlice';
import { fetchMedia } from './store/slices/mediaSlice';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchRooms()),
          dispatch(fetchSecurity()),
          dispatch(fetchEnergy()),
          dispatch(fetchMedia()),
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Smart Home...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;