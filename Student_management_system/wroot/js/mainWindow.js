function navigateTo(page, element) {
    const content = document.getElementById('sub_content');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');

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

// Function to manually execute scripts after loading new content
function executeScripts(element) {
    const scripts = element.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const newScript = document.createElement('script');
        newScript.text = scripts[i].text; // Copy the script content
        document.body.appendChild(newScript).parentNode.removeChild(newScript); // Execute script
    }
}
