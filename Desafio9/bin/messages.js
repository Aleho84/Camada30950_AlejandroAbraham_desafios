const _options = JSON.parse(process.env.knex_msqlite3)

class Messages {
    constructor() {
        this.knex = require('knex')(_options)
    }

    async getAll() {
        try {
            let messages = []

            await this.knex.from('messages').select('*')
                .then(rows => {
                    let message = {}
                    rows.forEach(row => {
                        message = {
                            id: row.id,
                            email: row.email,
                            timestamp: row.timestamp,
                            message: row.message
                        }
                        messages.push(message)
                        message = {}
                    })
                    return messages
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
            let newID = 0

            await this.knex('messages').insert(newMessage)
                .then(response => {
                    newID = response
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
