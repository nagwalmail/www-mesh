<?php
 
include("mssql.php");

if( !$connect ) {
	debug_to_console( "request refused - no connection" );
	echo( "no connection" );
	die();
}

$q = 'select wp1.wagon_guid, wp1.lat / 60. as lat, wp1.lng / 60. as lng, 
	wp1.speed, wp1.gps_date, wagon.name from wagon_pos wp1 
	left join wagon on (wagon.guid = wp1.wagon_guid)
	join
	(select wagon_guid, max(gps_date) as gps_date 
		from wagon_pos group by wagon_guid) as wp2 
	on wp1.wagon_guid = wp2.wagon_guid and wp1.gps_date = wp2.gps_date
	where name is not null and wp1.lat > 0 and wp1.lng > 0
	order by wp1.wagon_guid';

$result = odbc_exec( $connect, $q );
$json_result = array();

while( $row = odbc_fetch_array( $result ) ) {
	$json_result[ $row[ 'wagon_guid' ] ] = array(
		'name'  => $row[ 'name' ] == null ? "unknown_wagon" : $row[ 'name' ],
		'date' => $row[ 'gps_date' ],
		'lat' => $row[ 'lat' ],
		'lng' => $row[ 'lng' ]
	);
}
// else {
// 	echo "<p>Вагонов не обнаружено</p>";
// }

$data = array( 'data' => $json_result );
echo( json_encode($data) );
?>