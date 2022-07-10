chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
    if(tab.active && tab.highlighted){
        console.log(`tab ${tabId} has updated`);
    }
});

// chrome.tabs.query({active: true, currentWindow: true}, (tabResults) => {
//     const activeTab = tabResults[0];

// });