var MapManager = function( wagon_manager ) {
	this.map = {};
  this.mesh = {};
  this.wagon_manager = wagon_manager;
  google.maps.event.addDomListener(window, 'load', this.init.bind(this));
}

MapManager.prototype.init = function() {
	var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(55.755193, 37.627354),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  this.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  //this.wagon_manager.runGear( this.map );
  this.mesh = new Mesh( this.map );
  
  // Create the DIV to hold the control and
  // call the CenterControl() constructor passing
  // in this DIV.
  var centerControlDiv = document.createElement('div');
  new UgreshkaControl(this.map, centerControlDiv);

  centerControlDiv.index = 1;
  this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
  
  var self = this;
  google.maps.event.addDomListener(this.map, 'dragend', self.redrawRailroad.bind(this));

  google.maps.event.addDomListener(this.map, 'click', function() {
    clearSelected( this.map );
  });
};

MapManager.prototype.redrawRailroad = function() {
  var bounds_ = this.map.getBounds();
  var ne = new google.maps.LatLng( bounds_.getNorthEast().lat() + 1.0, bounds_.getNorthEast().lng() + 1.0 );
  var sw = new google.maps.LatLng( bounds_.getSouthWest().lat() - 1.0, bounds_.getSouthWest().lng() - 1.0 );
  var bounds = new google.maps.LatLngBounds( sw, ne );

  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "http://localhost/mesh2/php/data_provider.php?lat0=" + bounds.getNorthEast().lat() + 
    "&lat1=" + bounds.getSouthWest().lat() + "&lon0=" + bounds.getSouthWest().lng() +
    "&lon1=" + bounds.getNorthEast().lng();
  
  var mesh_tmp = new Mesh( this.map );
  request.open("GET", req, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.status == 200 && request.readyState == 4) {
      var json_mesh = JSON.parse(request.responseText);
      var data = json_mesh.data;
      for (var mesh_path_id in data) {
        var way = new Way( data[ mesh_path_id ].way );
        var meshPath = new MeshPath( mesh_path_id, way, data[ mesh_path_id ], this.map );
        mesh_tmp.mesh_path.push( meshPath );
      }
    }
  }.bind(this);
  
  this.mesh.clear();
  this.mesh = mesh_tmp;
  
  this.getRoads();
};

MapManager.prototype.getRoads = function() {
  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "http://localhost/mesh2/php/roads_provider.php";
  request.open("GET", req, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.status == 200 && request.readyState == 4) {
      console.log( request.rosponseText );
    }
  }.bind(this);
};

var UgreshkaControl = function(map, controlDiv) {
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
