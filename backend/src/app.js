const express = require('express');
const cors = require("cors");
const {db} = require('./config/firebase');

const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send('Hello World!');
})

app.get('/test-firebase', async(req, res) => {
    try {
        const collections = await db.listCollections();
        const collectionNames = collections.map(col => col.id);
        
        return res.json({ 
            success: true, 
            message: 'connect firebase successfully!',
            data: {
                collections: collectionNames.length > 0 ? collectionNames : 'did not have any collections',
                totalCollections: collectionNames.length
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'error connect to firebase', 
            error: error.message 
        });
    }
})

module.exports = app;