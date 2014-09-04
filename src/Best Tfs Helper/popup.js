(function (chrome) {

	var htmlForCheckbox = '<input value="{Prefix}"type="checkbox" checked="checked"/><text style="color:{Color}">{Name}</text><br>';
	
	chrome.storage.local.get("settings", function (item) {
		var settings = item.settings;

		$(function () {
			settings.cardTypes.forEach(function (elem) {
				$('#place-holder').append(htmlForCheckbox.replace(/{Name}/g, elem.name).replace(/{Prefix}/g, elem.prefix).replace(/{Color}/g, elem.color));
			});

			$('input').click(onCheckBoxClick);
			
			chrome.storage.local.get('colorOnOffState', function (item) {
				$("#color-on-off-button").val(item.colorOnOffState !== 'On' ? 'On' : 'Off');
			});

			$("#color-on-off-button").click(onTurnOnOffHighlightingClick);
						
			$("#generate-report-button").click(generateReport);

			chrome.storage.local.get("checkboxState", function (item) {
				item.checkboxState
					.filter(function (elem) { return !elem.checked; })
					.forEach(function (elem) {
						$('input[value="' + elem.prefix + '"]').prop('checked', false);
					});
			});
		});

		function onCheckBoxClick(e) {
			if ($(e.currentTarget).prop('checked')) showCardType(parsePrefixes($(e.currentTarget).val()));
			else hideCardType(parsePrefixes($(e.currentTarget).val()));
			saveState();
		}

		function onTurnOnOffHighlightingClick(e) {
			if ($(e.currentTarget).val() === 'On') onColors();
			else offColors();
		}

		function onColors() {
			var styleCss = '<style type="text/css" id="best-tfs-helper-style-div">';
			settings.cardTypes.forEach(function (cardType) {
				parsePrefixes(cardType.prefix).forEach(function (prefix) {
					styleCss += '.card-type-' + prefix + '>.tbTileContent { border-color: ' + cardType.color + '; }';
				});
			});

			settings.alerts.forEach(function(alert) {
				parsePrefixes(alert.keyword).forEach(function (keyword) {
					styleCss +='.alert-' + keyword + '>.tbTileContent { background-color: ' + alert.color + ';}';
				});
			});

			styleCss += '</style>';
			var execJs = "$('head').append('" + styleCss + "')";
			chrome.tabs.executeScript(null, { code: execJs });
			$("#color-on-off-button").val('Off');
		}

		function offColors() {
			chrome.tabs.executeScript(null, { code: "$('#best-tfs-helper-style-div').remove();" });
			$("#color-on-off-button").val('On');
		}
		function showCardType(cardTypes) {
			cardTypes.forEach(function (cardType) {
				settings.fadeCards
					? chrome.tabs.executeScript(null, { code: "$('.card-type-" + cardType + "').animate({ opacity: 1 });" })
					: chrome.tabs.executeScript(null, { code: "$('.card-type-" + cardType + "').show();" });
			});
		}

		function hideCardType(cardTypes) {
			cardTypes.forEach(function (cardType) {
				settings.fadeCards
					? chrome.tabs.executeScript(null, { code: "$('.card-type-" + cardType + "').animate({ opacity: 0.15 });" })
					: chrome.tabs.executeScript(null, { code: "$('.card-type-" + cardType + "').hide();" });
			});
		}

		function getState() {
			var result = [];
			$('input[type=checkbox]').each(function (i, elem) {
				result.push({ prefix: $(elem).val(), checked: elem.checked });
			});
			return result;
		}

		function saveState() {
			chrome.storage.local.set({ 'colorOnOffState': $('#color-on-off-button').val() });
			chrome.storage.local.set({ 'checkboxState': getState() });
		}

		function parsePrefixes(prefixes) {
			return prefixes.split(',')
				.map(function (prefix) { return prefix.trim(prefix); })
				.filter(function (prefix) { return prefix; })
				.filter(function (value, index, self) { return self.indexOf(value) === index; });
		}

		function generateReport() {
			var settingsStr = JSON.stringify(settings);
			var report = chrome.tabs.executeScript(null, { code: 'generateReport('+ settingsStr +');' });
		}
	});
}(chrome));
