import  express  from "express";
import { CreateStudentAbsence, GetStudnetAbsence , DeleteAbsence ,GetAbsence ,GetAbsenceDate } from "../controllers/AbsenceController.js";

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

AbsenceRoute.get('/student/absences' , async(req,res)=>{
    GetAbsence(req,res);
})

AbsenceRoute.get('/student/absencebydate' , async(req,res)=>{
    GetAbsenceDate(req,res);
})