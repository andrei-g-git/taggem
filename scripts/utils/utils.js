function randomColor(){
    let color = '#';
    for (let i = 0; i < 6; i++){
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    };
    return color;
 };

async function getCurrentTab(browser){ //this doesn't work for some reason. Apparently chrome ddiscards the DOM object after a while and maybe this sets up a wait period that's too long but now I'm just talking out of my ass
   const [tab] = await browser.tabs.query({active: true, currentWindow: true});
   return tab;
}

function getCurrentDomainAndUrl(browser){
   return new Promise(resolve => {
      // getCurrentTab(browser)
      //    .then(activeTab => {
      //       const url = new URL(activeTab.url);
      //       resolve({url: url.hash, domain: url.hostname});
      //    });
      browser.tabs.query({active: true, currentWindow: true}, result => {
         const activeTab = result[0];
         const url = new URL(activeTab.url);
         resolve({url: url.href, domain: url.hostname});
      });
   });
}

/* async  */function getCurrentDomain(browser){
   // let urlAndDomain = await getCurrentDomainAndUrl(browser);
   // return urlAndDomain.domain;
   return new Promise(resolve => {
      getCurrentDomainAndUrl(browser)
         .then(urlObject => {
            resolve(urlObject.domain);
         });
   });
}

/* async  */function getCurrentUrl(browser){
   // let urlAndDomain = await getCurrentDomainAndUrl(browser);
   // return urlAndDomain.url;
   return new Promise(resolve => {
      getCurrentDomainAndUrl(browser)
         .then(urlObject => {
            resolve(urlObject.url);
         });
   });
}

/* async  */function storeDataToStorage(browser, data){
   return new Promise((resolve, reject) => {
      browser.storage.local.set(data, function(){
          resolve("sent tag list to local storage");
      });
  });
}

/* async  */function getDataFromStorage(browser, ...keys){ //this doesn't actually retrieve more than 1 key/value pair
  return new Promise((resolve, reject) => {
      browser.storage.local.get([...keys], function(data){
          resolve(data);
      });
  });
}