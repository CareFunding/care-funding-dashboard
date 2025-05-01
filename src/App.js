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
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => signOut(auth);

  const handleUpload = async (event) => {
    const selected = event.target.files[0];
    setFile(selected);
    const formData = new FormData();
    formData.append('file', selected);

    const res = await fetch('https://bank-parser-api.onrender.com/upload?return_only_json=true', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    setData(result);
  };

  const downloadPDF = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://bank-parser-api.onrender.com/upload', {
      method: 'POST',
      body: formData
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CareFunding_Watermarked.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
        <img src='/care-funding-logo.png' alt='Logo' height='80' />
        <h1>Care Funding Group</h1>
        <h3>The Funders That Care</h3>
        <input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 8, width: '100%', marginBottom: 10 }} />
        <input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 8, width: '100%', marginBottom: 10 }} />
        <button onClick={login} style={{ padding: 10, width: '100%' }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <img src='/care-funding-logo.png' alt='Logo' height='80' />
      <h1>Care Funding Group</h1>
      <p>The Funders That Care</p>
      <button onClick={logout} style={{ marginBottom: 20 }}>Logout</button>

      <div style={{ marginBottom: 20 }}>
        <input type='file' onChange={handleUpload} />
      </div>

      {data && (
        <div style={{ margin: 'auto', textAlign: 'left', maxWidth: 600 }}>
          <h3>Underwriting Summary</h3>
          <p><strong>Avg Monthly Deposits:</strong> ${data.averageDeposits}</p>
          <p><strong>Total MCA Payments:</strong> ${data.totalMcaPayments}</p>
          <p><strong>Leverage:</strong> {data.leveragePercent}%</p>
          <p><strong>Status:</strong> {data.leveragePercent < 30 ? 'Eligible' : data.leveragePercent <= 45 ? 'High Risk' : 'Decline'}</p>
          <p><strong>Industry:</strong> {data.industryEstimate.join(', ')}</p>
          <p><strong>Negative Balance Days:</strong></p>
          <ul>{Object.entries(data.negativeDaysPerMonth).map(([month, days]) => (
            <li key={month}>{month}: {days} days</li>
          ))}</ul>
          <button onClick={downloadPDF} style={{ marginTop: 20 }}>Download Watermarked PDF</button>
        </div>
      )}
    </div>
  );
}
