chrome.tabs.onUpdated.addListener(function (id, info, tab) {
	if (info.status == "complete") {
		chrome.storage.local.get("settings", function (item) {
			if (tab.url && tab.url.indexOf(item.settings.tfsUrl) !== -1) {
				chrome.tabs.executeScript(null, { "file": "color.js" });
				chrome.pageAction.show(tab.id);
			}
		});
	}
});

chrome.runtime.onInstalled.addListener(function (details) {
	chrome.storage.local.clear();
	var defaultSettings = {
		'cardTypes': [
			{ 'name': 'Dev', 'prefix': 'DEV, BUG', 'color': '#ff0000' },
			{ 'name': 'Qa', 'prefix': 'QA', 'color': '#00ff00' },
			{ 'name': 'Auto', 'prefix': 'AUTO', 'color': '#0000ff' },
			{ 'name': 'Doc', 'prefix': 'DOC', 'color': '#c2c2c2' }],
		'alerts': [
			{ 'name': 'Waiting', 'keyword': 'Waiting', 'color': '#FFC7CE'}
		],	
		'tfsUrl': 'tfs'
	};
	chrome.storage.local.set({ 'settings': defaultSettings }, null);
	chrome.tabs.create({ url: "options.html" });
});