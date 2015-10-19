<?php
    include('../../config.php');

    $obj = new stdClass();
    $obj->error = 0;

    $quantita=1; if(isset($_POST['quantita'])){ $quantita=$_POST['quantita']; }
    $idProdotto=$_POST['idProdotto'];
    $idAttivita=$_POST['idAttivita'];
    $carrello = new carrello();
    $carrello -> svuota($idProdotto,$idAttivita);

    print(json_encode($obj));
    mysql_close($db);
?>