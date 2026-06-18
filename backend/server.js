const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
"mongodb://mongodb:27017/employeedb"
)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const EmployeeSchema = new mongoose.Schema({
   name:String,
   department:String
});

const Employee =
mongoose.model("Employee",EmployeeSchema);

app.get("/employees",async(req,res)=>{
   const employees =
   await Employee.find();

   res.json(employees);
});

app.post("/employees",async(req,res)=>{

   const employee =
   new Employee(req.body);

   await employee.save();

   res.json(employee);
});

app.listen(5000,()=>{
   console.log("Server Running");
});
