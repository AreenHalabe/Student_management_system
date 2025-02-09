import mongoose, { Schema } from "mongoose";

const absenceSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students',
    },
    date: {
        type: Date,
    }
});


export const Absence = mongoose.model("Absences" , absenceSchema);