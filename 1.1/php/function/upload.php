<?php

$obj = new stdClass();
$obj->error = 1;
$obj->goToUrl = "";
$obj->data  = new stdClass();
session_start(); include('../../config.php');





$typeUpload=$_POST['typeUpload'];
$type=$_POST['type'];
$id=$_POST['id'];

$filename = $_FILES['file']['name'];

$upload = new Upload($typeUpload,$type,"");

//$sqlFoto=mysql_query("SELECT * FROM foto");
/*while($rowFoto=mysql_fetch_assoc($sqlFoto)){
  $from = "../public/upload/foto/big3/".$rowFoto['imm'];
  //$destination = '../public/upload/foto/small/' . $rowFoto['imm'];
  //$upload->compress($from,$destination,"small");


  $destination = '../public/upload/foto/big/' . $rowFoto['imm'];
  $upload->compress($from,$destination,"big");

  //$destination = '../public/upload/foto/sfondi/' . $rowFoto['imm'];
  //$upload->compress($from,$destination,"sfondi");

}*/



$col=$upload->getColMedia();
if(empty($col)){ $col="idcontenuto"; //un campo a caso, tanto per non far ritornare errore
}


$filename="$type$id-".$filename;

if($typeUpload=="video"){
    $destination = '../../public/upload/video/' . $filename;
    if(@move_uploaded_file( $_FILES['file']['tmp_name'] , $destination )){
      $res=mysql_query("INSERT INTO video (stato,type,$col,url) VALUES('0','video','$id','$filename')")or die(mysql_error());
    }
}
elseif($typeUpload=="foto"){

    $destination = '../../public/upload/foto/sfondi/' . $filename;
    $success = $upload->compress($_FILES['file']['tmp_name'],$destination,"sfondi");

    $destinationBig = '../../public/upload/foto/big/' . $filename;
    $success = $upload->compress($_FILES['file']['tmp_name'],$destinationBig,"big");

    $destinationSmall = '../../public/upload/foto/small/' . $filename;
    $success = $upload->compress($_FILES['file']['tmp_name'],$destinationSmall,"small");

    if(@$success){ $res=mysql_query("INSERT INTO foto (stato,$col,imm) VALUES('0','$id','$filename')")or die(mysql_error()); }
}


if(@$res){
    $obj->error = 0;
    $obj->data->id = mysql_insert_id();
    $obj->data->idType = $obj->data->id;
    $obj->data->type = $typeUpload;
    $obj->data->url = $filename;
    //mi faccio ritornare il valore così come mi ritorna su Discovery.php
    if($typeUpload=="video"){
        $obj->data->video = new stdClass();
        $obj->data->video->src = HTTP."/public/upload/video/".$filename;
    }
    if($typeUpload=="foto"){
        $obj->data->foto = new stdClass();
        $obj->data->foto->src = HTTP."/public/upload/foto/big/".$filename;
    }
}

print(json_encode($obj));
mysql_close($db);

?>