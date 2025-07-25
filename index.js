const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ROUTES

// Get all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add expense
app.post('/expenses', (req, res) => {
  const { title, amount, date, category } = req.body;
  db.query(
    'INSERT INTO expenses (title, amount, date, category) VALUES (?, ?, ?, ?)',
    [title, amount, date, category],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Expense added', id: result.insertId });
    }
  );
});

// Delete expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Expense deleted' });
  });
});

// Start server
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
require('dotenv').config();
