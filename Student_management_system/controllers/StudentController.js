import { body, query } from "express-validator";
import { Student } from "../models/student.js";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";

export const AllStudentsByClassAndSection = async(req , res)=>{
    const {classs , section} = req.query;
    try{

        const students = await Student.find({
                class : classs ,
                section : section
            }
        );

        
        if(students.length != 0){
            res.status(StatusCode.Ok).send(students);
        }
        else{
            res.status(StatusCode.BadRequst).send(`لا يوجد صف (${classs}) مع شعبه (${section})`);
        }

        
       

    }
    catch (Error) {
        res.status(StatusCode.BadRequst).send(Error);
    }
};


export const AddStudent = async(req , res) =>{
    const {name , classs , section , fatherPhone , motherPhone} = req.body;

    try{
        const existingStudent = await Student.findOne({ name });
        if (existingStudent) {
            return res.status(StatusCode.BadRequest).send("اسم الطالبة موجود بالفعل");
        }
        const NewStudent = new Student({
            name : name,
            class : classs,
            fatherPhone : fatherPhone,
            motherPhone : motherPhone,
            section : section
        });

        await NewStudent.save();
        
        res.status(StatusCode.Ok).send("تم اضافه طالبه جديدة بنجاح");
    }
    catch (e) {
        res.status(StatusCode.ServerError).send("الخادم مشغول حاول مرة اخرى");
    }
}


export const DeleteStudent = async(req , res)=>{
    const {id} = req.query;
    try{
        const DeleteStudent = await Student.deleteOne({_id : id});
        if (DeleteStudent.deletedCount != 0) {
            return res.status(StatusCode.Ok).send("تم حذف الطالبة بنجاح");
        }
        else {
            return res.status(StatusCode.NotFound).send("الطالبة غير موجودة");
        }
    }
    catch (e) {
        res.status(StatusCode.ServerError).send("السيرفر مشغول حاول مرة اخرى");
    }

}



export const UpdateStudent = async(req,res)=>{
    const{id , name , classs , section , fatherPhone , motherPhone} = req.body;

    try{
        const checkName = await Student.findOne({name:name});
        if(checkName._id === id){
            const UpdateStudent = await Student.updateOne(
                {_id : id},
                {
                    name: name,
                    section : section,
                    class : classs,
                    fatherPhone : fatherPhone,
                    motherPhone : motherPhone
                }
            );
            if (UpdateStudent.modifiedCount != 0) {
                res.status(StatusCode.Ok).send("تم التحديث بنجاح");
            }
            else {
                res.status(StatusCode.ServerError).send("خطأ في التحديث حاول مرة اخرى");
            }
        }
        else{
            res.status(StatusCode.BadRequst).send("خطأ اثناء التحديث. الاسم المدخل خاص بطالبة اخرى ")
        }
    }
    catch (e) {
        return res.status(StatusCode.ServerError).send("خطأ في تحديث البيانات حاول مرة اخرى");
    }
}

