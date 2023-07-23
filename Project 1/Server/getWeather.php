<?php
require('config.php');
ini_set('display_errors', 'On');

// Check if latitude and longitude are provided
if (isset($_GET['lat']) && isset($_GET['lon'])) {
    $lat = $_GET['lat'];
    $lon = $_GET['lon'];

    // Build the API URL with latitude, longitude, and API key
    $api_url =  "http://api.weatherapi.com/v1/forecast.json?key={$COUNTRY_WEATHER_API_KEY}&q={$lat},{$lon}&days=5";

    // Make the API request
    $response = file_get_contents($api_url);

    // Check if the API request was successful
    if ($response !== false) {
        // Set the appropriate content type for JSON response
        header('Content-Type: application/json');
        // Echo the JSON response
        echo $response;
    } else {
        // If there was an error fetching data from the API, create an error response
        $error_response = array(
            'error' => 'Failed to fetch weather data.',
        );

        // Set the appropriate content type for JSON response
        header('Content-Type: application/json');
        // Echo the JSON error response
        echo json_encode($error_response);
    }
} else {
    // If latitude and longitude are not provided, create an error response
    $error_response = array(
        'error' => 'Latitude and longitude are required parameters.',
    );

    // Set the appropriate content type for JSON response
    header('Content-Type: application/json');
    // Echo the JSON error response
    echo json_encode($error_response);
}
?>
