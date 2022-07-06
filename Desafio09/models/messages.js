const mongoose = require('mongoose')

const messagesSchema = mongoose.Schema({
    author: {
        id: {
            type: String,
            equired: true
        },
        nombre: {
            type: String,
            equired: true
        },
        apellido: {
            type: String,
            equired: true
        },
        edad: {
            type: Number,
            equired: true
        },
        alias: {
            type: String,
            equired: true
        },
        avatar: {
            type: String,
            equired: true
        }
    },

    text: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    }
})

const MessagesSchema = mongoose.model('messages', messagesSchema)

module.exports = MessagesSchema