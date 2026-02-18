const config = {
  API_URL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? '/api' 
             : 'http://localhost:8000/api')
};

export default config;
