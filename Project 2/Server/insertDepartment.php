<?php
	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	$executionStartTime = microtime(true);

	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');
	
	$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)');
	$query->bind_param("si", $_REQUEST['department'], $_REQUEST['location']);
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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);
	echo json_encode($output); 
?>