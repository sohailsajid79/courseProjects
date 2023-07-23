<?php
require('config.php');
$baseCurrency = "USD";
$quoteCurrency = $_GET['quoteCurrency'];
$amount = $_GET['amount'];
$apiUrl = "https://v6.exchangerate-api.com/v6/{$EXCHANGERATE_API_KEY}/pair/{$baseCurrency}/{$quoteCurrency}/{$amount}";

$response = file_get_contents($apiUrl);

if ($response === false) {
    // Handle the error if the request fails
    echo "Failed to fetch exchange rate.";
} else {
    $data = json_decode($response, true);
    
    if ($data['result'] === 'success') {
        $fromCurrency = $data['base_code'];
        $toCurrency = $data['target_code'];
        $exchangeRate = $data['conversion_rate'];
        $convertedAmount = $data['conversion_result'];
        
        echo "Converted Amount: {$amount} {$fromCurrency} = {$convertedAmount} {$toCurrency}\n";

    } else {
        echo "API request failed: {$data['error']}";
    }
}
?>
