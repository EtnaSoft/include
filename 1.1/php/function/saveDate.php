<?php
$obj = new stdClass();
$obj->error = 1;
$POST = json_decode(file_get_contents("php://input"));
if(isset($POST->checkin)){
    session_start();
    $_SESSION['checkin']=$POST->checkin;
    $_SESSION['checkout']=$POST->checkout;
    $obj->error = 0;
    $obj->data = $POST->checkin;
}
print(json_encode($obj));
mysql_close($db);

?>