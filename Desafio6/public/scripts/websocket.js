const socket = io()
let products = []

const button = document.querySelector("#add_button")
button.addEventListener('click', (event) => {
    socket.emit('product_change')
})


//Socket Events
socket.on('server_handshake', () => {
    socket.emit('client_handshake')
    productsLoad()
})

socket.on('message', data => {
    console.log(data)
})

socket.on('product_change', data => {
    setTimeout(() => {
        productsLoad()
    }, 1000)
})


//Funciones
function createNode(element) {
    return document.createElement(element)
}

function append(parent, element) {
    return parent.appendChild(element)
}

function productsLoad() {
    const table = document.getElementById('products_table')
    const tbody = document.getElementById('products')
    tbody.remove()
    let tbodyNew = createNode('tbody')
    tbodyNew.id = 'products'
    append(table, tbodyNew)

    const url = '/api/productos'

    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            products = data
            return products.map((product) => {
                let tr = createNode('tr')
                let td1 = createNode('td')
                let td2 = createNode('td')
                let td3 = createNode('td')
                let img = createNode('img')

                img.src = product.thumbnail
                img.style = 'width:50px; heigth:50px'

                td1.innerHTML = `${product.title}`
                td2.innerHTML = `$${product.price}`

                append(td3, img)
                append(tr, td1)
                append(tr, td2)
                append(tr, td3)
                append(tbodyNew, tr)
            })
        })
        .catch(function (error) {
            console.log(error)
        })
}