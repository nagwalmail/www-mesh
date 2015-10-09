/* global google */
var ugreshka = new google.maps.LatLng( 55.717685, 37.695167 );
function CenterControl(controlDiv, map) {
  // Set CSS for the control border
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
}

function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

var map;
var road = [];
var wagons = [];
var listeners = [];

function getWagons() {
 //  for( var i = 0; i < wagons.length; i++ ) {
 //    google.maps.event.removeListener( wagons[ i ].listener );
 //    wagons[i].marker.setMap( null );
 //  }

 // wagons.length = 0;

  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "http://localhost/wagons_pos.php";
  var trainImg = 'images/train.png';
  request.open("GET", req, true);
  request.send(null);
  request.onreadystatechange = function() {  
    if (request.readyState == 4) {
        var json_wagons = JSON.parse( request.responseText );
        
        var data = json_wagons.data;
        for( var wagon in data ) {
            var w = data[ wagon ];
            //console.log( 'wagon = ' + wagon + '; wagons[wagon] = ' + wagons[wagon] );

            if( !(wagon in wagons) ) { //[ такой вагон еще не добавили на карту ]//
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng( w.lat, w.lng ),
                icon: trainImg,
                animation: google.maps.Animation.BOUNCE,
                draggable: false,
                map: map
              });

              var wagon_obj = Object.create( Wagon_old ).constructor( w, marker );
              wagons[ wagon ] = wagon_obj;
              var listener = wagon_obj.marker.addListener( 
                'click',
                (function(wo) {
                  return wo.onClick;
                })(wagon_obj)
              );

              wagon_obj.listener = listener;
              listeners.push( listener );
            }
            else { //[ вагон есть на карте, просто меняем его координаты ]//
              wagons[ wagon ].marker.setOptions({position: new google.maps.LatLng( w.lat, w.lng )});
            }
        }
    }
    else {
      console.log( "request.state: " + request.state );
    }
  }
}

function redrawRailroad( map ) {
  // console.log( 'wagons.length = ' + wagons.length );
  // for( var i = 0; i < wagons.length; i++ ) {

  //   //google.maps.event.removeListener( wagons[ i ].listener );
  //   var index = i;
  //   var w = wagons[ index ];

  //   console.log( 'clearing ' + w );
  //   w[i].marker.setMap( null );
  // }

  // listeners = [];
  // wagons = [];

  getWagons();
  for( var i = 0; i < road.length; i++ ) {
    google.maps.event.removeListener( road[i].listener );
    road[i].polyline.setMap( null );
  }

  road.length = 0;

  var bounds_ = map.getBounds();
  var ne = new google.maps.LatLng( bounds_.getNorthEast().lat() + 1.0, bounds_.getNorthEast().lng() + 1.0 );
  var sw = new google.maps.LatLng( bounds_.getSouthWest().lat() - 1.0, bounds_.getSouthWest().lng() - 1.0 );
  var bounds = new google.maps.LatLngBounds( sw, ne );

  var request = getXmlHttp();
  request.overrideMimeType('text/xml');
  var req = "http://localhost/data_provider.php?lat0=" + bounds.getNorthEast().lat() + 
    "&lat1=" + bounds.getSouthWest().lat() + "&lon0=" + bounds.getSouthWest().lng() +
    "&lon1=" + bounds.getNorthEast().lng();
  
  request.open("GET", req, true);
  request.send(null);
  request.onreadystatechange = function() {  
    if (request.readyState == 4) {
       var json_mesh = JSON.parse( request.responseText );
      // console.log( json_mesh );  

      var data = json_mesh.data;
      map.road = road;
      for( var mesh_path_id in data ) {
        var pts = [];
        var points = data[ mesh_path_id ].points;
        for( var p in points ) {
          pts.push( new google.maps.LatLng( points[ p ].lat, points[ p ].lng ) );
        }

        var flightPath = new google.maps.Polyline( {
          path: pts, 
          geodesic: false, 
          strokeColor: data[ mesh_path_id ].line.color,
          strokeOpacity: 1.0, 
          strokeWeight: data[ mesh_path_id ].line.width
        } );

        var way = Object.create( Way ).constructor( data[ mesh_path_id ].way );
        var meshPath = Object.create( MeshPath ).constructor( mesh_path_id, way, flightPath );
        var direction = {
          id: data[ mesh_path_id ].direction.id,
          name: data[ mesh_path_id ].direction.name 
        };

        meshPath.direction = direction;
        road.push( meshPath );
        flightPath.setMap( map );
      }

      road.forEach( function( element, index, road ) {
        var listener = element.polyline.addListener( 
          'click',
          function(event) { 
            element.onClick( event, element, map ); 
          } ); 

        element.listener = listener;
      } );

      setInterval(function () {
         getWagons() 
      }, 500 );

      // var xmlDoc = request.responseXML;
    
      // var markers = xmlDoc.getElementsByTagName("marker");                            
      // var lines = xmlDoc.documentElement.getElementsByTagName("line");
      // for (var a = 0; a < lines.length; a++) {
      //   var colour = lines[a].getAttribute("color");
      //   var width  = parseFloat(lines[a].getAttribute("width"));
      //   var points = lines[a].getElementsByTagName("point");
        
      //   for (var i = 0; i < points.length; i++) {
      //    pts.push( new google.maps.LatLng( parseFloat(points[i].getAttribute("lat")),
      //                       parseFloat(points[i].getAttribute("lng")) ));
      //   }

      //   var flightPath = new google.maps.Polyline({path: pts, geodesic: false, strokeColor: colour,
      //         strokeOpacity: 1.0, strokeWeight: width});

      //   var meshPath = Object.create( MeshPath ).constructor( lines[a].getAttribute("id"), flightPath );
      //   road.push( meshPath );
      //   flightPath.setMap( map );
      // }

      // road.forEach( function( element, index, road ) {
      //   element.polyline.addListener( 'click', function(event){ element.onClick( event, element, map ) } );
      // } );
    }
  }
}

function initialize() {
  var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(55.755193, 37.627354),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Create the DIV to hold the control and
  // call the CenterControl() constructor passing
  // in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

  google.maps.event.addDomListener(map, 'dragend', function() {
      redrawRailroad( map );
  });

  google.maps.event.addDomListener(map, 'click', function() {
    clearSelected( map );
  });

  
}

google.maps.event.addDomListener(window, 'load', initialize);


function drawWagon() {

}