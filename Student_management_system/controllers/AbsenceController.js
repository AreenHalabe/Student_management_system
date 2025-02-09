import { body, query } from "express-validator";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import { Absence } from "../models/Absence.js";
import {format} from'date-fns';

const formatDate = (date) => {
    return format(date, 'yyyy-MM-dd');
};

export const GetStudnetAbsence  = async(req,res)=>{

    try{
        const absences= await Absence.find({}).populate("student");
        res.status(StatusCode.Ok).send(absences);
    }
    catch(e){
        res.status(500).send("خطأ في السيرفر حاول مرة اخرى");
    }
};

export const DeleteAbsence = async(req,res)=>{
    const{id} = req.query;

    try{
        const DeleteAbsence = await Absence.deleteOne({_id:id});
        if (DeleteAbsence.deletedCount != 0) {
            return res.status(StatusCode.Ok).send("تم حذف الغياب بنجاح");
        }
        else {
            return res.status(StatusCode.NotFound).send("لا يوجد غياب");
        }
    }
    catch(e){
        res.status(StatusCode.BadRequst).send('خطأ في السيرفر حاول مرة اخرى')
    }
}




export const CreateStudentAbsence = async (req, res) => {
    const { studentIds } = req.body; 

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).send("Invalid input: studentIds must be a non-empty array.");
    }

    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Use UTC instead of local time

        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1); // Move to the next day in UTC

        // Check for existing absences
        const existingAbsences = await Absence.find({
            student: { $in: studentIds },
            date: { 
                $gte: today, 
                $lt: tomorrow // Ensure correct day boundary in UTC
            }
        });

        // Filter out IDs that already have an absence today
        const existingIds = existingAbsences.map(a => a.student.toString());
        const newAbsences = studentIds.filter(id => !existingIds.includes(id)).map(studentId => ({
            student: studentId,
            date: today, // This is now in UTC
        }));


        if (newAbsences.length > 0) {
            await Absence.insertMany(newAbsences);
            res.status(200).send({message: 'تم إضافة الغياب للطالبات'});
        } else {
            res.status(200).send({message: 'كل الطالبات المحددات موجودة بالفعل في قائمة الغياب لهذا اليوم.'});
        }
    } catch (e) {
        res.status(500).send("خطأ في اضافة الغيابات !!!!!");
    }
};


// export const GetAbsence = async(req , res)=>{
//     const {classs} = req.query;

//     const student =await Absence.aggregate([
//         {
//             $lookup: {
//                 from: "students",
//                 localField: "student",
//                 foreignField: "_id",
//                 as: "student",
//             },
//         },
//         { $unwind: "$student" },
//         { $match: 
//             {
//                 "student.class": `${classs}`
//             } 
//         },
//         {
//             $project: {
//                 _id: 1, // Keep the absence ID if needed
//                 date: 1, // Keep the date field
//                 "student.name": 1, // Only include the name from the student
//                 "student._id":1
//             },
//         },
//     ]);
//     res.status(StatusCode.Ok).send(student);
// }



export const GetAbsenceDate = async(req , res)=>{
    const {dateString} = req.query;

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return res.status(400).send({ message: "Invalid date format." });
    }

    date.setUTCHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setUTCDate(date.getUTCDate() + 1);



    const absences = await Absence.find({
        date: {
            $gte: date,
            $lt: nextDay
        }
    }).populate("student");

    const formattedAbsences = absences.map(absence => ({
        _id: absence._id,
        date: formatDate(absence.date), // Format the date here
        student: absence.student // Include the populated student data
    }));
    res.send(formattedAbsences);
}

export const GetAbsence = async(req , res)=>{
        const {dateString,classs} = req.query;

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return res.status(400).send({ message: "Invalid date format." });
        }

        date.setUTCHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setUTCDate(date.getUTCDate() + 1);
    


        const absences =await Absence.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student",
                },
            },
            { $unwind: "$student" },
            { $match: 
                {
                    "student.class": `${classs}`,
                    "date":{
                        $gte: date,
                        $lt: nextDay
                    }
                } 
            },
            {
                $project: {
                    _id: 1, // Keep the absence ID if needed
                    date: 1, // Keep the date field
                    "student.name": 1, // Only include the name from the student
                    "student._id":1,
                    "student.class":1,
                    "student.section":1
                },
            },
        ]);
        
        const formattedAbsences = absences.map(absence => ({
            _id:absence._id,
            date: formatDate(absence.date), // Format the date here
            student: absence.student // Include the populated student data
        }));

        res.send(formattedAbsences);
}
    