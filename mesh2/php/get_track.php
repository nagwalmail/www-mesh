<?php
include( "mssql.php" );

$guid = $_GET[ 'guid' ]; 
$date = $_GET[ 'date' ];

$q = "select (lat / 60) as lat, (lng / 60) as lng, speed 
	from wagon_pos where wagon_guid = '" . $guid 
	. "' and lat <> 0 and lng <> 0 and speed > 2"
	. " and date > '" . $date 
	. "' order by date desc";
	

$json_result = array();
$result = odbc_exec( $connect, $q );
while( $myRow = odbc_fetch_array( $result ) ) {
    $json_result[] = array(
		'lat' => $myRow[ 'lat' ],
		'lng' => $myRow[ 'lng' ],
		'speed' => $myRow[ 'speed' ]
	);
}

$data = array( 'data' => $json_result );
echo( json_encode($data) );
?>
