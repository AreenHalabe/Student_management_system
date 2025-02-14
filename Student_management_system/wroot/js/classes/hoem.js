
function navigate(page , params) {
    const content = document.getElementById('sub_content');

    // sessionStorage.setItem('classs', classs);
    // sessionStorage.setItem('section', section);
    const queryParams = new URLSearchParams(params);
    
    const classs = queryParams.get('class'); // Get the value of 'class'
    const section = queryParams.get('section'); 
     console.log('class : ' , classs , '-------' ,'sec : ' , section);


    // const url = `${page}?classs=${classs}&section=${section}`;
    // console.log('class : ' , classs , '-------' ,'sec : ' , section);
    // console.log("Navigating to:", url);
    //navigateTo(page , content);

}




document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-bodyyy');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            console.log("Card clicked!");

            // const page = this.getAttribute('data-page');
            // const params = this.getAttribute('data-params');
            // console.log("params into click listener", page);
            // navigate(page, params);
        });
    });
    // cards.addEventListener('click',function(){
    //     console.log("Card clicked!");
    // });

});
