// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function toggleSubmenu(menuId, element) {
    // Close all other menus
    const submenus = document.querySelectorAll(".submenu");
    submenus.forEach(menu => {
        if (menu.id !== menuId) {
            menu.classList.add("d-none");
        }
    });

    // Toggle the current submenu
    const menu = document.getElementById(menuId);
    menu.classList.toggle("d-none");

    // Highlight the clicked menu
    highlightMenu(element);
}

function highlightMenu(element) {
    // Remove highlight from all links
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        link.classList.remove("active-link");
    });

    // Add highlight to the current link
    element.classList.add("active-link");
}


