<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// WikipediaSearch API 
$url = 'http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=' . $_REQUEST['city'] . '&maxRows=1&username=sajid79&style=full';

// Initialize Curl 
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);

curl_close($ch);
	
$decode = json_decode($result, true);

$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['geonames'];
	
	header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($decode);


