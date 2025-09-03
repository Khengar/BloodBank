Basic authentication is working.
Mongodb is connected.
Patient donor feature is working. In order to use it you have to select option on the landing page.
Also, you can do changes to profile like: location, phone number.

To set the dependencies:
Run: "npm i " in both frontend and backend separately they have different dependencies. But they can be combined depending on the choice of developer.
After installing the dependencies. Set the .env file.
Mention the following details in .env file:
 - MONGO_URI
 - JWT_SECRET
 - FRONTEND_URL
 - PORT

Also, mention the /api target in "vite.config.ts" as per backend url.

Executing the code after installing dependencies:
 - "npm start" in backend folder
 - "npm run dev" in frontend folder
