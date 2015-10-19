<?php
    include('../../config.php');

    $obj = new stdClass();
    $obj->error = 0;

    $quantita=1; if(isset($_POST['quantita'])){ $quantita=$_POST['quantita']; }
    $idProdotto=$_POST['idProdotto'];
    $carrello = new carrello();
    $carrello -> addItem($idProdotto,$quantita);
    $numItem = $carrello -> getNumItem();

    $obj->html="<div class='clear w100' style=' text-align:left;'>
          <h3  ><b>".($lng['nuovoprodottoaggiuntoaltuocarrello'])."</b>  </h3>
          <h3 ><b>$numItem</b> ".($lng['prodottineltuocarrello'])." </h3>
          <div class='row'></div><br>  
          <div class='interaction'>
                <a href='/mycart' ><button class='right' > ".($lng['vaialcarrello'])."</button></a>
                <a name='closeDialog' ><button class='right'>".($lng['continuagliacquisti'])."</button></a>
          </div>
    </div>";

    print(json_encode($obj));
    mysql_close($db);
?>