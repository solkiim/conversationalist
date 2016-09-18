
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
      //$("#vol").val(instantMeter.value)
    }, 200);
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
			opacity: Math.random()
		  }, 500);
	});
	
	var um = new Object();
	um["solkim"] = 5;
	um["valeriemaytomic"] = 12;
	um["fuckmylife"] = 1;
	um["nikitaramoji"] = 8;
	changeTransparency(um);
	
	//sendData([2,1,6,29]);
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

function sendData(volumeData) {
	$.post( "/data/userAndVolume",
	{
	user : currentUser,
	volume : volumeData
	}, 
	function(data) {
		console.log(data);
	});
}