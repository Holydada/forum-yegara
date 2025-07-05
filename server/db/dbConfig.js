const mysql2 = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Create connection pool
const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST, // e.g., "104.152.168.209"
  user: process.env.DB_USER, // e.g., "dawitayn.evangadi-admin"
  password: process.env.DB_PASS, // e.g., "Holyghost321@@#"
  database: process.env.DB_NAME, // e.g., "dawitayn.evangadi-forum"
  port: 3306, // Explicitly set MySQL port
  connectionLimit: 10, // Optional: Set a reasonable max limit
  waitForConnections: true, // Optional: Wait for available connections
  queueLimit: 0, // Optional: No limit on queue request size
});

// Test initial connection
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the application if connection fails
  } else {
    console.log("Successfully connected to the database.");
    connection.release(); // Release the connection back to the pool
  }
});

// Test the pool with a promise-based query
dbConnection
  .promise()
  .query("SELECT 1") // Test query to verify connection
  .then(() => console.log("Database pool is operational"))
  .catch((err) => {
    console.error("Database pool test failed:", err.message);
    process.exit(1);
  });

module.exports = dbConnection.promise(); // Export promise-based interface
