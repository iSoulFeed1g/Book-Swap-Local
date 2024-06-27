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
    port: 5306,
    password: '',
    database: 'SISIII2024_89211069'
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
    const defaultProfilePic = 'uploads/default_image.png'; // Path to default profile picture
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
app.post('/create-post', upload.single('picture'), (req, res) => {
    const { title, description, price, author, email } = req.body;
    const picture = req.file ? req.file.path : null;

    const sql = "INSERT INTO posts (title, description, price, author, picture, email) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, description, price, author, picture, email], (err, data) => {
        if (err) {
            console.error("Error creating post:", err);
            return res.status(500).json({ message: 'Error creating post' });
        }
        return res.json({ message: "Success" });
    });
});

// Update post endpoint
app.post('/edit-post', upload.single('picture'), (req, res) => {
    const { id, title, description, price, author } = req.body;
    const picture = req.file ? req.file.path : null;

    const updateQuery = `
        UPDATE posts
        SET title = ?, description = ?, price = ?, author = ?, picture = ?
        WHERE id = ?`;

    db.query(updateQuery, [title, description, price, author, picture, id], (err, data) => {
        if (err) {
            console.error("Error updating post:", err);
            return res.status(500).json({ message: 'Error updating post' });
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

// Delete post endpoint
app.post('/delete-post', (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM posts WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error deleting post:", err);
            return res.status(500).json({ message: 'Error deleting post' });
        }
        return res.json({ message: "Success" });
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

// Post Details and Own Post Details
app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const sql = `
        SELECT posts.*, login.name AS user_name, login.email AS user_email
        FROM posts
        JOIN login ON posts.email = login.email
        WHERE posts.id = ?`;
    db.query(sql, [postId], (err, data) => {
        if (err) {
            console.error("Error fetching post:", err);
            return res.status(500).json({ message: 'Error fetching post' });
        }
        return res.json(data[0]);
    });
});

// Update post endpoint
app.post('/edit-post', upload.single('picture'), (req, res) => {
    const { id, title, description, price, author } = req.body;
    const picture = req.file ? req.file.path : null;

    const updateQuery = `
        UPDATE posts
        SET title = ?, description = ?, price = ?, author = ?
        ${picture ? ', picture = ?' : ''}
        WHERE id = ?`;

    const queryParams = picture ? [title, description, price, author, picture, id] : [title, description, price, author, id];

    db.query(updateQuery, queryParams, (err, data) => {
        if (err) {
            console.error("Error updating post:", err);
            return res.status(500).json({ message: 'Error updating post' });
        }
        return res.json({ message: "Success" });
    });
});


app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
