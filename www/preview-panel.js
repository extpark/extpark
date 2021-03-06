var extensionid = 'hjmakdlmddnejdocnlcjhikhdoiilphk';

if (localStorage.getItem('extensionid') !== null) {
  extensionid = localStorage.getItem('extensionid');
}

function getByNameObj(obj, nameWanted) {
  for (let i = 0; i < obj.length; i++) {
    let element = obj[i];
    if (element.name == nameWanted) {
      return obj[i];
    }
  }
}

function myParse(content) {
  return typeof content === 'string' ? JSON.parse(content) : content;
}

function unpack(lst, nameIt) {
  lst = myParse(lst);
  let returned = {};
  returned.content = getByNameObj(lst, 'HTML').configuration.value;
  returned.title = nameIt;
  let currentNum = 1;
  while (true) {
    if (!getByNameObj(lst, 'STYLE' + currentNum)) {
      currentNum -= 1;
      break;
    } else {
      currentNum += 1;
    }
  }
  anotherNum = 1;
  while (true) {
    if (!getByNameObj(lst, 'SCRIPT' + anotherNum)) {
      anotherNum -= 1;
      break;
    } else {
      anotherNum += 1;
    }
  }
  if (currentNum !== 0) {
    returned.styles = [];
  }
  if (anotherNum !== 0) {
    returned.scripts = [];
  }
  for (let i = 1; i <= currentNum; i++) {
    returned.styles.push(getByNameObj(lst, 'STYLE' + i).configuration.value);
  }
  for (let b = 1; b <= anotherNum; b++) {
    returned.scripts.push(getByNameObj(lst, 'SCRIPT' + b).configuration.value);
  }
  return returned;
}

const urlParams = new URLSearchParams(window.location.search);
var myParam = urlParams.get('panel');

try {
  myParam = decodeURIComponent(myParam);
} catch {
  console.error('Error in parsing parameter');
}

if (typeof myParam === 'string') {
  let renderedUnpack = unpack(
    JSON.parse(localStorage.getItem('ide-' + myParam)).tabs,
    myParam
  );
  chrome.runtime.sendMessage(
    extensionid,
    { method: 'INFO' },
    null,
    function (response) {
      chrome.devtools = {
        panels: {
          themeName: response.theme,
        },
        inspectedWindow: {
          eval: eval,
          reload: window.location.reload,
        },
        network: {},
      };
      chrome.extension = {
        lastError: chrome.runtime.lastError,
        inIncognitoContext: response.inIncognito,
        getURL: function (path) {
          return 'chrome-extension://' + extensionid + path;
        },
      };
      chrome.storage = {
        StorageChange: function (obj) {
          Object.entries(obj).forEach((value) => {
            this[value[0]] = value[1];
          });
        },
        local: {
          get: (arr, callback) => {
            let allkeys = Object.keys(localStorage);
            let lookFor = [];
            try {
              let toCallback = {};
              if (arr === null) {
                lookFor = allkeys;
              } else if (Array.isArray(arr)) {
                lookFor = arr;
              }
              Object.entries(localStorage).forEach((value) => {
                if (lookFor.includes(value[0])) {
                  toCallback[value[0]] = JSON.parse(value[1]);
                }
              });
            } finally {
              callback(toCallback);
            }
          },
          set: (obj, callback) => {
            let previousStorage = JSON.parse(JSON.stringify(localStorage));
            try {
              Object.entries(obj)
                .map((value) => {
                  let newValue = JSON.stringify(value[1]);
                  return [value[0], newValue];
                })
                .forEach((value) => {
                  localStorage.setItem(value[0], value[1]);
                });
            } finally {
              if (typeof callback === 'function') {
                callback();
              }
              if (this.onChanged.hasListener()) {
                changes = {};
                Object.entries(obj).forEach((value) => {
                  changes[value[0]] = new chrome.storage.StorageChange({
                    oldValue: previousStorage[value[0]],
                    newValue: value[1],
                  });
                });
                this.onChanged.listener(changes, 'local');
              }
            }
          },
          clear: (callback) => {
            let previousStorage = JSON.parse(JSON.stringify(localStorage));
            try {
              localStorage.clear();
            } finally {
              if (typeof callback === 'function') {
                callback();
              }
              if (this.onChanged.hasListener()) {
                changes = {};
                Object.keys(previousStorage).forEach((value) => {
                  changes[value] = new chrome.storage.StorageChange({
                    oldValue: previousStorage[value],
                  });
                });
                this.onChanged.listener(changes, 'local');
              }
            }
          },
          remove: (keys, callback) => {
            keysList = [];
            let previousStorage = JSON.parse(JSON.stringify(localStorage));
            try {
              if (Array.isArray(keys)) {
                keys.forEach((value) => {
                  localStorage.removeItem(value);
                });
                keysList = keys;
              } else {
                localStorage.removeItem(keys);
                keysList = [keys];
              }
            } finally {
              if (typeof callback === 'function') {
                callback();
              }
              if (this.onChanged.hasListener()) {
                changes = {};
                keysList.forEach((value) => {
                  changes[value] = new chrome.storage.StorageChange({
                    oldValue: previousStorage[value],
                  });
                });
                this.onChanged.listener(changes, 'local');
              }
            }
          },
          onChanged: {
            listener: null,
            addListener: (callback) => {
              this.listener = callback;
            },
            removeListener: () => {
              this.listener = null;
            },
            hasListener: () => {
              return (
                typeof this.listener === 'function' && this.listener !== null
              );
            },
          },
        },
        sync: {
          get: (arr, callback) => {
            let allkeys = Object.keys(localStorage);
            let lookFor = [];
            try {
              let toCallback = {};
              if (arr === null) {
                lookFor = allkeys;
              } else if (Array.isArray(arr)) {
                lookFor = arr;
              }
              Object.entries(localStorage).forEach((value) => {
                if (lookFor.includes(value[0])) {
                  toCallback[value[0]] = JSON.parse(value[1]);
                }
              });
            } finally {
              callback(toCallback);
            }
          },
          set: (obj, callback) => {
            let previousStorage = JSON.parse(JSON.stringify(localStorage));
            try {
              Object.entries(obj)
                .map((value) => {
                  let newValue = JSON.stringify(value[1]);
                  return [value[0], newValue];
                })
                .forEach((value) => {
                  localStorage.setItem(value[0], value[1]);
                });
            } finally {
              if (typeof callback === 'function') {
                callback();
              }
              if (this.onChanged.hasListener()) {
                changes = {};
                Object.entries(obj).forEach((value) => {
                  changes[value[0]] = new chrome.storage.StorageChange({
                    oldValue: previousStorage[value[0]],
                    newValue: value[1],
                  });
                });
                this.onChanged.listener(changes, 'sync');
              }
            }
          },
          clear: (callback) => {
            let previousStorage = JSON.parse(JSON.stringify(localStorage));
            try {
              localStorage.clear();
            } finally {
              if (typeof callback === 'function') {
                callback();
              }
              if (this.onChanged.hasListener()) {
                changes = {};
                Object.keys(previousStorage).forEach((value) => {
                  changes[value] = new chrome.storage.StorageChange({
                    oldValue: previousStorage[value],
                  });
                });
                this.onChanged.listener(changes, 'sync');
              }
            }
          },
          remove: (keys, callback) => {
            keysList = [];
            let previousStorage = JSON.parse(JSON.stringify(localStorage));
            try {
              if (Array.isArray(keys)) {
                keys.forEach((value) => {
                  localStorage.removeItem(value);
                });
                keysList = keys;
              } else {
                localStorage.removeItem(keys);
                keysList = [keys];
              }
            } finally {
              if (typeof callback === 'function') {
                callback();
              }
              if (this.onChanged.hasListener()) {
                changes = {};
                keysList.forEach((value) => {
                  changes[value] = new chrome.storage.StorageChange({
                    oldValue: previousStorage[value],
                  });
                });
                this.onChanged.listener(changes, 'sync');
              }
            }
          },
          onChanged: {
            listener: null,
            addListener: (callback) => {
              this.listener = callback;
            },
            removeListener: () => {
              this.listener = null;
            },
            hasListener: () => {
              return (
                typeof this.listener === 'function' && this.listener !== null
              );
            },
          },
        },
      };
      document.write(renderedUnpack.content);
      if (Array.isArray(renderedUnpack.styles)) {
        renderedUnpack.styles.forEach((styleElement) => {
          if (typeof styleElement === 'string') {
            let nextStyle = document.createElement('style');
            nextStyle.innerHTML = styleElement;
            document.head.appendChild(nextStyle);
          }
        });
      }
      if (Array.isArray(renderedUnpack.scripts)) {
        renderedUnpack.scripts.forEach((scriptElement) => {
          if (typeof scriptElement === 'string') {
            let nextScript = document.createElement('script');
            nextScript.innerHTML = scriptElement;
            document.head.appendChild(nextScript);
          }
        });
      }
    }
  );
}
