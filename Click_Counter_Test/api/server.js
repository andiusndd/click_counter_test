const { kv } = require('@vercel/kv');

// The function now takes req and res as arguments, standard for serverless functions
module.exports = async (req, res) => {
    // First, check if the Vercel KV environment variables are set.
    if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
        console.error('Vercel KV environment variables not found.');
        return res.status(500).json({ 
            error: 'Server configuration error. Please ensure the Vercel project is linked to a KV store.' 
        });
    }

    // We need to handle the different API routes within this single function
    if (req.url === '/api/counter') {
        try {
            let count = await kv.get('count');
            if (count === null) {
                count = 0;
            }
            res.status(200).json({ count });
        } catch (error) {
            console.error('Error reading from Vercel KV:', error);
            res.status(500).json({ error: 'Error reading count from Vercel KV' });
        }
    } else if (req.url === '/api/counter/increment' && req.method === 'POST') {
        try {
            const count = await kv.incr('count');
            res.status(200).json({ count });
        } catch (error) {
            console.error('Error updating Vercel KV:', error);
            res.status(500).json({ error: 'Error updating count in Vercel KV' });
        }
    } else {
        // Handle any other routes with a 404
        res.status(404).send('Not Found');
    }
};
