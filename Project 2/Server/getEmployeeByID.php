<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');
	

	// SQL does not accept parameters and so is not prepared
	$query = $conn->prepare("SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.id as departmentId, d.name as department, l.id as locationId, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.id = ? ");
    $query->bind_param("i", $_REQUEST['id']);

	$query->execute();
	
	if ($query == false) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}
   
    $result = $query->get_result();
   	$data = mysqli_fetch_object($result);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>