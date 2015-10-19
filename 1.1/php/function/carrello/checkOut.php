<?php
     include('../../config.php');
     $postdata = file_get_contents("php://input");
     $request = $_POST['data']['field'];
     $spedizione = $request['spedizione'];



     $idAttivita=$request['idAttivita'];
     $idTrasporto=$request['idTrasporto'];
     $obj = new stdClass();
     $obj->error = 0;

     $carrello = new carrello();
     $idCarrello=$carrello->getId();

     $nome=$spedizione['nome'];
     $cognome=$spedizione['cognome'];
     $nazione=$spedizione['nazione'];
     $regione=$spedizione['regione'];
     $citta=$spedizione['citta'];
     $indirizzo=$spedizione['indirizzo'];
     $cap=$spedizione['cap'];
     $tel=$spedizione['telefono'];
     $email=$spedizione['email'];
     $destinazioneNome=$nome." ".$cognome;
     $destinazioneIndirizzo=$indirizzo.", ".$citta.", ".$cap."  ".$regione.", ".$nazione;
     $destinazioneTel=$tel;
     $destinazioneEmail=$email;


     $costotrasporto=$_POST['costotrasporto'];


     $indirizzoaccesso=getenv("REMOTE_ADDR");
     $key=substr(md5(md5(rand(0,909)).date('Y-m-H-h -s i-d').'$nome etnaportal'.md5(rand(5,2))),5,5);

     $insertorder=mysql_query("INSERT INTO ecommerceordini (stato,ip,email,iduser,idattivita,data,costoprodotti,costotrasporto,costototale,iddestinazione,destinazioneNome, destinazioneIndirizzo, destinazioneTel, destinazioneEmail,keyaccess,idtrasporto) VALUES ('1','$indirizzoaccesso','$email','$_SESSION[iduser]','$idAttivita',
     '".date('Y-m-d H:i:s')."','$costoprodotti','$costotrasporto','$costototalee','0','$destinazioneNome','$destinazioneIndirizzo','$destinazioneTel','$destinazioneEmail','$key','$idTrasporto') ");
     if(@$insertorder){
        $idordine=mysql_insert_id();
        $sqlcarr=mysql_query("SELECT * FROM ecommercecarrelloxprodotti INNER JOIN ecommerceprodotti ON ecommerceprodotti.id = ecommercecarrelloxprodotti.idprodotto WHERE ecommerceprodotti.idattivita=$idAttivita AND idcarrello=$idCarrello  ")or die(mysql_error());
        while($rowcarr=mysql_fetch_assoc($sqlcarr)){
            mysql_query("INSERT INTO ecommerceordinixprodotti (idordine, iduser,data,idattivita,idprodotto,prezzounita,quantita,prezzotot,regolatrasporto,regolatrasportotipo,regolapagamento) VALUES ('$idordine','$_SESSION[iduser]','".date('Y-m-d H:i:s')."','$rowcarr[idattivita]','$rowcarr[idprodotto]','$rowcarr[prezzounita]','$rowcarr[quantita]','$rowcarr[prezzotot]','$rowcarr[regolatrasporto]','$rowcarr[regolatrasportotipo]','$rowcarr[regolapagamento]')  ");
            $costoprodotti+=($rowcarr['prezzounita']*$rowcarr['quantita']);
        }
        //$sqlRegolaTrasporto=mysql_query("SELECT comulabile FROM ecommerceregoletrasporto INNER JOIN ecommerceregoletrasportoxtipitrasporto ON ecommerceregoletrasportoxtipitrasporto.idregola = ecommerceregoletrasporto.id ")
        //$rowCom=mysql_fetch_assoc($sqlRegolaTrasporto);

        $numoggetti=0;
        $sqlcarr=mysql_query("SELECT * FROM ecommercecarrelloxprodotti INNER JOIN ecommerceprodotti ON ecommerceprodotti.id = ecommercecarrelloxprodotti.idprodotto WHERE ecommerceprodotti.idattivita=$idAttivita AND idcarrello=$idCarrello  ")or die(mysql_error());
        while($rowcarr=mysql_fetch_assoc($sqlcarr)){
            $numoggetti++;

            $sqlprezzotrasporto=mysql_query("
            SELECT * FROM ecommerceregoletrasportoxtipitrasporto
                INNER JOIN ecommerceregoletrasporto ON ecommerceregoletrasporto.id = ecommerceregoletrasportoxtipitrasporto.idregola
                    WHERE  ecommerceregoletrasportoxtipitrasporto.id=$idTrasporto")or die(mysql_error());
            $rowprezzotrasporto=mysql_fetch_assoc($sqlprezzotrasporto);
            $quantitacurr=$rowcarr['quantita'];

            for($i=0;$i<$quantitacurr;$i++){
                if($i==0){
                      if($numoggetti>1 && $rowprezzotrasporto['comulabile']!=0){
                           $prezzotrasportotSCONTO+=$rowprezzotrasporto['costoagg'];
                      }else{
                            $prezzotrasportotSCONTO+=$rowprezzotrasporto['costo'];
                      }
                }else{
                      $prezzotrasportotSCONTO+=$rowprezzotrasporto['costoagg'];
                }
               // echo("<b>$prezzotrasportotSCONTO<br> ");
            }
            for($i=0;$i<$quantitacurr;$i++){
                if($i==0){
                      $prezzotrasportot+=$rowprezzotrasporto['costo'];
                }else{
                      $prezzotrasportot+=$rowprezzotrasporto['costoagg'];
                }
            }
        }

        $costotrasporto=$prezzotrasportot; if($prezzotrasportotSCONTO<$prezzotrasportot){$costotrasporto=$prezzotrasportotSCONTO; }
        $costototalee=$costoprodotti+$costotrasporto;
        mysql_query("UPDATE ecommerceordini SET costoprodotti='$costoprodotti', costotrasporto='$costotrasporto', costototale='$costototalee' WHERE id=$idordine ");
        //reg($_SESSION['iduser'],$_SESSION['iduser'],'inserito','ordine','ecommerceordini',$idordine,'ordine','','',$idattivitacheck);
        mysql_query("DELETE FROM ecommercecarrelloxprodotti WHERE idattivita=$idAttivita AND idcarrello=$idCarrello");
        $_SESSION['ammordine']=$idordine;
        $obj->goToUrl = HTTP."/myorder/$idordine";
   }




    print(json_encode($obj));
    mysql_close($db);
?>