document.addEventListener("DOMContentLoaded", function () {
 // Get the current state of the extension from storage
 chrome.storage.sync.get("enabled", function (data) {
  var enabled = data.enabled;

  // Toggle the state of the extension
  enabled = !enabled;

  // Store the new state in storage
  chrome.storage.sync.set({ enabled: enabled }, function () {
    // Update the text of the toggle button to reflect the new state
    var toggleButton = document.getElementById("toggleButton");
    toggleButton.textContent = enabled ? "Deactivate Extension" : "Activate Extension";

    // Deactivate the extension if the toggle button was clicked and the extension is now disabled
    if (!enabled) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: function () {
              // Remove the blur event listener from all input and textarea elements
              var results = document.querySelectorAll("input, textarea");
              for (const prop in results) {
                const element = results[prop];
                element.removeEventListener("blur", blurEventListener);
              }
            },
          }
        );
      });
    }
  });
});
 

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0]) {
      document.getElementById("error").textContent =
        "Error: No active tab found.";
      return;
    }
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: function () {
          results = document.querySelectorAll("input , textarea");
          for (const prop in results) {
            const element = results[prop];
            // if (element.tagName !== "TEXTAREA" && element.tagName !== "INPUT") {
            //   console.log("Hi");
            //   continue;
            // }
            element.addEventListener("blur", (e) => { 
              const value = e.target.value
              if(value =='') return ;  
              alert(value);
            });
          }
          return "MAYBE SUCCESS";
        },
      },
      function (results) {
        console.log(results);
        if (!chrome.runtime.lastError) {
          console.log(results.result);
        } else {
          document.getElementById("error").textContent =
            "Error: " + chrome.runtime.lastError.message;
        }
      }
    );
  });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// Add event listener to the toggle button
document.getElementById("toggleButton").addEventListener("click", function () {
  // Get the current state of the extension from storage
  chrome.storage.sync.get("enabled", function (data) {
    var enabled = data.enabled;

    // Toggle the state of the extension
    enabled = !enabled;

    // Store the new state in storage
    chrome.storage.sync.set({ enabled: enabled }, function () {
      // Update the text of the toggle button to reflect the new state
      var toggleButton = document.getElementById("toggleButton");
      toggleButton.textContent = enabled ? "Deactivate Extension" : "Activate Extension";
    });
  });
});
