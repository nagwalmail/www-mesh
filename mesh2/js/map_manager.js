var MapManager = function( wagon_manager ) {
	this.map = {};
  this.mesh = {};
  this.track = [];
  this.wagon_manager = wagon_manager;
  this.HTMLredraw = new HTMLredraw();
  google.maps.event.addDomListener(window, 'load', this.init.bind(this));
}

MapManager.prototype.init = function() {
	var mapOptions = {
    zoom: 18,
    center: new google.maps.LatLng(55.957680, 38.028542),
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
  this.HTMLredraw.createUgreshkaCtrl(this.map, centerControlDiv);

  centerControlDiv.index = 1;
  this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
  
  var self = this;
  //google.maps.event.addDomListener(this.map, 'dragend', self.redrawRailroad.bind(this));

  google.maps.event.addDomListener(this.map, 'click', function() {
    clearSelected( this.map );
  });

  $(function () {
      $("#datetimepicker1").on("dp.change", function (e) {
        self.drawTrack( e );     
      }).bind( this );    
  }).bind( this );  
        
  this.HTMLredraw.fillWagonsSelector();
  //this.HTMLredraw.fillRoadsSelector();
  var cmb = document.getElementById( 'road_cmb' );
  if( cmb != null ) {
      cmb.addEventListener( 'change', self.redrawRailroad.bind(this));
  }
  
  var cmbW = document.getElementById( 'wagon_cmb' );
  if( cmbW != null ) {
      cmbW.addEventListener( 'change', self.drawTrack.bind(this));
  }
  
  //self.drawTrack(this);
};

MapManager.prototype.redrawRailroad = function() {
  var road_id = document.getElementById( 'road_cmb' ).value;
  var bounds_ = this.map.getBounds();
  var ne = new google.maps.LatLng( bounds_.getNorthEast().lat() + 1.0, bounds_.getNorthEast().lng() + 1.0 );
  var sw = new google.maps.LatLng( bounds_.getSouthWest().lat() - 1.0, bounds_.getSouthWest().lng() - 1.0 );
  var bounds = new google.maps.LatLngBounds( sw, ne );

  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "http://localhost/mesh2/php/data_provider.php?lat0=" + bounds.getNorthEast().lat() + 
    "&lat1=" + bounds.getSouthWest().lat() + "&lon0=" + bounds.getSouthWest().lng() +
    "&lon1=" + bounds.getNorthEast().lng() + "&road=" + road_id;
  
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
};

MapManager.prototype.drawTrack = function( e ) {
  for( var i = 0; i < this.track.length; i++ ) {
      this.track[ i ].setMap( null );
  }
  
  // console.log( "date: " + e.date.format( 'DD-MM-YYYY HH:mm:ss') );
  this.track = [];
  var request = getXmlHttp();
  var req = "/mesh/php/get_track.php?guid=36353431-6262-3332-6332-393534333937&\
      date=" + e.date.format( 'DD-MM-YYYY HH:mm:ss' );
      
  request.open( "GET", req, true );
  request.send( null );
  request.onreadystatechange = function () {
		if (request.readyState == 4 && request.responseText.length > 0) {
			var json = JSON.parse(request.responseText);
			var json_dots = json.data;
      var pts = [];
      var odd = 0;
      for( var dot in json_dots ) {
        var d = new google.maps.LatLng( json_dots[ dot ].lat, json_dots[ dot ].lng );
        pts.push( d );
        var speed = json_dots[ dot ].speed / 2;
      
        if( odd > 0 ) {
          odd = 0;
          var color = "#00" + speed * 5 + "00";
          var polyline = new google.maps.Polyline({
            path: pts,
            geodesic: false,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          
          polyline.setMap( this.map );
          this.track.push( polyline );
          pts = [];
          pts.push( d );
        }
        else {
          odd++;
        }
      }
		}
	}.bind(this);
};

