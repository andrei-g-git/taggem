document.addEventListener( 'DOMContentLoaded', init );

function init(){
    const form = document.getElementById("all-tags-input-form");
    listenForTagInput(form, storeDataToStorage, chrome);
}

function listenForTagInput(form, storeDataToStorage, browser){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            console.log("input value:  " + this.elements["text-field"].value);
            const tagString = this.elements["text-field"].value;
            storeDataToStorage(browser, {ALL_TAGS: tagString})
        });        
    }

}

async function storeDataToStorage(browser, data){
    return new Promise((resolve, reject) => {
        browser.storage.local.set(data, function(){
            resolve("sent tag list to local storage");
        });
    });
}