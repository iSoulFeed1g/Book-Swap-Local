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
    database: 'sisiii2024_89211069'
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../frontEnd/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontEnd/build/index.html'));
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
    const sql = "SELECT * FROM login WHERE `email` = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.status(500).json("Error");
        }
        if (data.length === 0) {
            return res.status(401).json("Account does not exist");
        } else {
            const user = data[0];
            if (user.password === req.body.password) {
                return res.json(user); // Return user data
            } else {
                return res.status(401).json("Incorrect password");
            }
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

// Route to delete a user
app.post('/delete-user', (req, res) => {
    const email = req.body.email;

    const deleteChatsQuery = 'DELETE FROM chats WHERE buyer_id = (SELECT id FROM login WHERE email = ?)';
    const deleteUserQuery = 'DELETE FROM login WHERE email = ?';

    db.query(deleteChatsQuery, [email], (err, result) => {
        if (err) {
            console.error('Error deleting chats:', err);
            res.status(500).send('Failed to delete user chats');
            return;
        }
        db.query(deleteUserQuery, [email], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                res.status(500).send('Failed to delete user');
                return;
            }
            res.send('Success');
        });
    });
});

// Upload profile picture endpoint
app.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
    const email = req.body.email;
    const profilePicPath = req.file.path;
  
    const sql = 'UPDATE login SET profile_pic = ? WHERE email = ?';
    db.query(sql, [profilePicPath, email], (err, result) => {
      if (err) {
        console.error('Error updating profile picture:', err);
        return res.status(500).json({ message: 'Failed' });
      }
      return res.json({ message: 'Success', profilePicPath: profilePicPath });
    });
  });

// Create post endpoint
app.post('/create-post', upload.single('picture'), (req, res) => {
    const { title, description, price, author, email, genre } = req.body;
    const picture = req.file ? req.file.path : null;

    const sql = "INSERT INTO posts (title, description, price, author, picture, email, genre) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, description, price, author, picture, email, genre], (err, data) => {
        if (err) {
            console.error("Error creating post:", err);
            return res.status(500).json({ message: 'Error creating post' });
        }
        return res.json({ message: "Success" });
    });
});

// Update post endpoint
app.post('/edit-post', upload.single('picture'), (req, res) => {
    const { id, title, description, price, author, genre } = req.body;
    const picture = req.file ? req.file.path : null;

    const updateQuery = `
        UPDATE posts
        SET title = ?, description = ?, price = ?, author = ?, genre = ?
        ${picture ? ', picture = ?' : ''}
        WHERE id = ?`;

    const queryParams = picture ? [title, description, price, author, genre, picture, id] : [title, description, price, author, genre, id];

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

// Endpoint to fetch posts with user names
app.get('/posts', (req, res) => {
    const { searchTerm, price, genre, sortBy, email } = req.query;
    let query = `
        SELECT posts.*, login.name as user_name 
        FROM posts 
        LEFT JOIN login ON posts.email = login.email 
        WHERE 1=1
    `;
    const queryParams = [];

    if (email) {
        query += ' AND posts.email = ?';
        queryParams.push(email);
    }

    if (searchTerm) {
        query += ' AND (title LIKE ? OR author LIKE ? OR description LIKE ?)';
        queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (price) {
        query += ' AND price <= ?';
        queryParams.push(price);
    }

    if (genre) {
        query += ' AND genre = ?';
        queryParams.push(genre);
    }

    if (sortBy) {
        if (sortBy === 'newest') {
            query += ' ORDER BY time DESC';
        } else if (sortBy === 'oldest') {
            query += ' ORDER BY time ASC';
        } else if (sortBy === 'priceAsc') {
            query += ' ORDER BY price ASC';
        } else if (sortBy === 'priceDesc') {
            query += ' ORDER BY price DESC';
        }
    } else {
        query += ' ORDER BY time DESC'; // Default sorting order
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.log('Error fetching posts:', err);
            res.status(500).send('Error fetching posts.');
        } else {
            res.json(results);
        }
    });
});


// Post Details Fetching Endpoint
app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const sql = `
        SELECT posts.*, login.id AS user_id, login.name AS user_name, login.email AS user_email, login.profile_pic AS user_profile_pic
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

// Ensure Chat Creation
app.post('/createChat', (req, res) => {
    const { buyer_id, seller_id, post_id, postImage, postTitle } = req.body;
    const query = 'SELECT id FROM chats WHERE (buyer_id = ? AND seller_id = ? AND post_id = ?) OR (buyer_id = ? AND seller_id = ? AND post_id = ?)';
    const values = [buyer_id, seller_id, post_id, seller_id, buyer_id, post_id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error checking for existing chat:', err);
            res.status(500).json({ error: 'Error checking for existing chat' });
        } else if (result.length > 0) {
            res.json({ chat_id: result[0].id });
        } else {
            const createQuery = 'INSERT INTO chats (buyer_id, seller_id, post_id, postImage, postTitle) VALUES (?, ?, ?, ?, ?)';
            const createValues = [buyer_id, seller_id, post_id, postImage, postTitle];

            db.query(createQuery, createValues, (err, result) => {
                if (err) {
                    console.error('Error creating chat:', err);
                    res.status(500).json({ error: 'Error creating chat' });
                } else {
                    res.json({ chat_id: result.insertId });
                }
            });
        }
    });
});

app.get('/chats/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const query = 'SELECT * FROM chats WHERE buyer_id = ? OR seller_id = ?';
    const values = [user_id, user_id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error retrieving chats:', err);
            res.status(500).json({ error: 'Error retrieving chats' });
        } else {
            res.json(result);
        }
    });
});

app.get('/messages/:chat_id', (req, res) => {
    const chat_id = req.params.chat_id;

    const query = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC';
    const values = [chat_id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error retrieving messages:', err);
            res.status(500).json({ error: 'Error retrieving messages' });
        } else {
            res.json(result);
        }
    });
});


app.post('/messages', (req, res) => {
    const { chat_id, user_email, message, postImage, postTitle } = req.body;
    const query = `
        INSERT INTO messages (chat_id, user_email, message, timestamp, postImage, postTitle)
        VALUES (?, ?, ?, NOW(), ?, ?)
    `;
    db.query(query, [chat_id, user_email, message, postImage, postTitle], (err, results) => {
        if (err) {
            console.error('Error saving message:', err);
            res.status(500).send('Server error');
            return;
        }
        res.send('Message saved');
    });
});

// Endpoint to fetch all inbox for a user
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

// Fetch genres endpoint
app.get('/genres', (req, res) => {
    db.query('SELECT * FROM genres', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error fetching genres');
        } else {
            res.json(results);
        }
    });
});

// Filter posts endpoint
app.get('/filter-posts', (req, res) => {
    const { query, sortBy, genre } = req.query;
    let sql = `
        SELECT posts.*, login.name as user_name 
        FROM posts 
        JOIN login ON posts.email = login.email 
        WHERE posts.title LIKE ? OR posts.description LIKE ?
    `;

    const values = [`%${query}%`, `%${query}%`];

    if (genre) {
        sql += ` AND posts.genre = ?`;
        values.push(genre);
    }

    if (sortBy) {
        if (sortBy === 'date') {
            sql += ` ORDER BY posts.created_at DESC`;
        } else if (sortBy === 'price') {
            sql += ` ORDER BY posts.price ASC`;
        } else if (sortBy === 'author') {
            sql += ` ORDER BY posts.author ASC`;
        }
    } else {
        sql += ` ORDER BY posts.id DESC`;
    }

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error filtering posts:", err);
            return res.status(500).json("Error");
        }
        return res.json(data);
    });
});


app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
