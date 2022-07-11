document.addEventListener( 'DOMContentLoaded', init );

function init(){

    getDataFromStorage(browser, "WEBSITES")
        .then(data => {
            if(! data["WEBSITES"]) storeDataToStorage(browser, {WEBSITES: {}});
        })

    const form = document.getElementById("all-tags-input-form");
    listenForTagInput(
        form, 
        storeDataToStorage, 
        getDataFromStorage,
        chrome,
        getCurrentDomain
    );

    // listenForURLJnject(
    //     document.getElementById("url-inject-button"), 
    //     chrome, 
    //     "ALL_TAGS",
    //     "DEMARCATOR",
    //     "NEW_DEMARCATOR"
    // );
    attatchTagsToURL(
        document.getElementById("url-inject-button"), 
        chrome, 
        "WEBSITES",
        "TAGS",
        "DEMARCATOR",
        "NEW_DEMARCATOR",  
        getCurrentUrlAndDomain
    )
}

function listenForTagInput(form, storeDataToStorage, getDataFromStorage, browser, getCurrentDomain){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            const tagString = this.elements["tags-field"].value;
            const demarcator = this.elements["demarcator-field"].value;
            const newDemarcator = this.elements["new-demarcator-field"].value;
            //storeDataToStorage(browser, {ALL_TAGS: tagString, DEMARCATOR: demarcator, NEW_DEMARCATOR: newDemarcator});
            getDataFromStorage(browser, "WEBSITES")
                .then(data => {
                    let websiteTags = data["WEBSITES"];
                    getCurrentDomain(browser)
                        .then(domain => {
                            websiteTags[domain] = {TAGS: tagString, DEMARCATOR: demarcator, NEW_DEMARCATOR: newDemarcator}
                            storeDataToStorage(browser, {
                                WEBSITES: websiteTags
                            });
                        })
                })

        });        
    }

}

function getCurrentDomain(browser){
    return new Promise(resolve => {
        browser.tabs.query({active: true, currentWindow: true}, result => {
            const activeTab = result[0];
            const url = new URL(activeTab.url);
            const domain = url.hostname;
            resolve(domain);
        });
    });
}

function getCurrentUrlAndDomain(browser){
    return new Promise(resolve => {
        browser.tabs.query({active: true, currentWindow: true}, result => {
            const activeTab = result[0];
            const url = new URL(activeTab.url);
            const domain = url.hostname;
            resolve({url: url.href, domain: domain});
        });
    });
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

function attatchTagsToURL(
    button, 
    browser, 
    mainKey,
    tagsKey,
    demarcatorKey,
    newDemarcatorKey,    
    getCurrentUrlAndDomain
){
    if(button){
        button.addEventListener("click", function(){
            getCurrentUrlAndDomain(browser)
                .then(urlObject => {
                    browser.storage.local.get(mainKey, function(data){
                        const webistes = data[mainKey];
                        const domain = urlObject.domain; //this is very coupled, using different fucntions to get the url and the domain separately is unweildy but better practice
                        const currentWebsiteData = webistes[domain];
                        const tagString = currentWebsiteData[tagsKey];
                        const demarcator = currentWebsiteData[demarcatorKey]; 
                        const newDemarcator = currentWebsiteData[newDemarcatorKey];
                        const currentUrl = urlObject.url;
                        console.log("main data etc:    " + JSON.stringify(webistes) + "   " + domain + "   " + currentUrl + "    " + demarcator)
                        if(currentUrl.includes(demarcator)){
                            let urlWithTags = currentUrl.replace(demarcator, (newDemarcator? newDemarcator : demarcator) + tagString);
                            console.log("FINAL URL:   " + urlWithTags)
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