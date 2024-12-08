const mongoose = require('mongoose');
const Car = require('./models/Car');

mongoose.connect('mongodb://localhost:27017/car_management')
    .then(() => {
        console.log('MongoDB connected');
        return Car.insertMany([
            { make: 'Toyota', model: 'Corolla', year: 2020, price: 20000 },
            { make: 'Honda', model: 'Civic', year: 2019, price: 22000 },
            { make: 'Ford', model: 'Mustang', year: 2021, price: 30000 }
        ]);
    })
    .then(() => {
        console.log('Sample data inserted');
        return mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        mongoose.disconnect();
    });
