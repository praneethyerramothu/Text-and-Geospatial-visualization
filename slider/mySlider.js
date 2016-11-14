var range = document.getElementById('range');

range.style.width = '700px';

noUiSlider.create(range, {
	start: [ 2007, 2015 ], // Handle start position
	step: 1, // Slider moves in increments of '10'
	margin: 1, // Handles must be more than '20' apart
	connect: true, // Display a colored bar between the handles
	direction: 'ltr', // Put '0' at the bottom of the slider
	orientation: 'horizontal', // Orient the slider vertically
	behaviour: 'drag', // Move handle on tap, bar is draggable
	range: { // Slider can select '0' to '100'
		'min': 2007,
		'max': 2015
	},
	pips: { // Show a scale with the slider
		mode: 'count',
		values: 9,
		density: 1
	}
});









