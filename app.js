const Rehive=require('rehive')
const express=require('express')
const app=express();
const port=3000;
const routes=require("./routes/admin")
app.use(express.json())
app.use("",routes);



const start=async()=>{
    try{
        app.listen(port,()=>{
            console.log("connected")
            
        })
    }catch(e){
        console.log(e);
    }
}
start();


module.exports=app