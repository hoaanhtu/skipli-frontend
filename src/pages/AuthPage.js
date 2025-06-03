import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../App';

function AuthPage({ onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [authStep, setAuthStep] = useState(1);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    if (!phoneNumber) {
      setMessage('please enter your phone number.');
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/phone/create-access-code`, { phoneNumber });
      setMessage('Access code has been sent to your phone number. Please check your messages.');
      setAuthStep(2);
    } catch (error) {
      setMessage(error.response?.data?.error || 'cannot send access code. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessCodeSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    if (!accessCode) {
      setMessage('please enter your access code.');
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/phone/validate-access-code`, { phoneNumber, accessCode });
      onLoginSuccess(phoneNumber);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Access code is invalid or expired. Please try again.');
      setAccessCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  }


  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h1>Phone Number</h1>
      {isLoading && <p>processing</p>}
      {message && <p style={{ color: message.startsWith('Access code has been sent') ? 'green' : 'red', margin: '10px 0' }}>{message}</p>}

      {authStep === 1 && (
        <form onSubmit={handlePhoneSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="authPhoneNumber" style={{ display: 'block', marginBottom: '5px' }}>phone number:</label>
            <input type="tel" id="authPhoneNumber" value={phoneNumber} onChange={handleSetPhoneNumber} placeholder="Nhập số điện thoại" disabled={isLoading} style={{ width: '95%', padding: '10px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>sned access code</button>
        </form>
      )}

      {authStep === 2 && (
        <form onSubmit={handleAccessCodeSubmit}>
          <p>Success: <strong>{phoneNumber}</strong>.</p>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="authAccessCode" style={{ display: 'block', marginBottom: '5px' }}>accees code:</label>
            <input type="text" id="authAccessCode" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="enter your access code" disabled={isLoading} style={{ width: '95%', padding: '10px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>submit</button>
        </form>
      )}
    </div>
  );
}

export default AuthPage;