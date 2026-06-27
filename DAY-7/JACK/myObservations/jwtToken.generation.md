## when we use jwt tokens 
* Whenever the user wants to access a protected route (like viewing their profile or adding a todo item), they will show this ID card to your server to prove who they are without having to send their password every single time.
## 1. jwt.sign(...) 
* This is the built-in Mongoose/JSONWebToken method that actually manufactures the token. It takes three essential arguments to generate the string: The Payload, The Secret Key, and The Options.
## 2. { id } (The Payload)
This is the data you want to store inside the token.

By passing { id } (which is shorthand for { id: id }), you are embedding the user's unique MongoDB database ID into the token itself.

Later, when the user sends this token back to your server, your backend can decode it and instantly know exactly which user is making the request.

## 3. process.env.JWT_SECRET (The Secret Key)
This is a private, secret string stored in your environment variables (.env file) that only your backend knows.

The jwt.sign method uses this key to cryptographically "sign" the token.

This makes the token completely tamper-proof. If a malicious user tries to alter the ID inside their token, the signature becomes invalid, and your server will reject it.

4. { expiresIn: '7d' } (The Options)
This sets the expiration lifespan of the token.

In your code, '7d' means the token is valid for 7 days.

After 7 days, the token automatically expires, and the user will be forced to log in again to get a fresh one. This is a standard security practice.