<?php
$obj = new stdClass();
$obj->error = 0;
session_start();
$POST = json_decode(file_get_contents("php://input"));
$obj->checkin = $_SESSION['checkin'];
$obj->checkout = $_SESSION['checkout'];
print(json_encode($obj));
mysql_close($db);

?>