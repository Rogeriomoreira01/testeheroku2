const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId
app.use(express.urlencoded({extended:true}))
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbUser:rogerio@cluster0.syhn4.mongodb.net/"
const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true})
app.set('view engine','ejs')
const port = process.env.PORT || '3000'
/*mongodb+srv://meuUsuario:minhaSenha@cluster0.wxg9a.mongodb.net/ */
app.get('/', (req, res)=>{  
  res.render('index.ejs')
})


client.connect(err => {
    if(err) return console.log(err)
    db = client.db('teste-bd')
    app.listen(port,()=>{
    console.log('o servidor estar rodando tranquilo')  
})
})
app.post('/show',(req, res)=>{
    db.collection('crud').insertOne(req.body,(err, result)=>{
        if(err) return console.log(err)
        console.log('salvo no nosso banco de dados mongodb')
        res.redirect('/')
        db.collection('crud').find().toArray((err, results)=>{
        console.log(results)
        })
    })
})

app.get('/', (req,res)=> {
    let cursor = db.collection('crud').find()
})

//renderizar e retornar o conteúdo do nosso banco
app.get('/show',(req,res)=>{
    db.collection('crud').find().toArray((err, results)=>{
        if(err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

//criando o nossa rota para editar 
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    var telefone = req.body.telefone
    var corte = req.body.corte
    var horario = req.body.horario

    db.collection('crud').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname,
            telefone: telefone,
            corte: corte,
            horario: horario
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')
    })
})
app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('crud').deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Banco Deletado!')
            res.redirect('/show')
        })
    })