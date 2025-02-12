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
        res.status(StatusCode.ServerError).send("خطأ في السيرفر حاول مرة اخرى");
    }
};

export const DeleteAbsence = async(req,res)=>{
    const{id} = req.query;

    try{
        const DeleteAbsence = await Absence.deleteOne({_id:id});
        if (DeleteAbsence.deletedCount != 0) {
            return res.status(StatusCode.Ok).send({message:"تم حذف الغياب بنجاح"});
        }
        else {
            return res.status(StatusCode.NotFound).send({message:"لا يوجد غياب"});
        }
    }
    catch(e){
        res.status(StatusCode.ServerError).send('خطأ في السيرفر حاول مرة اخرى')
    }
}




export const CreateStudentAbsence = async (req, res) => {
    const { studentIds } = req.body; 

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).send({message:"Invalid input: studentIds must be a non-empty array."});
    }

    try {
        const today = new Date();
        const newDate=today.toLocaleDateString();
        console.log('type of date-----',typeof(today.toLocaleDateString()));
        console.log(today.toLocaleTimeString());
        today.setHours(0, 0, 0, 0); // Use UTC instead of local time

        console.log(today);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Move to the next day in UTC

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
            date: newDate, // This is now in UTC
        }));


        if (newAbsences.length > 0) {
            await Absence.insertMany(newAbsences);
            res.status(StatusCode.Ok).send({message: 'تم إضافة الغياب للطالبات'});
        } else {
            res.status(StatusCode.Ok).send({message: 'كل الطالبات المحددات موجودة بالفعل في قائمة الغياب لهذا اليوم.'});
        }
    } catch (e) {
        res.status(StatusCode.ServerError).send({message:e.message});
    }
};



export const GetAbsenceByDate = async(req , res)=>{
    const {dateString} = req.query;

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return res.status(400).send({ message: "Invalid date format." });
        }

        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        try{
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

            if(absences.length==0){
                return res.status(StatusCode.Ok).send({message:`لا يوجد غياب للطلاب ب هذا التاريخ(${dateString})`});
            }
            
            const formattedAbsences = absences.map(absence => ({
                _id:absence._id,
                date: formatDate(absence.date), // Format the date here
                student: absence.student // Include the populated student data
            }));
    
            res.status(StatusCode.Ok).send(formattedAbsences);
        }
        catch(e){
            res.status(StatusCode.ServerError).send("خطأ في السيرفر حاول مرة اخرى");
        }
}

export const GetAbsenceByClassAndSection = async(req , res)=>{
        const { dateString, classs , section} = req.query;
        
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return res.status(400).send({ message: "Invalid date format." });
        }

        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
    
        const sectionInt = parseInt(section, 10);

        try{
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
                        "date":{
                            $gte: date,
                            $lt: nextDay
                        },
                        "student.class": `${classs}`,
                        "student.section": sectionInt
                        
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

            if(absences.length==0){
                return res.status(StatusCode.Ok).send({message:`لا يوجد غياب للطلاب ب هذا التاريخ(${dateString}) للصف (${classs}) شعبة(${section})`});
            }
    
            const formattedAbsences = absences.map(absence => ({
                _id:absence._id,
                date: formatDate(absence.date), // Format the date here
                student: absence.student // Include the populated student data
            }));
    
            res.status(StatusCode.Ok).send(formattedAbsences);
        }
        catch(e){
            res.status(StatusCode.ServerError).send("خطأ في السيرفر حاول مرة اخرى");
        }
}
    
