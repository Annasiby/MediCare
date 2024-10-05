const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

// Create a MySQL connection pool for better performance and scalability
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10, // Set a reasonable limit for concurrent connections
  queueLimit: 0 // Unlimited queueing of connection requests
});

// Read the SQL schema from dbSchema.sql
const schema = fs.readFileSync('./models/dbSchema.sql', 'utf8');
const sqlStatements = schema.split(';').filter(stmt => stmt.trim()); // Filter out empty statements

// Function to check if the database exists
const checkDatabase = (connection) => {
  return new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to execute SQL statements
const executeSqlStatements = (connection, statements) => {
  return new Promise((resolve, reject) => {
    let index = 0;

    const next = () => {
      if (index < statements.length) {
        connection.query(statements[index], (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Table created successfully or already exists.');
            index++;
            next(); // Execute the next statement
          }
        });
      } else {
        resolve(); // All statements executed
      }
    };

    next(); // Start executing the first statement
  });
};

// Optional: Test the connection to the database when the module is loaded
pool.getConnection(async (err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }

  try {
    // Ensure the database exists
    await checkDatabase(connection);

    // Use the correct database
    connection.changeUser({ database: process.env.DB_NAME }, async (err) => {
      if (err) {
        console.error('Error changing database:', err.stack);
        return;
      }

      // Execute each SQL statement one by one
      await executeSqlStatements(connection, sqlStatements)
        .then(() => {
          console.log('All tables created successfully.');
        })
        .catch((err) => {
          console.error('Error creating tables:', err.stack);
        })
        .finally(() => {
          connection.release(); // Release the connection back to the pool
        });
    });
  } catch (err) {
    console.error('Database setup error:', err);
    connection.release(); // Ensure the connection is released in case of an error
  }
});

// Export the pool for use in other modules
module.exports = pool;
