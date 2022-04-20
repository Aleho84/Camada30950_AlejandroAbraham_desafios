// *****************************************************
// *   Clase 2   : Principios básicos de Javascript    *
// *   Desafio 1 : "Clases"                            *
// *   Alumno    : Alejandro Abraham                   *
// *****************************************************

class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        // si por alguna razon se pasan mal o no se pasan los parametros objetos, lo crea o reasigna para evitar errores
        if (typeof nombre != 'string') { nombre = ''; };
        if (typeof apellido != 'string') { apellido = ''; };
        if (typeof libros != 'object') { libros = []; };
        if (typeof mascotas != 'object') { mascotas = []; };

        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    };

    getFullName() {
        return `${this.nombre} ${this.apellido}`;
    };

    addMascota(mascota) {
        this.mascotas.push(mascota);
    };

    countMascotas() {
        return this.mascotas.length;
    };

    addBook(nombre, autor) {
        this.libros.push({ nombre, autor });
    };

    getBookNames() {
        let listaLibros = [];
        this.libros.forEach(libro => {
            listaLibros.push(libro.nombre);
        });
        return listaLibros;
    };
};


let nombreUsuario1 = 'Alejandro';
let apellidoUsuario1 = 'Abraham';
let mascotasUsuario1 = ['Chimuelo'];
let librosUsuario1 = [{ "nombre": 'El fin de la eternidad', "autor": 'Isaac Asimov' }];

const usuario1 = new Usuario(nombreUsuario1, apellidoUsuario1, librosUsuario1, mascotasUsuario1);

console.log(`Nombre del usuario: ${usuario1.getFullName()}`);
console.log(`Cantidad inicial de mascotas: ${usuario1.countMascotas()} --> ${usuario1.mascotas}`);

usuario1.addMascota('Akira');
console.log(`Cantidad final de mascotas: ${usuario1.countMascotas()} --> ${usuario1.mascotas}`);

console.log(`Libros iniciales: ${usuario1.getBookNames()}`);
usuario1.addBook('El nombre del viento', 'Patrick Ruffus');
console.log(`Libros finales: ${usuario1.getBookNames()}`);
