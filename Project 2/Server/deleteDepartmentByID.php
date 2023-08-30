<?php
	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$placeholders = implode(',', array_fill(0, count($_REQUEST['departments']), '?'));

	$query = $conn->prepare("DELETE FROM department WHERE id IN ($placeholders)");

	$types = str_repeat('i', count($_REQUEST['departments']));
	$query->bind_param($types, ...$_REQUEST['departments']);

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