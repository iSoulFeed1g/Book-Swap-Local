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
        SELECT posts.*, login.name AS user_name, login.email AS user_email, login.id AS user_id
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

// Get all chats for a user
app.get('/chats', (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const sql = `
        SELECT chats.id, 
               CASE 
                   WHEN chats.buyer_id = ? THEN seller.name 
                   ELSE buyer.name 
               END AS chat_name
        FROM chats
        JOIN login AS buyer ON chats.buyer_id = buyer.id
        JOIN login AS seller ON chats.seller_id = seller.id
        WHERE buyer_id = ? OR seller_id = ?`;
    db.query(sql, [user_id, user_id, user_id], (err, data) => {
        if (err) {
            console.error("Error fetching chats:", err);
            return res.status(500).json({ message: "Error fetching chats", error: err });
        }
        return res.json(data);
    });
});

app.get('/inbox/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT 
            chats.id, 
            login.name, 
            login.profile_pic, 
            MAX(messages.timestamp) as lastMessageTime,
            SUBSTRING_INDEX(GROUP_CONCAT(messages.message ORDER BY messages.timestamp DESC), ',', 1) as lastMessage,
            SUBSTRING_INDEX(GROUP_CONCAT(messages.user_email ORDER BY messages.timestamp DESC), ',', 1) as lastMessageSender
        FROM 
            chats
        JOIN 
            login ON (chats.buyer_id = login.id OR chats.seller_id = login.id)
        LEFT JOIN 
            messages ON messages.chat_id = chats.id
        WHERE 
            (chats.buyer_id = ? OR chats.seller_id = ?)
        GROUP BY 
            chats.id, login.name, login.profile_pic
        ORDER BY 
            lastMessageTime DESC
    `;
    
    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});



app.get('/inbox/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const userIdResult = await pool.query('SELECT id FROM login WHERE email = $1', [email]);
        const userId = userIdResult.rows[0].id;

        const chatsResult = await pool.query(
            `SELECT DISTINCT ON (c.chat_id) c.chat_id, l.profile_pic, l.name
             FROM chats c
             JOIN login l ON (c.buyer_id = l.id OR c.seller_id = l.id)
             WHERE $1 IN (c.buyer_id, c.seller_id)`,
            [userId]
        );
        
        res.json(chatsResult.rows);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});






app.get('/getChats/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query('SELECT * FROM chats WHERE buyer_id = ? OR seller_id = ?', [userId, userId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
});

app.get('/getUserById/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query('SELECT id, name FROM login WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results[0]);
    });
});

app.post('/createChat', (req, res) => {
    const { buyer_id, seller_id } = req.body;

    if (!buyer_id || !seller_id) {
        return res.status(400).json({ message: 'buyer_id and seller_id are required' });
    }

    const query = `
        SELECT id 
        FROM chats 
        WHERE (buyer_id = ? AND seller_id = ?) 
           OR (buyer_id = ? AND seller_id = ?)`;

    db.query(query, [buyer_id, seller_id, seller_id, buyer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking for existing chat', error: err });
        }

        if (results.length > 0) {
            // Chat already exists
            return res.json({ chat_id: results[0].id });
        }

        // Create a new chat if it doesn't exist
        const insertQuery = 'INSERT INTO chats (buyer_id, seller_id) VALUES (?, ?)';
        db.query(insertQuery, [buyer_id, seller_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating chat', error: err });
            }
            return res.json({ chat_id: result.insertId });
        });
    });
});

// Endpoint to fetch chats for a user
app.get('/chats/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const query = `
        SELECT chats.id, buyer.email AS buyer_email, seller.email AS seller_email
        FROM chats
        JOIN login AS buyer ON chats.buyer_id = buyer.id
        JOIN login AS seller ON chats.seller_id = seller.id
        WHERE buyer.id = ? OR seller.id = ?`;

    db.query(query, [user_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to fetch chats' });
        }
        res.status(200).send(result);
    });
});

// Endpoint to fetch messages for a chat
app.get('/messages/:chat_id', (req, res) => {
    const chat_id = req.params.chat_id;

    const query = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp';
    db.query(query, [chat_id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to fetch messages' });
        }
        res.status(200).send(result);
    });
});

app.post('/messages', (req, res) => {
    const { chat_id, user_email, message } = req.body;
    db.query(
        "INSERT INTO messages (chat_id, user_email, message) VALUES (?, ?, ?)",
        [chat_id, user_email, message],
        (err, result) => {
            if (err) {
                res.send({ err });
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
