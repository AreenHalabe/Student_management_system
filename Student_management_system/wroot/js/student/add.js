
document.getElementById('studentForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const name = document.getElementById('name').value;
        const classs = document.getElementById('class').value;
        const sectionStr = document.getElementById('section').value;
        const fatherPhone = document.getElementById('fatherPhone').value;
        const motherPhone = document.getElementById('motherPhone').value;

        const section = parseInt(sectionStr, 10);

    const data = {
        name,
        classs,
        section,
        fatherPhone,
        motherPhone
    };
    try {
        const response = await fetch('http://localhost:3000/student/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        const messageDiv = document.getElementById('message');
        if (response.ok) {
            messageDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
        } 
        else if(response.status === 400 && result.message){
            messageDiv.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        }
        
        else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${result.errors}</div>`;
        }

    } catch (error) {
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = `<div class="alert alert-danger">حدث خطأ أثناء الاتصال بالخادم</div>`;
    }
});


