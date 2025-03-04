
function ChangeSection(element , Editesection){
    let navlist= document.querySelectorAll('.n-link');

        navlist.forEach(link => {
            link.classList.remove('active-link');
    });

    element.classList.add('active-link');
    getQueryParams(Editesection);
}

function getQueryParams(section) {
    const btn = document.getElementById('btnn');
    btn.addEventListener('click' , SendAbsence);
    let navlist= document.querySelectorAll('.n-link');
    const classs = sessionStorage.getItem('classs');
    if(section === '1'){
        navlist[0].classList.add('active-link');
    }
    fetchStudents(classs,section);
}

function AddLink(){
    const editLink = document.querySelectorAll('.edit-student');
    const deleteLink = document.querySelectorAll('.delete-student');
    editLink.forEach(link=>{
        link.addEventListener('click',function(){
            const data = this.getAttribute('data-page');
            console.log(data);
            editStudent('edit.html' ,data);
        });
    });

    deleteLink.forEach(link=>{
        link.addEventListener('click' , function () {
            const data = this.getAttribute('data-params');
            deleteStudent(data);
        })
    })
}

async function fetchStudents(classs , section) {
    let ClassName=document.getElementById('name-of-class');
    ClassName.innerHTML='الصف '+classs;

    try {
        const url=`http://localhost:3000/student/get?classs=${classs}&section=${section}`;
            const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
         const students = await response.json();
        const tableBody = document.getElementById('students-table');
        tableBody.innerHTML = ''; 

        if (students.length > 0) {
            students.forEach(student=> {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.fatherPhone || 'N/A'}</td>
                    <td>${student.motherPhone || 'N/A'}</td>
                    <td><input type="checkbox" class="studentCheckboxAbsence" data-index="${student._id}" /></td>
                    <td><input type="checkbox" class="studentCheckboxLate" data-index="${student._id}" /></td>
                    <td><input type="checkbox" class="studentCheckboxBehavior" data-index="${student._id}" /></td>
                    <td>
                        <a href="#" class="edit-student" data-page='${student._id}' >
                            <i class="far fa-edit"></i>
                        </a>
                        <a href="#" class="delete-student" data-params="id=${student._id}&name=${student.name}&section=${student.section}" >
                            <i class="fas fa-trash-alt"></i>
                        </a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            AddLink();
        } else {
            tableBody.innerHTML = '<tr><td colspan="5">لا يوجد طلاب</td></tr>';
        }
    } catch (error) {
        document.getElementById('students-table').innerHTML = `<tr><td colspan="5" style="color: red;">خطأ: ${error.message}</td></tr>`;
    }
}


async function deleteStudent(data){
    const queryParams = new URLSearchParams(data);

    const studentId = queryParams.get('id');
    const name = queryParams.get('name'); 
    const section = queryParams.get('section'); 


    // const confirmation = confirm(`هل أنت متأكد من حذف هذه الطالبة_____( ${name} ) ؟`);
    // if (!confirmation) return;
    const confirmation = await window.electronAPI.showConfirm(`هل أنت متأكد من حذف هذه الطالبة_____( ${name} ) ؟`);
    if (!confirmation) return;


    try{
        const url = `http://localhost:3000/student/delete?id=${studentId}`;
        const response = await fetch(url,{method : 'DELETE'})
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const classs = sessionStorage.getItem('classs');
        fetchStudents(classs, section);
    }
    catch(error){
        alert('error : ' , error.message);
    }
}

function GetStudentLate(){
    const studentLate =[];
    document.querySelectorAll('.studentCheckboxLate:checked').forEach((checkbox)=>{
        let studentId = checkbox.getAttribute("data-index");
        studentLate.push(studentId);
    });
    return studentLate;
}


function GetStudentBehavior(){
    const studentBehavior =[];
    document.querySelectorAll(".studentCheckboxBehavior:checked").forEach((checkbox)=>{
        let studentId = checkbox.getAttribute("data-index");
        studentBehavior.push(studentId);
    });
    return studentBehavior;
}

function GetStudentAbsence(){
    const studentAbsence = [];
    document.querySelectorAll(".studentCheckboxAbsence:checked").forEach((checkbox) => {
        let studentId = checkbox.getAttribute("data-index");
        studentAbsence.push(studentId);
    });
    return studentAbsence;
}

async function SaveLate(studentIds){
    const url = 'http://localhost:3000/student/late/add';
    try{
        const response = await fetch(url,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body:JSON.stringify({studentIds})
        });
        
    }
    catch(e){
        window.electronAPI.showAlert(e.message);
    }
}

async function SaveBehavior(studentIds) {
    const url='http://localhost:3000/student/behavior/add';
    try{
        const response = await fetch(url,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body:JSON.stringify({studentIds})
        });

    }
    catch(e){
        window.electronAPI.showAlert(e.message);
    }
}

async function SaveAbsence(studentIds) {
    const url = 'http://localhost:3000/student/create/absence';
    try{
        const response = await fetch(url,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'  // Ensure JSON format
            },
            body:JSON.stringify({studentIds})
        });

        
         const result = await response.json();
         if(response.ok){
            if(result.students){
                sendSMS(result.students , result.localDateString);
            }
        }
    }
    catch(e){
        window.electronAPI.showAlert(e.message);
    }
}




async function SendAbsence () {

    const studentsAbsence = GetStudentAbsence();
    const studentsLate = GetStudentLate();
    const studentsBehavior = GetStudentBehavior();

    if(studentsAbsence.length === 0 && studentsLate.length === 0 && studentsBehavior.length === 0){
        return window.electronAPI.showAlert('يجب تحديد طالبة على الأقل');
    }
    if(studentsAbsence.length > 0){
       await SaveAbsence(studentsAbsence);
    }
    if(studentsLate.length >0){
      await  SaveLate(studentsLate);
    }
    if(studentsBehavior.length){
       await SaveBehavior(studentsBehavior);
    }

    window.electronAPI.showAlert('تم الحفظ بنجاح');
}


 async function sendSMS(students , date){
    // console.log(students);
    // console.log(date);
    const url = "http://hotsms.ps/sendbulksms.php";
    const api_token = "679b3376b1ee4";
    const sender = "Askar G-S1";
    const type= "0";

    for(const student of students){
        const data = {
            api_token:api_token,
            sender:sender,
            type:type,
            mobile: `${student.fatherPhone}`,
            text: `الأهل الكرام نعلمكم أن إبنتكم ( ${student.name} ) قد تغيبت اليوم الموافق ( ${date} ) عن الدوام المدرسي راجين من حضرتكم توضيح سبب الغياب.\nتقبلو الاحترام`
        };

        try{
            const response = await fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(data).toString()
            });

            const result = await response.text(); // or response.json() if the API returns JSON
            console.log(`SMS sent to ${student.fatherPhone}:`, result);
        }
        catch(e){
            console.log(e.message);
        }
    }
    


}


function editStudent(page ,studentId) {
    const content = document.getElementById('sub_content');
    stuId = JSON.stringify(studentId);
    sessionStorage.setItem('studentId', stuId.trim()); 

    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html; 
            executeScripts(content); 
        })
        .catch(err => {
            content.innerHTML = `<p style="color: red;">Failed to load page: ${err.message}</p>`;
        });
}

function executeScripts(element) {
    const scripts = element.querySelectorAll('script');

    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');

        if (oldScript.src) {
            newScript.src = oldScript.src + "?nocache=" + new Date().getTime(); // Prevent caching
        } else {
            newScript.textContent = oldScript.textContent;
        }

        newScript.async = true;
        document.body.appendChild(newScript);
    });
}


getQueryParams(sessionStorage.getItem('section'));