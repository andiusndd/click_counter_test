const express = require('express');
const { kv } = require('@vercel/kv');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to get the current count
app.get('/api/counter', async (req, res) => {
    try {
        let count = await kv.get('count');
        if (count === null) {
            count = 0;
        }
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Error reading count from Vercel KV' });
    }
});

// Endpoint to increment the count
app.post('/api/counter/increment', async (req, res) => {
    try {
        const count = await kv.incr('count');
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Error updating count in Vercel KV' });
    }
});

// Serve the index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
