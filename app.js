const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const contact = require('./routes/contact');
const path  = require('path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(contact);



app.use((req,res,next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})


app.listen(8080);