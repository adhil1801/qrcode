
import React, { useState, useEffect } from 'react';
import './CookieNotice.css';

const CookieNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="card cookie-notice">
      <div className="title">🍪 Cookie Policy</div>
      <div className="description">
        We use cookies to enhance your experience and provide personalized content. 
        By clicking "Accept", you consent to our use of cookies as described in our 
        <span className="prefs"> Privacy Policy</span>. You can manage your preferences 
        or learn more about our data practices.
      </div>
      <div className="actions">
        <button className="decline" onClick={handleDecline}>
          Decline
        </button>
        <button className="valid" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;
