<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');


	// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare("SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel as p LEFT JOIN department as d ON d.id = p.departmentID LEFT JOIN location as l ON d.locationID = l.id WHERE CONCAT(p.firstName, ' ', p.lastName) LIKE ? ORDER BY p.firstName;");
	$keyword = '%' . $_REQUEST['keyword'] . '%';
	$query->bind_param("s",  $keyword);

	$query->execute();
	
	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}
    
	$result = $query->get_result();

   	$personnel = [];

	while ($row = mysqli_fetch_assoc($result)) {
		array_push($personnel, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $personnel;
	
	mysqli_close($conn);
	echo json_encode($output); 
?>