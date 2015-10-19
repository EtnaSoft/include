<?php
$POST = json_decode(file_get_contents("php://input"));
    if(isset($POST->cosa)){
      include('../../config.php');
              //$row['url']=str_replace("big","small",$row['url']);
              $obj = new stdClass();
              $obj->error = 0;
              $obj->result="";
              $obj->numLike=0;
              $idusersession=$iduser=$POST->UserId;
              if(!empty($idusersession)){
                    $tipo=$POST->cosa;
                    $type=$POST->typeCosa;
                    $idtype=$POST->idCosa;
                    $date=date('Y-m-d H:i:s');
                    $idazione=$idtype;
                    $typeUrl=$type;
                    if($type=="dormire" || $type=="mangiare" || $type=="servizicomm"){
                        $type="attivita";
                    }

                    if($tipo=="vivoqui" || $tipo=="voglio" || $tipo=="statoqui"){
                          if($tipo=="vivoqui"){
                              $selectcontrollo=mysql_query("SELECT * FROM liked WHERE iduser=$iduser AND type='$type' AND idtype=$idtype ");
                              $numcontrollo=mysql_num_rows($selectcontrollo);
                              if($numcontrollo==0){
                                $obj->result=true;
                                $sqlinsert=mysql_query("INSERT INTO liked (iduser,type,idtype,datainserimento,tipo) VALUES ('$iduser','$type','$idtype','$date','$tipo')");
                                //reg($iduser,$iduser,$tipo,$type,$type,$idazione,'','','');
                              }
                              else{
                                $obj->result=false;
                                $sqlinsert=mysql_query("DELETE FROM liked WHERE iduser=$iduser AND tipo='$tipo'  AND type='$type' AND idtype=$idtype ");
                                mysql_query("DELETE FROM reg WHERE azione='$tipo' AND cosa='$type' AND nametable='$type' AND idazione='$idtype' AND iduser='$iduser' ");
                              }
                          }else{
                              $selectcontrollo2=mysql_query("SELECT * FROM liked WHERE iduser=$iduser AND tipo='$tipo' AND type='$type' AND idtype=$idtype  ");
                              $numcontrollo2=mysql_num_rows($selectcontrollo2);
                              if($numcontrollo2==0){
                                $obj->result=true;
                                $sqlinsert=mysql_query("INSERT INTO liked (iduser,type,idtype,datainserimento,tipo) VALUES ('$iduser','$type','$idtype','$date','$tipo')");
                                //reg($iduser,'',$tipo,$type,$type,$idazione,'','','');
                              }
                              else{
                                $obj->result=false;
                                $sqlinsert=mysql_query("DELETE FROM liked WHERE iduser=$iduser AND tipo='$tipo' AND type='$type' AND idtype=$idtype ");
                                mysql_query("DELETE FROM reg WHERE azione='$tipo' AND cosa='$type' AND nametable='$type' AND idazione='$idtype' AND iduser='$iduser' ");
                              }
                          }

                          $selectcontrollo1=mysql_query("SELECT count(DISTINCT(iduser)) FROM liked WHERE tipo='$tipo' AND type='$type' AND idtype=$idtype AND iduser!=0 ");
                          $numVoglio1=mysql_fetch_row($selectcontrollo1);
                          $obj->numLike=(int)$numVoglio1[0];

                    }elseif($tipo=="like"){
                          $selectcontrollo=mysql_query("SELECT * FROM fotoxvoto WHERE iduser=$iduser AND idfoto=$idtype");
                          $numcontrollo=mysql_num_rows($selectcontrollo);
                          if($numcontrollo==0){
                              $obj->result=true;
                              $sqlinsert=mysql_query("INSERT INTO fotoxvoto (iduser,idfoto,data) VALUES ('$iduser','$idtype','$date')")or die(mysql_error());
                              //reg($iduser,$iduser,'bellafoto','foto','foto',$idtype,'','','');
                          }
                          else{
                             $obj->result=false;
                             $sqlinsert=mysql_query("DELETE FROM fotoxvoto WHERE iduser=$iduser AND idfoto=$idtype");
                             mysql_query("DELETE FROM reg WHERE azione='bellafoto' AND cosa='foto' AND nametable='foto' AND idazione='$idtype' AND iduser='$iduser' ");
                          }
                          $selectcontrollo1=mysql_query("SELECT count(DISTINCT(iduser)) FROM fotoxvoto WHERE idfoto=$idtype");
                          $numVoglio1=mysql_fetch_row($selectcontrollo1);
                          $obj->numLike=(int)$numVoglio1[0];
                    }elseif($tipo=="veroe"){
                              $selectcontrollo2=mysql_query("SELECT * FROM liked WHERE iduser=$iduser AND tipo='$tipo' AND type='$type' AND idtype=$idtype  ");
                              $numcontrollo2=mysql_num_rows($selectcontrollo2);
                              if($numcontrollo2==0){
                                $obj->result=true;
                                $sqlinsert=mysql_query("INSERT INTO liked (iduser,type,idtype,datainserimento,tipo) VALUES ('$iduser','$type','$idtype','$date','$tipo')");
                                //reg($iduser,'',$tipo,$type,$type,$idazione,'','','');
                              }
                              else{
                                $obj->result=false;
                                $sqlinsert=mysql_query("DELETE FROM liked WHERE iduser=$iduser AND tipo='$tipo' AND type='$type' AND idtype=$idtype ");
                                mysql_query("DELETE FROM reg WHERE azione='$tipo' AND cosa='$type' AND nametable='$type' AND idazione='$idtype' AND iduser='$iduser' ");
                              }
                    }
              }else{
                     $obj->result=false;
              }

    }
    else{
       $obj->result=false;
    }
    print(json_encode($obj));
    mysql_close($db);
?>




