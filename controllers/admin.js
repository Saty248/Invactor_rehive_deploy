
const Rehive=require('rehive') //rehive js sdk
require('dotenv').config();

// importing the email and password of the user who is adding the extension
/* let Email=process.env.Email 
let Password=process.env.Password */
let token="7bd33a3840f596eeeda7c4c6a78e29b87312bf5971c3bdaa21d738359a0f3d2a";
//3785503f8e6da7daef1c0943798dc856b3329ce51ed15d11a1c9a3422afe6956
 let rehive= new Rehive({
  apiVersion: 3, 
  apiToken: token //the token is permanent but to activate as an extension we need to add the token recieved from the extension.
});;

//to check is the rest api is working!!
const working=async (req,res)=>{
    res.status(200).json({
        msg:"working"
    })
}


// it is the end point to /activate. The request body contains the Token, which we need to send to the url = "https://api.rehive.com/3/auth/" with the login credentials to get verified.
/* const rehiveActivation=async (req,res)=>{
    console.log("req body",req.body);
    const url = "https://api.rehive.com/3/auth/";
    const {token} = req.body
    const headers = {
      'Authorization': `Token ${token}`,
      'Email': Email,
      'Password': Password,
      'Content-Type': 'application/json'
  };
    
    console.log("req data",token)
    await fetch(url, {
      method: 'GET',
      headers: headers,
      
  })
  .then(response => response.json())
  .then(data => {
      console.log('Authentication successful:', data);
  })
  .catch(error => {
      console.error('Authentication failed:', error);
  });
  rehive = new Rehive({
    apiVersion: 3, 
    apiToken: token
  });
console.log("rehive sdk=",rehive)
  res.json({
    status: 'OK',
  })

}

// it is the end point to /Deactivate. It sends the token and neccesary deactivation steps are taken.
const rehiveDeactivation=async (req,res)=>{
  console.log("req dec body",req.body);
  
  
  if(rehive) delete rehive;

 


res.json({
  status: 'OK',
})

} */

 
const webHooks=async(req,res)=>{
  console.log("webhook");
   try{
    
   const ans=await rehive.admin.webhooks.get();
    console.log(ans)
    res.json({message:"good"})  
 }catch(e){
    console.log(e);
   }
}
const PostwebHooks=async(req,res)=>{
  console.log("webhook post");
  console.log("header=",req.header)
  console.log("webhook=",req.body)
  let webhookEvent=req.body.event;
  console.log(webhookEvent,req.body.id)
  




  res.json({message:"good"})

  if(webhookEvent=='user.create'){

    
    let data={
     id:req.body.data.id,
     first_name:req.body.data.first_name
    }
   


   await createDepositAccWithCurr(data)
   await letCreateWithdrawAcc(data)

 }


}

let createDepositAccWithCurr=async ({id,first_name})=>{
  try {
    let userId=id;
     let ans=await rehive.admin.users.bankAccounts.create({
      user:userId,
      name: `${first_name}  Bank Account`,
      number: '1234567890',
      type: 'savings',
      bank_name: `${first_name} Bank`,
      bank_code: '221234',
      branch_code: '224321',
      currencies:['SAR','YER'],
      action: 'deposit'
      })
    console.log(ans)
   let ans2=await rehive.admin.users.bankAccounts.currencies.create(ans.id, {currency:'YER'}) 
   let ans3=await rehive.admin.users.bankAccounts.currencies.create(ans.id, {currency:'SAR'})
   console.log(ans2)
   console.log(ans3)
  } catch (error) {
    console.log(error)
  }

  
}



letCreateWithdrawAcc=async({id,first_name})=>{
try {
  let userId=id;
     let ans=await rehive.admin.users.bankAccounts.create({
      user:userId,
      name: `${first_name}  Bank Account`,
      number: '1234567890',
      type: 'savings',
      bank_name: `${first_name} Bank`,
      bank_code: '221234',
      branch_code: '224321',
      currencies:['SAR','YER'],
      action: 'withdraw'
      })
    console.log(ans)
   let ans2=await rehive.admin.users.bankAccounts.currencies.create(ans.id, {currency:'YER'}) 
   let ans3=await rehive.admin.users.bankAccounts.currencies.create(ans.id, {currency:'SAR'})
   console.log(ans2)
   console.log(ans3)
  
} catch (error) {
  console.log(error)
}


}






// deposit endpoint functions.
//Deposit funds into omnibus bank account
// the api checks the bank transaction history and calls this end point
const deposit_omnibus =async (req,res)=>{
  let ref=await req.body.ref;
  console.log("deposit");
  console.log(ref)
    try{
    //hardcoded data
    let data={
      status: "complete",
      subtype: "deposit_bank",
      account: ref, 
      currency:'SAR',
       amount:101
  }
   const ans=await rehive.admin.transactions.createCredit(data)
    console.log(ans)
    res.json({message:"good"})  
 }catch(e){
    console.log(e);
   } 
 
}



const isWithDraw=async (req,res)=>{
 
  try {
    console.log("isWithdraw working")
    console.log("webhook id=",req.body.data.id)
    if(req.body.data.label=='Withdraw manual'){

  withdraw_manual(req.body.data.id)






    }
   res.json({status:'202',message:"good"})
  
  } catch (error) {
    console.log("errror",error)
    
  }

}

let withdraw_manual=async(id)=>{

  try {
    console.log(`id ${id}`)
    let ans=await rehive.admin.transactions.get({id:id})
    
  console.log(ans)
    if(ans.status=='Pending'){ 
    let ans2=await rehive.admin.transactions.update(id,{status:'Complete'})
    console.log(ans2)
  
   }
    
  } catch (error) {
    console.log(error)
    
  }
 
 

}


const quote=async(req,res)=>{
  try {
    console.log("quote working")
    console.log("quote=",req.body)
    // the data is hardcoded but can we obtained from req.body.
    res.json({data:{ "from_amount": 1,   
    "to_amount": 1,
             
    "expires": 9694989385,      
    "rate": 0.01, }
              
  }
  );
  } catch (error) {
    console.log(error)
  }
  
}




module.exports={working,deposit_omnibus,webHooks,PostwebHooks,isWithDraw,quote}