"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
  var form = document.getElementById("all-tags-input-form");
  listenForTagInput(form, storeDataToStorage, chrome);
}

function listenForTagInput(form, storeDataToStorage, browser) {
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("input value:  " + this.elements["text-field"].value);
      var tagString = this.elements["text-field"].value;
      storeDataToStorage(browser, {
        ALL_TAGS: tagString
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