<?php

/************************************************************************/
/***************************** FUNCTION 1.0 *****************************/
/************************************************************************/

function accesso($type,$idtype,$valurl){
      $amministrazione=0; if(isset($_SESSION['iduser'])){  if($_SESSION['iduser']==18){ $amministrazione=1; } }
      $dateaccesso=date("Y-m-d H:i:s");
      $datagiorno=date("Y-m-d");
      $indirizzoaccesso=getenv("REMOTE_ADDR");
      $iduseraccess=0;
      $nickaccess="";
      $url = format_testo('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] );
      if(isset($_SESSION['iduser'])){
        $iduseraccess=$_SESSION['iduser'];
        $nickaccess=format_testo(nickname($_SESSION['iduser']));
      }
      $urlType=""; $urlVal="";
      if($type=="comune" || $type=="risorsa" || $type=="evento" || $type=="comune" || $type=="attivita"){
            $page = new pageScheda($type,$idtype);
            $urlGet= $page->getUrl();
            $urlType=$urlGet['typeurl']; $urlVal=$urlGet['val'];
            if($type=="attivita"){ $urlType="attivita"; }
      }

      $urlprec=$_SERVER['HTTP_REFERER'];
      //echo "INSERT INTO accessi (data,datagiorno,ip,iduser,nick,url,type,idtype,valurl,lang,urlprec,urlType,urlVal) VALUES ('$dateaccesso','$datagiorno','$indirizzoaccesso','$iduseraccess','$nickaccess','$url','$type','$idtype','$valurl','$_SESSION[lan]','$urlprec','$urlType','$urlVal')";
      mysql_query("INSERT INTO accessi (data,datagiorno,ip,iduser,nick,url,type,idtype,valurl,lang,urlprec,urlType,urlVal) VALUES
      ('$dateaccesso','$datagiorno','$indirizzoaccesso','$iduseraccess','$nickaccess','$url','$type','$idtype','$valurl','$_SESSION[lan]','$urlprec','$urlType','$urlVal')" )or die(mysql_error());
}

function getTable($type){
  $table=$type;
  switch($type){
        case 'foto':   $table="foto";  break;
        case 'photo':   $table="foto";  break;
        case 'video':   $table="video";  break;
        case 'eventi':   $table="eventi";  break;
        case 'evento':   $table="eventi";  break;
        case 'proverbi':   $table="proverbi";  break;
        case 'madeinsicily':   $table="ecommercexprodotti";  break;
        case 'prodotti':   $table="ecommerceprodotti";  break;
        case 'prodotto':   $table="ecommerceprodotti";  break;
        case 'risorsa':   $table="territorio";   break;
        case 'dormire':   $table="oggetti"; break;
        case 'mangiare':  $table="oggetti"; break;
        case 'attivitacommerciali':  $table="oggetti"; break;
        case 'comune':  $table="comuni"; break;
        case 'comuni':  $table="comuni"; break;
        case 'servizi':  $table="comunixservizi"; break;
        case 'servizicomm':  $table="oggetti"; break;
        case 'attivita':  $table="oggetti"; break;
        case 'offerte':  $table="offerte"; break;
        case 'offerta':  $table="offerte"; break;
        case 'recensioni':  $table="comments"; break;
        case 'alloggi':  $table="oggettixcamere"; break;
        case 'ricette':  $table="ricette"; break;
        case 'miti':  $table="miti"; break;
        case 'speciealieutiche':  $table="specie"; break;
        case 'modididire':  $table="modidire"; break;
        case 'trasporti':  $table="ecommerceregoletrasporto"; break;
        case 'ricettetipi':  $table="ricettetipologie"; break;
        case 'dormiretipi':  $table="tipi"; break;
        case 'mangiaretipi':  $table="tipi"; break;
        case 'shoppingtipi':  $table="tipi"; break;
        case 'servizicommtipi':  $table="tipi"; break;
        case 'page':  $table="urlpage"; break;
        case 'user':  $table="anagrafe"; break;
        case 'itinerari':  $table="percorso"; break;
        case 'percorsi':  $table="percorso"; break;
  }
  return $table;
}

function getBoolean($str){
  $str=(int)$str;
  if($str==0){
    $ret=false;
  }else{
    $ret=true;
  }
  return $ret;
}

function isLogin(){
    $return=false;
    if(isset($_SESSION['iduser'])){
      $return=true;
    }
    return $return;
}

function isEmpty($var){
        $return = false;
        if(isset($var)){
          $var=trim(str_replace(" ","",$var));
          if(!empty($var)){ $var=true; }
          return $return;
        }
}

function format_testo($str){
  //$str=(addslashes(stripslashes(str_replace( "\\" ,"/", $str))));
  $str=str_replace( "“" ,"\"", $str);
  $str=str_replace( "”" ,"\"", $str);
  $str=str_replace( "“" ,"\"", $str);
  $str=str_replace( "\"" ,"\"", $str);
  $str=str_replace( "%u2019" ,"'", $str);
  $str=str_replace( "%u201C" ,"\"", $str);
  $str=str_replace( "%u201D" ,"\"", $str);
  $str=str_replace( "%u201D" ,"\"", $str);
  $str=str_replace( "%u2039" ,"<", $str);
  $str=str_replace( "%u203A" ,">", $str);
  $str=str_replace( "%%u20AC" ,"&euro;", $str);
  $str=(trim(mysql_real_escape_string($str)));
  $str=str_replace( "\"" ,"\"", $str);
  return $str;
}

function format_testo_decode($str){
  //$str = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
  $quotes = array(
    "\xC2\xAB"     => '"', // « (U+00AB) in UTF-8
    "\xC2\xBB"     => '"', // » (U+00BB) in UTF-8
    "\xE2\x80\x98" => "'", // ‘ (U+2018) in UTF-8
    "\xE2\x80\x99" => "'", // ’ (U+2019) in UTF-8
    "\xE2\x80\x9A" => "'", // ‚ (U+201A) in UTF-8
    "\xE2\x80\x9B" => "'", // ? (U+201B) in UTF-8
    "\xE2\x80\x9C" => '"', // “ (U+201C) in UTF-8
    "\xE2\x80\x9D" => '"', // ” (U+201D) in UTF-8
    "\xE2\x80\x9E" => '"', // „ (U+201E) in UTF-8
    "\xE2\x80\x9F" => '"', // ? (U+201F) in UTF-8
    "\xE2\x80\xB9" => "'", // ‹ (U+2039) in UTF-8
    "\xE2\x80\xBA" => "'", // › (U+203A) in UTF-8
);
$str = strtr($str, $quotes);

  /*$str = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
  $str=str_replace( "`a" ,"à;", $str);
  $str=str_replace( "`e" ,"è", $str);
  $str=str_replace( "`u" ,"ù", $str);
  $str=str_replace( "`i" ,"ì", $str);
  $str=str_replace( "`o" ,"ò", $str); */
  return utf8_decode(format_testo($str));
}
function format_testo_decode_html($str){
  //$str = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
  $quotes = array(
    "\xC2\xAB"     => '"', // « (U+00AB) in UTF-8
    "\xC2\xBB"     => '"', // » (U+00BB) in UTF-8
    "\xE2\x80\x98" => "'", // ‘ (U+2018) in UTF-8
    "\xE2\x80\x99" => "'", // ’ (U+2019) in UTF-8
    "\xE2\x80\x9A" => "'", // ‚ (U+201A) in UTF-8
    "\xE2\x80\x9B" => "'", // ? (U+201B) in UTF-8
    "\xE2\x80\x9C" => '"', // “ (U+201C) in UTF-8
    "\xE2\x80\x9D" => '"', // ” (U+201D) in UTF-8
    "\xE2\x80\x9E" => '"', // „ (U+201E) in UTF-8
    "\xE2\x80\x9F" => '"', // ? (U+201F) in UTF-8
    "\xE2\x80\xB9" => "'", // ‹ (U+2039) in UTF-8
    "\xE2\x80\xBA" => "'", // › (U+203A) in UTF-8
);
$str = strtr($str, $quotes);
  /*$str=str_replace( "`a" ,"&agrave;", $str);
  $str=str_replace( "`e" ,"&egrave;", $str);
  $str=str_replace( "`u" ,"&ugrave;", $str);
  $str=str_replace( "`i" ,"&igrave;", $str);
  $str=str_replace( "`o" ,"&ograve;", $str); */
  return utf8_decode(format_testo($str));
}

function replace_accents($string){
    return str_replace( array("^"," ","'", '´', 'à','á','â','ã','ä', 'ç', 'è','é','ê','ë', 'ì','í','î','ï', 'ñ', 'ò','ó','ô','õ','ö', 'ù','ú','û','ü', 'ý','ÿ', 'À','Á','Â','Ã','Ä', 'Ç', 'È','É','Ê','Ë', 'Ì','Í','Î','Ï', 'Ñ', 'Ò','Ó','Ô','Õ','Ö', 'Ù','Ú','Û','Ü', 'Ý'),
    array('','-','-','a','a','a','a','a', 'c', 'e','e','e','e', 'i','i','i','i', 'n', 'o','o','o','o','o', 'u','u','u','u', 'y','y', 'A','A','A','A','A', 'C', 'E','E','E','E', 'I','I','I','I', 'N', 'O','O','O','O','O', 'U','U','U','U', 'Y'), $string);
}

function replace_accents2($string){
    return str_replace( array("^","'", '´', 'à','á','â','ã','ä', 'ç', 'è','é','ê','ë', 'ì','í','î','ï', 'ñ', 'ò','ó','ô','õ','ö', 'ù','ú','û','ü', 'ý','ÿ', 'À','Á','Â','Ã','Ä', 'Ç', 'È','É','Ê','Ë', 'Ì','Í','Î','Ï', 'Ñ', 'Ò','Ó','Ô','Õ','Ö', 'Ù','Ú','Û','Ü', 'Ý'),
    array('','-','a','a','a','a','a', 'c', 'e','e','e','e', 'i','i','i','i', 'n', 'o','o','o','o','o', 'u','u','u','u', 'y','y', 'A','A','A','A','A', 'C', 'E','E','E','E', 'I','I','I','I', 'N', 'O','O','O','O','O', 'U','U','U','U', 'Y'), $string);
}

function replace_accents3($string){
    return trim(strtolower(preg_replace('/[^A-z0-9-]/', '',(str_replace( array("^","'"," ", '´', 'à','á','â','ã','ä', 'ç', 'è','é','ê','ë', 'ì','í','î','ï', 'ñ', 'ò','ó','ô','õ','ö', 'ù','ú','û','ü', 'ý','ÿ', 'À','Á','Â','Ã','Ä', 'Ç', 'È','É','Ê','Ë', 'Ì','Í','Î','Ï', 'Ñ', 'Ò','Ó','Ô','Õ','Ö', 'Ù','Ú','Û','Ü', 'Ý'),
    array('','-','a','a','a','a','a', 'c', 'e','e','e','e', 'i','i','i','i', 'n', 'o','o','o','o','o', 'u','u','u','u', 'y','y', 'A','A','A','A','A', 'C', 'E','E','E','E', 'I','I','I','I', 'N', 'O','O','O','O','O', 'U','U','U','U', 'Y'), $string)))));
}

function ctrl($var,$namevar,$session,$amministrazione,$val1,$val2,$val3){
        $err=0;
        if($var=="post" || $var=="get"){
          if($var=="post"){  if(!isset($_POST[''.$namevar.''])){ $err++; } }
          if($var=="get"){ if(!isset($_GET[''.$namevar.''])){ $err++; } }
        }
        if($session==1){
          if(!isset($_SESSION['iduser'])){ $err++; }

          if($amministrazione==1){
              if($_SESSION['amministrazione']==0){ $err++; }
          }

        }
       return $err;
}

//controllo se esiste un elemento in un array
function inarray($valore_da_esaminare, $array_di_riferimento) {
    for($i = 0; $i < count($array_di_riferimento); $i++) {
    	if($valore_da_esaminare == $array_di_riferimento[$i]) {
    	    return 1;
    	}
    }
    return 0;
}

function cutTesto($txt,$max,$val1="",$val2=""){
  if(strlen($txt)>$max){ $txt=substr($txt,0,$max)."..."; }  return $txt;
}

//formatto la stringa per il JS
function formatForJS($str){
    $str=utf8_decode($str);
    $str=trim($str);
    //$str=str_replace("\n","",$str);
    $str=str_replace('"',"'",$str);
    $str=str_replace("'","\'",$str);
    return $str;
}

//formatto un array per il JS
function formatArrayForJS($str){
    $str= htmlspecialchars(str_replace('"',"'",json_encode($str)));
    //$str= htmlspecialchars(str_replace("'","",json_encode($str)));
    return $str;
}

//validazione e-mail
function chkEmail($email){$email = trim($email);if(!$email) {return false;}$num_at = count(explode( '@', $email )) - 1;if($num_at != 1) {return false;}if(strpos($email,';') || strpos($email,',') || strpos($email,' ')) {return false;}if(!preg_match( '/^[\w\.\-]+@\w+[\w\.\-]*?\.\w{1,4}$/', $email)) {return false;}return true;}

function nickname($iduser){
  $nick=null;
  if(!empty($iduser)){
    $sql=mysql_query("SELECT nickname,nome,cognome,stato_account,ente,t_ente FROM anagrafe WHERE codice=$iduser");
    $row=mysql_fetch_row($sql);
    if($row[3]==2){
      $nick="";
    }else{
        if($row[0]==""){
          $nick=$row[1]." ".($row[2]);
        }
        else{
          $nick=$row[0];
        }
    }
   }
    return $nick;
}




/*FUNZIONI COORDINATE*/
//ritorno le coordinate del raggio ( quadrato ) data una coordinate, o tipo e id della pagina geolocalizzata
function raggiocoordinate($coordinate,$lat,$lng,$raggio,$tbl,$col,$id){
  $array=0;
  $km1=0.008810;
  //controlle se le coordinate che mi sono passate sono corrette ( posso lasciarli apposta sbagliate o vuote in modo da far ricavare le coordinate dal database )
  if(controllo_coordinate($coordinate)==0){
            $array=array();
            $coordinate=str_replace("("," ",$coordinate);
            $coordinate=str_replace(")"," ",$coordinate);
            $coordinate=str_replace("%20"," ",$coordinate);
            $coordinate3=explode(",",$coordinate);
            $latcc=trim($coordinate3[0]);
            $lngcc=trim($coordinate3[1]);
            $array[0]=$coordinate;
            $array[1]=$coordinate3[0]-($km1*$raggio);
            $array[2]=$coordinate3[0]+($km1*$raggio);
            $array[3]=$coordinate3[1]-($km1*$raggio);
            $array[4]=$coordinate3[1]+($km1*$raggio);

            $array[5]=$coordinate3[0]-($km1*200);
            $array[6]=$coordinate3[0]+($km1*200);
            $array[7]=$coordinate3[1]-($km1*200);
            $array[8]=$coordinate3[1]+($km1*200);
  }else{
       //recupero le coordinate in base ai parametri passati
       if($tbl=="localita"){ $tbl="comunixfrazioni"; $col="id"; }
       $sqlcoo=mysql_query("SELECT coordinate FROM $tbl WHERE $col=$id")or die(mysql_error());
       $numcoo=mysql_num_rows($sqlcoo);
       //se l'elemento esiste ( CONTROLLO )
       if($numcoo!=0){
            $rowcoo=mysql_fetch_row($sqlcoo);
            $coordinaterr=$rowcoo[0];
            //se le coordinate sono CORRETTE
            if(controllo_coordinate($coordinaterr)==0){
                    $array=array();
                    $coordinaterr=str_replace("("," ",$coordinaterr);
                    $coordinaterr=str_replace(")"," ",$coordinaterr);
                    $coordinaterr=str_replace("%20"," ",$coordinaterr);
                    $coordinate3=explode(",",$coordinaterr);
                    $latcc=trim($coordinate3[0]);
                    $lngcc=trim($coordinate3[1]);
                    $array[0]=$coordinaterr;
                    $array[1]=$coordinate3[0]-($km1*$raggio);
                    $array[2]=$coordinate3[0]+($km1*$raggio);
                    $array[3]=$coordinate3[1]-($km1*$raggio);
                    $array[4]=$coordinate3[1]+($km1*$raggio);
                    $latcc=trim($coordinate3[0]);
                    $lngcc=trim($coordinate3[1]);
                    $array[5]=$coordinate3[0]-($km1*200);
                    $array[6]=$coordinate3[0]+($km1*200);
                    $array[7]=$coordinate3[1]-($km1*200);
                    $array[8]=$coordinate3[1]+($km1*200);
            }else{
              //se le coordinate sono SBAGLIATE o VUOTE controllo se idcomune del contenuto
              $array=0;
            }

       }else{  $array=0; }
  }

   return $array;
}

function controllo_coordinate($coo){
  $err=0;
  $coo=trim(str_replace("("," ",$coo));
  $coo=str_replace(")"," ",$coo);
  $coo=str_replace("%20"," ",$coo);
  $cooarray=explode(",",$coo);
  if(count($cooarray)==2){
        $lat=trim($cooarray[0]);
        $lng=trim($cooarray[1]);
        if(is_numeric($lat) && is_numeric($lng)){

        }else{
           $err++;
        }
  }else{
      $err++;
  }

  return $err;
}



/*FUNZIONI SULLE DATE*/
/* qualunque data inserisco mi ritorna un array con */
function getData($data){
  $err=0;
  $arrayreturn[0]=$data;
  $arraydata=explode(' ', $data);
  if(count($arraydata)==2){
      $data=$arraydata[0];
  }
  $arraydata=explode('/', $data);
  if(count($arraydata)==3){
     list($giorno, $mese, $anno) = explode('/', $data);
  }else{
    $arraydata=explode('-', $data);
    if(count($arraydata)==3){
        list($anno, $mese, $giorno ) = explode('-', $data);
    }else{ $err++; }

  }

  if($err==0){
      $giorni=array(0=>'Domenica', 1=>'Lunedì', 2=>'Martedì',3=>'Mercoledì',4=>'Giovedì', 5=>'Venerdì', 6=>'Sabato');
      $w = date('w', mktime(0,0,0, $mese, $giorno, $anno));
      $arrayreturn[1]=strtoupper(substr($giorni[$w],0,3));
      $arrayreturn[2]=$giorno;
      $arrayreturn[3]=strtoupper(substr(nome_mese($mese),0,3));
      $arrayreturn[4]=$anno;
      $arrayreturn[0]=strtoupper(substr($giorni[$w],0,3))." ".$arrayreturn[2]." ".$arrayreturn[3]." ".$arrayreturn[4];
  }


  return $arrayreturn;
}
/* qualunque data inserisco mi ritorna un array con */
function formatDate($data){
  $err=0;
  $arrayreturn[0]=$data;
  $arraydata=explode(' ', $data);
  $time="";
  /*2015-10-6 00:00:00*/
  if(count($arraydata)==2){
      $data=$arraydata[0];
      $time=substr($arraydata[1],0,5);
  }
  $arraydata=explode('/', $data);
  if(count($arraydata)==3){
     list($giorno, $mese, $anno) = explode('/', $data);
  }else{
    $arraydata=explode('-', $data);
    if(count($arraydata)==3){
        list($anno, $mese, $giorno ) = explode('-', $data);
    }else{ $err++; }

  }
  if($err==0){
      $giorni=array(0=>'Domenica', 1=>'Lunedì', 2=>'Martedì',3=>'Mercoledì',4=>'Giovedì', 5=>'Venerdì', 6=>'Sabato');
      $w = date('w', mktime(0,0,0, $mese, $giorno, $anno));
      $arrayreturn['week']=strtoupper(substr($giorni[$w],0,3));
      $arrayreturn['dd']=$giorno;
      $arrayreturn['mm']=strtoupper(substr(nome_mese($mese),0,3));
      $arrayreturn['aaaa']=$anno;
      $arrayreturn['date']=strtoupper(substr($giorni[$w],0,3))." ".$arrayreturn['dd']." ".$arrayreturn['mm']." ".$arrayreturn['aaaa'];
      $arrayreturn['time']=$time;
  }


  return $arrayreturn;
}

function nome_mese($num){
  if($num==1 || $num==01){ $name="Gennaio"; }
  if($num==2 || $num==02){ $name="Febbraio"; }
  if($num==3 || $num==03){ $name="Marzo"; }
  if($num==4 || $num==04){ $name="Aprile"; }
  if($num==5 || $num==05){ $name="Maggio"; }
  if($num==6 || $num==06){ $name="Giugno"; }
  if($num==7 || $num==07){ $name="Luglio"; }
  if($num==8 || $num==08){ $name="Agosto"; }
  if($num==9 || $num==09){ $name="Settembre"; }
  if($num==10){ $name="Ottobre"; }
  if($num==11){ $name="Novembre"; }
  if($num==12){ $name="Dicembre"; }
  return $name;
}

function getGiornosettimana($val,$lcurr=""){
   $lng=$_SESSION['arraylan'];  if($lcurr==""){ $l=$_SESSION['lan'];  }else{ $l=$lcurr; }
   if($lcurr=="en"){
      $giorni=array(1=>"Monday", 2=>"Tuesday",3=>"Wednesday",4=>"Thursday", 5=>"Friday", 6=>"Saturday", 7=>"Sunday");
   }else{
      $giorni=array(1=>$lng['lunedi'], 2=>$lng['martedi'],3=>$lng['mercoledi'],4=>$lng['giovedi'], 5=>$lng['venerdi'], 6=>$lng['sabato'] , 7=>$lng['domenica']);
   }
   return $giorni[$val];
 }

function getMese($val){
   if($val=="01" ||$val=="02" ||$val=="03" ||$val=="04" ||$val=="05" ||$val=="06" ||$val=="07" || $val=="08" ||$val=="09"  ){
        $val=str_replace("0","",$val);
   }
   $val=(int)$val;

   $lng=$_SESSION['arraylan'];  $l=$_SESSION['lan'];
   $giorni=array(1=>$lng['gennaio'], 2=>$lng['febbraio'],3=>$lng['marzo'],4=>$lng['aprile'], 5=>$lng['maggio'], 6=>$lng['giugno'] , 7=>$lng['luglio'], 8=>$lng['agosto'], 9=>$lng['settembre'], 10=>$lng['ottobre'], 11=>$lng['novembre'], 12=>$lng['dicembre']);
   return $giorni[$val];
 }

function explodeDate($data){
  $array=explode(" ",$data);
  return $array[0];
}

function data_adb($data){
    $data2=trim($data2);
    $data2= explode("/",$data,3);
    $data3=$data2[2]."-".$data2[1]."-".$data2[0];
    return $data3;
}

function data_db($data){
    $data2= explode("-",$data,3);
    $data3=$data2[2]."/".$data2[1]."/".$data2[0];
    return $data3;
}

function data_db_full($data){
    $data=explode(" ",$data,2);
    $data2= explode("-",$data[0],3);
    $data3=$data2[2]."/".$data2[1]."/".$data2[0];
    return $data3;
}

function FirstLastWeek($data_oggi2) {
      list($giorno, $mese, $anno) = explode('/', $data_oggi2);

      $w = date('w', mktime(0,0,0, $mese, $giorno, $anno));
      $day['W'] = date('W', mktime(0,0,0, $mese, $giorno, $anno));

      $giorni=array(0=>'Domenica', 1=>'Lunedì', 2=>'Martedì',3=>'Mercoledì',4=>'Giovedì', 5=>'Venerdì', 6=>'Sabato');

      $day['giorno'] = $giorni[$w];
      $day['anno'] = $anno;

      if($w == 0 )  {
            $day['lunedi']   = date('Y-m-d', mktime(0,0,0, $mese, $giorno - 6, $anno));
            $day['domenica'] = date('Y-m-d', mktime(0,0,0, $mese, $giorno, $anno));
            }  else {
                    $day['lunedi']   = date('Y-m-d', mktime(0,0,0, $mese, $giorno - $w + 1, $anno));
                    $day['domenica'] = date('Y-m-d', mktime(0,0,0, $mese, $giorno - $w + 7, $anno));
                    }
      return $day;
}



/* PAYPAL - ACQUISTI */
//controllo l'id di PayPal è in sessione, se lo è vuol dire che ho effettuato il pagamento, quindi posso eliminare la variabile dalla sessione e bloccare il pagamento delle stesso ordine
function checkPaymentId($type,$idtype,$paymentId){
  $ret=false;
  if(isset($_SESSION['paymentId'])){
    if($_SESSION['paymentId']==$paymentId){
        $ret=true;
        unset($_SESSION['paymentId']);
    }
  }
  return $ret;
}



/*MESSAGGISTICA*/
function lastMessage($idconversazione,$idPage){

                    $sql=mysql_query("SELECT testo,idmittente,data FROM conversazionixmess WHERE idconversazione=$idconversazione ORDER BY data DESC");
                    $row=mysql_fetch_row($sql);
                    if($row[1]==$idPage){  $ricevutoinviato=">";  }
                    else{   $ricevutoinviato="<"; }
                    $sqlmess=mysql_query("SELECT count(*) FROM conversazionixletti WHERE idconversazione=$idconversazione AND idricevente=$idPage");
                    $resmess=mysql_fetch_row($sqlmess);

                    $statoletto=0; $numdaleggere=0;
                    if($resmess[0]>0){ $statoletto=1; $numdaleggere=$resmess[0]; }




                    $ret['ricevutoinviato']=$ricevutoinviato;
                    $ret['idUser']=$row[1];
                    $ret['testo']=utf8_encode($row[0]);
                    $ret['data']=$row[2];
                    $ret['numdaleggere']=$numdaleggere;
                    return $ret;
}



/*GETSQLQUERY*/
function getSqlDate($dataEvento){
            //CONTROLLO SE HO PASSATO ALLA VARIABILE $dataEvento LA DATA SPECIFICA O MENO
            $arrayEvento=explode("-",$dataEvento,3);
            if(count($arrayEvento)==3){
                $optionDa=$dataEvento;
                $optionA=$dataEvento;
            }else{
                $giorno_corrente = date('d');
                $mese_corrente = date('m');
                $anno_corrente = date('Y');
                $week=date('W');
                $data_oggi = date('Y-m-d');
                $data_oggi2 = date('Y-m-d');

                //settimana corrente
                $data = date('d/m/Y');
                $day = FirstLastWeek($data);
                $settimanacorrente_da=$data_oggi2;
                $settimanacorrente_a=$day['domenica'];

                //settimana prossima
                $data=date('d/m/Y',mktime(0,0,0,$mese_corrente,$giorno_corrente+7,$anno_corrente));
                $day = FirstLastWeek($data);
                $settimanaprossima_da=$day['lunedi'];
                $settimanaprossima_a=$day['domenica'];

                //mese corrente
                $num_giorni = cal_days_in_month(CAL_GREGORIAN, $mese_corrente, $anno_corrente);
                $mesecorrente_da=$data_oggi2;
                $mesecorrente_a=$anno_corrente."-".$mese_corrente."-".$num_giorni;
                $mesecorrente_a=date('Y-m-d',mktime(0,0,0,$mese_corrente+1,$giorno_corrente,$anno_corrente));
                //mese prossimo
                $mese_scorso=date('m',mktime(0,0,0,$mese_corrente+1,1,$anno_corrente));
                $mese_anno_scorso=date('Y',mktime(0,0,0,$mese_corrente+1,1,$anno_corrente));
                $num_giorni = cal_days_in_month(CAL_GREGORIAN, $mese_scorso, $mese_anno_scorso);
                $meseprossimo_da=$mese_anno_scorso."-".$mese_scorso."-1";
                $meseprossimo_a=$mese_anno_scorso."-".$mese_scorso."-".$num_giorni;

                //anno corrente
                $annocorrente_da=$data_oggi2;
                $annocorrente_a=$anno_corrente."-12-31";
                $arrayoption=explode('-',$act,3);
                $optionTipo=0;

                $giorno_corrente=date('d');
                $mese_corrente=date('m');
                $anno_corrente=date('Y');
                if($dataEvento=="oggi"){                   $strhead.=" di oggi";  $optionDa=date('Y-m-d'); $optionA=date('Y-m-d'); $txtQuando="Oggi"; }
                if($dataEvento=="domani"){                 $strhead.=" di domani"; $optionDa=date('Y-m-d',mktime(0,0,0,$mese_corrente,$giorno_corrente+1,$anno_corrente)); $optionA=date('Y-m-d',mktime(0,0,0,$mese_corrente,$giorno_corrente+1,$anno_corrente)); $txtQuando="Domani"; }
                if($dataEvento=="weekend"){                $strhead.=" di questa settimana"; $optionDa=$settimanacorrente_da; $optionA=$settimanacorrente_a; $txtQuando="Questa settimana"; }
                if($dataEvento=="prossimasettimana"){      $strhead.=" della prossima settimana"; $optionDa=$settimanaprossima_da; $optionA=$settimanaprossima_a; $txtQuando="La settimana prossima"; }
                if($dataEvento=="questomese"){             $strhead.=" di questo mese ( ".nome_mese(date('m'))." )"; $optionDa=$mesecorrente_da; $optionA=$mesecorrente_a; $txtQuando="Questo mese"; }
                if($dataEvento=="prossimomese"){           $strhead.=" del prossimo mese ( ".nome_mese(date('m',mktime(0,0,0,$mese_corrente+1,$giorno_corrente,$anno_corrente)))." )"; $optionDa=$meseprossimo_da; $optionA=$meseprossimo_a; $txtQuando="Il mese prossimo"; }
                if($dataEvento=="questanno"){              $strhead.=" di quest'anno ( ".date('Y')." )"; $optionDa=$annocorrente_da; $optionA=$annocorrente_a; $txtQuando="Quest'anno"; }
                if($dataEvento=="old"){                    $strhead.=" passati "; $optionDa=0; $optionA=date('Y-m-d'); $txtQuando=$lng[$l]['eventipassati']; }
            }

            $sqlData=" AND (( datainizio BETWEEN '$optionDa' AND '$optionA' ) OR ( datafine BETWEEN '$optionDa' AND '$optionA' ) OR ( datainizio<='$optionDa'  AND datafine>='$optionA' ))  ";
            return $sqlData;
}
function getSqlWhere($cosa,$dove,$iddove){
  switch($cosa){
        case 'photo':   $sqlAdd="foto";  break;
        case 'video':   $sqlAdd="video";  break;
        case 'eventi':   $sqlAdd="eventi";  break;
        case 'risorsa':   $sqlAdd="territorio";   break;
        case 'dormire':   $sqlAdd="oggetti"; break;
        case 'mangiare':  $sqlAdd="oggetti"; break;
        case 'servizi':  $sqlAdd="comunixservizi"; break;
        case 'servizicomm':  $sqlAdd="oggetti"; break;
        case 'offerte':  $sqlAdd="oggetti"; break;
        case 'recensioni':  $sqlAdd="comments"; break;
  }
  if($cosa=="recensioni"){
       $where="type='$dove' AND idtype='$iddove' ";
       if($dove=="user"){ $where="iduser=$iddove ";  }
  }else{
      switch($dove){
            case 'comune':   if($cosa=="photo" || $cosa=="video"){ $where="AND $sqlAdd.idcomune=$iddove AND $sqlAdd.idevento=0 AND $sqlAdd.idattivita=0 AND $sqlAdd.idrisorsa=0"; }else{ $where="AND $sqlAdd.idcomune=$iddove "; } if($sqlAdd=="territorio"){ $where="AND $sqlAdd.id_comune=$iddove ";   } break;
            case 'risorsa':   $where="AND $sqlAdd.idrisorsa=$iddove "; $where=$where; break;
            case 'evento':   $where="AND $sqlAdd.idevento=$iddove "; $where2=$where; break;
            case 'eventi':   $where="AND $sqlAdd.idevento=$iddove "; $where2=$where; break;
            case 'localita':   $where="AND $sqlAdd.idfrazione=$iddove "; $where2=$where; break;
            case 'attivita':   $where="AND $sqlAdd.idattivita=$iddove "; $where2=$where; break;
            case 'user':   $where="AND $sqlAdd.iduser=$iddove "; $where2=$where; break;
      }
  }

  return $where;
}
function getSqlCosto($dove){}





?>