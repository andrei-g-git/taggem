class MainData{ //this isn't great, it's already stored in local storage, may cause conflicts 
                //basically the only good way to use this is to pump and dump
    constructor(_browser, tagKey){
       this.mainData = {}; 
       this.TAGS = tagKey;
       this.browser = _browser;
    }

    loadMainData(key){
        console.log("comeon")
        return new Promise((resolve, reject) => {
            this.browser.storage.local.get(key, function(data){
                console.log("anything?    key: " + "key")
                console.log("raw data:  ", data)
                console.log("WEBSITES: ", data["WEBSITES"])
                //THIS keyword belongs to the function, not the object
                //this.mainData = data[/* key */"WEBSITES"]; //feeding a variable doesn't seem to work here for some reason, it just takes the variable name as a key...
                //console.log("from the model, main data is  ", JSON.stringify(this.mainData)) //not yet assigned value, it's async
                //this.getMainData(data["WEBSITES"]); //class methods still have to call 'this'
                resolve(data[/* key */"WEBSITES"]);
            });
        })
            //.then(mainData => this.getMainData(mainData));   
        
        //test.then(result => { this.getMainData(result)/* ; return result */} )
        //return test;
    }

    getMainData(data){
        console.log("getMainData")
        console.log("from the model, main data is  ", JSON.stringify(data));
        this.mainData = data;
        console.log("this.mainData", JSON.stringify(this.mainData))
    }

    storeData(data){
        return new Promise((resolve, reject) => {
            this.browser.storage.local.set(data, function(){
                resolve("sent tag list to local storage");
            });
         });        
    }

    deleteTagByIndex(index, domain){
        // if(this.mainData.length){
        //     const domainData = this.mainData[domain];
        //     const tags = domainData[this.TAGS];
        //     tags.splice(index, 2);
        // }
        const tags = this.produceTags(domain, this.TAGS);
        tags.splice(index, 2);
        this.storeData(this.mainData);
    }

    deleteTagByName(name, domain){
        // if(this.mainData.length){
        //     const domainData = this.mainData[domain];
        //     const tags = domainData[this.TAGS];
        //     tags.splice(
        //         tags.indexOf(name), 
        //         2
        //     );
        // }
        console.log("TAGSSSS: ",this.TAGS, "DOMAIN :", domain);
        const tags = this.produceTags(domain, this.TAGS);
        tags.splice(
            tags.indexOf(name), 
            2
        );      
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