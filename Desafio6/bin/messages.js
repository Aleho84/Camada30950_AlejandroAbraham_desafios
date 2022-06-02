const fs = require('fs')
const resolve = require('path').resolve

class Messages {
    constructor(file, fileFormat) {
        this.file = file
        this.fileFormat = fileFormat
    }

    async #writeFile(data) {
        try {
            const path = resolve(this.file)
            await fs.writeFileSync(path, JSON.stringify(data, null, 2))
            return { message: `exito al escribir el archivo ${this.file}` }
        } catch (error) {
            throw error
        }
    }

    async #readFile() {
        try {
            const path = resolve(this.file)
            return await fs.readFileSync(path, this.fileFormat)
        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            let messages = []

            await this.#readFile()
                .then(response => {
                    messages = JSON.parse(response)
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
            let messages = []

            await this.#readFile()
                .then(response => {
                    messages = JSON.parse(response)
                    messages.push(newMessage)

                    this.#writeFile(messages)
                        .then(response => {
                            return newMessage
                        })
                        .catch(error => {
                            throw error
                        })
                })
                .catch(error => {
                    throw error
                })

            return messages
        } catch (error) {
            throw error
        }
    } 
}

module.exports = Messages