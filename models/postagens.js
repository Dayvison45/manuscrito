const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Postagem = new Schema({
dono:String,
titulo:String,
descricao:String,
data:{
type:Date,default:Date.now()
},

})

mongoose.model('postagens',Postagem)