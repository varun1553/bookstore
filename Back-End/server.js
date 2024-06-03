//create express app
const exp = require("express");
const app = exp();
const mclient=require("mongodb").MongoClient;
const cors = require("cors")

//import path modules 
const path=require('path');

app.use(cors());

//connect build of react app with nodejs
app.use(exp.static(path.join(__dirname,'../Front-End/build')))

//DB connection URL
const dbUrl='mongodb+srv://sahithi:sahithi@cluster0.buarlxn.mongodb.net/';

//connect with mongoDB server
mclient.connect(dbUrl)
.then((client)=>{

  //get DB object
  let dbObj=client.db("bookstore");

  //create collection objects
  let userCollectionObject=dbObj.collection("usercollection");
  let bookCollectionObject=dbObj.collection("bookcollection");

  //sharing collection objects to APIs
  app.set("userCollectionObject",userCollectionObject);
  app.set("bookCollectionObject",bookCollectionObject);

  console.log("DB connection success")
})
.catch(err=>console.log('Error in DB connection ',err))


//import userApp and productApp
const userApp = require("./APIS/userApi");
const bookApp = require('./APIS/booksApi')

//excute specific middleware based on path
app.use("/user-api", userApp);
app.use("/book-api", bookApp)


// dealing with page refresh
app.use('/',(request,response)=>{
  response.sendFile(path.join(__dirname,'../Front-End/build'))
})


//handling invalid paths
app.use((request, response, next) => {
  response.send({ message: `path ${request.url} is invalid` });
});

//error handling middleware
app.use((error, request, response, next) => {
  response.send({ message: "Error occurred", reason: `${error.message}` });
});

//assign port number
const port=4000;
app.listen(port, () => console.log(`Web server listening on port ${port}`));
