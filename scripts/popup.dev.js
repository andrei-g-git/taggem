"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
  var form = document.getElementById("all-tags-input-form");
  listenForTagInput(form, storeDataToStorage, chrome);
  listenForURLJnject(document.getElementById("url-inject-button"), chrome, "ALL_TAGS", "DEMARCATOR", "NEW_DEMARCATOR");
}

function listenForTagInput(form, storeDataToStorage, browser) {
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("input value:  " + this.elements["tags-field"].value);
      var tagString = this.elements["tags-field"].value;
      var demarcator = this.elements["demarcator-field"].value;
      var newDemarcator = this.elements["new-demarcator-field"].value;
      storeDataToStorage(browser, {
        ALL_TAGS: tagString,
        DEMARCATOR: demarcator,
        NEW_DEMARCATOR: newDemarcator
      });
    });
  }
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