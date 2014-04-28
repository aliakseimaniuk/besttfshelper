(function (chrome) {

	chrome.storage.local.get("settings", function (item) {
		var settings = item.settings;

		$(function () {

			$('.tbTileContent').each(function (index, elem) {
				var classAppliedToCard = false,
					$title = $(elem),
					$card = $title.parent();

				var classAppliedToCard = addClassesToCard($card, 'card-type-', settings.cardTypes.map(function (cardType) { return cardType.prefix; }), function(prefix) {
					return $title.children().first().html().indexOf(prefix) !== -1;
				})

				addClassesToCard($card, 'alert-',settings.alerts.map(function(alert) {return alert.keyword;}),function(keyword) {
					return $title.children().first().text().toLowerCase().indexOf(keyword.toLowerCase()) !== -1
				})
				
				if (!classAppliedToCard) $card.addClass('card-type-others');
			});

			chrome.storage.local.get("colorOnOffState", function (item) {
				if (item.colorOnOffState === "On") {
					addStyleElem();
				}
			});

			chrome.storage.local.get("checkboxState", function (item) {
				if (item.checkboxState != undefined) {
					item.checkboxState.forEach(function (elem) {
						if (elem.checked) showCardType(parsePrefixes(elem.prefix));
						else hideCardType(parsePrefixes(elem.prefix));
					});
				};
			});
		});

		function addClassesToCard($card, classPrefix, $classPostfixes, predicate) {
			var classAppliedToCard = false;

			$classPostfixes.forEach(function(keywords) {
				parsePrefixes(keywords).forEach(function (keyword) {
					if (predicate(keyword)) { 
						classAppliedToCard = true;
						$card.addClass(classPrefix + keyword);
					}
					if (classAppliedToCard) return false;
					});
				});

			return classAppliedToCard;
		}

		function showCardType(cardTypes) {
			cardTypes.forEach(function (cardType) {
				settings.fadeCards
					? $('.card-type-' + cardType).animate({ opacity: 1 })
					: $('.card-type-' + cardType).show();
			});
		}

		function hideCardType(cardTypes) {
			cardTypes.forEach(function (cardType) {
				settings.fadeCards
					? $('.card-type-' + cardType).animate({ opacity: 0.15 })
					: $('.card-type-' + cardType).hide();
			});
		}

		function parsePrefixes(prefixes) {
			return prefixes.split(',')
				.map(function (prefix) { return prefix.trim(prefix); })
				.filter(function (prefix) { return prefix; })
				.filter(function (value, index, self) { return self.indexOf(value) === index; });
		}

		function addStyleElem() {
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
			$('head').append(styleCss);
		}
	});
}(chrome));
