import { body, query } from "express-validator";
import { Student } from "../models/student.js";
import { StatusCode } from "../HTTPSStatusCode/StatusCode.js";

export const GetStudent = async(req,res)=>{
    const{id} = req.query;
    try{
        const student = await Student.findById({_id:id});
        if(student != null){
            res.status(StatusCode.Ok).send(student);
        }
        else{
            res.status(StatusCode.NotFound).send({message:'الطالبة غير موجودة'});
        }
    }
    catch(e){
        res.status(StatusCode.NotFound).send({message:'خطأ في السيرفر حاول مرة اخرى'});
    }
}

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
            res.status(StatusCode.BadRequst).send({message:`لا يوجد صف (${classs}) مع شعبه (${section})`});
        }

        
       

    }
    catch (Error) {
        res.status(StatusCode.BadRequst).send(Error);
    }
};


export const AddStudent = async(req , res) =>{
    const {name , classs , section , fatherPhone , motherPhone} = req.body;
   
    try{
        const NewStudent = new Student({
            name : name,
            class : classs,
            fatherPhone : fatherPhone,
            motherPhone : motherPhone,
            section : section
        });

        await NewStudent.save();
        
        res.status(StatusCode.Ok).send({message:"تم اضافه طالبه جديدة بنجاح"});
    }
    catch (e) {
         res.status(StatusCode.BadRequst).send({message:"اسم الطالبة موجود بالفعل"});
    }
}


export const DeleteStudent = async(req , res)=>{
    const {id} = req.query;
    try{
        const DeleteStudent = await Student.deleteOne({_id : id});
        if (DeleteStudent.deletedCount != 0) {
            return res.status(StatusCode.Ok).send({message:"تم حذف الطالبة بنجاح"});
        }
        else {
            return res.status(StatusCode.NotFound).send({message:"الطالبة غير موجودة"});
        }
    }
    catch (e) {
        res.status(StatusCode.ServerError).send({message:"السيرفر مشغول حاول مرة اخرى"});
    }

}



export const UpdateStudent = async(req,res)=>{
    const{id , name , classs , section , fatherPhone , motherPhone} = req.body;
    try{
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
            return res.status(StatusCode.Ok).send({message:"تم التحديث بنجاح"});
        }
        else {
            return res.status(StatusCode.Ok).send({message:"لم تقم بإجراء اي تعديل"});
        }

    }
    catch (e) {
        return res.status(StatusCode.BadRequst).send({message:'خطأ في التعديل الإسم المدخل خاص بطالبة اخرى'});
    }
}




