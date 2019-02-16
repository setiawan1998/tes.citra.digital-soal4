if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const GoogleStrategy = require('passport-google-oauth')
    .OAuth2Strategy;

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: '1096125716136-u0jc3719cef3f3g4qkkq119pb9g3hp1u.apps.googleusercontent.com',
        clientSecret: '2d2o8kCFPohB_GoyPry2Akp_',
        callbackURL: '/auth/google/callback'
    }, (token, refreshToken, profile, done) => {
        const data = {
            name: profile.displayName,
            token: token
        }
        localStorage.setItem("dataUser", JSON.stringify(data));
        return done(null, {
            profile: profile,
            token: token
        });
    }));
};