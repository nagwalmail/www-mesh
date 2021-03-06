<!-- OLD style

GET /mesh/set_pos.php?wagon_id=666&lat=57.00247129407001&lng=54.538987493544624&speed=60.0 HTTP/1.1
Host: localhost
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.33 Safari/537.36
Accept: ​*/*​
Referer: http://localhost/mesh_main.html
Accept-Encoding: gzip, deflate, sdch
Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4
Cookie: vc=11
-->

<!--
POST /mesh/php/set_pos.php?wi=3cecadac-45c8-440e-a847-a3acaf141e3e&la=57.002471&ln=54.538987&s=60
Host: localhost
-->
<!--
POST /mesh/php/set_pos.php?wi=&la=57.002471&ln=54.538987&s=60
Host: localhost
-->

<?php
include("mssql.php");
 
if( !$connect ) {
	debug_to_console( "request refused - no connection" );
	echo( "no connection" );
	die();
}


if( $_SERVER['REQUEST_METHOD'] != "POST" ) {
	echo "need 'POST' request";
	exit( 1 );
}


function checkParam( $param ) {
	return ( !empty( $param ) );	
}


$wagon_id = $_GET['wi'];
$lat = $_GET['la'];
$lng = $_GET['ln'];
$speed = $_GET['sp'];
$gps_dt_year = $_GET['yr'];
$gps_dt_month = $_GET['mo'];
$gps_dt_day = $_GET['da'];
$gps_dt_hour = $_GET['hr'];
$gps_dt_minute = $_GET['mn'];
$gps_dt_second = $_GET['sc'];


function checkParams() {
	global $wagon_id, $lat, $lng, $gps_dt_year, $gps_dt_month, $gps_dt_day;
	if( !checkParam( $wagon_id ) ) {
		echo "'wi' not set or empty\r\n";
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
	$dt = getdate();
	if( !checkParam( $gps_dt_year) or $gps_dt_year == 0) {
	    $gps_dt_year = $dt[year] % 2000;
	}
	if( !checkParam($gps_dt_month) or $gps_dt_month == 0) {
	    $gps_dt_month = $dt[mon];
	}
	if( !checkParam($gps_dt_day) or $gps_dt_day == 0) {
	    $gps_dt_day = $dt[mday];
	}
	return true;
}

if( !checkParams() ) {
	exit( 1 );
}
 
$q = sprintf( "INSERT INTO wagon_pos (wagon_guid, lat, lng, speed, gps_date) 
	VALUES ('%s', '%f', '%f', '%d', '%d-%d-%d %d:%d:%d')",
	addslashes( $wagon_id ), 
	addslashes( $lat ), 
	addslashes( $lng ), 
	addslashes( $speed ),
	addslashes( $gps_dt_day ),
	addslashes( $gps_dt_month ),
	addslashes( $gps_dt_year + 2000 ),
	addslashes( $gps_dt_hour ),
	addslashes( $gps_dt_minute ),
	addslashes( $gps_dt_second ) );

echo($q);

$result = odbc_exec( $connect, $q ); 
if( $result ) {
	exit( 0 );
}
else {
	echo "mssql error: " . odbc_errormsg( $connect );
	exit( 1 );
}
?>