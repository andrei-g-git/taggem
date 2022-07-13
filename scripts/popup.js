/* PSEUDO IMPORTS, CAN GET AUTOMATICALL FROM A SCRIPT DECLARED ABOVE

    import createTag from components/smallComponents.js

    import getCurrentDomain, 
        getCurrentUrl,
        storeDataToStorage,
        getDataFromStorage 
    from utils/utils.js

    import keys from emums/enums.js
*/

document.addEventListener( 'DOMContentLoaded', init );

function init(){
    getDataFromStorage(browser, keys.MAIN)
        .then(data => {
            if(! data[keys.MAIN]) storeDataToStorage(browser, {WEBSITES: {
                "en.wikipedia.org": {
                    "TAGS": [
                        "abc",
                        "def",
                        "ghi"
                    ],
                    "DEMARCATOR": "Page",
                    "NEW_DEMARCATOR": "DIIIICK"
                }
            }});
        })

    createAllTags(
        document.getElementById("tag-container"),
        chrome,
        createTag,
        getCurrentDomain,
        "WEBSITES",
        "TAGS"
    );

    refreshTags(
        document.getElementById("tag-container"),
        chrome,
        createAllTags,
        createTag,
        getCurrentDomain,
        "WEBSITES",
        "TAGS"        
    )

    addTag(
        document.getElementById("tag-form"),
        chrome,
        appendToMainData, 
        getCurrentDomain,
        "WEBSITES",
        "TAGS",
        "DEMARCATOR",
        "NEW_DEMARCATOR"      
    );

    listenForDemarcator(
        document.getElementById("demarcator-form"), 
        storeDataToStorage, 
        getDataFromStorage, 
        chrome, 
        getCurrentDomain
    );

    attatchTagsToURL(
        document.getElementById("url-inject-button"), 
        chrome, 
        "WEBSITES",
        "TAGS",
        "DEMARCATOR",
        "NEW_DEMARCATOR",  
        getCurrentDomain,
        getCurrentUrl
    )
}

function createAllTags(container, browser, createTag, getCurrentDomain, mainKey, tagsKey){
    if(container){
        container.innerHTML = "";
        getCurrentDomain(browser)
            .then(domain => {
                browser.storage.local.get(mainKey, data => {
                    const websites = data[mainKey];
                    const forCurrentWebsite = websites[domain];
                    const tags = forCurrentWebsite[tagsKey];
                    tags.forEach((tagString, index) => {
                        const tagElement = createTag(tagString, index);
                        container.appendChild(tagElement);
                    });
                })
            })
    }
}

function refreshTags(container, browser, createAllTags, createTag, getCurrentDomain, mainKey, tagsKey){
    browser.storage.local.onChanged.addListener(changes => {
        createAllTags(
            container,
            browser,
            createTag,
            getCurrentDomain,
            mainKey,
            tagsKey
        )
    });
}

function addTag(form, browser, appendToMainData, getCurrentDomain, mainKey, tagsKey, demarcatorKey, newDemarcatorKey){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            const newTag = this.elements["tag-field"].value;
            getCurrentDomain(browser)
                .then(domain => {
                    appendToMainData(browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey, newTag, domain)
                        .then(mainData => {
                            console.log("new main data before storage:  " + JSON.stringify(mainData))
                            const dataObject = {};
                            dataObject[mainKey] = mainData;
                            browser.storage.local.set(dataObject);
                        });
                });

        });
    }
}

function appendToMainData(browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey, newTag, domain){
    return new Promise(resolve => {
        browser.storage.local.get(mainKey, function(data){
            const websites = data[mainKey];
            if(! websites[domain]){
                websites[domain] = {};
                const emptyDomainData = websites[domain];
                emptyDomainData[tagsKey] = [];
                emptyDomainData[demarcatorKey] = "";
                emptyDomainData[newDemarcatorKey] = "";
            }
            const forThisWebsite = websites[domain];
            forThisWebsite[tagsKey].push(newTag);
            resolve(websites);
        });
    });

}

function listenForTagInput(form, storeDataToStorage, getDataFromStorage, browser, getCurrentDomain){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            const tagString = this.elements["tags-field"].value;
            const demarcator = this.elements["demarcator-field"].value;
            const newDemarcator = this.elements["new-demarcator-field"].value;
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


//DELET THIS!!!111
function listenForDemarcator(form, storeDataToStorage, getDataFromStorage, browser, getCurrentDomain){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            const demarcator = this.elements["demarcator-field"].value;
            const newDemarcator = this.elements["new-demarcator-field"].value;
            getDataFromStorage(browser, "WEBSITES")
                .then(data => {
                    let websites = data["WEBSITES"];
                    getCurrentDomain(browser)
                        .then(domain => {
                            websites[domain]["DEMARCATOR"] = demarcator;
                            websites[domain]["NEW_DEMARCATOR"] = newDemarcator;
                            storeDataToStorage(browser, {
                                WEBSITES: websites
                            });
                        })
                })
        });        
    }
}
//DELET^^^^^^^^^^^^^^^^^^^^^

function attatchTagsToURL(
    button, 
    browser, 
    mainKey,
    tagsKey,
    demarcatorKey,
    newDemarcatorKey,    
    getCurrentDomain,
    getCurrentUrl
){
    if(button){
        button.addEventListener("click", function(){
            console.log("added event listener to button")
            getCurrentDomain(browser)
                .then(domain => {
                    getTagsAndDemarcators(
                        domain, 
                        browser,
                        mainKey,
                        tagsKey,
                        demarcatorKey,
                        newDemarcatorKey
                    )
                        .then(affixObject => {
                            const {tagString, demarcator, newDemarcator} = affixObject;
                            getCurrentUrl(browser)
                                .then(currentUrl => {
                                    updateUrl(
                                        browser, 
                                        currentUrl, 
                                        tagString, 
                                        demarcator, 
                                        newDemarcator
                                    )
                                });
                        });
                })
        });

    }
}

function getTagsAndDemarcators(domain, browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey){
    return new Promise(resolve => {
        browser.storage.local.get(mainKey, function(data){
            const webistes = data[mainKey];
            const currentWebsiteData = webistes[domain];
            const tags = currentWebsiteData[tagsKey];
            let tagString = "";
            tags.forEach(tag => {
                tagString += tag;
            });
            const demarcator = currentWebsiteData[demarcatorKey]; 
            const newDemarcator = currentWebsiteData[newDemarcatorKey];   
            console.log("from helper function",tagString, demarcator, newDemarcator) //##################
            resolve({tagString: tagString, demarcator: demarcator, newDemarcator: newDemarcator});
        });
    });
}

function updateUrl(browser, currentUrl, tagString, demarcator, newDemarcator){
    if(currentUrl.includes(demarcator)){
        let urlWithTags = currentUrl.replace(demarcator, (newDemarcator? newDemarcator : demarcator) + tagString);
        console.log("FINAL URL:   " + urlWithTags)
        browser.tabs.update({url: urlWithTags})
    } else {
        console.log("no demarcator match, should be: " + demarcator);
    }
}


