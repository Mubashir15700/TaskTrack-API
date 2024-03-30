const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const UserRepository = require("../repositories/user");
const ReasonRepository = require("../repositories/reason");

const userRepository = new UserRepository();
const reasonRepository = new ReasonRepository();

passport.use(
    new OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
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

                if (user.isBlocked) {
                    const blockReason = await reasonRepository.findBlockReason(
                        user._id, "admin_block_user"
                    );

                    // Return an error to indicate that the user is blocked
                    const error = new Error(`Your account has been blocked. ${blockReason.reason}`);
                    error.status = 403; // Set the HTTP status code
                    return done(error);
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
