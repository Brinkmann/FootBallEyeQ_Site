import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2' ;
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "football_app",
  port: 3306 // optional, 3306 is the default port
});

db.connect((err: any) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.post('/register', async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, organization } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO login (email, password, first_name, last_name, organization)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [email, hashedPassword, first_name, last_name, organization], (err: any) => {
      if (err) {
        console.error("Registration failed:", err);
        return res.status(500).json({ message: "Error registering user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM login WHERE email = ?";
  db.query(sql, [email], async (err: any, results: any) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.status(200).json({ message: "Login successful", user });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.listen(8811, () => {
  console.log('Server running at http://localhost:8811');
});
