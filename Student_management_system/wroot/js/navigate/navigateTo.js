
export function navigateTo(page , content){
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
// export function executeScripts(element) {
//     const scripts = element.getElementsByTagName('script');
//     for (let i = 0; i < scripts.length; i++) {
//         const newScript = document.createElement('script');
//         newScript.text = scripts[i].text; // Copy the script content
//         document.body.appendChild(newScript).parentNode.removeChild(newScript); // Execute script
//     }
// }


//this is successfull down

// export function executeScripts(element) {
//     const scripts = element.querySelectorAll('script');
//     console.log("Executing scripts...");
//     console.log("Found scripts:", element.getElementsByTagName('script').length);
//     scripts.forEach(oldScript => {
//         // Remove any existing script with the same src before adding a new one
//         if (oldScript.src) {
//             const existingScript = document.querySelector(`script[src="${oldScript.src}"]`);
//             if (existingScript) {
//                 existingScript.remove();  // Delete old script
//             }
//         }

//         const newScript = document.createElement('script');

//         if (oldScript.src) {
//             newScript.src = oldScript.src + "?nocache=" + new Date().getTime(); // Prevent caching issues
//         } else {
//             newScript.textContent = oldScript.textContent;
//         }

//         newScript.async = true;
//         document.body.appendChild(newScript);
//     });
// }

export function executeScripts(element) {
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