<?php
require('config.php');
$countryCode = urlencode($_GET['countryCode']);
$url = "https://gnews.io/api/v4/search?q=example&lang=en&country={$countryCode}&max=5&apikey={$NEWS_API_KEY}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);
$articles = $data['articles'];

$response = array();
$response['articles'] = array();

for ($i = 0; $i < min(5, count($articles)); $i++) {
    // Article properties
    $title = $articles[$i]['title'];
    $description = $articles[$i]['description'];
    $image = $articles[$i]['image'];
    $publishedAt = $articles[$i]['publishedAt'];
    $url = $articles[$i]['url'];

    // Create an array with the article information
    $articleData = array(
        'title' => $title,
        'description' => $description,
        'image' => $image,
        'publishedAt' => $publishedAt,
        'url' => $url
    );

    // Add the article data to the response
    $response['articles'][] = $articleData;
}

// Set the response header to JSON
header('Content-Type: application/json');

// Output the JSON response
echo json_encode($response);
?>
