document.addEventListener("DOMContentLoaded", function () {
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
              const value = e.target.value;
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