import axios from "axios";
//yha se post request bhejne ke liye Axios use kar rhe hai
import Noty from "noty";
import moment from "moment";
import {initAdmin } from "./admin"
import { session } from "passport";
const http = require('http');

http.resolve = {fallback : { "http": require.resolve("stream-http") }};
let addToCart = document.querySelectorAll(".add-to-cart");

let cartCounter = document.getElementById("cartCounter");


function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log(res.data.totalQty);
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        text: "Item Added to Cart",
        timeout: 1000,
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    //console.log(pizza);
  });
});


//change order status
let  status = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value:null

order = JSON.parse(order);
console.log(order)
let time = document.createElement('small')




let adminAreaPath = window.location.pathname;
console.log(adminAreaPath);


 function updateStatus(order) {
  let stepCompleted = true;
  status.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  status.forEach((status) => {
    let dataProp = status.dataset.status;

    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm:A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}
if (!adminAreaPath.includes("admin")) {updateStatus(order);}  


  

//socket
let socket =io();

//checking the admin function
//
//Join
if(order){
socket.emit('join',`order_${order._id}`)
}


if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdate",(data)=>{
      const updatedOrder = {...order} //This method is used to copy the  object in javascript
      console.log(updatedOrder);
      updatedOrder.updatedAt =moment().format()
      updatedOrder.status =data.status
      
      updateStatus(updatedOrder);
       new Noty({
         type: "success",
         text: "Order Updated",
         timeout: 1000,
         progressBar: false,
       }).show();


    });


//removing alert mesg after 2 sec
const alerMsg = document.querySelector("#sucess-alert");
if(alerMsg){
  setTimeout(()=>{
    alerMsg.remove()
  },2000)
}    


