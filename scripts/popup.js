document.addEventListener( 'DOMContentLoaded', init );

function init(){
    const form = document.getElementById("all-tags-input-form");
    listenForTagInput(
        form, 
        storeDataToStorage, 
        chrome
    );

    listenForURLJnject(
        document.getElementById("url-inject-button"), 
        chrome, 
        getDataFromStorage, 
        "ALL_TAGS"
    );
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

function listenForURLJnject(button, browser, getDataFromStorage, tagsStorageKey){
    if(button){
        button.addEventListener("click", function(){
            getDataFromStorage(browser, tagsStorageKey)
                .then(data => {
                    const tagString = data[tagsStorageKey];
                    browser.tabs.query({active: true, currentWindow: true}, (tabResults) => {
                        const activeTab = tabResults[0];
                        browser.tabs.update({url: activeTab.url + tagString})
                    });
                });
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

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}