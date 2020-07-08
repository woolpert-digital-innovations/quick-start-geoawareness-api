const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const repository = require('./src/repository');
const ingestPublisher = require('./src/publisher');

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('REST API listening on port ', port);
});

app.get('/', async (req, res) => {
    res.send('Welcome to GeoAwareness REST API');
});

app.get('/stores', async (req, res) => {
    try {
        const stores = await repository.getStores();
        res.json(stores);
    } catch (error) {
        console.error(error);
        next(error);
    }
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
        console.error(error);
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
        console.error(error);
        next(error);
    }
});

app.patch('/orders/:orderId', async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        if (!orderId) {
            throw ('Order ID is required.');
        }
        let patch = req.body;

        const storeName = patch.storeName;
        if (!storeName) {
            throw ('Store name not found in request body.');
        }

        let orderOriginal = await repository.getOrder(orderId, storeName);
        if (!orderOriginal) {
            throw (`Order ${orderId} not found for store ${storeName}.`);
        }
        const order = {
            orderId: orderId,
            ...orderOriginal,
            ...patch
        }

        await repository.saveOrder(order);

        res.status(204).send();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.post('/events', async (req, res, next) => {
    try {
        const evt = req.body;
        console.log('event: ', evt);
        ingestPublisher.publishMessage(evt);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        next(error);
    }
});