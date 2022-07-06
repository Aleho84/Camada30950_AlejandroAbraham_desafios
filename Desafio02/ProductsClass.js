const fs = require('fs')
const _fileFormat = 'utf-8'

class Products {
    constructor(file) {
        this.file = file
        this.#getMaxId()
    }

    #maxId = 0

    async save(nuevoProducto) {
        let nuevoId = -1

        //si no es un producto valido para guardar, devuelve -1       
        if (!this.#validateProduct(nuevoProducto)) {
            throw 'El producto que intenta agregar no es valido'
        }

        try {
            const productos = await this.getAll()
                .then(respuesta => {
                    //genero un nuevo ID
                    nuevoProducto.id = ++this.#maxId
                    nuevoId = this.#maxId

                    respuesta.push(nuevoProducto)
                    fs.writeFileSync(this.file, JSON.stringify(respuesta, null, 2))
                })
            return nuevoId
        } catch (err) {
            return err
        }
    }

    async getById(id) {
        let producto = null
        try {
            const productos = await this.getAll()
                .then(respuesta => {
                    const resultado = respuesta.find(product => product.id === id)
                    if (resultado === undefined) { console.log(`El producto con id: ${id} no fue encontrado`) }
                    producto = resultado
                })
            return producto
        } catch (err) {
            return err
        }
    }

    async getAll() {
        try {
            const readInfo = await fs.promises.readFile(this.file, _fileFormat)
            return JSON.parse(readInfo)
        } catch (err) {
            return err
        }
    }

    async deleteById(id) {
        try {
            const productos = await this.getAll()
                .then(respuesta => {
                    const resultado = respuesta.filter(product => product.id != id)
                    fs.writeFileSync(this.file, JSON.stringify(resultado, null, 2))
                })
        } catch (err) {
            console.log(`ERROR: no se pudo eliminar el producto con ID=${id}`)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file, '[]')
                .then(respuesta => {
                    const resultado = respuesta.filter(product => product.id != id)
                    fs.writeFileSync(this.file, JSON.stringify(resultado, null, 2))
                })

        } catch (err) {
            return err
        }
    }

    #getMaxId() {
        try {
            let contenido = JSON.parse(fs.readFileSync(this.file, _fileFormat))

            if (!contenido.length == 0) {
                contenido = contenido.map(contenido => contenido.id)

                //busca el ID mayor de todos los productos y lo almacena en #maxId
                this.#maxId = Math.max(...contenido)
            }
        } catch (err) {
            return err
        }
    }

    #validateProduct(producto) {
        //valida que el producto a agregar tenga los campos correctos.
        if (typeof producto === 'undefined') { return false }
        if (!producto.hasOwnProperty('title')) { return false }
        if (!producto.hasOwnProperty('price')) { return false }
        if (!producto.hasOwnProperty('thumbnail')) { return false }
        if (!typeof producto.title === 'string') { return false }
        if (!typeof producto.price === 'number') { return false }
        if (!typeof producto.thumbnail === 'string') { return false }
        return true
    }
}

module.exports.Products = Products