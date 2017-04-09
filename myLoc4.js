/**
 * 
 */

var map;
window.onload = getMyLocation;
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


function showMap(latitude, longitude){
	var googleLatAndLong = new google.maps.LatLng(latitude, longitude);
	var mapOptions = {
			zoom: 8,
			center: googleLatAndLong,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);

	//addMarker(map, googleLatAndLong, title, content);
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
		navigator.geolocation.getCurrentPosition(displayLocation);
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
		var url = "http://dunett.dothome.co.kr/movieinfo.json";
		var request = new XMLHttpRequest();
		request.open("GET",url);
		request.onload = function(){
			if(request.status == 200){
				updateSales(request.responseText ,position);
			}
		};
		request.send(null);
	if(map == null){
		showMap(latitude, longitude);
	}else{
		scrollMapToPosition(position.coords);
	}
}

function degreeToRadians(degrees){
	var radians = (degrees * Math.PI)/180;
	return radians;
}