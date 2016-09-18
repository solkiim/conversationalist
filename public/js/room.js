
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* global AudioContext, SoundMeter */

'use strict';

var instantMeter = document.querySelector('#instant meter');
var dataHash = new Object();
var gradientHash = new Object();
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
    //console.log(soundMeter.instant.toFixed(2));
    setInterval(function() {
    //instantMeter.value should be the volume value, so you can return that at the end (probably)
      instantMeter.value = soundMeter.instant.toFixed(2);  
      sendData(instantMeter.value); 
	  console.log(instantMeter.value);
	  changeTransparency(dataHash);
      //$("#vol").val(instantMeter.value)
    }, 500);
  });
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}


navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);


var displayedUsers = [];
var currentUser = sessionStorage.getItem("name").replace(/\s+/, "").toLowerCase();

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
			opacity: 0
		  }, 500);
	});
	
	
	// dataHash["solkim"] = 5;
	// dataHash["valeriemaytomic"] = 12;
	// dataHash["fuckmylife"] = 1;
	// dataHash["nikitaramoji"] = 8;
	
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
		if (displayedUsers.indexOf(key) == -1) {	// if not yet displayed
			$("#content").append(
				"<div><div class='transparent-bubble' id='" + key + "'></div><div class='user-bubble'><p>" + key.charAt(0).toUpperCase() + "</p></div></div>"
			);
			displayedUsers.push(key)
			gradientHash[key] = 0;
		}

		//var NewRange = 100  
		//var NewValue = ((((value + 1) - min) * 100) / (range+1))

		console.log(key);
		console.log(value);
		if((value >= upperQuart) && (gradientHash[key] > 0){
			console.log("upperQuart")
			gradientHash[key] = gradientHash[key]-(0.03*speed);
		}
		else if ((value >= avg) && (gradientHash[key] > 0)){
			console.log("avg")
			gradientHash[key] = gradientHash[key]-(0.01*speed);
		}
		else if(value >= lowerQuart) && (gradientHash[key] < 1)){
			console.log("lowerQuart")
			gradientHash[key] = gradientHash[key]+(0.01*speed);
		}
		else if (gradientHash[key] < 1){
			console.log("bottom")
			gradientHash[key] = gradientHash[key]+(0.03*speed);
		}

		console.log(gradientHash[key])
		
		$("#" + key).animate({
			opacity: gradientHash[key]
		}, 500);
	}));
}

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