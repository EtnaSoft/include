<?php
$obj = new stdClass();
$obj->error = 1;
$POST = json_decode(file_get_contents("php://input"));
if(isset($POST->language)){
    session_start();
    $_SESSION['lan']=$POST->language;
    $langtbl="";  if($_SESSION['lan']!="it"){ $langtbl="_".$l; } $_SESSION['lanTable']=$langtbl;
    $obj->error = 0;
}
print(json_encode($obj));
mysql_close($db);

?>