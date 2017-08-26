<?php
    $city = $_GET['city'];
    $url = 'http://api.map.baidu.com/telematics/v3/weather?location='.$city.'&output=json&ak=Your Baidu DevAK';
	$text = file_get_contents($url);
	echo $text;
?>