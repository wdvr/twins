import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const UserNamePopup = ({ showPopup, setShowPopup }) => {
  const [name, setName] = useState('');
  const [cookies, setCookie] = useCookies(['userName']);

  useEffect(() => {
    // Check if the userName cookie exists
    if (!cookies.userName) {
      // If not, show the popup
      setShowPopup(true);
    } else {
      // If exists, send the name to Google Analytics
      sendNameToGA(cookies.userName);
    }
  }, [cookies.userName, setShowPopup]);

  const handleNameSubmit = () => {
    // Set the cookie for 30 days
    setCookie('userName', name, { path: '/', maxAge: 2592000 });
    sendNameToGA(name);
    setShowPopup(false);
  };

  const sendNameToGA = (userName) => {
    // Assuming you're using gtag for Google Analytics
    window.gtag('event', 'username_set', {
      'event_category': 'User',
      'event_label': userName,
    });
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div class="popup">
      <h2>Hurray, hurray!</h2>
      <p>Welcome to this online gender reveal party. Please enter your name below to get started.
</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={handleNameSubmit}>Get started!</button>
    </div>
  );
};

export default UserNamePopup;
