function HTMLredraw() {
	this.bodyWrap = document.querySelector('body');
	this.mapWrap = document.querySelector('#map-canvas');
    this.selectedWagonGuid = null;
}

HTMLredraw.prototype.createUgreshkaCtrl = function( map ) {
  var controlDiv = document.createElement('div');
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

  google.maps.event.addDomListener( controlUI, 'click', function() {
    map.setCenter(ugreshka);
    map.setZoom( 15 );
  } );
  
  map.controls[ google.maps.ControlPosition.BOTTOM_LEFT ].push( controlDiv );
  controlDiv.index = 1;
};

HTMLredraw.prototype.createDrawTrackButton = function( mm ) {
  var self = this;
  //alert("caller is " + arguments.callee.caller.toString());
  $( "#redrawBtn2" ).on( "click", function( e ) {
      var wagon_guid = self.getSelectedWagonGuid();
      var date_from = self.getDateFrom().subtract( 3, 'hour' );
      var date_to = self.getDateTo().subtract( 3, 'hour' );
//      mm.drawTrack( wagon_guid, date_from, date_to );
      mm.track.clear();
      self.fillTripsList( mm, wagon_guid, date_from, date_to );
  } );
};

HTMLredraw.prototype.fillDateSelectors = function() {
  $("#datetimepicker1").data("DateTimePicker").date( moment().subtract( 1, 'days') ) ;
  $("#datetimepicker2").data("DateTimePicker").date( moment() ) ;
};

HTMLredraw.prototype.getDateFrom = function() {
    return $( "#datetimepicker1" ).data( "DateTimePicker" ).date();    
};

HTMLredraw.prototype.getDateTo = function() {
    return $( "#datetimepicker2" ).data( "DateTimePicker" ).date();
};

HTMLredraw.prototype.getSelectedWagonGuid = function() {
    return this.selectedWagonGuid;
};

HTMLredraw.prototype.startProgress = function() {
    document.getElementById( 'get_track_progress' ).style.visibility = "visible";  
};

HTMLredraw.prototype.stopProgress = function() {
    document.getElementById( 'get_track_progress' ).style.visibility = "hidden";  
};

HTMLredraw.prototype.updateDotsCount = function( count ) {
    document.getElementById( 'label_dots_count' ).innerHTML = "Точек: " + count;
}

HTMLredraw.prototype.fillWagonsSelector = function( wm ) {
  var self = this;
  wm.getWagonsList(function () {
    var cmbItems = "";
    console.log("wagons.length = " + wm.wagons_list.length);
    for (var w in wm.wagons_list) {
      var wagon = wm.wagons_list[w];
      var vn = wagon.name.trim(); 
      cmbItems += '<li><a href="#" '
      + ' guid="' + wagon.guid + '">'
      + vn.substring( 0, vn.lastIndexOf( '(' ) )
      + '</a></li>';
    }

    $('.dropdown').on('click', 'a[data-toggle="dropdown"]', function () {
      console.log( "OnWagonDropdown" );
      if ($(this).children().length <= 0) {
          console.log( "OnWagonDropdown length <=0" );
        $(this).after('<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" >' +
          cmbItems + '</ul>');

        $(this).dropdown();
      }
    });

    $('.dropdown').on('click', 'li', function ( event ) {
      var wagon_guid = $( event.currentTarget.innerHTML ).attr( "guid" );
      var selText = $(this).text();
      $(this).parents('.dropdown').find('.dropdown-toggle').html(selText);
      self.selectedWagonGuid = wagon_guid;
       //$('.dropdown').html($(this).find('a').html());
    });
  });
};

HTMLredraw.prototype.fillTripsList = function( mm, wagon_guid, date_from, date_to ) {
    console.log( "fillTripsList" );
    RecursiveUnbind( $( "#listgroup-trips") );
    $("#listgroup-trips").empty();
    var self = this;
    $("#listgroup-trips").on( 'click', '.list-group-item', function(e) {
        e.preventDefault();
        var val = $(this).attr( 'trip_guid' );
        //alert( val );
        mm.drawTrack( wagon_guid, $(this).attr( 'date_from' ), $(this).attr( 'date_to' ) );
    });
    
    var request = getXmlHttp();
    request.overrideMimeType('text/xml');
    var req = "/mesh/php/get_trips.php?wagon_guid=" + wagon_guid 
        + "&date_from=" + date_from.format( 'DD-MM-YYYY HH:mm:ss' ) 
        + "&date_to=" + date_to.format( 'DD-MM-YYYY HH:mm:ss' );

        
    request.open("GET", req, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.status == 200 && request.readyState == 4) {
            var json = JSON.parse( request.responseText );
			var json_trips = json.data;
            var c = 1;
            if( json_trips.length > 0 ) {
                var EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
                $("#listgroup-trips").append( "<a href='#' class='list-group-item' "
                    + "id='" + -1
                    + "' trip_guid='" + EMPTY_GUID
                    + "' date_from='" + date_from.format( 'DD-MM-YYYY HH:mm:ss' )
                    + "' date_to='" + date_to.format( 'DD-MM-YYYY HH:mm:ss' )
                    + "'><span class='badge pull-left'>1-" + json_trips.length
                    + "</span>"                 
                    + "<h3 class='list-group-item-heading'>За весь период</h3><p class='list-group-item-text'></p>"
                    + "</li>" ).slideDown();
            }
                        
			for( var jt in json_trips ) {
                var jtrip = json_trips[ jt ];
                var tn = jtrip[ 'name' ];
                var td = moment( jtrip[ 'date_begin' ] ).format( 'DD/MM/YYYY HH:mm' );
                $("#listgroup-trips").append( "<a href='#' class='list-group-item' "
                    + "id='" + jt 
                    + "' trip_guid='" + jtrip[ 'guid' ]
                    + "' date_from='" + moment( jtrip[ 'date_begin' ] ).format( 'DD-MM-YYYY HH:mm:ss' )
                    + "' date_to='" + moment( jtrip[ 'date_end' ] ).format( 'DD-MM-YYYY HH:mm:ss' )
                    + "'><span class='badge pull-left'>" + c++ 
                    + "</span><h3 class='list-group-item-heading'>"
                    + tn.substring( 0, tn.lastIndexOf( '(' ) )
                    + "</h3><p class='list-group-item-text'>Дата: "
                    + td
                    + "</p>"
                    + "</li>" ).slideDown();
            }                
        }
    }
};

function RecursiveUnbind($jElement) {
    // remove this element's and all of its children's click events
    $jElement.unbind();
    $jElement.removeAttr('onclick');
    $jElement.children().each(function () {
        RecursiveUnbind($(this));
    });
}