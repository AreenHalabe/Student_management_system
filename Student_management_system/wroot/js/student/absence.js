function collectData(){
    const StartDate = document.getElementById('Sdate').value.trim();
    const EndDate = document.getElementById('Edate').value.trim();
    AbsenceByDatee(StartDate , EndDate);

}


async function AbsenceByDatee(StartDate , EndDate){
    const url = `http://localhost:3000/student/absence/date?StartDate=${StartDate}&EndDate=${EndDate}`
    const messageDiv = document.getElementById('message');
    let tableBody = document.getElementById('students-table');
    tableBody.innerHTML='';
    messageDiv.innerHTML='';

    

    try{
        const response = await fetch(url);
        const result = await response.json();

        console.log(result);

        if(result.StudentAbsences){
            InsertDataInTable(result.StudentAbsences);
        }
        
        else if(result.errors){
             messageDiv.innerHTML=`<div class="alert alert-danger">${result.errors}</div>`;
        }
        else if(result.message){
             tableBody.innerHTML=`<tr><td colspan="4"> ${result.message} </td></tr>`;
            console.log(result.message);
        }

    }
    catch(e){
        document.getElementById('students-table').innerHTML = `<tr><td colspan="5" style="color: red;">${e.message}</td></tr>`;
    }

}




function OnLoad() {
    const btn = document.getElementById('search-btn');
    btn.addEventListener('click' , collectData);
}




async function AbsenceByDate(date) {
    const url=`http://localhost:3000/student/absence/by/date?dateString=${date}`;
    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const absences = await response.json();
        let tableBody = document.getElementById('students-table');
        
        tableBody.innerHTML = ''; 

        if(absences.length > 0){
            InsertDataInTable(absences);
        }
        else{
            tableBody.innerHTML = `<tr><td colspan="4">${absences.message}</td></tr>`;
        }
    }
    catch(e){
        document.getElementById('students-table').innerHTML = `<tr><td colspan="5" style="color: red;">خطأ في الأتصال في الخادم</td></tr>`;
    }
}

async function AbsenceByDateAndClassAndSection(date , classs , section) {
    const url=`http://localhost:3000/student/absence/date/class/section?dateString=${date}&classs=${classs}&section=${section}`;

    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const absences = await response.json();
        let tableBody = document.getElementById('students-table');
        tableBody.innerHTML = ''; 
        if(absences.length > 0){
            InsertDataInTable(absences);
        }
        else{
            tableBody.innerHTML = `<tr><td colspan="4">${absences.message}</td></tr>`;
        }
    }
    catch(e){
        document.getElementById('students-table').innerHTML = `<tr><td colspan="5" style="color: red;">خطأ في الأتصال في الخادم</td></tr>`;
    }
}

function InsertDataInTable(StudentAbsences){
    let tableBody = document.getElementById('students-table');

    StudentAbsences.forEach(student=> {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>${student.date}</td>
        `;
        tableBody.appendChild(row);
    });

}




OnLoad();