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

// Call timezone_GeoName API
$timezone_info = getTimezoneInfo($coordinates['lat'], $coordinates['lng']);
if (!$timezone_info->status) {
    $response = array(
        "status" => "error",
        "message" => $timezone_info->message
    );
} else {
    $timezone = $timezone_info->data->timezoneId;
    $gmtOffset = $timezone_info->data->gmtOffset;
    $currentTime = $timezone_info->data->time;
    $longitude = $timezone_info->data->lng;
    $latitude = $timezone_info->data->lat;
    $sunrise = $timezone_info->data->sunrise;
    $sunset = $timezone_info->data->sunset;

    // Prepare response data
    $response = array(
        "status" => "success",
        "data" => array(
            "timezoneId" => $timezone,
            "gmtOffset" => $gmtOffset,
            "currentTime" => $currentTime,
            "sunrise" => $sunrise,
            "sunset" => $sunset
        )
    );

    // Log the result
    error_log(json_encode($response));
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($response);

function curlCoordinatesRequest($url, $method = "GET", $params = []) {
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
    $response_data = curl_errno($curl) ? [] : json_decode($response, true);
if (!curl_errno($curl) && isset($response_data['results'][0]['geometry'])) {
    $coordinates_lat_lng['lat'] = $response_data['results'][0]['geometry']['lat'];
    $coordinates_lat_lng['lng'] = $response_data['results'][0]['geometry']['lng'];
    return $coordinates_lat_lng;
}

    curl_close($curl);
    return [];
}

function getTimezoneInfo($latitude, $longitude) {
    global $COUNTRY_COORDINATES_API_KEY, $COUNTRY_HOLIDAYS_API_KEY;
    $username = 'sajid79';
    $timezone_GeoName_url = "http://api.geonames.org/timezoneJSON?formatted=true";
    $timezone_GeoName_url .= "&lat=" . $latitude;
    $timezone_GeoName_url .= "&lng=" . $longitude;
    $timezone_GeoName_url .= "&username=" . $username . "&style=full";
    $response = curlRequest($timezone_GeoName_url, 'GET');
    return $response;
}

function curlRequest($url, $method = "GET", $params = []) {
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CUSTOMREQUEST => $method,
    ));
    $response = curl_exec($curl);
    $response_data = curl_errno($curl) ? (object)[] : json_decode($response);
    if (curl_errno($curl)) {
        $response_data = (object)array('status' => false, 'message' => curl_error($curl));
    } else {
        $response_data = (object)array('status' => true, 'data' => $response_data);
    }
    curl_close($curl);
    return $response_data;
}
?>
