import  express  from "express";
import { body,query} from "express-validator";
import{validate} from"../Utils/validator.js";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import { AddBehavior, GetBehaviorByDate } from "../controllers/BehaviorController.js";

export const BehaviorRoute = express.Router();

BehaviorRoute.get('/student/behavior' , 
    query('StartDate').notEmpty().withMessage('يجب إدخال تاريخ بداية الفترة')
        .bail()
        .isDate().withMessage('YYYY-MM-DD  تاريخ بدايةالفترة يجب أن يكون على هذا النحو'),
        
    query('EndDate').notEmpty().withMessage('يجب إدخال تاريخ نهاية الفترة')
        .bail()
        .isDate().withMessage('YYYY-MM-DD تاريخ نهايةالفترة يجب أن يكون على هذا النحو'),

    (req, res, next) => validate(req, res, next, StatusCode.BadRequst),
    
    async(req , res)=>{
        GetBehaviorByDate(req,res);
    }
);

BehaviorRoute.post('/student/behavior/add' , async(req , res)=>{
    AddBehavior(req,res);
});