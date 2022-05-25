console.clear()
console.log('***TEST***')

const fs = require('fs')
const Products = require('../bin/products.js')

async function writeFile(file, data) {
  try {
    await fs.writeFileSync(file, data)
    return true
  } catch (error) {
    throw error
  }
}

const products = new Products('./data/products.json', 'utf-8')

products.getById(4)
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.error(error.message)
  })
