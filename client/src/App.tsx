import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ObjectsList from './pages/ObjectsList';
import ObjectForm from './pages/ObjectForm';
import Locations from './pages/Locations';
import Categories from './pages/Categories';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/objects"
              element={
                <PrivateRoute>
                  <ObjectsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/objects/new"
              element={
                <PrivateRoute>
                  <ObjectForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/objects/:id/edit"
              element={
                <PrivateRoute>
                  <ObjectForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/objects/:id"
              element={
                <PrivateRoute>
                  <ObjectsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/locations"
              element={
                <PrivateRoute>
                  <Locations />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <Categories />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
