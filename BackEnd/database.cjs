// Mongoose is the server-side link to MongoDB and our document models.
// This module shares that connection with the routes and Movie schema.
const mongoose = require('mongoose');

async function connectDatabase() {
  // Keep the private Atlas address outside the source files, tucked in .env.
  // Without an Atlas address, this project expects a local MongoDB service.
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  // Give this project its own database name, separate from the other work.
  // An environment value can choose another database without editing code.
  const database = process.env.MONGODB_DATABASE || 'lab7_mariia';

  // Wait for a real connection before opening the API port.
  // A short timeout gives us a clear startup failure instead of a long wait.
  await mongoose.connect(uri, {
    // Select the database explicitly even when the URI has no database path.
    dbName: database,
    // Limit how long the driver searches for an available MongoDB server.
    serverSelectionTimeoutMS: 5000,
    // A connected socket should not wait forever for a database reply.
    socketTimeoutMS: 10000
  });
}

// Export the connector for startup and the same mongoose instance for models.
// Requiring this file alone does not immediately open a network connection.
module.exports = { mongoose, connectDatabase };
