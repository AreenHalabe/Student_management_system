import  express  from "express";
import { body,query} from "express-validator";
import{validate} from"../Utils/validator.js";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import { AddLate, GetLateByDate } from "../controllers/LateController.js";

export const LateRoute = express.Router();

LateRoute.get('/student/late' , 
    query('StartDate').notEmpty().withMessage('يجب إدخال تاريخ بداية الفترة')
        .bail()
        .isDate().withMessage('YYYY-MM-DD  تاريخ بدايةالفترة يجب أن يكون على هذا النحو'),

    query('EndDate').notEmpty().withMessage('يجب إدخال تاريخ نهاية الفترة')
        .bail()
        .isDate().withMessage('YYYY-MM-DD تاريخ نهايةالفترة يجب أن يكون على هذا النحو'),

    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),

    async(req,res)=>{
        GetLateByDate(req,res);
    }
);


LateRoute.post('/student/late/add' , async(req,res)=>{
    AddLate(req,res);
});