<?php
session_start();
$obj = new stdClass();
$obj->error = 1;
$obj->goToUrl = this;
$obj->result="";
$obj->numLike=0;
$POST = json_decode(file_get_contents("php://input"));
  //$_SERVER['HTTP_X_FORWARDED_FOR']
	include "../../config.php";
    $elimina = array("(","#",")","/","*",'"',"'\'","<",">",";","!","'","+","[","]","$","%","&","0x0","0x");
	$idfacebook=0; if(isset($POST->idfacebook)){ $idfacebook= $POST->idfacebook; }
	$user= $POST->username;

	$pass= $POST->password;
	$user = stripslashes(str_replace( $elimina ,"", $user));
	$passwor = stripslashes(str_replace( $elimina ,"", $pass));
	$password=md5($passwor);
    $password2=md5($POST->password);
    $sifacebook=0;
    if($idfacebook!=0){
        $sql2 = "SELECT codice,email,nome,addrisorsa,addcontenuto,addevento,addappuntamento,tipo,addfoto,t_comune,t_commerciali,t_ente,id_comune,verifica,amministrazione,t_traduzione,accesso FROM anagrafe WHERE idfacebook=$idfacebook ";
    	$res = mysql_query($sql2)or die(mysql_error());
    	$sifacebook= mysql_num_rows($res);
     }
    if($sifacebook==0){
    	$sql = "SELECT codice,email,nome,addrisorsa,addcontenuto,addevento,addappuntamento,tipo,addfoto,t_comune,t_commerciali,t_ente,id_comune,verifica,amministrazione,t_traduzione,accesso FROM anagrafe WHERE (email='$user' OR nickname='$user') AND ( password='$password' OR password='$password2' )";
    	$res = mysql_query($sql)or die(mysql_error());
    	$si= mysql_num_rows($res);
    }else{
       $si=$sifacebook;
    }
    if($si==1){
        $row=mysql_fetch_row($res);
        //controllo se lo stato d'accesso è su TRUE
        if(getBoolean($row[16])){
              $userPage = new pageScheda('user',$row[0]);
              //$obj->goToUrl = $userPage->getUrl();
              $obj->error = 0;
              $date=date("Y-m-d H:i:s");
              $indirizzo=getenv("REMOTE_ADDR");
              $stru=$_SERVER['HTTP_USER_AGENT'];
              $insert_ses="INSERT INTO acc(corpo,testo,da,ind,iduser,nickname)VALUES('$stru','1','$date','$indirizzo','$row[0]','".nickname($row[0])."')";
              if($idfacebook!=0){ mysql_query("UPDATE anagrafe SET idfacebook='$idfacebook' AND stato_account='1' WHERE codice=$row[0] "); }
              mysql_query("UPDATE anagrafe SET stato_account='1' ");
              $res_ses=mysql_query($insert_ses);
              $_SESSION['iduser']=$row[0];
              $_SESSION['email']=$row[1];
              $_SESSION['nome']=utf8_encode($row[2]);
              $_SESSION['tipo']=$row[7];
              $_SESSION['addrisorsa']=$row[3];
              $_SESSION['addcontenuto']=$row[4];
              $_SESSION['addevento']=$row[5];
              $_SESSION['addappuntamento']=$row[6];
              $_SESSION['addfoto']=$row[8];
              $_SESSION['t_comune']=$row[9];
              $_SESSION['t_commerciali']=$row[10];
              $_SESSION['t_ente']=$row[11];
              $_SESSION['idcomune']=$row[12];
              $_SESSION['verifica']=$row[13];
              $_SESSION['amministrazione']=$row[14];
              $_SESSION['translation']=$row[15];
        }else{
              $obj->errorMsg = utf8_encode("Il tuo account è momentaneamento disabilitato, per altre informazioni contattaci");
        }
     }else{
            $obj->errorMsg = utf8_encode("Password e/o e-mail non corretti");
     }


    print(json_encode($obj));
    mysql_close($db); ?>