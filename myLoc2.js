/**
 * 
 */
window.onload = getMyLocation;

var ourCoords = {
		latitude: 37.4957,
		longitude: 127.0718
};
var map;

var watchId = null;

function addMarker(map, latlong, title, content){
	
	var markerOptions = {
			position: latlong,
			map: map,
			title: title,
			clickable: true
	};
	
	var marker = new google.maps.Marker(markerOptions);
	
	var infoWindowOptions = {
			content: content,
			position: latlong
	};
	
	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	
	google.maps.event.addListener(marker, "click", function(){infoWindow.open(map)});
};

var positionOptions = {
		enableHighAccuracy: false,
		timeout: Infinity,
		maximumAge: 0
}


function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
	var mapOptions = {
			zoom: 10,
			center: googleLatAndLong,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	
	var title = "Your Location";
	var content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);
}

function scrollMapToPosition(coords){
	var latitude = coords.latitude;
	var longitude = coords.longitude;
	var latlong = new google.maps.LatLng(latitude, longitude);
	
	map.panTo(latlong);
	
	addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}

function getMyLocation(){
	if(navigator.geolocation){
		/*navigator.geolocation.getCurrentPosition(displayLocation);*/
		var watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation;
		var clearWatchButton = document.getElementById("clearWatch");
		clearWatchButton.onclick = clearWatch;
	}else{
		alert("Oops, no geolocation support");
	}
}

function watchLocation(){
	watchId = navigator.geolocation.watchPosition(displayLocation, displayError, {timeout:5000});
}

function clearWatch(){
	if(watchId){
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

function displayError(error) {
	   var errorTypes = {
	      0: "Unknown error",
	      1: "Permission denied",
	      2: "Position is not available",
	      3: "Request timeout"
	   };
	   var errorMessage = errorTypes[error.code];
	   if (error.code == 0 || error.code == 2) {
	      errorMessage = errorMessage + " " + error.message;
	   }
	   var div = document.getElementById("location");
	   div.innerHTML = errorMessage;
	}

function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";
	
	var km = computeDistance(position.coords, ourCoords);
	var distance = document.getElementById("distance");
	distance.innerHTML = "You are " + km + " km from the wickedlySmart HQ";
	
	if(map == null){
		showMap(position.coords);
	}else{
		scrollMapToPosition(position.coords);
	}
}

function computeDistance(startCoords, destCoords){
	var startLatRads = degreeToRadians(startCoords.latitude);
	var startLongRads = degreeToRadians(startCoords.longitude);
	var destLatRads = degreeToRadians(destCoords.latitude);
	var destLongRads = degreeToRadians(destCoords.longitude);
	
	var Radius = 6371;
	var distance = Math.acos(Math.sin(startLatRads)* Math.sin(destLatRads) + 
			Math.cos(startLatRads) * Math.cos(destLatRads) *
			Math.cos(startLongRads - destLongRads)) * Radius;
	
	return distance;
}

function degreeToRadians(degrees){
	var radians = (degrees * Math.PI)/180;
	return radians;
}