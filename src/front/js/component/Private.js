import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Private() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Welcome to the private page!</div>;
}

export default Private;