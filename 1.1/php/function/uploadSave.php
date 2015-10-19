<?php
$obj = new stdClass();
$obj->error = 1;
$obj->goToUrl = "";
$obj->data  = new stdClass();
session_start(); include('../../config.php');
$POST = json_decode(file_get_contents("php://input"));


if($POST->files->type=="youtube"){
        $upload = new Upload("video",$POST->data->type,"");
        $col=$upload->getColMedia();
        if(empty($col)){ $col="idcontenuto"; /*un campo a caso, tanto per non far ritornare errore */ }

        //caricando direttamente il video qui ho bisogno di aggiornare i dati del video in questo caso = idattivita, etc..
        $res=mysql_query("INSERT INTO video (stato,titolo,descrizione,$col,url,frame,type) VALUES('2','".format_testo_decode($POST->files->title)."','".format_testo_decode($POST->files->desc)."','".$POST->data->id."','".$POST->files->youtube->url."','".$POST->files->youtube->url."','youtube')")or die(mysql_error());
}else{
        //scorro i file caricati e aggiorno le informazioni, possono essere piu di uno, in caso della foto, ma in qualunque caso è un array, in $files->result->data->id ho l'id del file che mi faccio ritornare quando carico il file in upload.php
        //in questo caso, ho già nell'elemento i dati di associazione = idattivita, idevento etc..
        foreach($POST->files AS $files){
          if(!$files->upload->aborted){
              if($files->result->data->type=="foto"){
                    $res=mysql_query("UPDATE foto SET stato='2', descrizione='".format_testo_decode($POST->files->desc)."' WHERE id='".$files->result->data->id."' ")or die(mysql_error());
              }
              elseif($files->result->data->type=="video"){
                    $res=mysql_query("UPDATE video SET stato='2',titolo='".format_testo_decode($POST->files->title)."', descrizione='".format_testo_decode($POST->files->desc)."' WHERE id='".$files->result->data->id."' ")or die(mysql_error());
              }
          }
        }
}
if(@$res){
    $obj->error = 0;
}

print(json_encode($obj));
mysql_close($db);

?>