// schema
const MessagesSchema = require('../models/messages.js')

class Messages {
    constructor() { }

    async getAll() {
        try {
            let messages = []

            await MessagesSchema.find({})
                .then((response) => {
                    messages = response
                })
                .catch(error => {
                    throw error
                })

            return messages
        } catch (error) {
            throw error
        }
    }

    async add(newMessage) {
        try {
            let newID = ''
            const addMessage = new MessagesSchema({
                author: {
                    id: newMessage.email,
                    nombre: newMessage.firstname,
                    apellido: newMessage.lastname,
                    edad: newMessage.age,
                    alias: newMessage.nickname,
                    avatar: newMessage.avatar
                },
                text: newMessage.message
            })

            await addMessage.save()
                .then((response) => {
                    newID = response._id
                })
                .catch(error => {
                    throw error
                })

            return newID
        } catch (error) {
            throw error
        }
    }
}

module.exports = Messages
