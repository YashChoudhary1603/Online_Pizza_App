const Menu = require('../../models/menu');

function homeController(){
    //factory function
    return{
        async index(req,res){
                const pizzas = await Menu.find();
                //console.log(pizzas[2]);
                return res.render("home" ,{pizzas:pizzas}); 

        }
    }
}



module.exports = homeController;