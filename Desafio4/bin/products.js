const fs = require('fs')
const resolve = require('path').resolve

class Products {
    constructor(file, fileFormat) {
        this.file = file
        this.fileFormat = fileFormat
        this.#getMaxId()
    }

    #maxId = 0

    async #writeFile(data) {
        return await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2))
    }

    async #readFile() {
        return await fs.promises.readFile(this.file, this.fileFormat)
    }

    async #deleteFile(file) {
        let path = resolve('./public/images/' + file)
        fs.unlink(path, (err) => {
            if (err) {
                console.log(`error al eliminar el archivo:${file}`)
            } else {
                return true
            }
        })
    }

    #isJSON(data) {
        if (data === '') { return false }
        try {
            JSON.parse(data)
        } catch (error) {
            return false
        }
        return true
    }

    #validateProduct(product) {
        //valida que el producto a agregar tenga los campos correctos.
        if (typeof product === 'undefined') { return false }
        if (!product.hasOwnProperty('title')) { return false }
        if (!product.hasOwnProperty('price')) { return false }
        if (!product.hasOwnProperty('thumbnail')) { return false }
        if (!typeof product.title === 'string') { return false }
        if (!typeof product.price === 'number') { return false }
        if (!typeof product.thumbnail === 'string') { return false }
        if (product.title === '') { return false }
        if (product.price === 'NaN') { return false }
        if (product.thumbnail === '') { return false }
        return true
    }

    #getMaxId() {
        try {
            this.#readFile()
                .then(response => {
                    let data = [] // si el archivo tiene datos invalidos, lo inicializa vacio.
                    if (this.#isJSON(response)) {
                        data = JSON.parse(response)
                    } else {
                        this.#writeFile(data)
                    }
                    if (!data.length == 0) {
                        data = data.map(data => data.id)
                        this.#maxId = Math.max(...data)
                    }
                })
        } catch (err) {
            return err
        }
    }

    async getAll() {
        try {
            let products = []
            await this.#readFile()
                .then(response => {
                    products = response
                })
            return JSON.parse(products)
        } catch (err) {
            return err
        }
    }

    async getById(id) {
        try {
            let product = {}
            await this.getAll()
                .then(response => {
                    product = response.find(product => product.id === id)
                })
            if (typeof product === 'undefined') { product = null } //si no encuentra el producto, devuelve null
            return product
        } catch (err) {
            return err
        }
    }

    async save(newProduct) {
        try {
            let nuevoId = null
            if (!this.#validateProduct(newProduct)) {                
                return nuevoId
            } //valida el producto, devuelve nulo si no es valido.   
            await this.getAll()
                .then(response => {
                    if (typeof newProduct.id === 'undefined') {
                        // genero un nuevo ID si no tiene asignado en newProduct
                        newProduct.id = ++this.#maxId
                        nuevoId = this.#maxId
                    } else {
                        // en el caso de que venga el id, utilizarlo
                        nuevoId = newProduct.id
                    }
                    response.push(newProduct)
                    this.#writeFile(response)
                })
            return nuevoId
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async deleteById(id) {
        try {
            let flag = false
            await this.getAll()
                .then(response => {
                    const search = response.find(product => product.id == id)
                    const newData = response.filter(product => product.id != id)
                    if (typeof search === 'undefined') {
                        flag = false
                    } else {
                        this.#writeFile(newData)
                        this.#deleteFile(search.thumbnail)                        
                        flag = true
                    }
                })
            return flag
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async deleteAll() {
        try {
            await this.getAll()
                .then(response => {
                    response.forEach(product => {
                        this.#deleteFile(product.thumbnail)
                    })
                    this.#writeFile([])
                })
            return true
        } catch (err) {
            console.log(err)
            return err
        }
    }
}

module.exports = Products