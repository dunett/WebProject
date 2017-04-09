/**
 * 
 */
window.onload = getMyLocation;

var map = null;
var watchId = null;

var min = 100000; //거리초기값
var minrow = null; //최단거리 주소값


var dst = document.getElementById("dst");
var dstA = document.getElementById("dstA");

var geocoder = null;
var infowindow = null;

/*window.onload = function(){
	var url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/1/1000/";
	var request = new XMLHttpRequest();
	request.open("GET",url);
	request.onload = function(){
		if(request.status == 200){
			ToiletView(request.responseText);
		}
	};
	request.send(null);
}*/

//json파일 5개 합치기 (검색)
function SearchdisplayLocation(position){
		var totaltext ="";
		var url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/1/1000/";
		var request1 = new XMLHttpRequest();
		request1.open("GET",url);
		request1.onload = function(){
			if(request1.status == 200){
				totaltext = "{\"Toilet\":[" + totaltext + request1.responseText; 
				url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/1001/2000/";
				var request2 = new XMLHttpRequest();
				request2.open("GET",url);
				request2.onload = function(){
					if(request2.status == 200){
						totaltext = totaltext + "," + request2.responseText;
						url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/2001/3000/";
						var request3 = new XMLHttpRequest();
						request3.open("GET",url);
						request3.onload = function(){
							if(request3.status == 200){
								totaltext = totaltext + "," + request3.responseText;
								url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/3001/4000/";
								var request4 = new XMLHttpRequest();
								request4.open("GET",url);
								request4.onload = function(){
									if(request4.status == 200){
										totaltext = totaltext + "," + request4.responseText;
										url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/4001/5000/";
										var request5 = new XMLHttpRequest();
										request5.open("GET",url);
										request5.onload = function(){
											if(request5.status == 200){
												totaltext = totaltext + "," + request5.responseText + "]}";
												ToiletView(totaltext,position);
											}
										};
										request5.send(null);
									}
								};
								request4.send(null);
							}
						};
						request3.send(null);
					}
				};
				request2.send(null);
			}
		};
		request1.send(null);
		searchMap(position);
}

//json파일 5개 합치기 (현재위치)
function displayLocation(position){
	var totaltext ="";
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
		var url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/1/1000/";
		var request1 = new XMLHttpRequest();
		request1.open("GET",url);
		request1.onload = function(){
			if(request1.status == 200){
				totaltext = "{\"Toilet\":[" + totaltext + request1.responseText; 
				url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/1001/2000/";
				var request2 = new XMLHttpRequest();
				request2.open("GET",url);
				request2.onload = function(){
					if(request2.status == 200){
						totaltext = totaltext + "," + request2.responseText;
						url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/2001/3000/";
						var request3 = new XMLHttpRequest();
						request3.open("GET",url);
						request3.onload = function(){
							if(request3.status == 200){
								totaltext = totaltext + "," + request3.responseText;
								url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/3001/4000/";
								var request4 = new XMLHttpRequest();
								request4.open("GET",url);
								request4.onload = function(){
									if(request4.status == 200){
										totaltext = totaltext + "," + request4.responseText;
										url = "http://openapi.seoul.go.kr:8088/496445715664756e31396b7a475176/json/GeoInfoPublicToiletWGS/4001/5000/";
										var request5 = new XMLHttpRequest();
										request5.open("GET",url);
										request5.onload = function(){
											if(request5.status == 200){
												totaltext = totaltext + "," + request5.responseText + "]}";
												closedToiletView(totaltext ,position);
											}
										};
										request5.send(null);
									}
								};
								request4.send(null);
							}
						};
						request3.send(null);
					}
				};
				request2.send(null);
			}
		};
		request1.send(null);
		showMap(position.coords);
}

//서울시 검색 화장실표시
function ToiletView(responseText,position){
	addMarker(map, position, "검색위치", "<div style=\"width:70px;\">검색위치</div>");
	var srt = document.getElementById("srt");
	var srtA = document.getElementById("srtA");
	var dst = document.getElementById("dst");
	var dstA = document.getElementById("dstA");
	var distance = document.getElementById("distance");
	var time = document.getElementById("time");
	srt.innerHTML = "검색보기에서는 제공되지 않습니다.";
	srtA.innerHTML = "검색보기에서는 제공되지 않습니다.";
	dst.innerHTML = "검색보기에서는 제공되지 않습니다.";
	dstA.innerHTML = "검색보기에서는 제공되지 않습니다.";
	distance.innerHTML = "";
	time.innerHTML = "";
	var distance = document.getElementById("distance");
	var time = document.getElementById("time");
	var totalrows = JSON.parse(responseText); //5000개 화장실
	var rows = totalrows.Toilet; //1000개 화장실
	for(var i = 0; i < rows.length; i++){
		for(var j = 0; j < (rows[i].GeoInfoPublicToiletWGS.row).length; j++){
			var row = rows[i].GeoInfoPublicToiletWGS.row[j];
			var LatAndLong = new google.maps.LatLng(row.LAT, row.LNG);
			var km = FcomputeDistance(position.lat(), position.lng(), row.LAT, row.LNG);
			if(km<1){
				addMarker(map, LatAndLong, "화장실", "<div style=\"width:150px;\">"+row.GU_NM+" "+row.HNR_NAM +" 화장실"+"</div>");
			}
		}
	}
	}

//최단거리화장실표시
function closedToiletView(responseText,position){
	var googleLatAndLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	addMarker(map, googleLatAndLong, "출발지", "<div style=\"width:70px;\">출발지</div>");
	var srt = document.getElementById("srt");
	srt.innerHTML = "현재위치";
	/*var GeoInfo = document.getElementById("GeoInfoPublicToiletWGS");*/
	var distance = document.getElementById("distance");
	var time = document.getElementById("time");
	var totalrows = JSON.parse(responseText); //5000개 화장실
	var rows = totalrows.Toilet; //1000개 화장실
	for(var i = 0; i < rows.length; i++){
		for(var j = 0; j < (rows[i].GeoInfoPublicToiletWGS.row).length; j++){
			var row = rows[i].GeoInfoPublicToiletWGS.row[j];
			/*var div2 = document.createElement("div");*/
			var km = computeDistance(position.coords, row.LAT, row.LNG);
			if(km<min){
				min = km;
				minrow = row;
			}
			/*div2.innerHTML = "현재 위치로 부터 " + sale.theater + "까지 " + km + " km 떨어져 있습니다.";
			distance.appendChild(div2);*/
			/*var showtime=getTimeFromString(sale.showtime[j]);
			if((showtime-now)>0){
			var div = document.createElement("div");
			div.setAttribute("class", "saleItem");
			div.innerHTML = sale.theater + " " + sale.title + "&nbsp;&nbsp;&nbsp;" + sale.showtime[j];
			salesDiv.appendChild(div);*/
		}
	}
	min = min*1000;
	if(min>1000){
		distance.innerHTML = "남은거리: <br>"+ Math.round(min/1000) + "km" +Math.round(min%1000)+"m";
	}else{
		distance.innerHTML = "남은거리: <br>"+ Math.round(min)+"m";
	}
	if((min/1.1)>3600){
		time.innerHTML = "남은시간: <br>" + Math.round((min/1.1)/3600) + "시간" + Math.round(((min/1.1)%3600)/60) + "분" + Math.round((((min/1.1)%3600)/60)%60)+"초";
	}else if((min/1.1)>60){
		time.innerHTML = "남은시간: <br>" + Math.round((min/1.1)/60) + "분" + Math.round((min/1.1)%60)+"초";
	}else{
		time.innerHTML = "남은시간: <br>" + Math.round(min/1.1)+"초";
	}
	var LatAndLong = new google.maps.LatLng(minrow.LAT, minrow.LNG);
	addMarker(map, LatAndLong, "목적지", "<div style=\"width:70px;\">목적지</div>");
	var dst = document.getElementById("dst");
	dst.innerHTML = minrow.GU_NM+" "+minrow.HNR_NAM +" 화장실";
	//지오코딩부분
	geocoder = new google.maps.Geocoder;
	infowindow = new google.maps.InfoWindow;
	geocodedstA(geocoder, map, infowindow, LatAndLong);
	}

function geocodeAddress(geocoder, resultsMap) {
	  var address = document.getElementById('loc').value;
	  geocoder.geocode({'address': address}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      /*resultsMap.setCenter(results[0].geometry.location);
	      var marker = new google.maps.Marker({
	        map: resultsMap,
	        position: results[0].geometry.location
	      });*/
	      SearchdisplayLocation(results[0].geometry.location);
	      //alert(results[0].geometry.location.lng());
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	}

/*function geocodeLatLng(geocoder, map, infowindow) {
	  var input = document.getElementById('latlng').value;
	  var latlngStr = input.split(',', 2);
	  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	  geocoder.geocode({'location': latlng}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	        map.setZoom(11);
	        var marker = new google.maps.Marker({
	          position: latlng,
	          map: map
	        });
	        infowindow.setContent(results[1].formatted_address);
	        infowindow.open(map, marker);
	      } else {
	        window.alert('No results found');
	      }
	    } else {
	      window.alert('Geocoder failed due to: ' + status);
	    }
	  });
	}*/

function geocodesrtA(geocoder, map, infowindow , position) {
	  var latlng = position;
	  geocoder.geocode({'location': latlng}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	        /*map.setZoom(11);
	        var marker = new google.maps.Marker({
	          position: latlng,
	          map: map
	        });
	        infowindow.setContent(results[1].formatted_address);*/
	        var srtA = document.getElementById("srtA");
	        srtA.innerHTML = results[1].formatted_address;
	        //infowindow.open(map, marker);
	      } else {
	        window.alert('No results found');
	      }
	    } else {
	      window.alert('Geocoder failed due to: ' + status);
	    }
	  });
	}

function geocodedstA(geocoder, map, infowindow , position) {
	  var latlng = position;
	  geocoder.geocode({'location': latlng}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	       /* map.setZoom(11);
	        var marker = new google.maps.Marker({
	          position: latlng,
	          map: map
	        });
	        infowindow.setContent(results[1].formatted_address);*/
	        var dstA = document.getElementById("dstA");
	        dstA.innerHTML = results[1].formatted_address;
	        //infowindow.open(map, marker);
	      } else {
	        window.alert('No results found');
	      }
	    } else {
	      window.alert('Geocoder failed due to: ' + status);
	    }
	  });
	}


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

//최단거리 맵
function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
	//지오코딩부분
	geocoder = new google.maps.Geocoder;
	infowindow = new google.maps.InfoWindow;
	geocodesrtA(geocoder, map, infowindow, googleLatAndLong);
	var mapOptions = {
			zoom: 15,
			center: googleLatAndLong,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
}
//검색시 불러오는 맵
function searchMap(coords){
	var mapOptions = {
			zoom: 14,
			center: coords,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
}
//초기에 불러오는 맵
function defultMap(){
	var googleLatAndLong = new google.maps.LatLng(37.561, 126.981);
	var mapOptions = {
			zoom: 11,
			center: googleLatAndLong,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
}

/*function getMyLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(displayLocation);
	}else{
		alert("Oops, no geolocation support");
	}
}*/
function getMyLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(defultMap);
		/*navigator.geolocation.getCurrentPosition(displayLocation);*/
		document.getElementById('myloc').addEventListener('click', function() {
			navigator.geolocation.getCurrentPosition(displayLocation);
		  });
		  document.getElementById('search').addEventListener('click', function() {
			geocoder = new google.maps.Geocoder();
		    geocodeAddress(geocoder, map);
		  });
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

/*function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	
	var km = computeDistance(position.coords, ourCoords);
	var distance = document.getElementById("distance");
	distance.innerHTML = "You are " + km + " km from the wickedlySmart HQ";
	
	showMap(position.coords);
}*/
// position 위도경도
function computeDistance(startCoords, destLat,destLong){
	var startLatRads = degreeToRadians(startCoords.latitude);
	var startLongRads = degreeToRadians(startCoords.longitude);
	var destLatRads = degreeToRadians(destLat);
	var destLongRads = degreeToRadians(destLong);
	
	var Radius = 6371;
	var distance = Math.acos(Math.sin(startLatRads)* Math.sin(destLatRads) + 
			Math.cos(startLatRads) * Math.cos(destLatRads) *
			Math.cos(startLongRads - destLongRads)) * Radius;
	
	return distance;
}
// 위도경도 위도경도
function FcomputeDistance(srtLat, srtLong, destLat,destLong){
	var startLatRads = degreeToRadians(srtLat);
	var startLongRads = degreeToRadians(srtLong);
	var destLatRads = degreeToRadians(destLat);
	var destLongRads = degreeToRadians(destLong);
	
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