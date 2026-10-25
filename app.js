// Task1: initiate app and run server at 3000
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Middleware to parse incoming JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));

// Task2: create mongoDB connection 
// Replace the connection string below with your MongoDB Atlas Connection URI
const mongoURI = 'mongodb+srv://riannpanikulam_db_user:<riannpanikulam_db_user>@cluster0.qtketzm.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB Atlas successfully");
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err);
});

// Employee Schema & Model Definition
const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

const EmployeeData = mongoose.model('employee', employeeSchema);

// Task 2 : write api with error handling and appropriate api mentioned in the TODO below

// TODO: get data from db using api '/api/employeelist'
app.get(['/api/employeelist', '/employeelist'], async (req, res) => {
    try {
        const employees = await EmployeeData.find();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send({ message: "Error fetching employee list", error: error.message });
    }
});

// TODO: get single data from db using api '/api/employeelist/:id'
app.get(['/api/employeelist/:id', '/employeelist/:id'], async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await EmployeeData.findById(id);
        if (!employee) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send({ message: "Error fetching employee details", error: error.message });
    }
});

// TODO: send data from db using api '/api/employeelist'
// Request body format:{name:'',location:'',position:'',salary:''}
app.post(['/api/employeelist', '/employeelist'], async (req, res) => {
    try {
        const newEmployee = new EmployeeData(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).send({ message: "Employee added successfully", data: savedEmployee });
    } catch (error) {
        res.status(500).send({ message: "Error adding employee", error: error.message });
    }
});

// TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete(['/api/employeelist/:id', '/employeelist/:id'], async (req, res) => {
    try {
        const id = req.params.id;
        const deletedEmployee = await EmployeeData.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).send({ message: "Employee not found to delete" });
        }
        res.status(200).send({ message: "Employee deleted successfully", data: deletedEmployee });
    } catch (error) {
        res.status(500).send({ message: "Error deleting employee", error: error.message });
    }
});

// TODO: Update a employee data from db by using api '/api/employeelist'
// Request body format:{name:'',location:'',position:'',salary:''}
app.put(['/api/employeelist', '/employeelist'], async (req, res) => {
    try {
        const id = req.body._id || req.body.id;
        const updatedEmployee = await EmployeeData.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                location: req.body.location,
                position: req.body.position,
                salary: req.body.salary
            },
            { new: true }
        );
        res.status(200).send({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (error) {
        res.status(500).send({ message: "Error updating employee", error: error.message });
    }
});

//! dont delete this code. it connects the front end file.
app.get('/{*splat}', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'Frontend', 'index.html'));
});

// Start Server at port 3000
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});