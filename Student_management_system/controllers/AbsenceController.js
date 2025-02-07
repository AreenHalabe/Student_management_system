import { body, query } from "express-validator";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";
import { Absence } from "../models/Absence.js";




export const GetStudnetAbsence  = async(req,res)=>{

    try{
        const absences= await Absence.find({}).populate("studentId");
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
        today.setHours(0, 0, 0, 0); // set to start of the day (ignor the houre , miniute and second)

        // Check for existing absences
        const existingAbsences = await Absence.find({
            studentId: { $in: studentIds },
            date: { 
                $gte: today, 
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // end of the day
            }
        });

        // Filter out IDs that already have an absence today
        const existingIds = existingAbsences.map(a => a.studentId.toString());
        const newAbsences = studentIds.filter(id => !existingIds.includes(id)).map(studentId => ({
            studentId: studentId,
            date: Date.now(),
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