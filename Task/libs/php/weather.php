<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$north = $_GET['north'];
$south = $_GET['south'];
$east = $_GET['east'];
$west = $_GET['west'];

// weather API 
$url = 'http://api.geonames.org/weatherJSON?formatted=true&north=' . $north . '&south=' . $south . '&east=' . $east . '&west=' . $west . '&username=sajid79&style=full';

// Initialize Curl 
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);

curl_close($ch);
	
$decode = json_decode($result, true);
	
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($decode);


