import { body, query } from "express-validator";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import { Absence } from "../models/Absence.js";


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


        const localDateString = today.toLocaleDateString('en-CA'); // "YYYY-MM-DD"

        const existingAbsences = await Absence.find({
            student: { $in: studentIds },
            date: localDateString

        });

        const existingIds = existingAbsences.map(a => a.student.toString());
        const newAbsences = studentIds.filter(id => !existingIds.includes(id)).map(studentId => ({
            student: studentId,
            date: localDateString,
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

        const localDateString = date.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
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
                        "date":localDateString
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
                return res.status(StatusCode.Ok).send({message:`لا يوجد غياب للطلاب ب هذا التاريخ (${dateString})`});
            }
            

            res.status(StatusCode.Ok).send(absences);
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

        const localDateString = date.toLocaleDateString('en-CA'); // "YYYY-MM-DD"

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
                        "date":localDateString ,
                        "student.class": `${classs}`,
                        "student.section": sectionInt
                        
                    } 
                },
                {
                    $project: {
                        _id: 1, // Keep the absence ID 
                        date: 1, // Keep the date field
                        "student.name": 1, // Only include the name from the student
                        "student._id":1,
                        "student.class":1,
                        "student.section":1
                    },
                },
            ]);

            if(absences.length==0){
                return res.status(StatusCode.Ok).send({message:`لا يوجد غياب للطلاب ب هذا التاريخ (${dateString}) للصف (${classs}) شعبة(${section})`});
            }
    
            res.status(StatusCode.Ok).send(absences);
        }
        catch(e){
            res.status(StatusCode.ServerError).send("خطأ في السيرفر حاول مرة اخرى");
        }
}
    
