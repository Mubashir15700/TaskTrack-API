const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const UserRepository = require("../repositories/user");

const userRepository = new UserRepository();

passport.use(
    new OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await userRepository.checkExistingEmail(profile.email);

                if (!user) {
                    await userRepository.createUser(
                        profile.displayName,
                        profile.email,
                        null,
                        null,
                        null,
                        profile.email_verified
                    );
                }

                const signedInUser = await userRepository.findUserByEmail(profile.email);

                return done(null, signedInUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport; // Export the passport object
