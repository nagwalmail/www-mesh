var WagonManager = function() {
	this.map = {};
	this.init();
};

WagonManager.prototype.init = function() {
	this.wagons = [];
	this.interval = 500;
	this.timer;
	this.HTMLredraw = new HTMLredraw();
};

WagonManager.prototype.move = function () {
	var request = getXmlHttp();
	request.overrideMimeType('text/xml');
	var req = "http://localhost/mesh2/php/wagons_pos.php";
	request.open("GET", req, true);
	request.send(null);
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.responseText.length > 0) {
			var json = JSON.parse(request.responseText);
			var json_wagons = json.data;
			for (var jw in json_wagons) {
				var jwagon = json_wagons[jw];
				if (!(jw in this.wagons)) { //[ такой вагон еще не добавили на карту ]//
					var new_wagon = new Wagon( this.map, jwagon );
					this.wagons[ jw ] = new_wagon;
				}

				this.wagons[jw].setPos( jwagon ); 
			}
		}
	}.bind(this);
};

WagonManager.prototype.runGear = function( map ) {
	var self = this;
	self.map = map;
	this.timer = setInterval( function() {
		self.move();		
	}, this.interval);
};

var Wagon = function( map, data ) {
	this.name = data.name;
	this.map_marker = new google.maps.Marker( {
		icon: 'images/train.png',
		title: data.name,
		animation: google.maps.Animation.BOUNCE,
		draggable: false,
		map: map
	} );
	
	this.map_marker.addListener( 'click', this.onClick.bind( this ) );
};

Wagon.prototype.onClick = function( event ) {
	console.log( "wagon name = " + this.name );	
};

Wagon.prototype.setPos = function( pos ) {
	this.map_marker.setOptions( { 
		position: new google.maps.LatLng( pos.lat, pos.lng )
	} );
}