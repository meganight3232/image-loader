const express = require('express');
const Jimp = require('jimp');
const app = express();

app.get('/convert', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send("Please provide an image URL.");

    try {
        // Fetch and decode the image
        const image = await Jimp.read(imageUrl);
        const pixels = [];
        
        // Safety feature: Resize massive images to prevent Roblox from crashing/lagging
        if (image.bitmap.width > 150) {
            image.resize(150, Jimp.AUTO); 
        }

        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Scan the image and grab the pixels + RGB colors
        image.scan(0, 0, width, height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0]; // Red (0 - 255)
            const g = this.bitmap.data[idx + 1]; // Green (0 - 255)
            const b = this.bitmap.data[idx + 2]; // Blue (0 - 255)
            const a = this.bitmap.data[idx + 3]; // Alpha/Transparency (0 - 255)
            
            // Only capture non-transparent pixels
            if (a > 0) {
                pixels.push({ 
                    X: x, 
                    Y: y, 
                    R: r, 
                    G: g, 
                    B: b, 
                    A: a,
                    MaxY: height // Passed so Roblox knows how to flip the image right-side up
                });
            }
        });

        res.json(pixels);
    } catch (err) {
        res.status(500).send("Error reading image. Make sure it is a direct image link.");
    }
});

// Use Render's dynamically assigned port, fallback to 3000
app.listen(process.env.PORT || 3000, () => {
    console.log('Proxy is running!');
});
