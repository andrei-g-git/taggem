/* PSEUDO IMPORTS, CAN GET AUTOMATICALL FROM A SCRIPT DECLARED ABOVE

    import createTag, createMarkGroup from components/smallComponents.js

    import getCurrentDomain, 
        getCurrentUrl,
        storeDataToStorage,
        getDataFromStorage,
        getDomainDataAfterDomainCheck,
        removeAllChildNodes ,
        removeAllChildNodesAsync
    from utils/utils.js

    import keys from emums/enums.js
*/

document.addEventListener( 'DOMContentLoaded', init );

//great, adding state now...
let refreshes = 0;

function init(){
    console.log("init")

    getDataFromStorage(browser, keys.MAIN)
        .then(data => {
            if(! data[keys.MAIN]) storeDataToStorage(browser, {WEBSITES: {
                "en.wikipedia.org": {
                    "TAGS": [
                        {tag: "abc", color: "#000000"},
                        {tag: "def", color: "000000"},
                        {tag: "ghi", color: "000000"}
                    ],
                    "MARK": "Page",
                    "END_MARK": "DIIIICK"
                }
            }});
        });

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
    );

    addTag(
        document.getElementById("tag-form"),
        chrome,
        appendToMainData, 
        getCurrentDomain,
        "WEBSITES",
        "TAGS",
        keys.MARK,
        keys.END_MARK      
    );

    listenForDemarcator(
        document.getElementById("demarcator-form"), 
        storeDataToStorage, 
        getDataFromStorage, 
        chrome, 
        getCurrentDomain
    );

    createMarks(
        document.getElementById("mark-container"), 
        chrome, 
        createMarkGroup, 
        keys.MAIN, 
        keys.MARK, 
        keys.END_MARK,
        getDomainDataAfterDomainCheck
    );

    refreshMarks(
        document.getElementById("mark-container"),
        chrome,
        createMarks,
        createMarkGroup,
        getDomainDataAfterDomainCheck,
        keys.MAIN, 
        keys.MARK, 
        keys.END_MARK,     
    );


    attatchTagsToURL(
        document.getElementById("url-inject-button"), 
        chrome, 
        "WEBSITES",
        "TAGS",
        keys.MARK,
        keys.END_MARK,  
        getCurrentDomain,
        getCurrentUrl
    )
}

function deleteTagByName(name, domain, mainKey, browser){
    const model = new MainData(browser, keys.TAGS);
    model.loadMainData(mainKey)
        .then(result => {
            model.getMainData(result); //not good, should be called inside the object
            model.deleteTagByName(name, domain);
        });
    
}



// function createAllTags_New(container, browser, createTag, getCurrentDomain, mainKey, tagsKey){
//     removeAllChildNodesAsync(container)
//         .then(container => {
//             browser.storage.local.onChanged.addListener(changes => {
//                 getCurrentDomain(browser)
//                     .then(domain => {
//                         getDomainData(browser, domain, mainKey)
//                             .then(domainData => {
//                                 let dataFromDomain = domainData;
//                                 console.log("changes from new thing" , JSON.stringify(changes))
//                                 if(changes.WEBSITES/* changes.newValue.length */){
//                                     const primaryData = changes["WEBSITES"].newValue;
//                                     dataFromDomain = primaryData[domain];
//                                     // if(primaryData.WEBSITES){
//                                     //     dataFromDomain = primaryData["WEBSITES"][domain];
//                                     // } else {
//                                     //     dataFromDomain = primaryData[domain]; //well this sucks
//                                     // }
//                                 } else {
//                                     dataFromDomain = changes[domain].newValue
//                                 }  
//                                 const tags = dataFromDomain[tagsKey];
//                                 console.log("tags: ", JSON.stringify(tags));
//                                 tags.forEach((tagObject, index) => {
//                                     const tagString = tagObject.tag;
//                                     const color = tagObject.color;
//                                     const tagElement = createTag(tagString, color, index);
//                                     console.log("tagElement " + index + "  ", tagElement);
//                                     container.appendChild(tagElement);
//                                     console.log(`container after elem ${index}  added: `, container);
//                                     ///////
//                                     tagElement.addEventListener("click", () => deleteTagByName(tagString, domain, mainKey, browser));
//                                 });                                 
//                             });                        
//                     });
//             });
//         });
// }




function createAllTags(container, browser, createTag, getCurrentDomain, mainKey, tagsKey){
    if(container){

        //delete
        refreshes += 1;

        container.innerHTML = "";
        console.log("container FORM createAllTags ++++++: ", container);
        getCurrentDomain(browser)
            .then(domain => {
                console.log("~~~ wonder if getCurrentDomain still works: ", domain)
                getDomainData(browser, domain, mainKey)
                    .then(domainData => {
                        const tags = domainData[tagsKey];
                        tags.forEach((tagObject, index) => {
                            const tagString = tagObject.tag;
                            const color = tagObject.color;
                            const tagElement = createTag(tagString, color, index);
                            console.log("tagElement " + index + "  ", tagElement);
                            container.appendChild(tagElement);
                            console.log(`container after elem ${index}  added: `, container);
                            ///////
                            tagElement.addEventListener("click", () => deleteTagByName(tagString, domain, mainKey, browser));
                        });

                        setTimeout(() => {
                            console.log("container after 1 second: ", container);
                        },
                            190
                        )
                    });
            })
    }
}

function createMarks(container, browser, createMarkGroup, mainKey, markKey, endMarkKey, getDomainDataAfterDomainCheck){
    if(container){
        container.innerHTML = "";
        getDomainDataAfterDomainCheck(browser, mainKey)
            .then(domainData => {
                const mark = domainData[markKey];
                const endMark = domainData[endMarkKey];
                container.appendChild(createMarkGroup(mark, mark.length));
                container.appendChild(createMarkGroup(endMark, endMark.length));
            });
    }
}

function refreshTags(container, browser, createAllTags, createTag, getCurrentDomain, mainKey, tagsKey){
    browser.storage.local.onChanged.addListener(changes => { //so I don't need the results, I have no idea why I wasn't retreiving the right data when using my functions...
        console.log("CHANGES FROM OLD REFRESH:  ", JSON.stringify(changes))
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

// function refreshTagsFromWebistes(container, browser, createTag, tagsKey){
//     if(container){

//         console.log("container from refreshTags: ", container);
//         // console.log("from new refresh function, container before innerhtml='':  ", container)
//         // container.innerHTML = "";

//         // const testE = document.createElement("div");
//         // testE.setAttribute("class", "PULA")
//         // container.appendChild(testE);

//         // removeAllChildNodes(container);
//         // console.log("from new refresh function, container AFTER innerhtml='':  ", container)

//         // let promise = new Promise((resolve, reject) => {
//         //     resolve(container);
//         // });
//         // if(refreshes > 1) promise = removeAllChildNodesAsync(container);
//         if(1 > 0/* refreshes > 1 */){
//             removeAllChildNodesAsync(container/* , refreshes */)
//             // promise
//                 .then(container => {

            
//             //delete
//             refreshes += 1;

//                     console.log("container from removeAllChildNodes: ", container);
//                     browser.storage.local.onChanged.addListener(changes => {
//                         console.log("refreshes: ", refreshes, "  CHANGES:  ", JSON.stringify(changes))
//                         getCurrentDomain(browser)
//                             .then(domain => {
//                                 console.log("DOMAIN    ---:", domain)
//                                 let domainDataChanges = {}
//                                 if(JSON.stringify(changes).includes("WEBSITES")){
//                                     domainDataChanges = changes["WEBSITES"][domain]
//                                 } else {
//                                     domainDataChanges = changes[domain]
//                                 }
//                                 const domainData = domainDataChanges.newValue;
//                                 console.log("DIMAIN DATA: ----", JSON.stringify(domainData))
//                                 const tags = domainData[tagsKey];
//                                 tags.forEach((tagObject, index) => {
//                                     console.log(`i-${index}:  `,index);
//                                     const tagString = tagObject.tag;
//                                     const color = tagObject.color;
//                                     const tagElement = createTag(tagString, color, index);
//                                     container.appendChild(tagElement);

//                                     //test
//                                     tagElement.setAttribute("style", `border-width: 10px;`)

//                                     ///////
//                                     tagElement.addEventListener("click", () => deleteTagByName(tagString, domain, mainKey, browser));
//                                 });
//                             });
//                     });
//                 });
//             }

//     }
// }

function refreshMarks(container, browser, createMarks, createMarkGroup, getDomainDataAfterDomainCheck, mainKey, markKey, endMarkKey){
    browser.storage.local.onChanged.addListener(changes => {
        createMarks(
            container,
            browser,
            createMarkGroup,
            mainKey,
            markKey, 
            endMarkKey,
            getDomainDataAfterDomainCheck,
        )
    });
}

function addTag(form, browser, appendToMainData, getCurrentDomain, mainKey, tagsKey, demarcatorKey, newDemarcatorKey){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            const input = this.elements["tag-field"];
            const newTag = input.value;
            getCurrentDomain(browser)
                .then(domain => {
                    appendToMainData(browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey, newTag, domain)
                        .then(mainData => {
                            const dataObject = {};
                            dataObject[mainKey] = mainData;
                            browser.storage.local.set(dataObject);
                        });
                    return "whatever"
                })
                .then(result => {
                    input.value = "";
                })

        });
    }
}

//##################################
//##################################
//##################################
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
            forThisWebsite[tagsKey].push({
                tag:newTag, 
                color: randomColor()
            });
            resolve(websites);
        });
    });

}

//DELET THIS!!!111
function listenForDemarcator(form, storeDataToStorage, getDataFromStorage, browser, getCurrentDomain){
    if(form){
        form.addEventListener("submit", function(event){
            event.preventDefault();
            const demarcatorInput = this.elements["demarcator-field"];
            const newDemarcatorInput = this.elements["new-demarcator-field"];
            const demarcator = demarcatorInput.value;
            const newDemarcator = newDemarcatorInput.value;

            getDataFromStorage(browser, keys.MAIN)
                .then(data => {
                    let websites = data[keys.MAIN];
                    getCurrentDomain(browser)
                        .then(domain => {
                            websites[domain][keys.MARK] = demarcator;
                            websites[domain][keys.END_MARK] = newDemarcator;
                            storeDataToStorage(browser, {
                                WEBSITES: websites
                            });
                        })
                    return "whatever";
                })
                .then(result => {
                    demarcatorInput.value = "";
                    newDemarcatorInput.value = "";
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
            tags.forEach(tagObject => {
                tagString += tagObject.tag;
            });
            const demarcator = currentWebsiteData[demarcatorKey]; 
            const newDemarcator = currentWebsiteData[newDemarcatorKey];   
            resolve({tagString: tagString, demarcator: demarcator, newDemarcator: newDemarcator});
        });
    });
}

function updateUrl(browser, currentUrl, tagString, demarcator, newDemarcator){
    if(currentUrl.includes(demarcator)){
        let toReplace = "";
        const start = currentUrl.indexOf(demarcator) + demarcator.length;
        if(newDemarcator && newDemarcator.length > 0){
            const end = currentUrl.indexOf(newDemarcator);
            toReplace = currentUrl.slice(start, end);
        } else {
            toReplace = currentUrl.slice(start);
        }

        let urlWithTags = currentUrl.replace(demarcator + toReplace, demarcator + tagString);
        browser.tabs.update({url: urlWithTags})
    } else {
        console.log("no demarcator match, should be: " + demarcator);
    }
}
