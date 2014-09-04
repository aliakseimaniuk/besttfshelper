function generateReport(settings) {
	var dependencies = getDependenciesForReport(settings);
	var inProgressTasks = getTasks('In progress');
	var doneTasks = getTasks('Done');
	
	report = dependencies + inProgressTasks + doneTasks;
	console.log(report);
	
	var reportWindow = window.open("Report Window", "Report Window", "width=500, height=500");
	reportWindow.document.write(report);
}
	
function getDependenciesForReport(settings)	{
	var dependencies = 'Dependencies:<br />';
		
	settings.alerts.forEach(function(alert) {
		parsePrefixes(alert.keyword).forEach(function (keyword) {
			var cards = $('.alert-' + keyword);

			$('.alert-' + keyword).each(function (index, card) {
				var taskName = $(card).closest('.taskboard-row').find('.tbPivotItem').find('.witTitle').text();
				dependencies += (index + 1) + ')' + taskName + ': ' + $(card).text() + '<br />';
			});										
		});
	});

	return dependencies + '<br />';
}

function getTasks(status) {
	var tasks = status +':<br />';
	var axis = '';
	$('.witState').each(function (index, element) {
		var header = $(element).text(); 
		if (header.toLowerCase().indexOf(status.toLowerCase()) != -1)
		{
			axis = $(element).closest('.taskboard-cell').attr('id');
		}
	});

	var i = 1;
	$('.tbTileContent').each(function (index, elem) {
		if ($(elem).text().toLowerCase().indexOf('[story point]') != -1)
		{
			var parentAxis = $(elem).closest('.taskboard-cell').attr('axis');

			if (parentAxis == axis)
			{
				var taskName = $(elem).closest('.taskboard-row').find('.tbPivotItem').find('.witTitle').text();
				tasks += i + ')' + taskName + '<br />';
				i++;
			}
		}
	});

	return tasks + '<br />';
}

function parsePrefixes(prefixes) {
	return prefixes.split(',')
		.map(function (prefix) { return prefix.trim(prefix); })
		.filter(function (prefix) { return prefix; })
		.filter(function (value, index, self) { return self.indexOf(value) === index; });
}