<?php
session_start();
$obj = new stdClass();
$obj->error = 1;
$obj->goToUrl = this;
$obj->result="";
$obj->numLike=0;
$obj->data = new stdClass();
$POST = json_decode(file_get_contents("php://input"));

   //$_SERVER['HTTP_X_FORWARDED_FOR']
	include "../../config.php";
	$idfacebook=0; if(isset($_POST['idfacebook'])){ $idfacebook= $_POST['idfacebook']; }
    $nome=format_testo_decode($POST->name);
    $cognome=format_testo_decode($POST->surname);
    $email=format_testo($POST->email);
	$password=md5($POST->password);
	$passwordrip=md5($POST->passwordrip);
    $sifacebook=0;

    $email_admin="info@maredeiciclopi.it";
    $idfacebook=$POST->idfacebook;
    $idgoogle=$POST->idgoogle;

    $idgoogle=0; if(isset($POST->idgoogle)){ $idgoogle= $POST->idgoogle; }
	$idfacebook=0; if(isset($POST->idfacebook)){ $_GET= $POST->idfacebook; }
    if($POST->password!=$POST->passwordrip){
        $obj->errorMsg=utf8_encode("Le password non coincidono");
    }else{
          $controllo2="SELECT email FROM anagrafe WHERE email='$email'";
          $res_controllo2=mysql_query($controllo2);
          $num_controllo2=mysql_num_rows($res_controllo2);
          if($num_controllo2!=0){
              $rows['success']=2;
              $rows['idUser']="";
              $rows['userEmail']="";
              $rows['userNome']="";
              $rows['userUsername']="";
              $rows['avatar']="";
              $output[]=$rows;
              $obj->errorMsg=utf8_encode(" '$email'<br> risulta già registrata");
          }else{
                  $insert="INSERT INTO anagrafe
                  (nome,cognome,password,email,stato_account,idfacebook,dataiscrizione)
                  VALUES('$nome','$cognome','$password','$email','1','$idfacebook','".date('Y-m-d H:i:s')."')";
                  $res33=mysql_query($insert) or die(mysql_error()."Errore nella registrazione, controlla di aver inseriti correttamente i campi, se il problema persiste contattaci.");
                  if(@$res33){

                          if($idfacebook!=0){
                                $sql2 = "SELECT codice,email,nome,cognome,addrisorsa,addcontenuto,addevento,addappuntamento,tipo,addfoto,t_comune,t_commerciali,t_ente,id_comune,verifica,amministrazione,t_traduzione,avatar FROM anagrafe WHERE idfacebook=$idfacebook ";
                            	$res = mysql_query($sql2)or die(mysql_error());
                            	$sifacebook= mysql_num_rows($res);
                          }
                          if($sifacebook==0){
                            	$sql = "SELECT codice,email,nome,cognome,addrisorsa,addcontenuto,addevento,addappuntamento,tipo,addfoto,t_comune,t_commerciali,t_ente,id_comune,verifica,amministrazione,t_traduzione,avatar FROM anagrafe WHERE (email='$email' OR nickname='$email') AND ( password='$password' )";
                            	$res = mysql_query($sql)or die(mysql_error());
                            	$si= mysql_num_rows($res);
                          }else{
                                $si=$sifacebook;
                                $obj->error = 0;
                          }

                        if($si==1){
                              $obj->error = 0;
                              $row=mysql_fetch_assoc($res);
                              $userPage = new pageScheda('user',$row['codice']);
                              if($POST->newsletter=="1"){
                                mysql_query("INSERT INTO anagrafexnewsletter (data,iduser,email,nome,cognome) VALUES ('".date('Y-m-d H:i:s')."','".$row['codice']."','".format_testo_decode($row['email'])."','".format_testo_decode($row['nome'])."','".format_testo_decode($row['cognome'])."')");
                              }
                              $obj->goToUrl = $userPage->getUrl();
                              $obj->goToUrl = "/";
                              //sentPush("admin","register","user",$row['codice']);
                              $date=date("Y-m-d H:i:s");
                              $indirizzo=getenv("REMOTE_ADDR");
                              $stru=$_SERVER['HTTP_USER_AGENT'];
                              $insert_ses="INSERT INTO acc(corpo,testo,da,ind,iduser,nickname)VALUES('$stru','1','$date','$indirizzo','$row[codice]','".nickname($row['codice'])."')";
                              if($idfacebook!=0){ mysql_query("UPDATE anagrafe SET idfacebook='$idfacebook' WHERE codice=$row[codice]"); }
                              $res_ses=mysql_query($insert_ses);
                              $rows['success']=1;
                              $rows['idUser']=$row['codice'];
                              $rows['avatar'] = "http://etnaportal.it/public/upload/avatar/".$row['avatar']."";
                              $rows['userEmail']=$row['email'];
                              $rows['userNome']=utf8_encode($row['nome']);
                              $rows['userUsername']=utf8_encode(nickname($row['codice']));
                              $output[]=$rows;
                              $resLogin = mysql_query("SELECT codice,email,nome,addrisorsa,addcontenuto,addevento,addappuntamento,tipo,addfoto,t_comune,t_commerciali,t_ente,id_comune,verifica,amministrazione,t_traduzione FROM anagrafe WHERE codice=".$row['codice']." ");
                              $rowLog=mysql_fetch_row($resLogin);
                              $_SESSION['iduser']=$rowLog[0];
                              $_SESSION['email']=$rowLog[1];
                              $_SESSION['nome']=utf8_encode($rowLog[2]);
                              $_SESSION['tipo']=$rowLog[7];
                              $_SESSION['addrisorsa']=$rowLog[3];
                              $_SESSION['addcontenuto']=$rowLog[4];
                              $_SESSION['addevento']=$rowLog[5];
                              $_SESSION['addappuntamento']=$rowLog[6];
                              $_SESSION['addfoto']=$rowLog[8];
                              $_SESSION['t_comune']=$rowLog[9];
                              $_SESSION['t_commerciali']=$rowLog[10];
                              $_SESSION['t_ente']=$rowLog[11];
                              $_SESSION['idcomune']=$rowLog[12];
                              $_SESSION['verifica']=$rowLog[13];
                              $_SESSION['amministrazione']=$rowLog[14];
                              $_SESSION['translation']=$rowLog[15];
                        }else{
                              $obj->error = 0;
                        }
                  }

          }
    }
    $obj->data=$output;
    print(json_encode($obj));
    mysql_close($db);

 ?>