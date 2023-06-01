<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$country_code = strtolower($_GET['country_code']);
$country_name = $_GET['country_name']; 
$api_key = '498e4b11ada640dca187615cac3a761b'; 

//get Coordinates
$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . urlencode($country_name) . '&key=' . $api_key . "&countrycode=" . $country_code;
$url .= "&pretty=1";
$url .= "&no_dedupe=1";
$url .= "&limit=1";
$coordinates = curlCoordinatesRequest($url, 'GET');

// Get timezone information using GeoNames API
$username = 'sajid79'; // username
$url = "http://api.geonames.org/timezoneJSON?formatted=true&lat=" . $coordinates['lat'] . "&lng=" . $coordinates['lng'] . "&username=$username&style=full";
$timezone_info = curlRequest($url, 'GET');

echo "Timezone Info: ";
print_r($timezone_info);

if (!$timezone_info->status) {
    $response = array(
        "status" => "error",
        "message" => $timezone_info->message
    );
} else {
    $timezone = $timezone_info->data['timezoneId'];
    $gmtOffset = $timezone_info->data['gmtOffset'];
    $currentTime = $timezone_info->data['time'];
    $longitude = $timezone_info->data['lng'];
    $latitude = $timezone_info->data['lat'];
    $sunrise = $timezone_info->data['sunrise'];
    $sunset = $timezone_info->data['sunset'];

    // Prepare response data
    $response = array(
        "status" => "success",
        "data" => array(
            "timezoneId" => $timezone,
            "gmtOffset" => $gmtOffset,
            "currentTime" => $currentTime,
            "longitude" => $longitude,
            "latitude" => $latitude,
            "sunrise" => $sunrise,
            "sunset" => $sunset
        )
    );
}

// Log the result
error_log(json_encode($response));

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($response);

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
        CURLOPT_CUSTOMREQUEST => $method,
    ));
    $response = curl_exec($curl);
    $response_data = curl_errno($curl) ? (object)[] : json_decode($response, true);
    if (curl_errno($curl)) {
        $response_data = ['status' => false, 'message' => curl_error($curl)];
    } else {
        $response_data = ['status' => true, 'data' => $response_data];
    }
    curl_close($curl);
    return (object) $response_data;
}
?>
