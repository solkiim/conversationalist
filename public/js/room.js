'use strict';

var instantMeter = document.querySelector('#instant meter');
var dataHash = new Object();
var gradientHash = new Object();
var displayedUsers = [];
var currentUser = sessionStorage.getItem("name").replace(/\s+/, "").toLowerCase();
const speed = 1.5;

try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: true,
  video: false
};

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
  soundMeter.connectToSource(stream, function(e) {
    if (e) {
      alert(e);
      return;
    }
    setInterval(function() {
    //instantMeter.value should be the volume value, so you can return that at the end (probably)
      instantMeter.value = soundMeter.instant.toFixed(2);  
      sendData(instantMeter.value); 
	  changeTransparency(dataHash);
    }, 1000);
  });
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

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
	
	$(".transparent-bubble").each(function() {
		$(this).animate({
			opacity: 0
		  }, 500);
	});
});

function changeTransparency(usermap) {
	var max = -Infinity;
	var min = Infinity;
	var sum = 0;
	var length = 0;
	jQuery.each(usermap, (function(key, value) {
		if (value > max) max = value;
		if (value < min) min = value;
		sum += value;
		length += 1;
	}));
	
	var range = max - min;
	var avg = sum / length;
	var lowerQuart = avg / 2;
	var upperQuart = avg + lowerQuart;
	
	jQuery.each(usermap, (function(key, value) {
		// add user if not yet displayed
		if (displayedUsers.indexOf(key) == -1) {
			$("#content").append(
				"<div><div class='transparent-bubble' id='" + key + "'></div><div class='user-bubble'><p>" + key.charAt(0).toUpperCase() + "</p></div></div>"
			);
			displayedUsers.push(key)
			gradientHash[key] = 0;
		}

		// set gradient
		var currGradient = gradientHash[key]
		if ((value >= upperQuart) && (currGradient > 0)){
			gradientHash[key] = currGradient-(0.03*speed);
		}
		else if ((value >= avg) && (currGradient > 0)){
			gradientHash[key] = currGradient-(0.01*speed);
		}
		else if ((value >= lowerQuart) && (currGradient < 1)){
			gradientHash[key] = currGradient+(0.01*speed);
		}
		else if (currGradient < 1){
			gradientHash[key] = currGradient+(0.03*speed);
		}
		
		// change text color based on transparency value
		if (gradientHash[key] > 0.6) {
			$("#" + key).siblings(".user-bubble").css("color", "#30084d");
		} else {
			$("#" + key).siblings(".user-bubble").css("color", "#fff");
		}
		
		// change transparency based on speak value
		$("#" + key).animate({
			opacity: gradientHash[key]
		}, 500);
	}));
}

// send data to backend
function sendData(volumeData) {
	$.post( "/data/userAndVolume",
	{
	user : currentUser,
	volume : volumeData
	}, 
	function(data) {
		dataHash = JSON.parse(data);
	});
}