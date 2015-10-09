<?php
 
include("config.php");
 
echo '<markers>', "\n";
$mesh_path = -1; 
$color_main = "#071928";
$color_station = "071928";
$q = 'SELECT mesh_point.*, way.* FROM mesh_point' .
	' LEFT JOIN way ON (way.id = mesh_point.way_id)' .
	' WHERE latitude < ' . $_GET['lat0'] . 
	' AND latitude > ' . $_GET['lat1'] . 
	' AND longitude > ' . $_GET['lon0'] .
	' AND longitude < ' . $_GET['lon1'] .
	' ORDER BY mesh_path_id';

$result = mysql_query($q);

if(mysql_num_rows($result) > 0) {
	while ($mar = mysql_fetch_array($result) ) {
		if( $mar['mesh_path_id'] != $mesh_path ) {
			if( $mesh_path != -1) {
				echo '</line>', "\n";
			}

			$mesh_path = $mar['mesh_path_id'];
			echo '<line color="#071928" width="1" id="' , $mar['mesh_path_id'] , '" way_num="' , $mar['way_num'] , '">\n';
		}

		echo '<point lat="' , $mar['latitude'] + 0.005 , '" lng="', $mar['longitude'] - 0.011 , '"/>\n';
	}

	echo '</line>', "\n";
}
else {
	echo "<p>Линий не обнаружено</p>";
}
 
echo '</markers>';
 
?>