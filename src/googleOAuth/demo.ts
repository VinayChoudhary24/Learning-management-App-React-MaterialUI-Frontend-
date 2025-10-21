// import { OAuth2Client } from "google-auth-library";

// const CLIENT_ID =
// const CLIENT_SECRET =

// // Create an OAuth2 client with the given credentials
// const oauth2Client = new OAuth2Client(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   "http://localhost:5173/oauth2/callback" // Redirect URL
// );

// // Generate the URL for consent page landing
// const scopes = [
//   "https://www.googleapis.com/auth/userinfo.profile",
//   "https://www.googleapis.com/auth/userinfo.email",
// ];
// export const url = oauth2Client.generateAuthUrl({
//   access_type: "offline",
//   scope: scopes,
//   redirect_uri: "http://localhost:5173/oauth2/callback",
// });

// // 1. We will make the call to this Route
// // write a route handler for /auth/google
// app.get("/auth/google", (req, res) => {
//   res.redirect(url);
// });

// // 2. Google will call this route after successful authentication 'Authorized redirect URIs'
// app.get("/oauth2/callback", async (req, res) => {
//   const code = req.query.code as string;
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);
//   console.log("Tokens:", tokens.id_token);
//   return res.send("Authentication successful! You can close this window.");
//   // You can also redirect the user to your app's frontend
//   // res.redirect('http://localhost:5173');
// });
