<?php
include( "mssql.php" );

$wagon_guid = $_GET[ 'wagon_guid' ];
$date_from = $_GET[ 'date_from' ];
$date_to = $_GET[ 'date_to' ];

$q = "SELECT guid, wagon_guid, name, date_begin, date_end FROM trip 
        WHERE wagon_guid = '" . $wagon_guid
        . "' AND date_begin >= '" . $date_from
        . "' AND date_end <= '" . $date_to
        . "' ORDER BY date_begin DESC";
	
//echo( $q );
$json_result = array();
$result = odbc_exec( $connect, $q );
while( $myRow = odbc_fetch_array( $result ) ) {
    $json_result[] = array(
		'guid' => $myRow[ 'guid' ],
		'name' => $myRow[ 'name' ],
        'wagon_guid' => $myRow[ 'wagon_guid' ],
        'date_begin' => $myRow[ 'date_begin' ],
        'date_end' => $myRow[ 'date_end' ]
	);
}

$data = array( 'data' => $json_result );
echo( json_encode($data) );
?>
