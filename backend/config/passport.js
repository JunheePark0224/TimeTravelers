// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('./db');

// Local Strategy for email/password login
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find user by email
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Remove password from user object
    delete user.password;
    return done(null, user);

  } catch (error) {
    return done(error);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, name, birth_date, created_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return done(null, false);
    }

    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;