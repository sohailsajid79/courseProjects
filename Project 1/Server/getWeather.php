<?php
require('config.php');
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$country_code = strtolower($_GET['country_code']);
$country_name = $_GET['country_name'];

// get Coordinates
$url = 'https://api.opencagedata.com/geocode/v1/json?q='.urlencode($country_name).'&key=' 
. $COUNTRY_COORDINATES_API_KEY."&countrycode=".$country_code;
$url .= "&pretty=1"; 
$url .= "&no_dedupe=1";  
$url .= "&limit=1";  
$coordinates = curlCoordinatesRequest($url,'GET');

// get Forecast
$weather_url = 'api.openweathermap.org/data/2.5/weather?';
$weather_url .= "lat=".$coordinates['lat']; 
$weather_url .= "&lon=".$coordinates['lng'];
$weather_url .= "&appid=".$COUNTRY_WEATHER_API_KEY;  
$forecast = curlRequest($weather_url,'GET');
echo json_encode($forecast);

function curlCoordinatesRequest($url, $method = "GET", $params = [])
{
    $coordinates_lat_lng['lat'] = null;
    $coordinates_lat_lng['lng'] = null;
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $method,
    ));
    $response = curl_exec($curl);
    $response_data = curl_errno($curl) ? [] : json_decode($response);
    if (!curl_errno($curl)) {
        $coordinates = isset($response_data->results[0]->geometry) ? $response_data->results[0]->geometry : [];
        $coordinates_lat_lng['lat'] = isset($coordinates->lat) ? $coordinates->lat : null;
        $coordinates_lat_lng['lng'] = isset($coordinates->lng) ? $coordinates->lng : null;
        return $coordinates_lat_lng;
    } 
    curl_close($curl);
    return $coordinates_lat_lng;
}
function curlRequest($url, $method = "GET", $params = [])
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        // CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $method,
    ));
    $response = curl_exec($curl);
    $response_data = curl_errno($curl) ? (object)[] : json_decode($response);
    if (curl_errno($curl)) {
        $response_data = ['status' => false, 'message' => curl_error($curl)];
    } else {
        $response_data = ['status' => true, 'data' => $response_data];
    }
    curl_close($curl);
    return (object)$response_data;
}
?>

