<?php

$server = '192.168.1.1';
$login = 'sa';
$password = '123';
$db_name = 'vector';

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

$connectionInfo = array( "Database"=>$db_name, "UID"=>$login, "PWD"=>$password,
	"CharacterSet"  => 'UTF-8' );
	
$mssql_conn = sqlsrv_connect( $server, $connectionInfo );
if( $mssql_conn === false ) { 
	die( FormatErrors( sqlsrv_errors() ) ); 
}

//var_dump( $mssql_conn );
?>