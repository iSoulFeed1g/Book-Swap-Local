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
    const { title, description, email, price } = req.body;
    const picture = req.file ? req.file.path : 'uploads/1719331628307.png';

    if (!title || !description || !price) {
        return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const sql = "INSERT INTO posts (title, description, email, price, picture) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, description, email, price, picture], (err, data) => {
        if (err) {
            console.error("Error creating post:", err);
            return res.json({ message: "Error" });
        }
        return res.json({ message: "Success" });
    });
});

// Updade post endpoint
app.post('/update-post', upload.single('image'), (req, res) => {
    const { id, title, description, price } = req.body;
    const picture = req.file ? req.file.path : null;

    if (!title || !description || !price) {
        return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const sql = picture
        ? "UPDATE posts SET title = ?, description = ?, price = ?, picture = ? WHERE id = ?"
        : "UPDATE posts SET title = ?, description = ?, price = ? WHERE id = ?";

    const params = picture
        ? [title, description, price, picture, id]
        : [title, description, price, id];

    db.query(sql, params, (err, data) => {
        if (err) {
            console.error("Error updating post:", err);
            return res.json({ message: "Error" });
        }
        return res.json({ message: "Success" });
    });
});

// Endpoint to fetch all posts with user information
app.get('/all-posts', (req, res) => {
    const sql = `
        SELECT posts.*, login.name as user_name 
        FROM posts 
        JOIN login ON posts.email = login.email 
        ORDER BY posts.id DESC`;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching posts:", err);  // Log the error
            return res.json("Error");
        }
        return res.json(data);
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


// Search posts endpoint
app.get('/search-posts', (req, res) => {
    const searchQuery = req.query.q || '';
    const sql = `
        SELECT posts.*, login.name as user_name 
        FROM posts 
        JOIN login ON posts.email = login.email 
        WHERE posts.title LIKE ? OR posts.description LIKE ? 
        ORDER BY posts.id DESC`;

    db.query(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (err, data) => {
        if (err) {
            console.error("Error searching posts:", err);  // Log the error
            return res.json("Error");
        }
        return res.json(data);
    });
});


app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
