<?php
    if(isset($_POST['cosa'])){
      include('../../config.php');
              //$row['url']=str_replace("big","small",$row['url']);
              $obj = new stdClass();
              $obj->result="0";
              $obj->error = 0;
              $idtype=$_POST['idCosa'];
              $type=$_POST['cosa'];
              $pagamento=$_POST['pagamento'];
              $date=date('Y-m-d H:i:s');
              if($type=="ordine"){

                      if($_POST['newStato']==2){
                        mysql_query("UPDATE ecommerceordini SET stato='2' WHERE id=".$idtype." ");
                        $sqlprodotti=mysql_query("SELECT idprodotto,quantita FROM ecommerceordinixprodotti WHERE idordine=$idtype");
                        while($rowprodotti=mysql_fetch_assoc($sqlprodotti)){
                          //quantita in questo momento
                          $sqldisp=mysql_query("SELECT disponibilita FROM ecommerceprodotti WHERE id=$rowprodotti[idprodotto]");
                          $rowdispo=mysql_fetch_row($sqldisp);
                          //nuova disponibilita'
                          $newdisp=$rowdispo[0]-$rowprodotti['quantita'];
                          mysql_query("UPDATE ecommerceprodotti SET disponibilita='$newdisp' WHERE id=$rowprodotti[idprodotto]");
                          mysql_query("UPDATE ecommerceordini SET nuovo='0' WHERE id=$idtype");
                        }
                        echo("1");
                      }
                      if($_POST['newStato']==3){
                        mysql_query("UPDATE ecommerceordini SET stato='3' , infospedizione='' , identificativospedizione='".format_testo($_POST['num'])."', dataspedizione='".format_testo(data_adb($_POST['quando']))."' WHERE id=$idtype");
                        echo("1");
                      }
                      if($_POST['newStato']==4){
                        mysql_query("UPDATE ecommerceordini SET stato='4' WHERE id=$idtype");
                        mysql_query("INSERT INTO ecommercefeedback (idattivita,type,idtype,voto,descrizione) VALUES ('','ordine','$idtype','$_POST[voto]','".format_testo($_POST['feedbackcomment'])."') ");
                        echo("1");
                      }

              }
              if($type=="prenotazione"){

                      if($_POST['newStato']==2){
                        mysql_query("UPDATE prenotazioni SET stato='2' WHERE id=".$idtype." ");
                        echo("1");
                      }
                      if($_POST['newStato']==3){
                        mysql_query("UPDATE prenotazioni SET stato='3'  WHERE id=$idtype");
                        echo("1");
                      }
                      if($_POST['newStato']==4){
                        mysql_query("UPDATE prenotazioni SET stato='4' WHERE id=$idtype");
                        mysql_query("INSERT INTO ecommercefeedback (idattivita,type,idtype,voto,descrizione) VALUES ('','$type','$idtype','$_POST[voto]','".format_testo($_POST['feedbackcomment'])."') ");
                        echo("1");
                      }

              }


    }

    mysql_close($db);
?>




