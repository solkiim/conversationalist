var displayedUsers = [];

$(document).ready(function(){
	$('#particles').particleground({
	  minSpeedX: 0.1,
	  maxSpeedX: 0.7,
	  minSpeedY: 0.1,
	  maxSpeedY: 0.7,
	  directionX: 'center', // 'center', 'left' or 'right'. 'center' = dots bounce off edges
	  directionY: 'center', // 'center', 'up' or 'down'. 'center' = dots bounce off edges
	  density: 9000, // How many particles will be generated: one particle every n pixels
	  dotColor: 'rgba(232, 233, 239, 0.2)',
	  lineColor: 'rgba(232, 233, 239, 0.25)',
	  particleRadius: 0, // Dot size
	  lineWidth: 0.8,
	  curvedLines: false,
	  proximity: 120, // How close two dots need to be before they join
	  parallax: true,
	  parallaxMultiplier: 6, // The lower the number, the more extreme the parallax effect
	  onInit: function() {},
	  onDestroy: function() {}
	});
	
	$(".transparent-bubble").each(function() {
		$(this).animate({
			opacity: Math.random()
		  }, 500);
	});
	
	var um = new Object();
	um["solkim"] = 5;
	um["valeriemaytomic"] = 12;
	um["fuckmylife"] = 8;
	um["nikitaramoji"] = 1;
	console.log(um);
	changeTransparency(um);
});

function changeTransparency(usermap) {
	var max = -Infinity;
	var min = Infinity;
	jQuery.each(usermap, (function(key, value) {
		if (value > max) max = value;
		if (value < min) min = value;
	}));
	
	var range = max - min;
	
	jQuery.each(usermap, (function(key, value) {
		if (displayedUsers.indexOf(key) == -1) {	// if not yet displayed
			$("#content").append(
				"<div><div class='transparent-bubble' id='" + key + "'></div><div class='user-bubble'><p>" + key.charAt(0).toUpperCase() + "</p></div></div>"
			);
		}
		
		$("#" + key).animate({
			opacity: (value - min) / (range + 1)
		}, 500);
	}));
}