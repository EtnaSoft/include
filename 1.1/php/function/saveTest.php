<?php
$obj = new stdClass();
$obj->error = 1;
$POST = json_decode(file_get_contents("php://input"));
if(isset($POST->test)){
    session_start();
    $_SESSION['test']=$POST->test;
    $obj->error = 0; 
}
print(json_encode($obj));
mysql_close($db);

?>