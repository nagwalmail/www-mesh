<?php
 
$sdb_name = "localhost";
$user_name = "root";
$user_password = "123";
$db_name = "mesh";
 
// ���������� � �������� ���� ������
if(!$link = mysql_connect($sdb_name, $user_name, $user_password))
{
  echo "<br>mysql_connect failed:<br>";
  echo mysql_error();
  
  exit();
}
 
// �������� ���� ������
if(!mysql_select_db($db_name, $link))
{
  echo "<br>mysql_select_db failed:<br>";
  echo mysql_error();
  
  exit();
}
 
mysql_query('SET NAMES utf8');

?>