import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from '../../node_modules/react-router-dom/dist/index';

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>404 Error</h1>
      {setTimeout(() => {
        navigate(-1);
      }, 3000)}
    </div>
  );
}

export default ErrorPage;
