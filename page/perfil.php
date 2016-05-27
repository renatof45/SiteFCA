<?php
$errors = array();
$dao = new UtilizadorDao();
$flashes=null;

if (array_key_exists('alterar', $_POST)){
    $areas = array();
    $utilizador = new Utilizador(null);
    if (array_key_exists('option1', $_POST)){
      $areas[$_POST['option1']]=$_POST['option1'];
    }
    if (array_key_exists('option2', $_POST)){
      $areas[$_POST['option2']]=$_POST['option2'];
    }
    if (array_key_exists('option3', $_POST)){
      $areas[$_POST['option3']]=$_POST['option3'];
    }
    if (array_key_exists('option4', $_POST)){
      $areas[$_POST['option4']]=$_POST['option4'];
    }
    if (array_key_exists('option5', $_POST)){
      $areas[$_POST['option5']]=$_POST['option5'];
    }
    $tipo=$dao->getTipo($_SESSION['user']);
    $params = array(
            'numero' => $_POST['utilizador']['numero'],
            'pass'  => $_POST['utilizador']['pass'],
            'nome' => $_POST['utilizador']['nome'],
            'tipo' => $tipo,
            'area'=> $areas
        );
    
    UtilizadorMapper::map($utilizador,$params);
    $dao->delete($_SESSION['user']);
    $errors = UtilizadorValidator::validate($utilizador);

    if (empty($errors)) {

       

       $dao->insert($utilizador);
       $$app->redirect('/SiteFCA-master/web/');
       }
}
else{
	$utilizador = new Utilizador($dao->getUser($_SESSION['user']));
    //print_r($utilizador->getArea());
}
?>