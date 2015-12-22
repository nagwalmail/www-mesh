<?php

//echo( "куку на!" );
$guid = $_GET[ 'guid' ]; 
$date_from = $_GET[ 'date_from' ];
$date_to = $_GET[ 'date_to' ];
$max_dots_count = 2000;

$q = "with x as (
	select row_number() over(order by gps_date desc) as rown, 
			(lat / 60) as lat, 
			(lng / 60) as lng, 
			speed, 
			gps_date 
	from wagon_pos where wagon_guid = '" . $guid 
	. "' and lat <> 0 and lng <> 0 and speed > 2"
	. " and gps_date >= '" . $date_from 
	. "' and gps_date <= '" . $date_to . "')"

	// . " select * from x";
	
	. " select * from x where rown % ((select count(id) + " . $max_dots_count 
	. "	from wagon_pos where wagon_guid = '" . $guid 
	. "' and lat <> 0 and lng <> 0 and speed > 2"
	. " and gps_date >= '" . $date_from 
	. "' and gps_date <= '" . $date_to
	. "') / " . $max_dots_count . ") = 0";
	
//echo( $q );

include( "mssql.php" );

$json_result = array();
$result = odbc_exec( $connect, $q );
while( $myRow = odbc_fetch_array( $result ) ) {
    $json_result[] = array(
		'lat' => $myRow[ 'lat' ],
		'lng' => $myRow[ 'lng' ],
		'speed' => $myRow[ 'speed' ],
		'date' => $myRow[ 'gps_date' ]
	);
}

$data = array( 'data' => $json_result );
echo( json_encode($data) );
?>
