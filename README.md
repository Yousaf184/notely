# notes-app

Take notes in markdown format

## How to run the app locally?

1. Create a `.env` file containing the following environment variables:

   ```
   PORT=<some port number>
   NODE_ENV=development
   JWT_SECRET_KEY=<you jwt secret key>
   DATABASE_URI=<mongodb connection url>
   ```

2. Run `npm install`

3. Run `npm run dev` and visit the following url: `http:localhost:<port>/notes`
