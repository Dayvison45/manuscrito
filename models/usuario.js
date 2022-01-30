const mongoose= require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
nome:String,
senha:String,
logado:Boolean,
default:0

})

mongoose.model('usuarios',Usuario)