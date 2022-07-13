import "dotenv/config";
import server from "./app.js";
import { connectDatabase } from "./lib/db.js";

function startServer() {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

connectDatabase()
  .then(startServer)
  .catch((error) => {
    console.log("Error connecting to database:", error.message);
  });
