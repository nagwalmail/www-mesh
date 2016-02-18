function Track( map ) {
	this.track_path = [];	
	this.dots_in_path = 5;
	this.map = map;
    this.first = null;
};

Track.prototype.clear = function() {
	for( var i = 0; i < this.track_path.length; i++ ) {
    	this.track_path[ i ].polyline.setMap( null );
  	}
	  
	this.track_path = [];
    this.first = null;
};

Track.prototype.createFromJson = function( json_dots ) {
	var pts = [];
	var odd = 0;
    var arrow_counter = 0;
    var symbolStart = {
        path: 'M -2,0 0,-2 2,0 0,2 z',
        strokeColor: '#000000',
        fillColor: '#808080',
        fillOpacity: 1,
        anchor: { x: 0, y: -1 }
    };
    
    var symbolFinish = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        strokeWeight: 2,
        anchor: { x: 0, y: 1 },
        strokeColor: "#404040"        
    }

    var symbolFinishSmall = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 2,
        strokeWeight: 2,
        anchor: { x: 0, y: 2 },
        strokeColor: "#FFFFFF"        
    }
    
    var symbolArrow = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        strokeOpacity: 0.8,
        strokeColor: "#4285F4",
        anchor: { x: -2, y: 0 },
    }
      
	for( var dot in json_dots ) {
        var d = new google.maps.LatLng( json_dots[ dot ].lat, json_dots[ dot ].lng );
        if( this.first == null ) {
            this.first = d;
        }
        
        pts.push( d );
        var speed = Math.round(json_dots[ dot ].speed / 2);
      
      
        if( odd > this.dots_in_path ) {
          odd = 0;
          arrow_counter++;
          var icons = [ 
            {
                icon: arrow_counter >= ( json_dots.length / ( this.dots_in_path + 2 ) - 1 ) ?
                    symbolFinish : null,
                    
                offset: "100%"
            },
            {
                icon: arrow_counter >= ( json_dots.length / ( this.dots_in_path + 2 ) - 1 ) ?
                    symbolFinishSmall : null,
                    
                offset: "100%"
            },
            {
                icon: arrow_counter == 1 ? symbolStart : null,
                offset: "0%"
            },
            {
                icon: arrow_counter % this.dots_in_path == 0 ? 
                    symbolArrow : null,
                    
                offset: "50%"
            }
         ];

          var path = new TrackPath( pts, speed, json_dots[ dot ], icons );
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

function TrackPath( points, speed, json_dot, icons ) {
	this.track = {}
	var color = createColor( speed );	

	this.polyline = new google.maps.Polyline({
		path: points,
		geodesic: false,
		strokeColor: color,
		strokeOpacity: 1.0,
		strokeWeight: 2,
        icons: icons
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