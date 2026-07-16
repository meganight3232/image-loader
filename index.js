const express = require('express');
const Jimp = require('jimp');
const app = express();

app.get('/convert', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send("Please provide an image URL.");

    try {
        const image = await Jimp.read(imageUrl);
        const pixels = [];

        // Resize to prevent Roblox from lagging/crashing
        if (image.bitmap.width > 150) {
            image.resize(150, Jimp.AUTO); 
        }

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const a = this.bitmap.data[idx + 3];
            if (a > 0) {
                pixels.push({ X: x, Y: y, A: a });
            }
        });

        res.json(pixels);
    } catch (err) {
        res.status(500).send("Error reading image.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Proxy is running!');
});
