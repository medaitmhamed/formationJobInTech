const express = require("express");
const dotenv = require("dotenv");
const { router } = require("./router.js");
const { connectToDatabase } = require("./config/database");

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use("/", router);

async function start() {
  try {
    await connectToDatabase(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Échec du démarrage de l'application :", err.message);
    process.exit(1);
  }
}

start();
