import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD475y2fyqq2le-yZvdpCoiju2xpVyf6gQ",
  authDomain: "carefundingportal1.firebaseapp.com",
  projectId: "carefundingportal1",
  storageBucket: "carefundingportal1.firebasestorage.app",
  messagingSenderId: "91542314102",
  appId: "1:91542314102:web:ed02f2bbe2b31d353b9357"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => signOut(auth);

  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial' }}>
      <img src='/care-funding-logo.png' alt='Logo' height='80' />
      <h1>Care Funding Group</h1>
      <h2>The Funders That Care</h2>
      {!user ? (
        <div style={{ marginTop: 20 }}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, margin: 5 }}
          />
          <br />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, margin: 5 }}
          />
          <br />
          <button onClick={login} style={{ padding: '10px 20px', marginTop: 10 }}>
            Login
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h3>Welcome, {user.email}</h3>
          <button onClick={logout} style={{ padding: '10px 20px' }}>Logout</button>
        </div>
      )}
    </div>
  );
}
