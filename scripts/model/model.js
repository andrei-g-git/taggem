class MainData{ //this isn't great, it's already stored in local storage, may cause conflicts 
                //basically the only good way to use this is to pump and dump
    constructor(_browser, tagKey){
       this.mainData = {}; 
       this.TAGS = tagKey;
       this.browser = _browser;
    }

    loadMainData(key){
        return new Promise((resolve, reject) => {
            this.browser.storage.local.get(key, function(data){
                console.log("WEBSITES: ", data["WEBSITES"])
                resolve(data[/* key */"WEBSITES"]);
            });
        });
    }

    getMainData(data){
        this.mainData = data;
        console.log("this.mainData", JSON.stringify(this.mainData))
    }

    storeData(data){
        return new Promise((resolve, reject) => {
            this.browser.storage.local.set({WEBSITES: data}, function(){
                resolve("sent tag list to local storage");
            });
         });        
    }

    deleteTagByIndex(index, domain){
        const tags = this.produceTags(domain, this.TAGS);
        tags.splice(index, 2);
        this.storeData(this.mainData);
    }

    deleteTagByName(name, domain){
        const tags = this.produceTags(domain, this.TAGS);
        console.log("&&&&&&&&&& DELETED TAG:  ", name, "  and INDEXOF:  ", tags.indexOf(name), "  OLD TAGS: ", tags)
        const tagStringArray = tags.map(tag => tag.tag);
        tags.splice(
            tagStringArray.indexOf(name), 
            1//2  ---- 2????
        );    
        console.log("&&&&&&&&&& SPLICED TAGS: ", tags)  
        console.log("data before store: ", JSON.stringify(this.mainData))
        this.storeData(this.mainData);  
    }

    addTag(name, color, domain){
        const tags = this.produceTags(domain, this.TAGS);
        if(tags.filter(tag => tag.tag === name)){
            console.log("tag already exists!");
        } else {
            tags.push({
                tag: name,
                color: color
            });
        }
    }

    produceTags(domain, tagsKey){
        if(this.mainData && this.mainData[domain]){
            const domainData = this.mainData[domain];
            return domainData[this.TAGS];
        } else {
            return null;
        }       
    }
}