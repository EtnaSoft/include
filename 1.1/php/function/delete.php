<?php session_start();
$obj = new stdClass();
$obj->result="0";
$obj->error = 1;
$obj->goToUrl = "closeDialog";
$obj->html = "";
$POST = json_decode(file_get_contents("php://input"));
if(!isset($POST->idType)){
    include('page_error.php');
}
else{
            include('../../config.php');
            $type=$POST->type;
            $id=$POST->idType;
            if($type=="camera" || $type=="alloggi"){  $type="oggettixcamere";  }
            if($type=="commentsfoto"){  $type="fotoxcommenti";  }
            if($type=="variantecamera"){  $type="oggettixcamerexvarianti";  }
            if($type=="regola" || $type=="regole"){  $type="oggettixcamerexregole";  }
            if($type=="notizia" || $type=="notizie"){  $type="notizie";  }
            if($type=="itemcarrello" ){  $type="ecommercecarrelloxprodotti";  }
            if($type=="prodotto" || $type=="madeinsicily" ){  $type="ecommerceprodotti";  }
            if($type=="regolapagamento" ){  $type="ecommerceregolepagamento";  }
            if($type=="regolatrasporto" ){  $type="ecommerceregoletrasporto";  }
            if($type=="ordine" ){  $type="ecommerceordini";  }
            if($type=="evento"){  $type="eventi";  }
            if($type=="review"){  $type="comments";  }
            if($type=="image/jpeg"){  $type="foto";  }
            if($type=="video/mp4"){  $type="video";  }
            if($type=="percorso" || $type=="percorsi" || $type=="itinerari"){ $type="percorso"; }
            if($type=="contenuticomuni"){
                    $sqlcontenuto=mysql_query("SELECT idcontenuto FROM $type WHERE id=$id");
                    $numcontenuto=mysql_num_rows($sqlcontenuto);
                    if($numcontenuto>0){
                      $rowcontenuto=mysql_fetch_row($sqlcontenuto);
                      //il contenuto eliminato è la scheda principale ( titolo,tipologia,ecc.. )
                      if($rowcontenuto[0]==0){
                         $sqlcontenuti=mysql_query("SELECT * FROM $type WHERE idcontenuto=$rowcontenuto[0]");
                         while($rowcontenuti=mysql_fetch_assoc($sqlcontenuti)){
                              mysql_query("DELETE FROM $type WHERE id=$rowcontenuti[id]");
                               $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                         }

                      }else{
                        //il contenuto è una singola scheda
                         $sqlcontenuti2=mysql_query("SELECT * FROM $type WHERE idcontenuto=$rowcontenuto[0]");
                         $numcontenuto=mysql_num_rows($sqlcontenuti2);
                         if($numcontenuto==1){
                              mysql_query("DELETE FROM $type WHERE id=$rowcontenuto[0]");
                               $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                         }

                      }

                    }
                }

                if($type=="bacheca"){
                    $sqlimmaginebacheca=mysql_query("SELECT imm FROM bacheca WHERE id=$id");
                    $rowimmaginebacheca=mysql_fetch_row($sqlimmaginebacheca);
                    if($rowimmaginebacheca[0]!=0){
                        elimina_foto($rowimmaginebacheca[0]);
                    }
                }


                if($type=="oggettixcamere" || $type=="alloggi"){

                    // mysql_query("DELETE FROM oggettixservizi WHERE idcamera=$id");
                    //mysql_query("DELETE FROM oggettixcamerexprezzi WHERE idcamera=$id");
                    //mysql_query("DELETE FROM oggettixcamerexvarianti WHERE idcamera=$id");
                    //$resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                    $obj->html = "<div class='divHome'><h3>Non puoi eliminare questo alloggio, ci sono delle prenotazioni in corso</h3><button class=\"done\">Ok</button><div class='row'></div></div>";
                }
                if($type=="percorso" ){
                    mysql_query("DELETE FROM percorsoxrisorse WHERE idpercorso=$id");
                    $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                    //mysql_query("DELETE FROM url WHERE (type='percorso' OR type='percorsi') AND idtype=$id");
                }
                if($type=="notizia" || $type=="notizie"){
                    mysql_query("DELETE FROM notiziextipi WHERE idnotizia=$id");
                    $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                    //mysql_query("DELETE FROM url WHERE (type='notizie' OR type='notizia') AND idtype=$id");
                }
                if($type=="oggettixcamerexvarianti"){
                    mysql_query("DELETE FROM oggettixservizi WHERE idvariante=$id");
                    mysql_query("DELETE FROM oggettixcamerexprezzi WHERE idvariante=$id");
                    $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                }
                if($type=="prenotazioni" || $type=="prenotazione"){
                    mysql_query("DELETE FROM prenotazionixcamere WHERE idprenotazione=$id");
                    $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                }
                if($type=="servizio" ){
                    mysql_query("DELETE FROM tipixservizi WHERE idservizio=$id");
                    mysql_query("DELETE FROM oggettixservizistruttura WHERE idservizio=$id");
                    $resdel2=mysql_query("DELETE FROM oggettiservizi WHERE id=$id")or die(mysql_error());
                }
                if($type=="attivita"){    
                    $resdel2=mysql_query("DELETE FROM oggetti WHERE id=$id")or die(mysql_error());
                    $resdel2=mysql_query("DELETE FROM oggettixfamiglie  WHERE idoggetto=$id");
                    $resdel2=mysql_query("DELETE FROM oggettixservizi  WHERE idoggetto=$id");
                    $resdel2=mysql_query("DELETE FROM oggettixservizistruttura  WHERE idattivita=$id");
                    $resdel2=mysql_query("DELETE FROM oggettixtipologia  WHERE idattivita=$id");
                    $resdel2=mysql_query("DELETE FROM url  WHERE type='attivita' AND id=$id");

                    //mysql_query("DELETE FROM url WHERE (type='percorso' OR type='percorsi') AND idtype=$id");
                }

                if($type=="risorsa" || $type=="territorio"){
                        //quando elimino una risorsa : elimino le associazione delle foto con questo id - elimino le associazioni come sfondo - infine elimino la risorsa
                        $re1=mysql_query("UPDATE foto SET idrisorsa='' WHERE idrisorsa=$id");
                        $re2=mysql_query("DELETE FROM comunexsfondo WHERE idrisorsa=$id AND idcomune=0 AND iduser=0");
                        if(@$re1 && @$re2){
                            $resdel2=mysql_query("DELETE FROM territorio WHERE id=$id");
                            if(@$resdel2){
                               controllopagineinsesistenti();
                            }
                        }
                }
                 //se sto eliminando un pacchetto, non lo elimino, lo passo allo stato 0
                 if($type=="pacchetti" || $type=="offerte" || $type=="offerta" ){
                      $type="offerte";
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                 }
                 //se sto eliminando un prodotto
                 if($type=="prodotto" || $type=="prodotti" || $type=="ecommerceprodotti" ){ $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error()); }
                 if($type=="ecommerceregolepagamento" || $type=="ecommerceregoletrasporto" || $type=="ecommercecarrelloxprodotti" ){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                 }
                 if($type=="ecommerceordini"  ){
                      $resdel2=mysql_query("UPDATE  $type SET stato='0', dataannullamento='".date('Y-m-d H:i:s')."' WHERE id=$id")or die(mysql_error());
                      //$resdel2=mysql_query("DELETE FROM ecommerceordinixprodotti WHERE idordine=$id")or die(mysql_error());
                 }
                 if($type=="comunixfrazioni"  ){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                 }
                 if( $type=="eventi"  ){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                      $resdel2=mysql_query("DELETE FROM eventixtipi WHERE idevento=$id")or die(mysql_error());
                 }
                 if($type=="streaming" || $type=="video" || $type=="ricette"  ){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                 }

                 if($type=="fotoxcommenti"){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                 }
                 if($type=="foto"){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                      //$resdel2=mysql_query("DELETE FROM fotoxcommenti WHERE idfoto=$id")or die(mysql_error());
                 }
                 if($type=="specie"){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                      //$resdel2=mysql_query("DELETE FROM fotoxcommenti WHERE idfoto=$id")or die(mysql_error());
                 }
                 if($type=="comments"){
                      $resdel2=mysql_query("DELETE FROM $type WHERE id=$id")or die(mysql_error());
                      //$resdel2=mysql_query("DELETE FROM fotoxcommenti WHERE idfoto=$id")or die(mysql_error());
                 }



                if(@$resdel2){
                       $obj->error = 0;
                       if($type!="comunixsuper" && $type!="percorso" && $type!="ecommerceregolepagamento" &&  $type!="ecommerceregoletrasporto" &&  $type!="ecommercecarrelloxprodotti" && $type!="notizia" && $type!="oggettixcamere" && $type!="fotoxcommenti"  && $type!="pacchetti"  && $type!="offerte"  && $type!="oggettixcamerexregole" && $type!="prenotazioni" && $type!="oggettixcamerexvarianti" && $type!="oggettixcamere" && $type!="news" && $type!="bacheca" && $type!="streaming"){
                            //reg($_SESSION['iduser'],$_SESSION['iduser'],'delete',$type,$type,$id,'','','');
                       }

                }

}
print(json_encode($obj));
mysql_close($db);
?>


