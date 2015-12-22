var WagonManager = function() {
	this.map = {};
	this.init();
};

WagonManager.prototype.init = function() {
	this.wagons = [];
	this.wagons_list = [];
	this.interval = 1000;
	this.timeout;
};

WagonManager.prototype.move = function () {
	var request = getXmlHttp();
	//request.overrideMimeType('text/xml');
	var req = "/mesh/php/wagons_pos.php";
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
			
			this.timeout = setTimeout( function() {
				this.move();
			}.bind( this ), this.interval );
		}
	}.bind(this);
};

WagonManager.prototype.runGear = function( map ) {
	var self = this;
	self.map = map;
	this.timeout = setTimeout( function() {
		self.move();		
	}, this.interval);
};

WagonManager.prototype.stopGear = function() {
	console.log( "### clear timeout " + this.timeout );
	clearTimeout( this.timeout );
}

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

WagonManager.prototype.getWagonsList = function( callback ) {
	var request = getXmlHttp();
	request.overrideMimeType('text/xml');
	var req = "/mesh/php/get_wagons.php";
	request.open("GET", req, true);
	request.send(null);
	request.onreadystatechange = function () {
		console.log("fillWagonsSelector request.status = " + request.status);
		if (request.status == 200 && request.readyState == 4) {
			var json = JSON.parse(request.responseText);
			console.log( json.data );
			var json_wagons = json.data;
			for (var jw in json_wagons) {
				var jwagon = json_wagons[jw];
				this.wagons_list.push( jwagon );
			}
			
			callback();
		}
	}.bind( this );
}