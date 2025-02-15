async function loadStudentData() {
    const studentId = JSON.parse(sessionStorage.getItem('studentId')).trim();
    try{
        const url=`http://localhost:3000/student?id=${studentId}`;
        const response = await fetch(url,{method:'GET'});
        if(! response.ok){
            throw new Error('HTTP error: ' + response.status);
        }
        const data = await response.json(); // Parse the JSON response

        document.getElementById('student-name').value=data.name
        document.getElementById('student-class').value = data.class;
        document.getElementById('student-section').value = data.section;
        document.getElementById('fatherPhone').value = data.fatherPhone || '';
        document.getElementById('motherPhone').value = data.motherPhone || '';
        document.getElementById('student-id').value = data._id;

    }
    catch(e){
        alert('خطأ في الأتصال بالخادم' + e.message);
    }
}



document.getElementById('studentForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        const id = document.getElementById('student-id').value;
        const name = document.getElementById('student-name').value;
        const classs = document.getElementById('student-class').value;
        const sectionStr = document.getElementById('student-section').value;
        const fatherPhone = document.getElementById('fatherPhone').value;
        const motherPhone = document.getElementById('motherPhone').value;
        console.log(id);
        const section = parseInt(sectionStr, 10);

    const data = {
        id,
        name,
        classs,
        section,
        fatherPhone,
        motherPhone
    };
    try {
        const response = await fetch('http://localhost:3000/student/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);

        const messageDiv = document.getElementById('message');
        if (response.ok) {
            messageDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
            //alert(`${result.message}`);
            
        } 
        else if(result.message){
            messageDiv.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
            
        }
        else{
            messageDiv.innerHTML = `<div class="alert alert-danger">${result.errors}</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = `<div class="alert alert-danger">حدث خطأ أثناء الاتصال بالخادم</div>`;
    }
}); 

loadStudentData();