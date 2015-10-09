<?php
 
include("config.php");
 
// $q = 'SELECT * FROM wagon_pos wp1 left join wagon on wp1.wagon_id = wagon.id' .
// 	' WHERE wp1.date = (SELECT max(wp2.date) FROM wagon_pos wp2' .
// 	' where wp2.wagon_id = wp1.wagon_id)' .
// 	' order by wp1.wagon_id';

$q = 'select wp1.*, wagon.* from wagon_pos wp1 
	left join wagon on (wagon.id = wp1.wagon_id)
	join 
	(select wagon_id, max(date) as date from wagon_pos group by wagon_id) as wp2 
	on wp1.wagon_id = wp2.wagon_id and wp1.date = wp2.date order by wp1.wagon_id';

$result = mysql_query($q);
$json_result = array();

$gps_point = array();
if(mysql_num_rows($result) > 0) {
	while ($mar = mysql_fetch_array($result) ) {
		$json_result[ $mar['wagon_id'] ] = array(
			'name'  => $mar[ 'name' ] == null ? "unknown_wagon" : $mar[ 'name' ],
			'date' => $mar['date'],
			'lat' => $mar['lat'] + 0.005,
			'lng' => $mar['lng'] - 0.011
		);
	}
}
else {
	echo "<p>Вагонов не обнаружено</p>";
}
 
$data = array();
$data['data'] = $json_result;

echo json_encode($data, JSON_FORCE_OBJECT);
?>