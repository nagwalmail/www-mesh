function Track( map ) {
	this.track_path = [];	
	this.dots_in_path = 5;
	this.map = map;
};

Track.prototype.clear = function() {
	for( var i = 0; i < this.track_path.length; i++ ) {
    	this.track_path[ i ].setMap( null );
  	}
};

Track.prototype.createFromJson = function( json_dots ) {
	var pts = [];
	var odd = 0;

	for( var dot in json_dots ) {
        var d = new google.maps.LatLng( json_dots[ dot ].lat, json_dots[ dot ].lng );
        pts.push( d );
        var speed = Math.round(json_dots[ dot ].speed / 2);
      
        if( odd > this.dots_in_path ) {
          odd = 0;
          var path = new TrackPath( pts, speed, json_dots[ dot ] );
          path.setTrack( this );
          pts = [];
          pts.push( d );
        }
        else {
          odd++;
        }
    }
};

Track.prototype.addPath = function( path ) {
	this.track_path.push( path );	
}; 

function TrackPath( points, speed, json_dot ) {
	this.track = {}
	var color = createColor( speed );	
	this.polyline = new google.maps.Polyline({
		path: points,
		geodesic: false,
		strokeColor: color,
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	
	this.polyline.info = json_dot;
	this.polyline.addListener( 'click', function( e ) {
		document.getElementById( 'label_speed' ).innerHTML = 
			"Скорость: " + this.info.speed + " км/ч";          

		document.getElementById( 'label_date' ).innerHTML = 
			"Дата: " + moment( this.info.date ).add( 3, 'hour' ).format( 'DD-MM-YYYY HH:mm' );          
	} );	
};

TrackPath.prototype.setTrack = function( track ) {
	this.track = track;
	this.polyline.setMap( track.map );
	track.addPath( this );
};