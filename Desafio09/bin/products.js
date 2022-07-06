// schema
const ProductsSchema = require('../models/products.js')

class Products {
    constructor() { }

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
            await ProductsSchema.find({})
                .then((response) => {
                    products = response
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
            let product = {}

            await ProductsSchema.find({ id })
                .then((response) => {
                    product = response
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

            let newID = ''
            const addProduct = new ProductsSchema({
                title: newProduct.title,
                price: newProduct.price,
                thumbnail: newProduct.thumbnail
            })            

            await addProduct.save()
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

module.exports = Products
