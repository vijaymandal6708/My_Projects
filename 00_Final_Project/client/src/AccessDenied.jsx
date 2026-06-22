import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#343a40',
      textAlign: 'center',
      padding: '20px'
    },
    title: {
      fontSize: '4rem',
      margin: '0 0 1rem 0',
      color: '#212529'
    },
    message: {
      fontSize: '1.25rem',
      maxWidth: '600px',
      lineHeight: '1.6',
      color: '#6c757d'
    },
    divider: {
      width: '50px',
      height: '4px',
      backgroundColor: '#dee2e6',
      margin: '2rem 0',
      borderRadius: '2px'
    },
    link: {
      marginTop: '1.5rem',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      textDecoration: 'none',
      borderRadius: '5px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403</h1>
      <p style={styles.message}>
        The doors remain closed. Access to this resource is currently restricted 
        and you are not authorized to proceed.
      </p>
      <div style={styles.divider} />
      <small>Please verify your credentials or return to the safety of the main dashboard.</small>
      
      <Link to="/login" style={styles.link}>
        Return to Login
      </Link>
    </div>
  );
};

export default AccessDenied;