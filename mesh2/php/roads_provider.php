<?php

include("mssql.php");

// Initialize parameters and prepare the statement. 
// Variables $qty and $id are bound to the statement, $stmt.
$qty = 0; $id = 0;
$stmt = sqlsrv_prepare( $mssql_conn, "GetRoads", array( &$qty, &$id));
if( !$stmt ) {
    die( print_r( sqlsrv_errors(), true));
}

if( sqlsrv_execute( $stmt ) === false ) {
    die( print_r( sqlsrv_errors(), true));
}

// Retrieve each row as an object.
// Because no class is specified, each row will be retrieved as a stdClass object.
// Property names correspond to field names.
while( $obj = sqlsrv_fetch_object( $stmt ) ) {
    echo $obj->id.". ".$obj->name."<br />";
}
?>