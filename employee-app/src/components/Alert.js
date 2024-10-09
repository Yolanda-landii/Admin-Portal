import React from 'react';
// import './Alert.css'; 

const Alert = ({ message, type }) => (
  <div className={`alert alert-${type}`}>
    {message}
  </div>
);

export default Alert;
