//Database
const _options = JSON.parse(process.env.knex_mysql)

class Products {
    constructor() {
        this.knex = require('knex')(_options)
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

            await this.knex.from('products').select('*')
                .then(rows => {
                    let product = {}
                    rows.forEach(row => {
                        product = {
                            id: row.id,
                            title: row.title,
                            price: row.price,
                            thumbnail: row.thumbnail
                        }
                        products.push(product)
                        product = {}
                    })
                    return products
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

            await this.knex.from('products').select('*').where({ id: id })
                .then(rows => {
                    rows.forEach(row => {
                        product = {
                            id: row.id,
                            title: row.title,
                            price: row.price,
                            thumbnail: row.thumbnail
                        }
                    })
                    return product
                })
                .catch(error => {
                    throw error
                })

            if (typeof product === {}) {
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

            let newID = 0

            await this.knex('products').insert(newProduct)
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

            let updated_flag = false

            await this.knex('products').where({ id: product.id }).update(product)
                .then(response => {
                    updated_flag = response
                })
                .catch(error => {
                    throw error
                })

            if (updated_flag) {
                return product
            } else {
                return { status: 202, message: 'Producto no encontrado' }
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = Products
