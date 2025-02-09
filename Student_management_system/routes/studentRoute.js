import  express  from "express";
import { body,query} from "express-validator";
import{validate} from"../Utils/validator.js";
import { AllStudentsByClassAndSection, DeleteStudent ,AddStudent ,UpdateStudent ,GetStudent } from "../controllers/StudentController.js";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
export const StudentRoute = express.Router();

StudentRoute.get('/student' ,
    query('id').notEmpty().withMessage('id must be not empty')
        .bail()
        .isMongoId().withMessage('invalid sentence id'),
    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),
    
    async(req,res)=>{
        GetStudent(req,res);
    }
);

StudentRoute.get('/student/get' , async(req ,res)=>{
        AllStudentsByClassAndSection(req , res);
    }
);

StudentRoute.post('/student/add' ,
    body("name")
        .notEmpty().withMessage("الاسم يجب ان لا يكون فارغا")
        .bail()
        .matches(/^[\u0621-\u064A\s]+$/).withMessage("الاسم يجب أن يحتوي على أحرف عربية ومسافات فقط"),
    body("classs")
        .notEmpty().withMessage("الصف يجب أن لا يكون فارغًا")
        .bail()
        .isIn(['السادس الأساسي', 'السابع الأساسي', 'الثامن الأساسي' ,'التاسع الأساسي']).withMessage("الصف يجب ان يكون اما السادس الأساسي او السابع الأساسي او الثامن الأساسي او التاسع الأساسي"),
    body("section")
        .notEmpty().withMessage("الشعبة يجب أن لا يكون فارغًا")
        .bail()
        .isInt({ min: 1, max: 3 }).withMessage("الشعبة يجب أن يكون رقمًا بين 1 و 3"),
    body("fatherPhone")
        .notEmpty().withMessage("رقم هاتف الأب يجب أن لا يكون فارغًا")
        .bail()
        .matches(/^05\d{8}$/).withMessage("رقم هاتف الأب يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"),
    body("motherPhone")
        .notEmpty().withMessage("رقم هاتف الأب يجب أن لا يكون فارغًا")
        .bail()
        .isNumeric().withMessage("رقم الام يجب ان يكون ارقام فقط"),

    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),

     async(req,res)=>{
        AddStudent(req ,res);
    }
);

StudentRoute.delete('/student/delete' , async(req,res)=>{
    DeleteStudent(req,res);
});

StudentRoute.put('/student/update' ,
    body("id").isMongoId().withMessage("pleace enter the id for object in mongodb"),
    body("name")
        .notEmpty().withMessage("الاسم يجب ان لا يكون فارغا")
        .bail()
        .matches(/^[\u0621-\u064A\s]+$/).withMessage("الاسم يجب أن يحتوي على أحرف عربية ومسافات فقط"),
    body("classs")
        .notEmpty().withMessage("الصف يجب أن لا يكون فارغًا")
        .bail()
        .isIn(['السادس الأساسي', 'السابع الأساسي', 'الثامن الأساسي' ,'التاسع الأساسي']).withMessage("الصف يجب ان يكون اما السادس الأساسي او السابع الأساسي او الثامن الأساسي او التاسع الأساسي"),
    body("section")
        .notEmpty().withMessage("القسم يجب أن لا يكون فارغًا")
        .bail()
        .isInt({ min: 1, max: 3 }).withMessage("القسم يجب أن يكون رقمًا بين 1 و 3"),
    body("fatherPhone")
        .notEmpty().withMessage("رقم هاتف الأب يجب أن لا يكون فارغًا")
        .bail()
        .matches(/^05\d{8}$/).withMessage("رقم هاتف الأب يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"),
    body("motherPhone")
        .notEmpty().withMessage("رقم هاتف الأب يجب أن لا يكون فارغًا")
        .bail()
        .isNumeric().withMessage("رقم الام يجب ان يكون ارقام فقط"),

    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),
     async(req , res)=>{
        UpdateStudent(req,res);
    }
);