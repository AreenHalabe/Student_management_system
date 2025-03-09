import { body, query } from "express-validator";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import {Behavior} from "../models/Behavior.js";


export const AddBehavior = async(req , res)=>{
    const {studentIds} = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(StatusCode.BadRequst).send({message:"Invalid input: studentIds must be a non-empty array."});
    }

    try{
        const today = new Date();
        const date = today.toLocaleDateString('en-CA'); 

        for(const student of studentIds){
            const studentBehavior = await Behavior.findOneAndUpdate(
               {student : student},
               { $addToSet: { datesOfBehavior: date } }, // Add date only if it doesn't already exist
                { upsert: true, new: true }
            );
        }

        res.status(StatusCode.Ok).send({message : 'تم إضافة السلوكيات بنجاح'});

    }
    catch(e){
        res.status(StatusCode.BadRequst).send({message : e.message});
    }
}

export const GetBehaviorByDate = async(req,res)=>{
    const {StartDate , EndDate} = req.query;

    const startDate = new Date(StartDate).toLocaleDateString('en-CA');
    const endDate = new Date(EndDate).toLocaleDateString('en-CA');

    if(startDate > endDate){
        return res.status(StatusCode.BadRequst).json({errors:'خطأ في إدخال الفترة يجب أن يكون تاريخ نهاية الفترة بعد تاريخ البداية'});
    }
    try{
        const studentBehavior = await Behavior.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student",
                },
            },
            { $unwind: "$student" },
            {
                $match: {
                    datesOfBehavior: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $project: {
                    "student.name": 1,
                    "student._id":1,
                    "student.class":1,
                    "student.section":1,
                    BehaviorCount: {
                        $size: {
                            $filter: {
                                input: "$datesOfBehavior",
                                as: "date",
                                cond: {
                                    $and: [
                                        { $gte: ["$$date", startDate] },
                                        { $lte: ["$$date", endDate] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);
        

        if (studentBehavior.length === 0) {
            return res.status(StatusCode.Ok).json({ message: `لا يوجد سلوكيات للطالبات من ( ${startDate} )ــــــ إلى ــــــ(${endDate})` });
        }

        res.status(StatusCode.Ok).json({studentBehavior:studentBehavior});
    }
    catch(e){
        res.status(StatusCode.BadRequst).send({message : e.message});
    }
}