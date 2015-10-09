<!--
POST /set_pos.php?wi=666&la=57.002471&ln=54.538987&s=60
Host: localhost
-->

<?php
 
include("config.php");

if( $_SERVER['REQUEST_METHOD'] != "POST" ) {
	echo "need 'POST' request";
	exit( 1 );
}

function checkParam( $param ) {
	return ( !empty( $param ) && is_numeric( $param ) );	
}

$wagon_id = $_GET['wi'];
$lat = $_GET['la'];
$lng = $_GET['ln'];
$speed = $_GET['s'];

function checkParams() {
	global $wagon_id, $lat, $lng;
	if( !checkParam( $wagon_id ) ) {
		echo "'wi' not set or not numeric\r\n";
		return false;
	}
	
	if( !checkParam( $lat ) ) {
		echo "'la' not set or not numeric\r\n";
		return false;
	}
	
	if( !checkParam( $lng ) ) {
		echo "'ln' not set or not numeric\r\n";
		return false;
	}
	
	return true;
}

if( !checkParams() ) {
	exit( 1 );
}
 
$q = sprintf( "INSERT INTO wagon_pos (wagon_id, lat, lng, speed) VALUES ('%d', '%f', '%f', '%f')",
	mysql_real_escape_string($wagon_id), 
	mysql_real_escape_string($lat), 
	mysql_real_escape_string($lng), 
	mysql_real_escape_string($speed) );

if( mysql_query( $q ) ) {
	exit( 0 );
}
else {
	echo "mysql error: " . mysql_error();
	exit( 1 );
}

?>