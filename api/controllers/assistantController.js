const geolib = require('geolib');


app.post('/directions', (req, res) => {
    // const { origin, destination } = req.body;
    const origin = { latitude: 37.7749, longitude: -122.4194 };
    const destination = { latitude: 34.0522, longitude: -118.2437 };
    const distance = geolib.getDistance(origin, destination);

    res.json({ distance });
});