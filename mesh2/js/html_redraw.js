function HTMLredraw() {
	this.bodyWrap = document.querySelector('body');
	this.mapWrap = document.querySelector('#map-canvas')
}

HTMLredraw.prototype.createUgreshkaCtrl = function(map, controlDiv) {
  // Set CSS for the control border
  var ugreshka = new google.maps.LatLng( 55.717685, 37.695167 );
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Угрешская';
  controlUI.appendChild(controlText);

  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(ugreshka);
    map.setZoom( 15 );
  });
};

HTMLredraw.prototype.fillWagonsSelector = function() {
  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "/mesh/php/get_wagons.php";
  request.open("GET", req, true);
  request.send(null);
  request.onreadystatechange = function () {
    console.log( "fillWagonsSelector request.status = " + request.status );
    if (request.status == 200 && request.readyState == 4) {
      var cmb = document.getElementById( 'wagon_cmb' );
      while( cmb.options.length > 1 ) {
          cmb.remove(1);
      }
      
 			var json = JSON.parse( request.responseText );
      
			var json_wagons = json.data;
			for( var jw in json_wagons ) {
				var jwagon = json_wagons[ jw ];
        var opt = document.createElement( 'option' );
        opt.value = jw;
        opt.innerText = jwagon[ "name" ];
        cmb.appendChild( opt );
      }
    }
  };
};

HTMLredraw.prototype.fillRoadsSelector = function() {
  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "/mesh/php/roads_provider.php";
  request.open("GET", req, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.status == 200 && request.readyState == 4) {
      var cmb = document.getElementById( 'road_cmb' );
      while( cmb.options.length > 1 ) {
          cmb.remove(1);
      }
      
 			var json = JSON.parse( request.responseText );
      
			var json_roads = json.data;
			for( var jr in json_roads ) {
        
				var jroad = json_roads[ jr ];
        var opt = document.createElement( 'option' );
        opt.value = jr;
        opt.innerText = jroad;
        cmb.appendChild( opt );
      }
    }
  };
};

