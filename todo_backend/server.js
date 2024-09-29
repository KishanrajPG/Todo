const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Middleware
app.use(express.json()); // For parsing application/json

// Configure MySQL connection to AWS Aurora
const dbConfig = {
  host: 'tododatabase-instance-1.clokse64abxd.us-east-1.rds.amazonaws.com', // Aurora endpoint
  user: 'admin', // MySQL username
  password: 'todoroot', // MySQL password
  port: 3306, // Default MySQL port
};

// Create a connection to MySQL
const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Check if the database exists, and create it if it doesn't
  const dbName = 'tododatabase'; // Replace with your actual database name

  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log(`Database ${dbName} checked/created`);

    // Switch to the database
    connection.changeUser({ database: dbName }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }
      console.log(`Switched to database: ${dbName}`);

      // Create the 'todos' table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL
        )`;
      
      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          return;
        }
        console.log('Table "todos" checked/created');
      });
    });
  });
});

// Create a new Todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  const query = 'INSERT INTO todos (title) VALUES (?)';
  connection.query(query, [title], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, title });
  });
});

// Read all Todos
app.get('/todos', (req, res) => {
  const query = 'SELECT * FROM todos';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// // Update a Todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const query = 'UPDATE todos SET title = ? WHERE id = ?';
  connection.query(query, [title, id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ id, title });
  });
});

// // Delete a Todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM todos WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(204).send();
  });
});

// Start the server
app.get('/', (req, res) => {
    res.send('Welcome to the Todo API');
  });
  
  // Create a new Todo
  app.post('/todos', (req, res) => {
    const { title } = req.body;
    const query = 'INSERT INTO todos (title) VALUES (?)';
    connection.query(query, [title], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: results.insertId, title });
    });
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
