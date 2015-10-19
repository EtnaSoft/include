<?php
$obj = new stdClass();
$obj->error = 1;
$obj->goToUrl = "msg";
$POST = json_decode(file_get_contents("php://input"));
if(isset($POST->typePage)){
      session_start(); include('../../config.php');
      $fotosel=$POST->id;
      $type=$POST->typePage;
      $id=$POST->idPage;
      $sqlimmrul="";
      $imm="imm";
      if($type=="famiglie"){ $sqlimmrul=", immurl='$imm' "; }
      if($type=="prodotto" || $type=="madeinsicily"){ $type="ecommerceprodotti"; }
      if($type=="evento" ){ $type='eventi'; }
      if($type=="attivitacommerciali" || $type=="attivita" ){ $type='oggetti'; }
      if($type=="risorsa" ){ $type='territorio'; }
      if($type=="ricette" || $type=="ricetta" ){ $type='ricette'; }
      if($type=="alloggi" ){ $type='oggettixcamere'; }
      if($type=="comune" ){ $type='comuni'; $imm="avatar"; }
      if($type=="percorso" || $type=="percorsi" || $type=="itinerari"  ){ $type='percorso'; }
      if($type=="specie" ){ $type='specie'; }
      if($type=="page" ){
            $type='urlpage';
            if($POST->cosa=="video"){ $imm="video"; }
      }

      $sql=mysql_query("UPDATE $type SET $imm='$fotosel' $sqlimmrul  WHERE id=$id")or die(mysql_error());
      if(@$sql){
            if($type=="urlpage" ){
                $sql=mysql_query("UPDATE $type SET header='".$POST->cosa."'  WHERE id=$id")or die(mysql_error());
            }
            $obj->error = 0;
      }
}
print(json_encode($obj));
mysql_close($db);

?>
