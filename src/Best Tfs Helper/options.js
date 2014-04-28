(function (chrome) {

	$(function () {
		var prefixTemplate = $('#prefix-template').html(),
			$prefixesContainer = $('#prefixes-container');

		var keywordTemplate = $('#keyword-template').html(),
			$keywordContainer = $('#keywords-container');

		initContainer($prefixesContainer, $('#add-button'), prefixTemplate);
		initContainer($keywordContainer, $('#add-keyword-button'), keywordTemplate);
		$("#save-button").on('click', onSaveButtonClick);

		chrome.storage.local.get("settings", function (item) {
			var settings = item.settings;
			$prefixesContainer.append(settings.cardTypes.map(function(elem) {
				return prefixTemplate.replace('{Name}', elem.name).replace('{Prefix}', elem.prefix).replace('{Color}', elem.color);
			}).join(''));
			$keywordContainer.append(settings.alerts.map(function(elem) {
				return keywordTemplate.replace('{Name}', elem.name).replace('{Keyword}', elem.keyword).replace('{Color}', elem.color);
			}).join(''));
			$('#url-input').val(settings.tfsUrl);
		});
	});

	function initContainer($container, $addButton, template) {
		$container.on('click', '.remove-button', function (e) { $(e.currentTarget).parent().remove(); });
		$addButton.on('click', function () { $container.append(template); });
	}

	function onSaveButtonClick(e) {
		var cardTypes = [];
		var alerts = [];
		$('.card-type').each(function (i, elem) {
			var name = $(elem).find('.name-input').val();
			var prefix = $(elem).find('.prefix-input').val();
			var color = $(elem).find('.color-input').val();
			cardTypes.push({ 'name': name, 'prefix': prefix, 'color': color });
		});
		$('.alerts').each(function(i, elem) {
			var name = $(elem).find('.name-input').val();
			var keyword = $(elem).find('.keyword-input').val();
			var color = $(elem).find('.color-input').val();
			alerts.push({ 'name': name, 'keyword': keyword, 'color': color });
		})

		var tfsUrl = $('#url-input').val().trim().replace(/[\/]+$/, "");
		var fadeCards = $('#fade-cards').prop('checked');
		saveSettings({ 'cardTypes': cardTypes, 'alerts': alerts, 'tfsUrl': tfsUrl, 'fadeCards': fadeCards });
	}

	function saveSettings(settings) {
		chrome.storage.local.set({ 'settings': settings }, function () {
			var error = chrome.runtime.lastError;
			if (error) alert(error);
			else switchToTfsTab(settings.tfsUrl);
		});
	}

	function switchToTfsTab(tfsUrl) {
		chrome.tabs.getCurrent(function (settingsTab) {
			chrome.tabs.query({}, function (tabs) {
				tabs.filter(function (tab) {
					return tab.url && tab.url.indexOf(tfsUrl) >= 0;
				}).some(function (tfsTab) {
					chrome.tabs.update(tfsTab.id, { active: true });
					chrome.tabs.reload(tfsTab.id);
					return true;
				});
				chrome.tabs.remove(settingsTab.id);
			});
		});
	}
})(chrome);
