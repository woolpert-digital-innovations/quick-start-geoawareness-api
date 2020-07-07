const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// const repository = require('./fake-repository');
const repository = require('./repository');

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('REST API listening on port ', port);
});

app.get('/', async (req, res) => {
    res.json('Welcome to GeoAwareness REST API');
});

app.get('/stores', async (req, res) => {
    const stores = await repository.getStores();
    res.json(stores);
});

app.get('/geofences', async (req, res) => {
    try {
        const storeName = req.query.storeName;
        if (!storeName) {
            throw ('Store name is required.');
        }
        const geofences = await repository.getGeofencesByStore(storeName);
        res.json(geofences);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

app.get('/orders', async (req, res, next) => {
    try {
        const storeName = req.query.storeName;
        if (!storeName) {
            throw ('Store name is required.');
        }
        const orders = await repository.getOrdersByStore(storeName);
        res.json(orders);
    } catch (error) {
        console.log(error);
        next(error);
    }
});