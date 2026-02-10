module.exports = async (req, res) => {
    // ALLOW ALL ORIGINS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const wpUrl = `http://awoplatfrm-blog-app.atwebpages.com/wp-json/wp/v2${req.url}`;

    try {
        const response = await fetch(wpUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};