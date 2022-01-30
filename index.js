// instalçao das dependencias
const express= require('express')
var mongoose = require('mongoose')
const path = require('path')

//configuraçoes
const app = express();

//handlebars 
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//body-parser
const bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
 


//
mongoose.connect("mongodb+srv://MagoDayvison:magomanda@cluster0.mtyeu.mongodb.net/manuscritos?retryWrites=true&w=majority")



//
app.use(express.static(path.join(__dirname,'public')))

//rotas

const admin = require('./routs/admin.js');

app.use('/admin',admin)
//outros

const Port =  process.env.PORT || 8002
app.listen(Port, ()=>{console.log('servidor funcionando')})