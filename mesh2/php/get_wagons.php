<?php
include( "mssql.php" );

// $q = "SELECT LEFT( name, CHARINDEX('(', (select top(1) name from wagon)) - 2 ) as name 
// 	FROM wagon";
$q = "SELECT id, name FROM wagon order by name";
	
$json_result = array();
$result = odbc_exec( $connect, $q );
while( $myRow = odbc_fetch_array( $result ) ) {
    $json_result[] = array(
		'id' => $myRow[ 'id' ],
		'name' => $myRow[ 'name' ]
	);
}

$data = array( 'data' => $json_result );
echo( json_encode($data) );
?>
