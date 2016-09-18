$(document).ready(function(){
	$('#particles').particleground({
	  minSpeedX: 0.1,
	  maxSpeedX: 0.7,
	  minSpeedY: 0.1,
	  maxSpeedY: 0.7,
	  directionX: 'center',
	  directionY: 'center',
	  density: 9000,
	  dotColor: 'rgba(232, 233, 239, 0.2)',
	  lineColor: 'rgba(232, 233, 239, 0.25)',
	  particleRadius: 0,
	  lineWidth: 0.8,
	  curvedLines: false,
	  proximity: 120,
	  parallax: true,
	  parallaxMultiplier: 6,
	  onInit: function() {},
	  onDestroy: function() {}
	});
	
	sessionStorage.setItem('label', 'value')
});

// save name in browser session storage
function saveName() {
	sessionStorage.setItem("name", $("#name").val());
	window.location = "room.html";	// switch to room page when clicked
}