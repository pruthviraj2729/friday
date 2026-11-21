import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { config } from "./config/env.js";

await connectDatabase();
app.listen(config.port, () => {
  console.log(`Friday auth server listening on port ${config.port}`);
});
