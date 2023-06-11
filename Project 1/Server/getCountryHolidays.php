
<?php
require('config.php');
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$url = $_POST['url'];
$country_code = $_POST['country_code'];
if(isset($_POST['data_type']) && ($_POST['data_type'] == 'holiday')){
    $current_year = date('Y');
    $params = [
        "api_key" => $COUNTRY_HOLIDAYS_API_KEY,
        "country" => $country_code,
        'type' => 'national',
        'year' => $current_year,
    ];
    $response = curlRequest($url,'GET',$params);
    return json_encode($response);
} 
function curlRequest($url, $method = "GET", $params = [])
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url."?".http_build_query($params),
        CURLOPT_RETURNTRANSFER => false,
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

