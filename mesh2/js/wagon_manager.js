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
			var json_wagons = JSON.parse(request.responseText);
			var data = json_wagons.data;
			for (var wagon in data) {
				var w = data[wagon];
				if (!(wagon in this.wagons)) { //[ такой вагон еще не добавили на карту ]//
					var new_wagon = new Wagon(this.map, w);
					this.wagons[ wagon ] = new_wagon;
				}
				else { //[ вагон есть на карте, просто меняем его координаты ]//
					this.wagons[wagon].setPos( w ); 
				}
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
	this.map_marker = new google.maps.Marker( {
		position: new google.maps.LatLng( data.lat, data.lng ),
		icon: 'images/train.png',
		title: 'wagon 1',
		animation: google.maps.Animation.BOUNCE,
		draggable: false,
		map: map
	} );
	
	this.map_marker.addListener( 'click', this.onClick );
};

Wagon.prototype.onClick = function( event ) {
	console.log( "wagon pos = " + this.getPosition() );	
};

Wagon.prototype.setPos = function( pos ) {
	this.map_marker.setOptions( { 
		position: new google.maps.LatLng( pos.lat, pos.lng )
	} );
}