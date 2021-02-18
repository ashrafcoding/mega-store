const productsModel = require('../models/ProductsModel')


exports.getHome = (req,res,next) => {
    
    productsModel.getAllProducts().then(products =>{
        res.render('index', {products})

        
    })
}

exports.getContact = (req, res) => {
    res.render("contact")
}

