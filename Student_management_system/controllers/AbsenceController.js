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
        const absences = studentIds.map((studentId) => ({
            studentId: studentId, 
            date: Date.now(), 
        }));

        await Absence.insertMany(absences);

        res.status(StatusCode.Ok).send(`تم اضافه الغياب ل (${absences.length}) طالبة نجاح`);
    } catch (e) {
        //console.error(e);
       // res.status(500).json({ error: "Failed to create absences", details: e.message }); // Send a safe error message
        res.status(500).send("خطأ في اضافة الغيابات !!!!!");
    }
};