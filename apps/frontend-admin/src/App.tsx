import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'reflect-metadata';
import Navigation from './features/navigation/Navigation';
import RestaurantPage from './features/restaurant/components/RestaurantPage';
import MenuPage from './features/menu/MenuPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/restaurant" replace />} />
          <Route path="/restaurant" element={<RestaurantPage />} />
          <Route path="/menu" element={<MenuPage />} />

          <Route path="*" element={
            <div className="p-8 text-center text-xl text-red-500">
              404 - Page Not Found
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;