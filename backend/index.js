var express = require("express");
var app = express();

var multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'L:/flipkart/frontend/public/upload/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + uniqueSuffix + ".png")
  }
})


var upload = multer({ storage: storage });

var bcrypt = require("bcrypt");

var cors = require("cors");

var { MongoClient } = require("mongodb");
// const MongoClient = require('mongodb').Client;

app.use(cors());

async function createDb() {
  var url = "mongodb://0.0.0.0:27017/";
  const client = new MongoClient(url);
  var db = client.db("admin");
  var collection = db.collection("students");
  console.log("collection", collection);
  return collection;
}
//register API endpoint
app.post("/api/register", upload.array(), async function (req, res) {
  console.log("req data", req);
  console.log("register data", req.body);
  //return
  var name =
    req.body.name != null || req.body.name != undefined || req.body.name != ""
      ? req.body.name
      : "";
  var email =
    req.body.email != null ||
    req.body.email != undefined ||
    req.body.email != ""
      ? req.body.email
      : "";
  var password =
    req.body.password != null ||
    req.body.password != undefined ||
    req.body.password != ""
      ? req.body.password
      : "";
  var m_no =
    req.body.mobile != null ||
    req.body.mobile != undefined ||
    req.body.mobile != ""
      ? req.body.mobile
      : "";
  var hashpassword = await bcrypt.hash(password, 10);

  console.log("name,email,password,mobile", name, email, password, m_no);
  //  return

  var response = await createDb();
  console.log("response", response);
  if(name == "" || email == "" || password == "" || m_no == ""){
    res.send({message:"all data fields are required", status:0});
  }
else{
  var data = await response.insertOne({
    name: name,
    email: email,
    password: hashpassword,
    m_no: m_no,
  });
  console.log("data", data);
  if (data) {
    res.send({ message: "user registered successfully", status: 1 });
  } else {
    res.send({ message: "user registration failed", status: 0 });
  }
}
 
});

//All users data endpoint(find all user data)
app.get("/api/users", async function (req, res) {
  var response = await createDb();
  var data = await response.find().toArray();
  // if(data){
  console.log("all user data", data);
  res.send({ message: "user fetched successfully", status: 1, data: data });
});
//   else{
//     res.send({message:"user not fetched",status:0});
//   }
// })

// login API endpoint
app.post("/api/login", upload.single(), async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var response = await createDb();
  var data = await response.find({ email: email }).toArray();
  console.log("data", data);
  if (data.length > 0) {
    bcrypt.compare(password, data[0].password, function (err, result) {
      if (err) {
        console.log("error in comparing the password", err);
        res.send({ message: "password did not matched", status: 0 });
      } else if (result) {
        if (email == data[0].email) {
          res.send({
            message: "user logged in successfully",
            status: 1,
            email: data[0].email,
          });
        } else {
          res.send({
            message: "Please enter correct email or password ",
            status: 0,
          });
        }
      } else {
        res.send({ message: "Password not matched ", status: 0 });
      }
    });
  } else {
    res.send({
      message: "you are not registered with us please register first",
      status: 0,
    });
  }
});

//specific user data endpoint
app.get("/api/users/:email", async function (req, res) {
  console.log("req.params=", req.params);
  var email = req.params.email;
  console.log("email=", email);
  var response = await createDb();
  var data = await response.findOne({ email: email });
  // console.log("data=",data.length);
  if (data.email) {
    console.log("specific user data", data);
    res.send({ message: "user fetched successfully", status: 1, data: data });
  } else {
    res.send({ message: "user not found", status: 0 });
  }
});

//delete user API endpoint
app.post("/api/delete/:email", async function (req, res) {
  console.log("req.params=", req.params);
  var email = req.params.email;
  var response = await createDb();
  var data = await response.find({ email: email }).toArray();
  console.log("data=", data.length);
  if (data.length) {
    var data = await response.deleteOne({ email: email });
    if (data) {
      console.log("all user data", data);
      res.send({
        messages: "user deleted successfully",
        status: 1,
        data: data,
      });
    } else {
      res.send({ messages: "user not deleted successfully", status: 0 });
    }
  } else {
    res.send({ messages: "user not found", status: 0 });
  }
});

//Update user API endpoint
app.post("/api/update/:email", upload.single(), async function (req, res) {
  console.log("req.params=", req.params);
  var email = req.params.email;
  var newEmail = req.body.newEmail;
  // var name = req.body.name;
  var response = await createDb();
  var data = await response.find({ email: email }).toArray();
  console.log("data=", data.length);
  if (data.length) {
    var data = await response.updateMany(
      { email: email },
      { $set: { email: newEmail } }
    );
    if (data) {
      console.log("all user data=", data);
      res.send({ message: "user updated successfully", status: 1, data: data });
    } else {
      res.send({ message: "user not updated successfully", status: 0 });
    }
  } else {
    res.send({ message: "user not found", status: 0 });
  }
});

//Reset_Password API endpoint
app.post(
  "/api/user/reset_password",
  upload.single(),
  async function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var response = await createDb();
    var data = await response.find({ email: email }).toArray();
    console.log("data=", data.length);
    if (data.length > 0) {
      var result = await response.updateMany(
        { email: email },
        { $set: { email: email, password: password } }
      );

      if (result.modifiedCount == 1) {
        console.log("user data", data);
        res.send({ message: "password updated successfully", status: 1 });
      } else {
        res.send({ message: "password not updated successfully", status: 0 });
      }
    } else {
      res.send({ message: "user not found", status: 0 });
    }
  }
);

//image upload multer api endpoint
app.post("/api/image",upload.single("image"),async(req,res)=>{
  console.log("req data:",req);
  const email = req.body.email;
  const image = req.file.filename;

  var response = await createDb();
  var data = await response.find({ email: email}).toArray();
  console.log("data=",data.length);
  if(data.length){
    var response = await response.updateMany(
      {email: email},
      { $set : {image: image}}
    );
    console.log("data=",response);
    if(response){
      res.send({message:"user updated with image successfully",status:1,data:data});
    } else{
      res.send({message:"user not updated with image",status:0,data:data});
    }
  } else {
    res.send({message:"user not found",status: 0});
  }
});





app.listen("8000", function () {
  console.log("your server running on port http://localhost:8000");
});
