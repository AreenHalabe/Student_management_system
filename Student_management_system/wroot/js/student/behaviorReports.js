async function LateReport(StartDate , EndDate) {
    const url =`http://localhost:3000/student/behavior?StartDate=${StartDate}&EndDate=${EndDate}`;


    try{
        const messageDiv = document.getElementById('message');
        let tableBody = document.getElementById('students-table');
         tableBody.innerHTML='';
        messageDiv.innerHTML='';
        const response = await fetch(url);
        const result = await response.json();

        if(result.studentBehavior){
            InsertDataInTable(result.studentBehavior);
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

function InsertDataInTable(studentBehavior){
    let tableBody = document.getElementById('students-table');
    studentBehavior.forEach(studentbehavior=> {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${studentbehavior.student.name}</td>
            <td>${studentbehavior.student.class}</td>
            <td>${studentbehavior.student.section}</td>
            <td>${studentbehavior.BehaviorCount}</td>
        `;
        tableBody.appendChild(row);
    });
}

function OnLoad() {
    const btn = document.getElementById('search-btn');
    btn.addEventListener('click' , collectData);
}

function collectData(){
    const StartDate = document.getElementById('Sdate').value.trim();
    const EndDate = document.getElementById('Edate').value.trim();
    LateReport(StartDate , EndDate);
}

OnLoad();