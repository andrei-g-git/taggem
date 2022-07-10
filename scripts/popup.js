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
        "ALL_TAGS",
        "DEMARCATOR",
        "NEW_DEMARCATOR"
    );
}

function listenForTagInput(form, storeDataToStorage, browser){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            console.log("input value:  " + this.elements["tags-field"].value);
            const tagString = this.elements["tags-field"].value;
            const demarcator = this.elements["demarcator-field"].value;
            const newDemarcator = this.elements["new-demarcator-field"].value;
            storeDataToStorage(browser, {ALL_TAGS: tagString, DEMARCATOR: demarcator, NEW_DEMARCATOR: newDemarcator});
        });        
    }

}

function listenForURLJnject(button, browser, tagsStorageKey, demarcatorKey, newDemarcatorKey){
    if(button){
        button.addEventListener("click", function(){
            browser.storage.local.get([tagsStorageKey, demarcatorKey, newDemarcatorKey], function(data){

                console.log(JSON.stringify(data))
                const tagString = data[tagsStorageKey];
                const demarcator = data[demarcatorKey]; 
                const newDemarcator = data[newDemarcatorKey];
                browser.tabs.query({active: true, currentWindow: true}, (tabResults) => {
                    const activeTab = tabResults[0];
                    const currentUrl = activeTab.url;
                    console.log("demarcator:    " + demarcator + "   and the key:    " + demarcatorKey + "  and the tags: " + tagString + "   new demarcator" + newDemarcator)
                    if(currentUrl.includes(demarcator)){
                        let urlWithTags = currentUrl.replace(demarcator, (newDemarcator? newDemarcator : demarcator) + tagString);
                        browser.tabs.update({url: urlWithTags})
                    } else {
                        console.log("no demarcator match, should be: " + demarcator);
                    }
                });

            })
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

async function getDataFromStorage(browser, ...keys){ //this doesn't actually retrieve more than 1 key/value pair
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}