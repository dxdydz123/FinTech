import "dotenv/config";


import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[DB] using URL:`, process.env.DATABASE_URL);
    console.log(`Server running on port ${PORT}`);
});
