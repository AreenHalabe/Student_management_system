import  express  from "express";
import { body,query} from "express-validator";
import{validate} from"../Utils/validator.js";
import { CreateStudentAbsence, GetStudnetAbsence , DeleteAbsence  , GetAbsenceByDatee } from "../controllers/AbsenceController.js";
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





AbsenceRoute.get('/student/absence/date',
        query('StartDate').notEmpty().withMessage('يجب إدخال تاريخ بداية الفترة')
            .bail()
            .isDate().withMessage('YYYY-MM-DD  تاريخ بدايةالفترة يجب أن يكون على هذا النحو'),
            
        query('EndDate').notEmpty().withMessage('يجب إدخال تاريخ نهاية الفترة')
            .bail()
            .isDate().withMessage('YYYY-MM-DD تاريخ نهايةالفترة يجب أن يكون على هذا النحو'),
    
        (req, res, next) => validate(req, res, next, StatusCode.BadRequst),
    
    
    async(req , res)=>{
        GetAbsenceByDatee(req,res);

    }
);