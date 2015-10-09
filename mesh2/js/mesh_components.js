function Mesh( map ) {
	this.mesh_path = [];
	this.map = map;
};

Mesh.prototype.clear = function() {
	var arr = this.mesh_path;
	arr.forEach( function( mp, i, arr ) {
		mp.polyline.setMap( null );
	} );
	// for(var i = 0; i < this.mesh_path.length; ++i) {
	// 	this.mesh_path[ i ].polyline.setMap( null );
	// }	
	
	this.mesh_path = [];
};

function Way( json_way ) {
	this.id = json_way.id;
	this.way_num = json_way.num;
};

Way.prototype.onClick = function( event ) {
	console.log( this.way_num + " clicked" );
}

function MeshPath( id, way, data, map ) {
	this.id = id;
	this.way = way;

	var pts = [];
	var points = data.points;
	for (var p in points) {
		pts.push( new google.maps.LatLng( points[ p ].lat, points[ p ].lng ) );
	}
	
	var line = data.line;
	this.polyline = new google.maps.Polyline({
          path: pts,
          geodesic: false,
          strokeColor: line.color,
          strokeOpacity: 1.0,
          strokeWeight: line.width
        });
		
	this.direction = {
		id: data.direction.id,
		name: data.direction.name
	}; 
	
	this.polyline.setMap( map );
	this.polyline.addListener( 'click', way.onClick.bind( way ) );
};