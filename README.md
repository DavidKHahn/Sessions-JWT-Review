### Sessions-JWT-Review

"**Token authentication**

 - A request to the server is signed by a "token" - usually it means setting specific http headers, however, they can be sent in any part of the http request (POST body, etc.)

**Pros:**

 - You can authorize only the requests you wish to authorize. (Cookies
  even the authorization cookie are sent for every single request.)
 - Immune to XSRF (Short example of XSRF - I'll send you a link in email that will look like <img src="http://bank.com?withdraw=1000&to=myself" />, and if you're logged in via cookie authentication to bank.com, and bank.com doesn't have any means of XSRF protection, I'll withdraw money from your account simply by the fact that your browser will trigger an authorized GET request to that url.) Note there are anti forgery measure you can do with cookie-based authentication - but you have to implement those.
 - Cookies are bound to a single domain. A cookie created on the domain foo.com can't be read by the domain bar.com, while you can send tokens to any domain you like. This is especially useful for single page applications that are consuming multiple services that are requiring authorization - so I can have a web app on the domain myapp.com that can make authorized client-side requests to myservice1.com and to myservice2.com.

**Cons:**
 - You have to store the token somewhere; while cookies are stored "out of the box". The locations that comes to mind are localStorage (con: the token is persisted even after you close browser window), sessionStorage (pro: the token is discarded after you close browser window, con: opening a link in a new tab will render that tab anonymous) and cookies (Pro: the token is discarded after you close the browser window. If you use a session cookie you will be authenticated when opening a link in a new tab, and you're immune to XSRF since you're ignoring the cookie for authentication, you're just using it as token storage. Con: cookies are sent out for every single request. If this cookie is not marked as https only, you're open to man in the middle attacks.)
 - It is slightly easier to do XSS attack against token based authentication (i.e. if I'm able to run an injected script on your site, I can steal your token; however, cookie based authentication is not a silver bullet either - while cookies marked as http-only can't be read by the client, the client can still make requests on your behalf that will automatically include the authorization cookie.)
 - Requests to download a file, which is supposed to work only for authorized users, requires you to use File API. The same request works out of the box for cookie-based authentication.
Cookie authentication

 - A request to the server is always signed in by authorization cookie.

**Pros:**

 - Cookies can be marked as "http-only" which makes them impossible to be read on the client side. This is better for XSS-attack protection.
 - Comes out of the box - you don't have to implement any code on the client side.

**Cons:**

 - Bound to a single domain. (So if you have a single page application that makes requests to multiple services, you can end up doing crazy stuff like a reverse proxy.)
 - Vulnerable to XSRF. You have to implement extra measures to make your site protected against cross site request forgery.
 - Are sent out for every single request, (even for requests that don't require authentication)."

 (Credit: https://stackoverflow.com/questions/17000835/token-authentication-vs-cookies)

**JWT Token:** https://jwt.io/