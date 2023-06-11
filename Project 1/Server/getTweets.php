<?php
require('config.php');
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$country_name = $_GET['country_name'];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://twitter135.p.rapidapi.com/Search/?q=' . urlencode($country_name) . '&count=10',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: twitter135.p.rapidapi.com",
        "X-RapidAPI-Key:" . $TWITTER_API_KEY  // Includes the API key header
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    $error = "cURL Error #:" . $err;
    echo json_encode(array("error" => $error)); 
} else {
    echo $response; 
}
