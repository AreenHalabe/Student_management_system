import  express  from "express";
import { body,query} from "express-validator";
import{validate} from"../Utils/validator.js";
import { CreateStudentAbsence, GetStudnetAbsence , DeleteAbsence ,GetAbsenceByDate ,GetAbsenceByClassAndSection } from "../controllers/AbsenceController.js";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
export const AbsenceRoute = express.Router();




AbsenceRoute.get('/student/absence' , async(req,res)=>{
    GetStudnetAbsence(req,res);
});

AbsenceRoute.post('/student/create/absence',async(req,res)=>{
        CreateStudentAbsence(req,res);
    }   
);

AbsenceRoute.delete('/student/absence/delete',
    query('id').notEmpty().withMessage('id must not empty')
        .bail()
        .isMongoId().withMessage('wrong sentence for id'),
    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),
     async(req,res)=>{
    DeleteAbsence(req,res);
});

AbsenceRoute.get('/student/absence/date/class/section' 
    ,query('dateString').notEmpty().withMessage('يجب ادخال التاريخ')
        .bail()
        .isDate().withMessage('date must be YYYY-MM-DD'),
    query("classs")
        .notEmpty().withMessage("الصف يجب أن لا يكون فارغًا")
        .bail()
        .isIn(['السادس الأساسي', 'السابع الأساسي', 'الثامن الأساسي' ,'التاسع الأساسي']).withMessage("الصف يجب ان يكون اما السادس الأساسي او السابع الأساسي او الثامن الأساسي او التاسع الأساسي"),
    query("section")
        .notEmpty().withMessage("الشعبة يجب أن لا يكون فارغًا")
        .bail()
        .isInt({ min: 1, max: 3 }).withMessage("الشعبة يجب أن يكون رقمًا بين 1 و 3"),
    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),
    
     async(req,res)=>{
    GetAbsenceByClassAndSection(req,res);
    }
);

AbsenceRoute.get('/student/absence/by/date' ,
    query('dateString').notEmpty().withMessage('يجب ادخال التاريخ')
        .bail()
        .isDate().withMessage('date must be YYYY-MM-DD'),
    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),

    async(req,res)=>{
        GetAbsenceByDate(req,res);
    }
);