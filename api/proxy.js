module.exports = async (req, res) => {
    // ALLOW ALL ORIGINS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Remove /api/proxy from the URL
    const wpPath = req.url.replace(/^\/api\/proxy/, '');
    const wpUrl = `http://awoplatfrm-blog-app.atwebpages.com/wp-json${wpPath}`;

    console.log('Proxy:', req.url, '→', wpUrl);
    console.log('Auth Header:', req.headers.authorization ? 'Present' : 'Missing');

    try {
        const response = await fetch(wpUrl, {
            method: req.method,

            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || '' // CRITICAL: Forward auth header
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
