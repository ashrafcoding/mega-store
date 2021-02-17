const productsModel = require('../models/ProductsModel')


exports.getProduct = (req,res)=>{
    let id = req.params.id
    productsModel.getProductsById(id).then((product) =>{
        res.render('product-detail',{product})
        
    })
}

exports.getProductCategory = (req, res)=> {
    let category = req.params.category
    
    productsModel.getProductsByCategory(category).then((products) =>{
        
        res.render('product-list',{products})
    })
}
