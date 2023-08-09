<?php
require('config.php');
ini_set('display_errors', 'On');

// Check if latitude and longitude are provided
if (isset($_GET['lat']) && isset($_GET['lon'])) {
    $lat = $_GET['lat'];
    $lon = $_GET['lon'];

    $api_url =  "http://api.weatherapi.com/v1/forecast.json?key={$COUNTRY_WEATHER_API_KEY}&q={$lat},{$lon}&days=5";
    $response = file_get_contents($api_url);

    if ($response !== false) {
        header('Content-Type: application/json');
        echo $response;
    } else {
        $error_response = array(
            'error' => 'Failed to fetch weather data.',
        );
        header('Content-Type: application/json');
        echo json_encode($error_response);
    }
} else {
    $error_response = array(
        'error' => 'Latitude and longitude are required parameters.',
    );

    header('Content-Type: application/json');
    echo json_encode($error_response);
}
?>
