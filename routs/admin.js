const express = require('express')
const res = require('express/lib/response')

const mongoose = require('mongoose')
const router = express.Router()
const erros = []
require('../models/postagens')
const Postagem=mongoose.model('postagens')
require('../models/usuario')
const Usuario =mongoose.model('usuarios')


router.get('/',(req,res)=>{
res.redirect('/admin/inscrever')

//cadastro
})
router.get('/inscrever',(req,res)=>{
    res.render('admin/inscrever')})
router.post('/subscribe',(req,res)=>{
    if(erros.length>0){erros.pop()}
 Usuario.findOne({nome:req.body.nome}).lean().then((usuario)=>{
if(usuario){erros.push({texto:"usuario ja existe"})}
else{const user={
      nome:req.body.nome,
      senha:req.body.senha,
     }
        new Usuario(user).save().then(res.redirect('/admin/login'))
}res.render('admin/inscrever',{erros:erros})})})
//login
router.get('/login',(req,res)=>{
res.render('admin/login')

})

router.post('/logar',(req,res)=>{
 Usuario.findOne({nome:req.body.nome }).then((usuario)=>{
    if(erros.length>0){erros.pop()}
    if(!usuario){erros.push({texto:"usuario nao encontrado"})}
    else{
        if(usuario.senha === req.body.senha){
                 Usuario.findOne({nome:req.body.nome }).updateOne({logado:1}),
                res.redirect('/admin/home/'+usuario.id
 )}
      else{erros.push({texto:"senha invalida"})}  
    }
    res.render("admin/login",{erros:erros})
    
 })
    })
//home

router.get('/home/:id',(req,res)=>{

    Usuario.find().lean().then((usuarios)=>{
    Usuario.findOne({_id:req.params.id}).lean().then((usuario)=>{
if(usuario.logado===1){res.redirect('/admin/login')}
else{
Postagem.find({dono:{ $ne:usuario.nome}}).lean().then((postagens)=>{
    Postagem.find({dono:usuario.nome}).lean().then((mypostagens)=>{
 res.render('admin/home',{usuarios:usuarios,postagens:postagens,usuario:usuario,mypostagens:mypostagens})

 })
})}




     })})
     
})

router.post('/postar/:id',(req,res)=>{
if(req.body.titulo==='' || req.body.descricao ==='' ){erros.push({texto:"nao se pode enviar postagem com campos vazios"})
}
else{
  const post ={
    dono:req.body.autor,
    titulo:req.body.titulo,
    descricao:req.body.descricao
}
new Postagem(post).save().then(res.redirect('/admin/home/'+req.params.id))

}
})
router.get('/editarpostagem/:id',(req,res)=>{
   
Postagem.findOne({_id:req.params.id}).lean().then((postagens)=>{
res.render('admin/editarpostagens',{postagens:postagens})})})

router.get('/editar/:id',(req,res)=>{
Postagem.findOne({_id:req.params.id}).lean().then((postagens)=>{
    Usuario.findOne({nome:postagens.dono}).lean().then((usuario)=>{
res.render('admin/editarpostagens',{postagens:postagens,usuario,usuario})})})})

router.post('/editado/:id/:user',(req,res)=>{
    if(erros.length>0){erros.pop()}
    if(req.body.titulo || req.body.descricao === undefined){
        erros.push({texto:'nao se pode enviar dados vazios'})}
Postagem.findOne({_id:req.params.id}).updateOne({
titulo:req.body.titulo,descricao:req.body.descricao
}).then(erros.push({texto:"editado com sucesso"}),res.redirect('/admin/home/'+req.params.user))})



router.get('/excluirpostagem/:id',(req,res)=>{
    if(erros.length>0){erros.pop()}
Postagem.findOne({_id:req.params.id}).remove().then(console.log('postagem editada com sucesso'))
})



//perfil
router.get('/perfil/:id',(req,res)=>{
Usuario.findOne({_id:req.params.id}).lean().then((usuario)=>{
Postagem.find({dono:usuario.nome}).lean().then((postagens)=>{if(usuario.logado===0){res.redirect('/admin/login')}
    else{  res.render("admin/perfil",{usuario:usuario,postagens:postagens})}})

    })
})
router.get("/perfileditar/:id",(req,res)=>{
    Usuario.findOne({_id:req.params.id}).lean().then((usuario)=>{
        res.render('admin/editarperfil',{usuario:usuario})})})
router.post('/editarperfil/:id',(req,res)=>{
    if(erros.length>0){erros.pop()}
    if(req.body.nome || req.body.senha === undefined){
        erros.push({texto:'nao se pode enviar dados vazios'})}
Usuario.findOne({_id:req.params.id}).updateOne({
    nome:req.body.nome,
    senha:req.body.senha,
}).then(res.redirect('/admin/home/'+req.params.id))})

router.get('/excluirusuario/:id',(req,res)=>{
Usuario.findOne({_id:req.params.id}).deleteOne().then( res.redirect('/admin/fim'))})
 router.get('/editarperfil/:id',(req,res)=>{
Usuario.findOne({_id:req.params.id}).lean().then((usuario)=>{
res.render('admin/editarperfil',{usuario:usuario})})})
router.get('/perfileditado/:id',(req,res)=>{
    if(erros.length>0){erros.pop()}
    if(req.body.nome || req.body.senha === undefined){
        erros.push({texto:'nao se pode enviar dados vazios'})}
Usuario.findOne({_id:req.params.id}).upgrade({
nome:req.body.nome,
    senha:req.body.senha
}).save().then(console.log('postagem editada com sucesso'))})
    router.get('/excluirusuario/:id',(req,res)=>{
Usuario.findOne({_id:req.params.id}).remove().then(console.log('usuario excluido com sucesso'))
})   
router.get('/excluir/:id/:user',(req,res)=>{
    Usuario.findOne({nome:req.params.user}).lean().then((usuario)=>{
      Postagem.findOne({_id:req.params.id}).deleteOne().then(
   res.redirect('/admin/home/'+usuario._id)
)  
    })
})
//perfil publico


router.get("/perfilpublico/:user",(req,res)=>{
    Usuario.findOne({nome:req.params.user}).then((usuario)=>{
        Postagem.find({dono:usuario.nome}).lean().then((postagens)=>{res.render('admin/perfilpublico',{usuario:usuario,postagens:postagens})})
        
    })
})

//demais
router.get('/embreve/:id',(req,res)=>{
    Usuario.findOne({_id:req.params.id}).lean().then((usuario)=>{res.render('admin/embreve',{usuario:usuario})})
    
})
router.get('/sobre/:id',(req,res)=>{
    Usuario.findOne({_id:req.params.id}).lean().then((usuario)=>{res.render('admin/sobre',{usuario:usuario})})

})

router.get('/fim',(req,res)=>{

    res.render('admin/fim')
})
//logout
router.get('/logout/:id',(req,res)=>{
    Usuario.findOne({nome:req.params.id }).updateOne({logado:0}),
    res.redirect("/admin/login")
})

    
    

module.exports = router;
