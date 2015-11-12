<?php

include("mssql.php");

// $stmt = odbc_prepare( $connect, 'select * from road' );
// debug_to_console( odbc_errormsg( $connect ) );
// echo( "<br>prepared<br>" );

//$result = odbc_exec( $connect, 'select * from wagon' );
$result = odbc_prepare( $connect, 'CALL GetWagons' );
$success = odbc_execute( $result );
debug_to_console( odbc_errormsg( $connect ) );
echo( "<br>executed: <br>" . $success );
//odbc_result_all($result);
while( odbc_fetch_row( $result ) ) {
    $road = odbc_result( $result, 2 );
    echo( '<br>' . $road . '<br>' );
}

$roads = odbc_fetch_array( $success );
echo( $roads );
odbc_free_result( $success );
odbc_close( $connection );

// Initialize parameters and prepare the statement. 
// Variables $qty and $id are bound to the statement, $stmt.
// $qty = 0; $id = 0;
// debug_to_console( "trying to prepare...");
// $stmt = sqlsrv_prepare( $mssql_conn, "GetRoads", array( &$qty, &$id));
// if( !$stmt ) {
//     debug_to_console( "failed to prepate" );
//     die( print_r( sqlsrv_errors(), true));
// }
// 
// if( sqlsrv_execute( $stmt ) === false ) {
//     die( print_r( sqlsrv_errors(), true ) );
// }
// 
// $roads = array();
// 
// // Retrieve each row as an object.
// // Because no class is specified, each row will be retrieved as a stdClass object.
// // Property names correspond to field names.
// while( $obj = sqlsrv_fetch_object( $stmt ) ) {
//     $roads[ $obj->id ] = $obj->name;
//     //echo $obj->id.". ".$obj->name."<br />";
// }
// 
// $data = array();
// $data['data'] = $roads;
// 
// echo json_encode($data, JSON_FORCE_OBJECT);
?>