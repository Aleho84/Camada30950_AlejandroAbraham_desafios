// *****************************************************
// *   Clase 4   : Manejo de Archivos en Javascript    *
// *   Desafio 2 : "Manejo de Archivos en Javascript"  *
// *   Alumno    : Alejandro Abraham                   *
// *****************************************************

console.clear()

const _filePath = './products.txt'
const ProductsClass = require('./ProductsClass.js')
const productoNuevo =
{
    "title": "Lápiz Negro",
    "price": 63.29,
    "thumbnail": "https://cdn0.iconfinder.com/data/icons/school-73/128/pencil_write_signature_note_school_education_study-512.png",
}

const productos = new ProductsClass.Products(_filePath)


//Lectura Async
const lectura = new Promise(function (resolve, reject) {
    resolve(productos.getAll());
})
lectura.then(function (value) {
    console.log('*********************** LECTURA ***********************')
    console.log(value)
}, function (err) {
    console.log(err); // Error!
})


//Escritura Async
const escritura = new Promise(function (resolve, reject) {
    resolve(productos.save(productoNuevo));
})
escritura.then(function (value) {
    console.log('********************** ESCRITURA **********************')
    console.log(`Nuevo producto agregado: ID=${value}`)

    //Lectura por ID Async luego de que escribio
    const lecturaID = new Promise(function (resolve, reject) {
        resolve(productos.getById(4));
    })
    lecturaID.then(function (value) {
        console.log('******************* LECTURA POR ID ********************')
        console.log(value)

        //Borrar el ID 4 luego de que escribio y que leyo popr ID
        const idBorrar = 4
        const borrarID = new Promise(function (resolve, reject) {
            resolve(productos.deleteById(idBorrar));
        })
        borrarID.then(function (value) {
            console.log('******************* ELIMINAR POR ID ***********************')
            console.log(`Producto con ID=${idBorrar} fue eliminado`)
        }, function (err) {
            console.log(err); // Error!
        })


    }, function (err) {
        console.log(err); // Error!
    })

}, function (err) {
    console.log(err); // Error!
})

//BORRA TODO
// productos.deleteAll()