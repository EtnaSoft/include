<?php
session_start(); include('../../config.php');

$POST = json_decode(file_get_contents("php://input"));

$obj = new stdClass();
$obj->error = 1;
$obj->goToUrl = "msg";

$action=$_GET['action'];
$carrello = new carrello($POST->session->idUserSession);

$idCarrello = $carrello->getId();
$obj->idCart = $idCarrello;

if($action=="getCart"){
        $obj->error = 0;
        $obj->data = $carrello->getArrayItem();
        $obj->total = $carrello->getTotal();
}

if($action=="addItem"){
        if($carrello->addItem($POST->item->id,$POST->item->qtn)){
            $obj->error = 0;
        }
}
if($action=="delItem"){
        if($carrello->delItem($POST->item->id)){
            $obj->error = 0;
        }
}
if($action=="updateQtn"){
        foreach ( $POST->item AS $item ){
            if($carrello->refItem($item->idprodotto,$item->quantita)){
                $obj->error = 0;
            }
        }
}



print(json_encode($obj));
mysql_close($db);
?>
