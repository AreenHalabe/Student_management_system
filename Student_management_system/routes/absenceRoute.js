import  express  from "express";
import { CreateStudentAbsence, GetStudnetAbsence , DeleteAbsence } from "../controllers/AbsenceController.js";

export const AbsenceRoute = express.Router();



AbsenceRoute.get('/student/absence' , async(req,res)=>{
    GetStudnetAbsence(req,res);
});

AbsenceRoute.post('/student/create/absence' , async(req,res)=>{
    CreateStudentAbsence(req,res);
});

AbsenceRoute.delete('/student/absence/delete' , async(req,res)=>{
    DeleteAbsence(req,res);
});