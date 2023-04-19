const first = (req, res)=>{

    data ={
        "tipo de requisicao" : "POST",
        "nome da requisicao" : "first"
    }

    return res.json(data);
}
//
module.exports = {
    first
}