const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();

passport.serializeUser((user, done) => {
    // We only save the necessary user data (ID and display name) to the session.
    done(null, { 
        id: user.id, 
        displayName: user.displayName 
    });
});

// Used to deserialize the user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new GoogleStrategy({
    // 1. Get credentials from environment variables (your .env file)
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // 2. The URL where Google will redirect the user after authorization
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true 
},
    (request, accessToken, refreshToken, profile, done) => {
        // This function runs after a successful Google login.
        // It should save or retrieve the user from your database.
        
        // For CSE341, we typically just use the profile data directly.
        const user = {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value
        };
        
        // Pass the user object to the next middleware (auth callback)
        return done(null, user);
    }
));

module.exports = passport;