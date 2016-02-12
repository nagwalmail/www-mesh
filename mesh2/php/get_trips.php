<?php
include( "mssql.php" );

$q = "SELECT guid, wagon_guid, name, date_begin, date_end FROM trip WHERE wagon_guid is not null order by name";
	
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
