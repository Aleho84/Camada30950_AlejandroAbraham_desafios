const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    }
});

const ProductsSchema = mongoose.model('products', productsSchema);

module.exports = ProductsSchema;