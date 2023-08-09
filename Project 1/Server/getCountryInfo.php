<?php
    try {
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $username = $_GET['username'];
        $timezoneUrl = "http://api.geonames.org/timezoneJSON?lat=" . $lat . "&lng=" . $lon . "&username=" . $username;
    
        header('Access-Control-Allow-Origin: *');
        $timezoneData = file_get_contents($timezoneUrl);
    
        if ($timezoneData === false) {
            throw new Exception("Failed to fetch data from the Geonames API.");
        }
        echo $timezoneData;
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(array('error' => $e->getMessage()));
    }
?>
