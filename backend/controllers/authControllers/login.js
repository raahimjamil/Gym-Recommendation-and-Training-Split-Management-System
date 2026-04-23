import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your_jwt_secret_key';
import bcrypt from 'bcryptjs';
import pool from '../../db.js';

const login = async (req, res) => {
     const { email, password } = req.body;
     let days = 0;
     let split = '';
     let goal = '';

     if (!email || !password) {
          return res.status(400).json({ error: 'Please fill all fields' });
     }

     try {
          const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
          if (rows.length === 0) {
               return res.status(400).json({ error: 'Invalid credentials' });
          }

          const user = rows[0];
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
               return res.status(400).json({ error: 'Invalid credentials' });
          }

          const [rows2] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [user.id]);

          if (rows2.length > 0) {
               days = rows2[0].days;  // assuming days still exists or mapping appropriately
               split = rows2[0].split; // assuming split still exists
               goal = rows2[0].goal;
          }

          const payload = { email: user.email, id: user.id, name: user.name };
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

          res.cookie('token', token, {
               secure: false, // true in production
               httpOnly: true,
               maxAge: 24 * 60 * 60 * 1000
          });

          return res.json({
               success: true,
               name: user.name,
               days: days,
               split: split,
               goal: goal
          });

     } catch (err) {
          console.error('Login error:', err);
          return res.status(500).json({ error: 'Database error' });
     }
};
export default login;