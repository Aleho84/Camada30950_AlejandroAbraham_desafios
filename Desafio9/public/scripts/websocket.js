const socket = io()
let products = []
let messages = []

//Agregar Productos
const add_button = document.querySelector("#add_button")
const title = document.querySelector("#title")
const price = document.querySelector("#price")
const thumbnail = document.querySelector("#thumbnail")

add_button.addEventListener('click', (event) => {
    let newProduct = {
        title: title.value,
        price: price.value,
        thumbnail: thumbnail.value
    }
    if (validarProduct(newProduct)) {
        socket.emit('product_add', newProduct)
    }
})


//Centro de Mensajes
const message_button = document.querySelector("#message_button")
const email = document.querySelector("#email")
const firstname = document.querySelector("#firstname")
const lastname = document.querySelector("#lastname")
const age = document.querySelector("#age")
const nickname = document.querySelector("#nickname")
const avatar = document.querySelector("#avatar")
const message = document.querySelector("#message")

message_button.addEventListener('click', (event) => {
    let newMessage = {
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        age: age.value,
        nickname: nickname.value,
        avatar: avatar.value,
        message: message.value,
        timestamp: timeStamp()
    }
    console.log(avatar.vlaue)
    if (validarMessage(newMessage)) {
        socket.emit('message_add', newMessage)
    }
})


//Socket Events
socket.on('server_handshake', () => {
    socket.emit('client_handshake')
    productsLoad()
    messagesLoad()
})

socket.on('message', msg => {
    Toast.fire({
        icon: msg.alertIcon,
        title: msg.alertMessage
    })
})

socket.on('product_change', data => {
    productsAdd(data)
})

socket.on('message_change', data => {
    messagesAdd(data)
})


//Funciones
//Products
function productsLoad() {
    const tbody = document.getElementById('products')
    const elements = tbody.getElementsByTagName('td')
    const url = '/api/productos'

    if (elements.length === 0) {
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                products = data
                return products.map((product) => {
                    appendProduct(tbody, product)
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }
}

function productsAdd(newProduct) {
    const tbody = document.getElementById('products')
    appendProduct(tbody, newProduct)
}


//Messages
function messagesLoad() {
    const tbody = document.getElementById('centro_mensajes')
    const elements = tbody.getElementsByTagName('span')
    const url = '/api/mensajes'

    if (elements.length === 0) {
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                messages = data
                return messages.map((msg) => {
                    appendMessage(tbody, msg)
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }
}

function messagesAdd(newMessage) {
    const tbody = document.getElementById('centro_mensajes')
    const formatedMessage = {
        author: {
            id: newMessage.email,
            nombre: newMessage.firstname,
            apellido: newMessage.lastname,
            edad: newMessage.age,
            alias: newMessage.nickname,
            avatar: newMessage.avatar
        },
        text: newMessage.message,
        created: newMessage.timestamp
    }
    appendMessage(tbody, formatedMessage)
}


//Others
function createNode(element) {
    return document.createElement(element)
}

function append(parent, element) {
    return parent.appendChild(element)
}

function appendProduct(tbody, product) {
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
    append(tbody, tr)
}

function appendMessage(tbody, msg) {
    let author = msg.author

    let email = createNode('span')
    email.className = 'sp_email'
    email.innerHTML = `${author.id} `

    let timestamp = createNode('span')
    timestamp.className = 'sp_timestamp'
    timestamp.innerHTML = `[${msg.created}]: `

    let message = createNode('span')
    message.className = 'sp_message'
    message.innerHTML = `${msg.text}`

    let avatar = createNode('img')
    avatar.className = 'sp_avatar'
    avatar.src = author.avatar

    let br = createNode('br')

    append(tbody, email)
    append(tbody, timestamp)
    append(tbody, message)
    append(tbody, avatar)
    append(tbody, br)
}

function timeStamp() {
    const newDate = new Date()
    const daySeparator = '-'
    const hourSeparator = ':'

    let year = newDate.getFullYear()
    let month = newDate.getMonth() + 1
    month = (month < 10) ? `0${month}` : month
    let day = newDate.getDay()
    day = (day < 10) ? `0${day}` : day

    let hour = newDate.getHours()
    hour = (hour < 10) ? '0' + hour : hour
    let minute = newDate.getMinutes()
    minute = (minute < 10) ? '0' + minute : minute
    let second = newDate.getSeconds()
    second = (second.toFixed() < 10) ? '0' + second : second

    return `${year}${daySeparator}${month}${daySeparator}${day} ${hour}${hourSeparator}${minute}${hourSeparator}${second}`
}

function validarProduct(product) {
    if (product.title === '') {
        Toast.fire({ icon: 'warning', title: 'El Titulo no puede estar vacio' })
        return false
    } else if (product.price === '') {
        Toast.fire({ icon: 'warning', title: 'El Precio no puede estar vacio' })
        return false
    } else if (product.thumbnail === '') {
        Toast.fire({ icon: 'warning', title: 'La Imagen no puede estar vacia' })
        return false
    } else {
        return true
    }
}

function validarMessage(msg) {
    if (msg.email === '') {
        Toast.fire({ icon: 'warning', title: 'Falta indicar un E-Mail' })
        return false
    } else if (msg.message === '') {
        Toast.fire({ icon: 'warning', title: 'El Mensaje no puede estar vacio' })
        return false
    } else {
        return true
    }
}