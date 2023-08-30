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

	$query = $conn->prepare("SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id = ? ORDER BY p.firstName ");

	$query->bind_param("i", $_REQUEST['id']);

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