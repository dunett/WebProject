window.onload =initMap;
var map;
var health_Code=null;	
var forecast_Code=null;
var sidoName;


//지도 초기화 
function initMap(){

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 11 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
  
	map = new daum.maps.Map(mapContainer, mapOption);
		 map.setZoomable(false);
 	initControl();
	//selectLoc('서울특별시');
	myLocation();
};

//컨트롤 초기화
function initControl(){
// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new daum.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// daum.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

// //지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
// var zoomControl = new daum.maps.ZoomControl();
// map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

};


function moveTomyLocation()
{

	if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new daum.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div>현위치</div>'; // 인포윈도우에 표시될 내용입니다
 		
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
		getmyLocationAddr();  

      });
    }
      
}
//지도 이동  함수
function MoveTo(a,b) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new daum.maps.LatLng(a, b);
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);            
}

//현재위치 검색후 getmyLocationAddr
function myLocation(){

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new daum.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div>현위치</div>'; // 인포윈도우에 표시될 내용입니다
 		
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
		getmyLocationAddr();  

      });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    var locPosition = new daum.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
    displayMarker(locPosition, message);
}

}//end MYlocation

function displayMarker(locPosition, message) {

	var imageSrc = 'here.png', 
    imageSize = new daum.maps.Size(64, 69),
    // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
    imageOption = {offset: new daum.maps.Point(27, 69)}; 
 
   var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);
    // 마커를 생성합니다
    var marker = new daum.maps.Marker({  
        map: map, 
        position: locPosition,
        image:markerImage
    }); 
    
    marker.setMap(map); 
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}
//위치 를 주소로 만든후 selectLoc
function getmyLocationAddr(){
// 주소-좌표 변환 객체를 생성합니다
var geocoder = new daum.maps.services.Geocoder();

// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
searchAddrFromCoords(map.getCenter(), displayCenterInfo);

function searchAddrFromCoords(coords, callback) {
    // 좌표로 주소 정보를 요청합니다
    geocoder.coord2addr(coords, callback);         
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(status, result) {
    if (status === daum.maps.services.Status.OK) {
      //  alert(result[0].name1);
        document.getElementById('myloctext').innerHTML =result[0].fullName;
        selectMYLoc(result[0].name1);
    }    
}
}//end getmyLocationAddr


//지역선택 후 지도이동 & 파싱
function selectLoc(value){

	var a,b;
	health_Code=null;
	forecast_Code=null;
	sidoName=value;
	switch(value){
		case '서울특별시': health_Code=1100000000;sidoName='서울';  a=37.5636;b=126.98; var locPosition = new daum.maps.LatLng(a, b), message = '<div>서울</div>'; displayMarker(locPosition, message);
			break;
	
		case '부산광역시': health_Code=2600000000; sidoName='부산'; a=35.177;b=129.077 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>부산</div>'; displayMarker(locPosition, message);
			break;
	
		case '대구광역시': health_Code=2700000000;sidoName='대구';  a=35.8685;b=128.6036 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>대구</div>'; displayMarker(locPosition, message);
			break;
	
		case '인천광역시': health_Code=2800000000;sidoName='인천';  a=37.4532;b=126.7074 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>인천</div>'; displayMarker(locPosition, message);
			break;
	
		case '광주광역시': health_Code=2900000000; sidoName='광주'; a=35.157;b=126.8534; var locPosition = new daum.maps.LatLng(a, b), message = '<div>광주</div>'; displayMarker(locPosition, message);
			break;
	
		case '대전광역시': health_Code=3000000000;sidoName='대전';  a=36.3471;b=127.3866; var locPosition = new daum.maps.LatLng(a, b), message = '<div>대전</div>'; displayMarker(locPosition, message);
			break;
	
		case '울산광역시': health_Code=3100000000; sidoName='울산'; a=35.5354;b=129.3137 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>울산</div>'; displayMarker(locPosition, message);
			break;
	
		case '경기도': health_Code=4111000000;sidoName='경기';  a=37.2606;b=127.0307; var locPosition = new daum.maps.LatLng(a, b), message = '<div>경기</div>'; displayMarker(locPosition, message);
			break;
	
		case '강원도': health_Code=4211000000;sidoName='강원';  a=37.8785;b=127.7323; var locPosition = new daum.maps.LatLng(a, b), message = '<div>강원</div>'; displayMarker(locPosition, message);
			break;
	
		case '충청북도': health_Code=4311000000;sidoName='충북';  a=36.6396;b=127.4912 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>충북</div>'; displayMarker(locPosition, message);
			break;
	
		case '충청남도': health_Code=4413000000;sidoName='충남';  a=36.8121;b=127.1162; var locPosition = new daum.maps.LatLng(a, b), message = '<div>충남</div>'; displayMarker(locPosition, message);
			break;
	
		case '전라북도': health_Code=4511000000;sidoName='전북';  a=35.8215;b=127.15; var locPosition = new daum.maps.LatLng(a, b), message = '<div>전북</div>'; displayMarker(locPosition, message);
			break;

		case '전라남도': health_Code=4611000000;sidoName='전남';  a=34.8088;b=126.3944; var locPosition = new daum.maps.LatLng(a, b), message = '<div>전남</div>'; displayMarker(locPosition, message);
			break;
	
		case '경상북도': health_Code=4812100000;sidoName='경북';  a=36.016;b=129.3456 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>경북</div>'; displayMarker(locPosition, message);
			break; 
	
		case '경상남도': health_Code=4812000000;sidoName='경남';  a=35.2248;b=128.6841; var locPosition = new daum.maps.LatLng(a, b), message = '<div>경남</div>'; displayMarker(locPosition, message);
			break;
			
		case '제주특별자치도': health_Code=5011000000;sidoName='제주'; a=33.4963;b=126.5332 ; var locPosition = new daum.maps.LatLng(a, b), message = '<div>제주</div>'; displayMarker(locPosition, message);
			break;
	
	}//endswitch
	//지도 이동 
	MoveTo(a,b);
	//파싱 호출
 	parsing();
}//end selectLoc



//내위치 검색후 후 지도이동 & 파싱
function selectMYLoc(value){

	var a,b;
	health_Code=null;
	forecast_Code=null;
	sidoName=value;
	switch(value){
		case '서울특별시': health_Code=1100000000;sidoName='서울';  a=37.5636;b=126.98;
			break;
	
		case '부산광역시': health_Code=2600000000; sidoName='부산'; a=35.177;b=129.077 ;
			break;
	
		case '대구광역시': health_Code=2700000000;sidoName='대구';  a=35.8685;b=128.6036 ;
			break;
	
		case '인천광역시': health_Code=2800000000;sidoName='인천';  a=37.4532;b=126.7074 ;
			break;
	
		case '광주광역시': health_Code=2900000000; sidoName='광주'; a=35.157;b=126.8534;
			break;
	
		case '대전광역시': health_Code=3000000000;sidoName='대전';  a=36.3471;b=127.3866;
			break;
	
		case '울산광역시': health_Code=3100000000; sidoName='울산'; a=35.5354;b=129.3137 ;
			break;
	
		case '경기도': health_Code=4111000000;sidoName='경기';  a=37.2606;b=127.0307;
			break;
	
		case '강원도': health_Code=4211000000;sidoName='강원';  a=37.8785;b=127.7323;
			break;
	
		case '충청북도': health_Code=4311000000;sidoName='충북';  a=36.6396;b=127.4912 ;
			break;
	
		case '충청남도': health_Code=4413000000;sidoName='충남';  a=36.8121;b=127.1162;
			break;
	
		case '전라북도': health_Code=4511000000;sidoName='전북';  a=35.8215;b=127.15;
			break;

		case '전라남도': health_Code=4611000000;sidoName='전남';  a=34.8088;b=126.3944;
			break;
	
		case '경상북도': health_Code=4812100000;sidoName='경북';  a=36.016;b=129.3456 ;
			break; 
	
		case '경상남도': health_Code=4812000000;sidoName='경남';  a=35.2248;b=128.6841;
			break;
	
		case '제주특별자치도': health_Code=5011000000;sidoName='제주'; a=33.4963;b=126.5332 ;
			break;
	
	}//endswitch
	//파싱 호출
 	parsing();
}//end selectLoc


//파싱 함수
function parsing(){
    
//미세먼지
 $.ajax({
        url:"http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=B8uq23YZEeiWzi1shldMKFWW3WrwsCBe9KFxmb9d3tBEbs5EosgrUMI%2BBod%2BInHKw3kY6VmTLM12v3CRgkR0cg%3D%3D&numOfRows=1&pageNo=1&sidoName="+sidoName,
        type: 'GET',
        dataType:"xml",
        success: dust 
    });

}//end parsing
			

//예보 콜백 함수
function forecast(info){
// 	alert("예보"+info);

 var myXML = info.responseText;
 
 			 //alert(myXML);
            myXML = $.parseXML(myXML)
            myXML = $(myXML); 
            
 			var result='';
       
          	var data= $(myXML.find('item'));
          	
          	if($(data[data.length-1]).find('informOverall').text().length!=0)
          	{
		document.getElementById('f_1').innerHTML =$(data[data.length-1]).find('informOverall').text();
		document.getElementById('f_2').innerHTML =$(data[data.length-1]).find('informGrade').text();
		document.getElementById('date').innerHTML =$(data[data.length-1]).find('dataTime').text();
		}else{
		document.getElementById('f_1').innerHTML ='예보 준비중 입니다. ';
		document.getElementById('f_2').innerHTML ='예보 준비중 입니다. ';
		document.getElementById('date').innerHTML =$(data[data.length-1]).find('dataTime').text();
		}

}


//오염 정보 콜백 함수
function dust(info){
// 	alert("먼지"+info);
 var myXML = info.responseText;
 
 		// alert(myXML);
            myXML = $.parseXML(myXML)
            myXML = $(myXML); 
            
 			var result='';
       
          	var data= $(myXML.find('item'));
          	
	document.getElementById('d_1').innerHTML =$(data).find('dataTime').text();
	document.getElementById('d_2').innerHTML =$(data).find('stationName').text();
	document.getElementById('d_3').innerHTML =setTotalContent($(data).find('khaiGrade').text());
	document.getElementById('d_4').innerHTML =setContentforDust($(data).find('pm10Grade').text());
	document.getElementById('d_5').innerHTML =setContentforDust($(data).find('o3Grade').text());
	document.getElementById('d_6').innerHTML =setContentforDust($(data).find('coGrade').text());
 		

}

function setTotalContent(text){
	var result='';
 			switch(text)
			{
				case '0':result = '좋음';
					break;
			
				case '1':result = '좋음';
					break;
					
				case '2':result = '보통';
					break;
				case '3':result = '나쁨';
					break;
				case '4':result = '매우나쁨';
					break;
				default : result='정보없음';
					break;
			}
	return result;
}


//오염정보 내용 가공 함수
function setContentforDust(text){
	var result='';
 			switch(text)
			{
				case '0':result = '좋음';
					break;
			
				case '1':result = '좋음';
					break;
					
				case '2':result = '보통';
					break;
				case '3':result = '나쁨';
					break;
				case '3':result = '매우나쁨';
					break;

				default : result='정보없음';
					break;
			}
	return result;
}

