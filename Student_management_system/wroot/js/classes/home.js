//import { navigateTo } from "../navigate/navigateTo.js";


function ChangeContent(page , params){
    const queryParams = new URLSearchParams(params);
    const classs = queryParams.get('class');
    const section = queryParams.get('section'); 

    const content = document.getElementById('sub_content');
    sessionStorage.setItem('classs', classs);
    sessionStorage.setItem('section', section);

    navigateTo(page ,content);

}

function OnLoad(){
    const cards = document.querySelectorAll('.card-body');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const params = this.getAttribute('data-params');
            ChangeContent(page , params);
        });
    });
}

function navigateTo(page , content){
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html; // Set the content
            executeScripts(content); // Execute scripts manually
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

OnLoad();
