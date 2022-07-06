// ****************************************************
// * Script para inicializar la pase de datos MariaDB *
// ****************************************************

const dotenv = require('dotenv').config()

const _options = JSON.parse(process.env.knex_options)
const knex = require('knex')(_options)

const product01 = { "title": "Escuadra", "price": 123.45, "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png" }
const product02 = { "title": "Calculadora", "price": 234.56, "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png" }
const product03 = { "title": "Globo Terráqueo", "price": 345.67, "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png" }

console.log('> Inicializando base de datos')

knex.schema.hasTable('products')
    .then(exists => {
        if (!exists) {
            knex.schema.createTable('products', (table) => {
                table.increments('id').primary().unique()
                table.string('title').notNullable()
                table.decimal('price', 8, 2).notNullable()
                table.string('thumbnail').notNullable()
            })
                .then(() => {
                    console.log('> Tabla products creada')
                    knex('products').insert(product01)
                        .then(() => {
                            knex('products').insert(product02)
                                .then(() => {
                                    knex('products').insert(product03)
                                        .then(() => {
                                            console.log('> Productos agregados')
                                            process.exit()
                                        })
                                })
                        })
                })
                .catch((err) => {
                    console.log(err)
                    process.exit()
                })
        } else {
            console.log('> La tabla products ya existe')
            process.exit()
        }
    })
    .catch(err => {
        console.log(err.message)
        process.exit()
    })
