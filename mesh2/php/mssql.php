<?php

function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'mssql: " . $data . "' );</script>";

    echo $output;
}

function FormatErrors( $errors )
{
	echo "Error information:";

	foreach ( $errors as $error )
	{
		echo "SQLSTATE: ".$error['SQLSTATE']."";
		echo "Code: ".$error['code']."";
		echo "Message: ".$error['message']."";
	}
}

$source_name = 'vectorDB';
$login = 'sa';
$password = '123';
$connect = odbc_connect( $source_name, $login, $password );

if( !$connect ) {
	debug_to_console( "connect error: " . odbc_errormsg() );
}
else {
	debug_to_console( "connect ok" );
}


// $connectionInfo = array( "Database"=>$db_name, "UID"=>$login, "PWD"=>$password,
// 	"CharacterSet"  => 'UTF-8' );
// 	
// debug_to_console( "trying to connect..." );
// 
// $version = phpversion();
// debug_to_console( "PHP version = " . $version );
// 
// $mssql_conn = sqlsrv_connect( $server, $connectionInfo );
// debug_to_console( "after connect..." );
// if( $mssql_conn === false ) {
// 	debug_to_console( "failed to connect..." ); 
// 	die( FormatErrors( sqlsrv_errors() ) ); 
// }
// 
// var_dump( $mssql_conn );
?>