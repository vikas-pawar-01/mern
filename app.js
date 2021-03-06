const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const placesRoute = require('./routes/places-routes');
const usersRoute = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
// app.use(express.static(path.join('public')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin-, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places', placesRoute);

app.use('/api/users', usersRoute);

// app.use((req, res, next) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// })

app.use((req, res, next) => {
    next(new HttpError('Could not find this route.', 404));
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }

    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({ message: error.message });
});

app.listen(process.env.PORT || 5000);

// mongoose
//     .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v4byc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
//     .then(() => {
//         app.listen(process.env.PORT || 5000);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
