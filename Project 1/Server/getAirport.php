<?php
    $username = "sajid79";
    $iso_a2 = $_GET['iso_a2'];
    $url = file_get_contents("https://coding.itcareerswitch.co.uk/leaflet/getAirports.php?iso=".$iso_a2);
    if ($url === false) {
        echo "Failed to fetch data.";
    } else {
        echo json_encode($url);
    }
?>
