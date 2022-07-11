"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
  getDataFromStorage(browser, "WEBSITES").then(function (data) {
    if (!data["WEBSITES"]) storeDataToStorage(browser, {
      WEBSITES: {
        "en.wikipedia.org": {
          "TAGS": ["abc", "def", "ghi"],
          "DEMARCATOR": "Page",
          "NEW_DEMARCATOR": "DIIIICK"
        }
      }
    });
  });
  createAllTags(document.getElementById("tag-container"), chrome, makeTag, getCurrentDomain, "WEBSITES", "TAGS");
  addTag(document.getElementById("tag-form"), chrome, appendToMainData, getCurrentDomain, "WEBSITES", "TAGS", "DEMARCATOR", "NEW_DEMARCATOR"); // const form = document.getElementById("all-tags-input-form");
  // listenForTagInput(
  //     form, 
  //     storeDataToStorage, 
  //     getDataFromStorage,
  //     chrome,
  //     getCurrentDomain
  // );

  listenForDemarcator(document.getElementById("demarcator-form"), storeDataToStorage, getDataFromStorage, chrome, getCurrentDomain);
  attatchTagsToURL(document.getElementById("url-inject-button"), chrome, "WEBSITES", "TAGS", "DEMARCATOR", "NEW_DEMARCATOR", getCurrentUrlAndDomain);
}

function createAllTags(container, browser, makeTag, getCurrentDomain, mainKey, tagsKey) {
  if (container) {
    getCurrentDomain(browser).then(function (domain) {
      browser.storage.local.get(mainKey, function (data) {
        var websites = data[mainKey];
        var forCurrentWebsite = websites[domain];
        var tags = forCurrentWebsite[tagsKey];
        tags.forEach(function (tagString, index) {
          var tagElement = makeTag(tagString, index);
          container.appendChild(tagElement);
        });
      });
    });
  }
}

function makeTag(content, index) {
  var tag = document.createElement("div");
  tag.setAttribute("class", "tag");
  tag.setAttribute("id", "tag-" + index);
  tag.setAttribute("value", content);
  tag.appendChild(document.createTextNode(content));
  return tag;
}

function addTag(form, browser, appendToMainData, getCurrentDomain, mainKey, tagsKey, demarcatorKey, newDemarcatorKey) {
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var newTag = this.elements["tag-field"].value;
      getCurrentDomain(browser).then(function (domain) {
        appendToMainData(browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey, newTag, domain).then(function (mainData) {
          console.log("new main data before storage:  " + JSON.stringify(mainData));
          var dataObject = {};
          dataObject[mainKey] = mainData;
          browser.storage.local.set(dataObject);
        });
      });
    });
  }
}

function appendToMainData(browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey, newTag, domain) {
  return new Promise(function (resolve) {
    browser.storage.local.get(mainKey, function (data) {
      var websites = data[mainKey];

      if (!websites[domain]) {
        websites[domain] = {};
        var emptyDomainData = websites[domain];
        emptyDomainData[tagsKey] = [];
        emptyDomainData[demarcatorKey] = "";
        emptyDomainData[newDemarcatorKey] = "";
      }

      var forThisWebsite = websites[domain];
      forThisWebsite[tagsKey].push(newTag);
      resolve(websites);
    });
  });
}

function listenForTagInput(form, storeDataToStorage, getDataFromStorage, browser, getCurrentDomain) {
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var tagString = this.elements["tags-field"].value;
      var demarcator = this.elements["demarcator-field"].value;
      var newDemarcator = this.elements["new-demarcator-field"].value;
      getDataFromStorage(browser, "WEBSITES").then(function (data) {
        var websiteTags = data["WEBSITES"];
        getCurrentDomain(browser).then(function (domain) {
          websiteTags[domain] = {
            TAGS: tagString,
            DEMARCATOR: demarcator,
            NEW_DEMARCATOR: newDemarcator
          };
          storeDataToStorage(browser, {
            WEBSITES: websiteTags
          });
        });
      });
    });
  }
} //DELET THIS!!!111


function listenForDemarcator(form, storeDataToStorage, getDataFromStorage, browser, getCurrentDomain) {
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var demarcator = this.elements["demarcator-field"].value;
      var newDemarcator = this.elements["new-demarcator-field"].value;
      getDataFromStorage(browser, "WEBSITES").then(function (data) {
        var websites = data["WEBSITES"];
        getCurrentDomain(browser).then(function (domain) {
          websites[domain]["DEMARCATOR"] = demarcator;
          websites[domain]["NEW_DEMARCATOR"] = newDemarcator;
          storeDataToStorage(browser, {
            WEBSITES: websites
          });
        });
      });
    });
  }
} //DELET^^^^^^^^^^^^^^^^^^^^^


function getCurrentDomain(browser) {
  return new Promise(function (resolve) {
    browser.tabs.query({
      active: true,
      currentWindow: true
    }, function (result) {
      var activeTab = result[0];
      var url = new URL(activeTab.url);
      var domain = url.hostname;
      resolve(domain);
    });
  });
}

function getCurrentUrlAndDomain(browser) {
  return new Promise(function (resolve) {
    browser.tabs.query({
      active: true,
      currentWindow: true
    }, function (result) {
      var activeTab = result[0];
      var url = new URL(activeTab.url);
      var domain = url.hostname;
      resolve({
        url: url.href,
        domain: domain
      });
    });
  });
}

function listenForURLJnject(button, browser, tagsStorageKey, demarcatorKey, newDemarcatorKey) {
  if (button) {
    button.addEventListener("click", function () {
      browser.storage.local.get([tagsStorageKey, demarcatorKey, newDemarcatorKey], function (data) {
        console.log(JSON.stringify(data));
        var tagString = data[tagsStorageKey];
        var demarcator = data[demarcatorKey];
        var newDemarcator = data[newDemarcatorKey];
        browser.tabs.query({
          active: true,
          currentWindow: true
        }, function (tabResults) {
          var activeTab = tabResults[0];
          var currentUrl = activeTab.url;
          console.log("demarcator:    " + demarcator + "   and the key:    " + demarcatorKey + "  and the tags: " + tagString + "   new demarcator" + newDemarcator);

          if (currentUrl.includes(demarcator)) {
            var urlWithTags = currentUrl.replace(demarcator, (newDemarcator ? newDemarcator : demarcator) + tagString);
            browser.tabs.update({
              url: urlWithTags
            });
          } else {
            console.log("no demarcator match, should be: " + demarcator);
          }
        });
      });
    });
  }
}

function attatchTagsToURL(button, browser, mainKey, tagsKey, demarcatorKey, newDemarcatorKey, getCurrentUrlAndDomain) {
  if (button) {
    button.addEventListener("click", function () {
      console.log("added event listener to button");
      getCurrentUrlAndDomain(browser).then(function (urlObject) {
        browser.storage.local.get(mainKey, function (data) {
          var webistes = data[mainKey];
          var domain = urlObject.domain; //this is very coupled, using different fucntions to get the url and the domain separately is unweildy but better practice

          var currentWebsiteData = webistes[domain];
          var tags = currentWebsiteData[tagsKey];
          var tagString = "";
          tags.forEach(function (tag) {
            tagString += tag;
          });
          var demarcator = currentWebsiteData[demarcatorKey];
          var newDemarcator = currentWebsiteData[newDemarcatorKey];
          var currentUrl = urlObject.url;
          console.log("main data etc:    " + JSON.stringify(webistes) + "   " + domain + "   " + currentUrl + "    " + demarcator);

          if (currentUrl.includes(demarcator)) {
            var urlWithTags = currentUrl.replace(demarcator, (newDemarcator ? newDemarcator : demarcator) + tagString);
            console.log("FINAL URL:   " + urlWithTags);
            browser.tabs.update({
              url: urlWithTags
            });
          } else {
            console.log("no demarcator match, should be: " + demarcator);
          }
        });
      });
    });
  }
}

function storeDataToStorage(browser, data) {
  return regeneratorRuntime.async(function storeDataToStorage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            browser.storage.local.set(data, function () {
              resolve("sent tag list to local storage");
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getDataFromStorage(browser) {
  var _len,
      keys,
      _key,
      _args2 = arguments;

  return regeneratorRuntime.async(function getDataFromStorage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          for (_len = _args2.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            keys[_key - 1] = _args2[_key];
          }

          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            browser.storage.local.get([].concat(keys), function (data) {
              resolve(data);
            });
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}