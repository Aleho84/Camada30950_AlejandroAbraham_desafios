const fs = require('fs')
const resolve = require('path').resolve

class Products {
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

    async #deleteFile(file) {
        try {
            const path = resolve('./public/images/' + file)
            await fs.unlinkSync(path)
            return { message: `exito al eliminar el archivo ${path}` }
        } catch (error) {
            throw error
        }
    }

    #getMaxID(products) {
        let listID = products.map(products => products.id)
        let maxID = Math.max(...listID)
        maxID += 1
        return maxID
    }

    #isJSON(data) {
        try {
            if (data === '') { return false }
            JSON.parse(data)
            return true
        } catch (error) {
            return false
        }
    }

    #validateProduct(product) {
        //valida que el producto a agregar tenga los campos correctos.
        let { title, price, thumbnail } = product

        // console.log(`title = ${title} ${typeof title}`)
        // console.log(`price = ${price} ${typeof price}`)
        // console.log(`thumbnail = ${thumbnail} ${typeof thumbnail}`)

        if (typeof product === 'undefined') { return false }
        if (typeof title === 'undefined') { return false }
        if (typeof price === 'undefined') { return false }
        if (typeof thumbnail === 'undefined') { return false }

        if (!product.hasOwnProperty('title')) { return false }
        if (!product.hasOwnProperty('price')) { return false }
        if (!product.hasOwnProperty('thumbnail')) { return false }

        if (!(typeof title === 'string')) { return false }
        if (!(typeof price === 'number')) { return false }
        if (!(typeof thumbnail === 'string')) { return false }

        if (title === '') { return false }
        if (isNaN(price)) { return false }
        if (price === null) { return false }
        if (thumbnail === '') { return false }

        return true
    }

    async getAll() {
        try {
            let products = []

            await this.#readFile()
                .then(response => {
                    products = JSON.parse(response)
                })
                .catch(error => {
                    throw error
                })

            return products
        } catch (error) {
            throw error
        }
    }

    async getById(id) {
        try {
            if (isNaN(id)) {
                return { status: 400, message: 'ID invalido' }
            } else {
                id = parseInt(id)
            }

            let product = {}

            await this.#readFile()
                .then(response => {
                    product = JSON.parse(response).find(p => p.id === id)
                })
                .catch(error => {
                    throw error
                })

            if (typeof product === 'undefined') {
                return { status: 202, message: 'Producto no encontrado' }
            } else {
                return product
            }
        } catch (error) {
            throw error
        }
    }

    async add(newProduct) {
        try {
            newProduct.price = parseFloat(newProduct.price)

            if (!this.#validateProduct(newProduct)) {
                return { status: 400, message: 'Producto invalido' }
            }

            let products = []

            await this.#readFile()
                .then(response => {
                    products = JSON.parse(response)
                    newProduct.id = this.#getMaxID(products)
                    products.push(newProduct)

                    this.#writeFile(products)
                        .then(response => {
                            return newProduct
                        })
                        .catch(error => {
                            throw error
                        })
                })
                .catch(error => {
                    throw error
                })

            return products
        } catch (error) {
            throw error
        }
    }

    async update(product) {
        try {
            product.id = parseInt(product.id)
            product.price = parseFloat(product.price)

            if (!this.#validateProduct(product)) {
                return { status: 400, message: 'Producto invalido' }
            }

            if (isNaN(product.id)) {
                return { status: 400, message: 'ID invalido' }
            }

            let products = []
            let updateProducts = []
            let findProduct = []

            await this.#readFile()
                .then(response => {
                    products = JSON.parse(response)
                    findProduct = products.find(p => p.id === product.id)

                    if (!(typeof findProduct === 'undefined')) {
                        updateProducts = products.map(p => {
                            if (p.id === product.id) {
                                return product
                            } else {
                                return p
                            }
                        })

                        this.#writeFile(updateProducts)
                            .catch(error => {
                                throw error
                            })
                    }
                })
                .catch(error => {
                    throw error
                })

            if (!(typeof findProduct === 'undefined')) {
                return products
            } else {
                return { status: 202, message: 'Producto no encontrado' }
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = Products