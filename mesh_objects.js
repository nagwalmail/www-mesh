/* global google */
// var Way = {
//   constructor: function( way ) {
//     "use strict";
//     this.id = way.id;
//     this.way_num = way.num;
//     return this;
//   }
// };

var Wagon_old = {
  listener: null,
  wagon: null,
  marker: null,
  constructor: function( wagon, marker ) {
    this.wagon = wagon;
    this.marker = marker;
    return this;
  },

  onClick: function( event, map ) {
    var contentString = '<div id="content">'+
    
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Вагон</h1>'+
      '<div id="bodyContent">'+
      '<p><b>' + this.wagon.name + '</b>' +
      '<p><b>Lat: ' + this.wagon.lat + '</b></p>' +
      '<p><b>Lng: ' + this.wagon.lng + '</b></p>' +
      '<p>Подробная информация: <a href="http://vector-soft.ru">'+
      'http://vector-soft.ru</a> '+
      '(last visited ' + this.wagon.date + ').</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

    infowindow.setPosition( /*marker.getPosition()*/ugreshka );  
    infowindow.open( map );      
  }
};

var MeshPath_old = {
  listener: null,
  constructor: function( id, way, polyline ) {
    this.id = id;
    this.polyline = polyline;
    this.way = way;

    return this;
  },

  onClick: function( event, mesh_path, map ) {
    var way = document.getElementsByClassName("way");
    way[0].innerHTML = "way = '" + mesh_path.way.way_num + "'";

    var dir = document.getElementsByClassName( "direction" );
    dir[0].innerHTML = "direction = '" + mesh_path.direction.id + "'";

    clearSelected( map );
    mesh_path.polyline.setOptions({strokeColor: 'red', strokeWeight: 2});
    for( var i = 0; i < map.road.length; i++ ) {
      if( map.road[i].way.way_num == mesh_path.way.way_num &&
        map.road[i].direction.id == mesh_path.direction.id ) {
          map.road[i].polyline.setOptions({strokeColor: 'red', strokeWeight: 2});
      }
    }
  }
};

var clearSelected = function( map ) {
    for( var i = 0; i < map.road.length; i++ ) {
      map.road[i].polyline.setOptions({strokeColor: 'black', strokeWeight: 1});
    }
}

function MeshPath2( id, way, polyline ) {
  this.id = id;
  this.way = way;
  this.polyline = polyline;
}

MeshPath2.prototype.onClick = function() {
  
}