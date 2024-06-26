const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 4306,
    password: '',
    database: 'sisiii_project'
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Signup endpoint
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`, `profile_pic`) VALUES (?)";
    const defaultProfilePic = 'uploads/1719331628307.png'; // Path to default profile picture
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        defaultProfilePic
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        // Fetch the newly created user
        const fetchSql = "SELECT * FROM login WHERE `email` = ?";
        db.query(fetchSql, [req.body.email], (fetchErr, fetchData) => {
            if (fetchErr) {
                return res.json("Error");
            }
            if (fetchData.length > 0) {
                return res.json(fetchData[0]); // Return user data
            } else {
                return res.json("Failed");
            }
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json(data[0]);  // Return user data
        } else {
            return res.json("Failed");
        }
    });
});

// Change password endpoint
app.post('/change-password', (req, res) => {
    const { email, newPassword } = req.body;
    const sqlUpdate = "UPDATE login SET password = ? WHERE email = ?";
    db.query(sqlUpdate, [newPassword, email], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

// Delete profile endpoint
app.post('/delete-profile', (req, res) => {
    const { email } = req.body;
    const sqlDelete = "DELETE FROM login WHERE email = ?";
    db.query(sqlDelete, [email], (err, result) => {
        if (err) {
            return res.json("Error");
        }
        if (result.affectedRows > 0) {
            return res.json("Success");
        } else {
            return res.json("User not found");
        }
    });
});

// Upload profile picture endpoint
app.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
    const { email } = req.body;
    const profilePicPath = req.file.path;

    const sqlUpdate = "UPDATE login SET profile_pic = ? WHERE email = ?";
    db.query(sqlUpdate, [profilePicPath, email], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json({ message: "Success", profilePicPath });
    });
});

// Create post endpoint
app.post('/create-post', upload.single('image'), (req, res) => {
    const { title, description, email } = req.body;
    const imagePath = req.file ? req.file.path : 'uploads/1719331628307.png'; // Default image path

    const sql = "INSERT INTO posts (title, picture, time, email, description) VALUES (?, ?, NOW(), ?, ?)";
    const values = [title, imagePath, email, description];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error" });
        }
        return res.json({ message: "Success" });
    });
});


// Endpoint to fetch posts by email
app.get('/posts', (req, res) => {
    const { email } = req.query;
    const sql = "SELECT * FROM posts WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Error fetching posts:", err);
            return res.status(500).json({ message: "Error", error: err });
        }
        return res.json(data);
    });
});

app.post('/delete-post', (req, res) => {
    const { id } = req.body;
    const sqlDelete = "DELETE FROM posts WHERE id = ?";
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            return res.json("Error");
        }
        if (result.affectedRows > 0) {
            return res.json({ message: "Success" });
        } else {
            return res.json("Post not found");
        }
    });
});

// Update post endpoint
app.post('/update-post', (req, res) => {
    const { id, title, description } = req.body;

    const sqlUpdate = "UPDATE posts SET title = ?, description = ? WHERE id = ?";
    db.query(sqlUpdate, [title, description, id], (err, result) => {
        if (err) {
            return res.json({ message: "Error" });
        }
        return res.json({ message: "Success" });
    });
});

// Endpoint to fetch all posts with user information
app.get('/all-posts', (req, res) => {
    const sql = `
        SELECT p.id, p.title, p.picture, p.time, p.email, p.description, l.name AS user_name
        FROM posts p
        JOIN login l ON p.email = l.email
        ORDER BY p.time DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching all posts:", err);
            return res.status(500).json({ message: "Error", error: err });
        }
        return res.json(data);
    });
});


app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
