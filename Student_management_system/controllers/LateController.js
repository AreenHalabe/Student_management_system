import { body, query } from "express-validator";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import { Late } from "../models/Late.js";



export const AddLate = async (req ,res)=> {
    const {studentIds} = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(StatusCode.BadRequst).send({message:"Invalid input: studentIds must be a non-empty array."});
    }
    
    try{
        const today = new Date();
        const date = today.toLocaleDateString('en-CA'); 

        for (const id of studentIds){
            const studentLate = await Late.findOneAndUpdate(
                { student : id },
                { $addToSet: { datesOfLate: date } }, // Add date only if it doesn't already exist
                { upsert: true, new: true }
                /**
                 * upsert :
                 *      If a document matching the studentId exists, it updates the document.
                        If no matching document is found, it creates a new document with the given data.
                    new:true :
                        makes Mongoose return the updated document after the changes, not before.
    
                 */
            );
        }
        
        res.status(StatusCode.Ok).send({message:'تم إضافة التأخر بنجاح'});
    }
    catch(e){
     res.status(StatusCode.BadRequst).send({message : e.message});
    }
}


export const GetLateByDate = async(req , res)=>{
    const {StartDate , EndDate} = req.query;

    const Sdate = new Date(StartDate);
    const Edate = new Date(EndDate);

    if(Sdate > Edate){
        return res.status(StatusCode.BadRequst).json({message:'خطأ في إدخال الفترة يجب أن يكون تاريخ نهاية الفترة بعد تاريخ البداية'});
    }
    
    const startDate = Sdate.toLocaleDateString('en-CA');
    const endDate = Edate.toLocaleDateString('en-CA');


    try {
        const studentsWithLates = await Late.aggregate([
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
                    datesOfLate: {
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
                    lateCount: {
                        $size: {
                            $filter: {
                                input: "$datesOfLate",
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

        if (studentsWithLates.length === 0) {
            return res.status(StatusCode.BadRequst).json({ message: `لا يوجد تأخر للطالبات من ( ${startDate} )ــــــ إلى ــــــ(${endDate})` });
        }

        res.status(StatusCode.Ok).json(studentsWithLates);
    } catch (error) {
        res.status(StatusCode.BadRequst).json({ message : error.message });
    }
}