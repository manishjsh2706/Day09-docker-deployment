Lab 01: Multi-Tier Application Deployment Using Docker, Node.js, MongoDB and Persistent Volumes 
Use Case
Build a simple Employee Management System:
Frontend
HTML/CSS/JavaScript
Displays employee list
Add employee form
Backend
Node.js + Express
REST APIs
Database
MongoDB
Step 1: Create Project Structure
Login to Docker VM
sudo apt update
sudo apt install npm -y
sudo apt install tree -y

mkdir employee-app
cd employee-app

mkdir frontend
mkdir backend
Verify
tree .
Expected
employee-app
├── frontend
└── backend
Step 2: Create Backend Application
Move to backend
cd backend
Initialize
npm init -y
Install packages
npm install express mongoose cors
Step 3: Create Backend Source Code
Create file
nano server.js
Paste
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
Save
CTRL+X
Y
ENTER
Step 4: Backend Dockerfile
Create
nano Dockerfile
Paste
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node","server.js"]
Step 5: Build Frontend
Go back
cd ..
cd frontend
Create
nano index.html
Paste
<!DOCTYPE html>
<html>
<head>
<title>Employee App</title>
</head>
<body>

<h1>Employee Management</h1>

<input id="name" placeholder="Name">

<input id="department"
placeholder="Department">

<button onclick="saveEmployee()">
Save
</button>

<h2>Employees</h2>

<ul id="employees"></ul>

<script>

const API =
"http://3.134.93.161:5000";

async function loadEmployees(){

const response =
await fetch(API+"/employees");

const data =
await response.json();

let html="";

data.forEach(emp=>{

html +=
`<li>${emp.name}
- ${emp.department}</li>`;

});

document.getElementById(
"employees"
).innerHTML=html;
}

async function saveEmployee(){

const name=
document.getElementById("name").value;

const department=
document.getElementById("department").value;

await fetch(
API+"/employees",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
department
})
});

loadEmployees();
}

loadEmployees();

</script>

</body>
</html>
Replace YOUR_PUBLIC_IP with Docker Lab Public IP.
Step 6: Frontend Dockerfile
Create
nano Dockerfile
Paste
FROM nginx:latest

COPY index.html \
/usr/share/nginx/html/index.html

EXPOSE 80
Step 7: Create MongoDB Volume
Create persistent volume
docker volume create mongodb-data
Verify
docker volume ls
Expected
mongodb-data
Step 8: Start MongoDB Container
docker run -d \
--name mongodb \
--network employee-network \
-v mongodb-data:/data/db \
mongo:7

Verify
docker ps
Step 8.1: Create Docker Network
Go to root
cd ..
Create network
docker network create employee-network
Verify
docker network ls
Step 09: Build Backend Image
cd backend
Build
docker build -t employee-backend .
Run
docker run -d \
--name backend \
--network employee-network \
-p 5000:5000 \
employee-backend
Verify logs
docker logs backend
Expected
MongoDB Connected
Server Running
Step 10: Build Frontend Image
cd ../frontend
Build
docker build -t employee-frontend .
Run
docker run -d \
--name frontend \
--network employee-network \
-p 80:80 \
employee-frontend

Step 11: Test APIs
Get employees
curl http://localhost:5000/employees
Add employee
curl -X POST \
http://localhost:5000/employees \
-H "Content-Type: application/json" \
-d '{"name":"Neeraj","department":"Cloud"}'
Check again
curl http://localhost:5000/employees
Step 12: Access Application
Open browser
http://EC2-PUBLIC-IP
Example
http://13.232.xxx.xxx
You should see:
Employee Management

Name
Department

Save

Employees
-----------
Neeraj - Cloud
Step 15: Verify Volume Persistence
Check volume
docker volume inspect mongodb-data
Stop MongoDB
docker stop mongodb
docker rm mongodb
Recreate
docker run -d \
--name mongodb \
--network employee-network \
-v mongodb-data:/data/db \
mongo:7
Verify data still exists
curl http://localhost:5000/employees
Expected
[
{
  "name":"Neeraj",
  "department":"Cloud"
}
]
Data survives because of Docker Volume.

