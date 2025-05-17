chrome.devtools.panels.create(
    "Request Replay",
    "",
    // "devtools/index.html",
    "devtools/devtools_panel.html",
    function(panel: chrome.devtools.panels.ExtensionPanel) {
        console.log("Devtools panel opened", panel)
    }
)