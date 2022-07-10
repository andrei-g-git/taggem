// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
//     if(tab.active && tab.highlighted){
//         console.log(`tab ${tabId} has updated`);
//         chrome.tabs.update({url: "https://wikipedia.org"}) //deathloop --- obviously this won't work
//     }
// });

// chrome.tabs.query({active: true, currentWindow: true}, (tabResults) => {
//     const activeTab = tabResults[0];

// });