const Product = require('../models/product');
const Cart = require('../models/cart');

const items_per_page = 2;

exports.getProducts = (req, res, next) => {
  const page=+req.query.page || 1;
  var totalitems=0;
  
Product.count() //it is not working but 
  .then(numproducts=>{

    totalitems=numproducts;
    return Product.findAll({offset:(page-1)*items_per_page,
      limit:items_per_page})
  })
  // ------------------
  // i want to send this data to front end to use for page numbers
  


  //====================
  
    
    .then(products => {
     
  const hasnextpage=items_per_page*page<totalitems;
  const haspreviouspage=page>1;
  const nextpage=page+1;
  const previouspage=page-1;
  const lastpage=Math.ceil(totalitems/items_per_page)
  const obj={
    totalitems:totalitems,
    currentpage:page,
    hasnextpage:hasnextpage,
    haspreviouspage:haspreviouspage,
    nextpage:nextpage,
    previouspage:previouspage,
    lastpage:lastpage
  
  }
      res.json({products ,success:true,obj})
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};


exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json({
            success: true,
            products: products
          })
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
        })
        .catch(err => { res.status(500).json({ success: false, message: err})});
    })
    .catch(err => { res.status(500).json({ success: false, message: err})});
};

exports.postCart = (req, res, next) => {

  if(!req.body.productId){
    return res.status(400).json({ sucess: false, message: 'product id is not found' })
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      // if (products.length > 0) {
      //   product = products[0];
      // }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({sucess:true, message: "Successfully added"})
    })
    .catch(err => {
      res.status(500).json({sucess: false, message: "Error occured"})
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts({ where: { id: prodId }});
  })
  .then(products => {
    const product = products[0];
    product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
