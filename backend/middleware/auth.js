// middleware/auth.js

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false, 
    message: 'Please log in to access this resource' 
  });
};

// Check if user is NOT authenticated (for login/signup routes)
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({ 
    success: false, 
    message: 'You are already logged in' 
  });
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};