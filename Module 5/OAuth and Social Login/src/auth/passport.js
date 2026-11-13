Kalvium


BMT


Progress indicator


brain
dot
5.2 OAuth & Social Login
5.2
OAuth & Social Login

A product manager asks
for one feature: Continue with Google.The worst way to build it is to ask the user
for their Google password and store it.That single decision would hand your app access to their Gmail, Drive, and recovery email— and turn one breach of your database into a breach of their entire digital life.Users should never trust you with a password they did not create
for you.

OAuth lets a user grant your app limited access without sharing their password.Passport.js runs the Google flow;
your server verifies or creates the user, then issues its own JWT so the API stays stateless.

By the end of this lesson, you will be able to:

    Name the four OAuth 2.0 actors and explain each one 's responsibility.
Trace the authorization code flow from redirect to code to token exchange to profile.
Configure Google login with Passport.js and GoogleStrategy.
Use the verify callback to find, link, or create a user safely.
Issue your own app JWT after OAuth instead of forwarding Google 's token.
Handle existing local accounts without duplicates or account takeover.
1
Why OAuth
2
The Four Actors
3
Authorization Code Flow
4
Passport.js
5
Issuing the App JWT
6
Account Linking▶
Check Understanding◆
OAuth Flow Tracer▶
Watch◆
Threadbase✎
Recap & Practice✦
Mind Map⚡
For Fast Learners
1
Why OAuth Exists

delegate access· never share passwords

OAuth 2.0 is a delegation framework.It lets a user grant your app limited access to something they own— their Google identity, their calendar, their repositories— without ever giving your app their password.When a user clicks Continue with Google, they authenticate directly with Google.Your app receives a provider - issued token proving Google verified them, plus permission to read only the fields you asked
for.

This is fundamentally different from the password login you built earlier.In password login, your server checks the password.In Google login, Google checks its own session, and your app trusts the result because it arrives through a signed, provider - controlled flow.Your server never sees the Google password at any point.

✗Password - sharing(wrong)

App asks
for the Google password
App stores a third - party credential
App gains full account access
One breach exposes everything✓ OAuth delegation(right)

User authenticates with Google
App receives a scoped token
Password never reaches your server
Access is limited and revocable
One clarification that trips people up: OAuth 2.0 is an authorization framework— it delegates access.It does not by itself tell you who the user is.That identity layer is OpenID Connect(OIDC), a thin standard built on top of OAuth.When you request scope: openid email profile, that is OIDC riding over the OAuth channel— and Passport.js handles both together.

Takeaway: OAuth is not "give another app my password."
It is "let this app do one approved thing on my behalf through a provider-issued token."
OIDC adds the identity layer on top.

2
The Four OAuth Actors

owner· client· authorization server· resource server

Every OAuth flow becomes clear once you can name the four actors.These exact names appear in the OAuth specification and in every provider 's docs.

Resource Owner

The user.Owns the data and grants consent.In Threadbase, the person clicking "Continue with Google."

Client

Your Express app.Requests access and handles the callback.Holds the client secret on the server.

Authorization Server

accounts.google.com.Authenticates the user, shows consent, issues the code and tokens.

Resource Server

googleapis.com.Holds the user 's profile data and accepts the access token.

who talks to whom

User Browser→ Your App→ Google OAuth→ Google API
// The user authenticates with Google directly.
// Your app never handles the Google password —
// it only receives a scoped, time-limited token.
Takeaway: your app is the OAuth client.Google is both the authorization server(login + consent) and the resource server(profile data).The user owns the data and grants consent.

3
The Authorization Code Flow

redirect→ code→ token exchange→ profile

The authorization code flow is the correct OAuth flow
for server - side apps.The crucial idea: the browser only ever receives a short - lived code, never the final token.Your server exchanges that code
for tokens directly with Google, using the client secret— server to server, out of the browser 's reach.

1 Redirect

Your app redirects the browser to Google with client_id, redirect_uri, scope, and a random state.

2 Consent

Google authenticates the user and shows the requested scopes.The user clicks Allow.

3 Code

Google redirects back to your callback URL with a short - lived, single - use authorization code.

4E xchange

Your server sends code + client_secret to Google, server - to - server, and receives tokens.

5 Profile

Your server reads the user 's identity fields (sub, email, name) from the token or userinfo endpoint.

6 App JWT

Your app finds or creates the local user, then signs its own JWT and returns it.

Step 1— the first redirect— carries the parameters that define the request:

    step 1— redirect the browser to Google

GET https: //accounts.google.com/o/oauth2/v2/auth
    ?
    response_type = code // ask for a code, not a token
    &
    client_id = YOUR_CLIENT_ID &
    redirect_uri = /auth/google / callback &
    scope = openid email profile // OIDC identity fields
    &
    state = random - csrf - token // echoed back to prevent forgery
Step 4— the code exchange— is the security - critical step.It happens on your server, never in the browser:

    step 4— exchange the code(server - to - server)

POST https: //oauth2.googleapis.com/token
    code = AUTHORIZATION_CODE &
    client_id = YOUR_CLIENT_ID &
    client_secret = YOUR_CLIENT_SECRET // never in the browser!
    &
    redirect_uri = /auth/google / callback &
    grant_type = authorization_code⚠ Why not
let the browser do the exchange ?

        The exchange requires the client_secret.If that secret lived in browser JavaScript, anyone could view - source it and impersonate your app.The authorization code flow keeps the secret on your server;
    the browser only ever holds a single - use code that expires in about 60 seconds.

Takeaway: the browser receives a short - lived code;
your server exchanges it
for tokens server - to - server so the client secret never leaves the backend.That is what makes this flow safe
for Express apps.

4
Google Login with Passport.js

strategy config· verify callback· done()

Passport.js is middleware that standardizes authentication.A strategy is a provider - specific plugin.passport - google - oauth20 knows how to build the redirect,
    catch the callback code, exchange it, and fetch the Google profile.You configure the strategy once and write the verify callback— the part where you decide which local user the Google profile maps to.

src / auth / passport.js— configure the GoogleStrategy

const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    },
    async(accessToken, refreshToken, profile, done) => {
        // profile.id → Google sub (stable id)
        // profile.emails[0] → email + verification flag
        // your job: map this profile to a local user
        return done(null, user);
    }
));
The verify callback is the bridge between Google 's identity world and your application'
s user table.Google knows the user as a stable sub;
Threadbase knows them as an internal id with a role.The callback converts one into the other.How you finish it decides what Passport does next:

    done(null, user)

Success.Passport sets req.user.

done(null, false)

Login rejected— not a server error.

done(err)

Unexpected error→ Passport returns 500.

Two routes wire it up.The first triggers the redirect to Google;
the second is where Google sends the user back.Both use session: false because Threadbase is a stateless JWT API— no session cookies.

src / routes / auth.js— the two OAuth routes

// 1. trigger the OAuth flow
router.get('/google',
    passport.authenticate('google', { scope: ['openid', 'email', 'profile'], session: false }));
// 2. Google redirects the user back here
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => { // req.user is set by the verify callback
        const token = signToken({ sub: req.user.id, role: req.user.role });
        res.json({ token });
    });
Takeaway: Passport runs the OAuth protocol;
your verify callback maps the Google profile to a local user with done(null, user).Use session: false to keep the API stateless.

5
Issuing Your Own App JWT

Google 's token is not your API token

After OAuth succeeds, your server knows which local user logged in .A tempting mistake is to hand Google 's access_token to the client and use it as the session credential. That token belongs to Google'
s APIs, not yours.Instead, issue your own JWT— the exact same token shape you already use everywhere
else .

Google access token Your app JWT
Scoped to Google 's APIs	Scoped to your API
Expires on Google 's schedule	Expires when you decide
Carries no Threadbase role Carries sub and role
May need a Google round - trip to validate Verified locally with your secret
issue the app JWT— same signToken as the password flow

const token = jwt.sign({ sub: user.id, role: user.role }, // your claims
    process.env.ACCESS_SECRET, // your secret
    { algorithm: 'HS256', expiresIn: '15m' }
);
// the client sends this on every request:
// Authorization: Bearer <token>
// requireAuth verifies it locally — Google is never contacted again
Because the token shape is identical to earlier lessons, requireAuth still verifies it and requireRole still reads the role.Your protected routes do not know or care whether the login came from a password or from Google— the authentication method ends at the callback route.

    Takeaway: OAuth proves identity through Google, but your app still issues its own JWT
for your API.Never forward Google 's access token to the client — it is for Google, not for you.

6
Existing Accounts and Safe Linking

googleId first· verified email only· member
default

Real users often already have a local account before Google login is added.Your verify callback must avoid two failures: creating a duplicate account, and allowing an account takeover.The safe pattern handles three cases in a fixed order.

the verify callback— find, link, or create

const googleId = profile.id;
const email = profile.emails[0].value;
// 1. returning OAuth user — matched by stable googleId
let user = await User.findOne({ googleId });
if (user) return done(null, user);
// 2. existing local account — link ONLY if Google verified the email
user = await User.findOne({ email });
if (user) {
    if (!profile._json.email_verified) return done(null, false);
    user.googleId = googleId;
    await user.save();
    return done(null, user);
}
// 3. brand-new user — create at lowest privilege
user = await User.create({ googleId, email, name: profile.displayName, role: 'member' });
return done(null, user);
The order is not cosmetic.profile.id(the Google sub) is stable and permanent, so it is the primary lookup key.Email is only a linking fallback
for a first - time OAuth login, because emails can change.And before linking by email you must check email_verified— otherwise an attacker with an unverified Google account could claim someone
else 's Threadbase account just by using their email address.

Store googleId as a sparse unique field

Add googleId as a nullable, indexed, unique field.sparse: true lets many local - only accounts keep a null googleId
while still enforcing uniqueness
for linked accounts— so no two users can ever share one Google identity.

Takeaway: look up by Google sub first, link by verified email second, create a member account last.That order prevents both duplicate accounts and account takeover.

▶
Check Your Understanding

five scenarios— pick the correct decision, check the reasoning


◆
OAuth Flow Tracer

step through every actor and every HTTP hop

Click through the complete authorization code flow.Each step highlights which actors are talking, shows the exact HTTP request or response, and explains what it means.


▶
Watch: OAuth 2.0 in Two Views

flow + tokens· then roles + consent

Two short explainers reinforce the scenes from different angles.The first walks the authorization code flow and shows how access tokens and JWTs fit together.The second uses a bank - login example to make the four actors, the client ID / secret, and the consent step concrete.As you watch, map each idea back to the verify callback and the two routes from Scene 4.

1— OAuth 2.0 explained: the flow, tokens, and JWTs


2— OAuth 2.0 overview: roles, consent, and the authorization code grant


◆
Threadbase— Google login, one token model

OAuth enters· the same app JWT leaves

Threadbase adds Google login without touching the protected API surface.Google owns the login ceremony, but Threadbase owns application identity: once Google proves who the user is, Threadbase maps that profile to its own user record, keeps its own role, and signs its own access token.Every route downstream stays exactly as it was.

threadbase / src / auth / passport.js

passport.use(new GoogleStrategy(googleOptions,
    async(accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id;
            const email = profile.emails[0].value;
            // returning OAuth user
            let user = await User.findOne({ googleId });
            if (user) return done(null, user);
            // link existing account — only if verified
            user = await User.findOne({ email });
            if (user) {
                if (!profile._json.email_verified) return done(null, false);
                user.googleId = googleId;
                await user.save();
                return done(null, user);
            }
            // brand-new member
            user = await User.create({ googleId, email, role: 'member' });
            return done(null, user);
        } catch (err) { return done(err); }
    }));
Threadbase OAuth flow

GET / auth / google— Passport builds the redirect;
the browser goes to Google.
GET / auth / google / callback— Passport exchanges the code and fetches the profile.
Verify callback maps the profile: returning user, verified - email link, or new member.
Threadbase signs { sub: user.id, role: user.role }
and returns its own JWT.
Every protected route still runs requireAuth then requireRole— unaware of how login happened.
Checks you would run

redirect_uri matches Google Console exactly.
session: false on both Passport routes.
googleId indexed, unique, sparse.
email_verified checked before linking.
App JWT carries sub and role.
What never to do

    Store a Google password.
Return Google 's access token as your API token.
Create a duplicate on an email match.
Link an unverified email.
Put the client secret in frontend code.✎
Recap and Practice

say the flow aloud· reason about the edge cases

Practice prompts

Name the four actors and map each to Google login.
Explain why the code exchange must be server - to - server, and what leaks
if it is not.
Explain why profile.id is a better lookup key than email.
Explain the attack that email_verified prevents during account linking.
Explain why your API issues its own JWT instead of forwarding Google 's access token.
Common misconceptions

    "OAuth logs the user in for me."
OAuth authorizes access;
OIDC adds identity.You still create / find a local user and issue your own token.
"I can use Google's access token as my session."
It is scoped to Google and expires on Google 's schedule. Issue your own JWT with your claims.
"Match users by email."
Emails change and can be unverified.Match by the stable sub;
link by email only when verified.
"The client secret can live in the frontend."
Never.It belongs on the server;
the browser only ever holds the short - lived code.
Ready - to - ship checklist

Tick every item before calling Google login production - ready

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and ACCESS_SECRET live in environment variables— never committed.
The callback URL in code matches the authorised redirect URI in Google Cloud Console exactly.
Both Passport routes use session: false so the API stays stateless.
The verify callback looks up users by profile.id / sub first.
Email is only a linking fallback, used only when email_verified is true.
New OAuth accounts
default to role: 'member';
no OAuth login can self - promote.
Google 's access_token is never returned to the client as an API credential.
Your app signs its own JWT with { sub, role }, HS256, and a short expiry.
Downstream routes still use requireAuth and requireRole unchanged.
OAuth failure redirects to a controlled error route, not an unhandled 500.
Requested scopes are minimal— openid email profile unless a feature truly needs more.✦
OAuth & Social Login Mind Map

OAuth 2.0 and Social Login mind map— actors, authorization code flow, Passport.js strategy, app JWT issuance, safe account linking
FOR FAST LEARNERS

Beyond the basic Google flow

PKCE
for public clients

Single - page apps and mobile apps cannot keep a client secret.PKCE(Proof Key
    for Code Exchange) replaces the secret with a one - time code_verifier / code_challenge pair, closing the code - interception attack.It is now recommended
for all clients, not just public ones.

id_token vs userinfo

OIDC returns a signed id_token(a JWT) alongside the access token.You can verify it locally with Google 's public keys instead of calling the userinfo endpoint — one fewer network round-trip per login. Passport can be configured to read either.

Multiple providers

Add GitHub, Apple, or Microsoft by registering more Passport strategies.Keep one users table with a providers sub - document(provider + providerId) so a single account can link several logins without duplicates.

Refresh & revocation

Request access_type = offline to receive a refresh_token
for long - lived Google API access.Store it encrypted, and handle revocation: if Google returns invalid_grant, the user unlinked your app— prompt them to reconnect.

Bonus Content

This section is optional, and learners who want to explore the topics covered so far can utilise the materials provided below.

Passport.js— GoogleStrategy documentation
Google— OAuth 2.0 protocol reference
OpenID Connect Core— the identity layer over OAuth
RFC 9700— OAuth 2.0 Security Best Current Practice
You can now name the OAuth actors, trace the authorization code flow, configure Google login with Passport.js, map a profile to a local user safely, and issue your own app JWT so the API stays stateless.Happy learning!

    test
Assignment
Best Score
    -
    score
cta
Complete this assignment to show your understanding of the concepts you 've learned.

target
Get 60 % or more
timer
60 m
container
Start Assignmentarrow
assignment
OAuth & Social Login

00 h 59 m 55 s
Add Google OAuth login to an existing Express API.The authentication middleware and JWT utilities are already provided.Your job is to implement the verifyCallback that decides what to do with a Google profile, and the callback route handler that issues your own app JWT.

    Starter project
Start from the starter code here: Starter Repo.Copy it into your repository, implement the task, commit your changes, push your branch, and submit the pull request(PR) link.

What is already provided
The starter includes a working Express application with:

    src / data.js— an in -memory user store with three pre - seeded users.One has a googleId already set(returning OAuth user).One has a matching email but no googleId(linking test).One is an admin with no OAuth account.
src / utils / jwt.js— signToken(payload) and verifyToken(token).Both work correctly.Use signToken.
src / middleware / requireAuth.js— the JWT verification middleware from LU51.Given and working.
src / routes / posts.js— a protected GET / posts route used in tests to verify your issued JWT is real.
src / app.js— Express setup, Passport initialised, all routes mounted.Do not modify.
src / auth / passport.js— the GoogleStrategy is configured(clientID, clientSecret, callbackURL).The verifyCallback is a stub that calls done(null, false).
src / routes / auth.js— the / auth / google trigger route is given.The / auth / google / callback handler is a stub that returns an error.
tests / run.js— the full automated test suite.Do not modify.
Your task
File 1: src / auth / passport.js— implement verifyCallback

The verify callback receives a verified Google profile and must decide which user to
return .It must handle exactly three scenarios, checked in this order:

    First, check
if a user in the store already has a googleId matching profile.id.If yes, this is a returning OAuth user— call done(null, user) and
return .

Second, check
if any user has an email matching profile.emails[0].value.If yes, this is an existing local account using Google login
for the first time.Before linking, check profile._json.email_verified.If it is true, set user.googleId = profile.id and call done(null, user).If email_verified is false, call done(null, false)— never link an unverified email, because an attacker could use it to take over someone
else 's account.

Third,
if there is no match at all, create a new user object: { id: nextId(), googleId: profile.id, email, name, role: 'member' }, push it into users, and call done(null, newUser).

On any unexpected error, call done(err).

File 2: src / routes / auth.js— implement the callback handler

The passport.authenticate middleware is already there.After it runs, req.user is the user returned by your verifyCallback.Your handler must call signToken({ sub: req.user.id, role: req.user.role }) and respond with res.json({ token }).

Rules
verifyCallback is exported from src / auth / passport.js— the test calls it directly without a browser.
Read only from profile.id, profile.emails[0].value, profile.displayName, and profile._json.email_verified.Do not trust any other source.
Always use profile.id(Google 's stable sub) as the primary lookup key, not the email.
        Always
        default new users to role: 'member'.Never forward Google 's accessToken to the client. Issue your own token with signToken.
        Do not modify src / data.js, src / app.js, src / routes / posts.js, src / utils / jwt.js, src / middleware / requireAuth.js, or tests / run.js.Test cases Run npm test.The suite calls verifyCallback directly with mock profiles and makes HTTP requests to the running server.There are nine scenarios and 18 assertions:

        Bob 's profile has a googleId that matches an existing user — returns the existing user with his moderator role intact. No duplicate is created.

        Alice 's profile has an email that matches an existing local account with no googleId — returns the existing user with the googleId now set. No new user is created. This is the link operation.

        Carol 's profile has no match at all — returns a new user object. The store grows by one.

        Carol 's new user has role: '
        member '. New accounts always start at the lowest role.

        Carol 's new user has googleId equal to profile.id. The Google identity is stored.

        An attacker profile that matches Alice 's email but has email_verified: false — returns false (rejected). Alice'
        s existing googleId is not changed.This is the security test: unverified emails must never be used to link accounts.

        signToken({ sub, role }) produces a JWT that verifyToken can decode.The sub and role claims are present and correct.

        That JWT passes requireAuth on GET / posts and returns status 200 with the correct userId.

        A request with no token returns 401. This comes from requireAuth and confirms you did not accidentally remove the protection.

        When all scenarios pass, the suite prints Results: 18 passed, 0 failed.

        Security expectations Your PR description must answer two questions:

        Why is the order of the three checks(googleId→ email→ create) important ? What goes wrong
        if you check email before googleId ?
        Why do you issue your own JWT instead of returning Google 's accessToken to the client?
        Submission guidelines Fork or clone the starter repo.Create a branch : git checkout - b lu55 - oauth - YOUR_NAME.Implement verifyCallback and the callback handler.Run npm test— confirm Results : 18 passed, 0 failed.Open a PR against the main branch.Write a PR description that answers the two security questions above.Submit the PR link.Submission Instructions Fork the shared course repository to your GitHub account only once.The same repository contains starter code
        for multiple assignments.Clone your fork and open the project folder specified in this assignment.Do not create a separate repository
        for each assignment.Switch to the main branch, pull the latest changes, and create a new branch
        for this assignment.Complete the assignment only in the specified project folder.Commit your changes and push the assignment branch to your fork.Create a Pull Request(PR) from your assignment branch to the main branch of your own fork.Before creating the PR, verify that the base repository shows your GitHub username, not kalviumcommunity.Submit the PR link as your assignment submission.Need help ? Watch : How to create a branch and submit changes through a pull request If you do not have access to the KalviumCommunity GitHub organization, submit the Access Request Form.

        This assignment covers the following concepts Github PR URL *
        eg.https: //github.com/kalviumcommunity/repo/pull/34
        Ensure the shared url is active and accessible.

        Submit Authorization & RBAC API Security Principles Support Student App | Kalvium