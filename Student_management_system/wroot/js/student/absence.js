function collectData(){
    const date = document.getElementById('date').value.trim();
    const classs = document.getElementById('class').value.trim();
    const section = document.getElementById('section').value.trim();
    const messageDiv = document.getElementById('message');
    let tableBody = document.getElementById('students-table');

    if(date && classs && section){
        messageDiv.innerHTML='';
        AbsenceByDateAndClassAndSection(date , classs , section);
    }
    else if(date && !classs && !section){
        messageDiv.innerHTML='';
        AbsenceByDate(date);
    }
    else{
        messageDiv.innerHTML='';
        tableBody.innerHTML = ''; 
        messageDiv.innerHTML=`<div class="alert alert-danger">البحث يمكن أن يكون عن طريق التاريخ فقط <h2>أو</h2> عن طريق التاريخ مع الصف مع الشعبة</div>`;
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

function InsertDataInTable(absences){
    let tableBody = document.getElementById('students-table');

    absences.forEach(absence=> {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${absence.student.name}</td>
            <td>${absence.student.class}</td>
            <td>${absence.student.section}</td>
            <td>${absence.date}</td>
        `;
        tableBody.appendChild(row);
    });

}




OnLoad();