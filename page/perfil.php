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
    //print_r($areas);
    $params = array(
            'numero' => $_POST['utilizador']['numero'],
            'pass'  => $_POST['utilizador']['pass'],
            'nome' => $_POST['utilizador']['nome'],
            'tipo' => 2,
            'area'=> $areas
        );
    
    UtilizadorMapper::map($utilizador,$params);
    $dao->delete($_SESSION['user']);
    $errors = UtilizadorValidator::validate($utilizador);

    if (empty($errors)) {

        $dao = new UtilizadorDao();

        $dao->insert($utilizador);
        Flash::addFlash('Alterados dados do utilizador!');
        $flashes = Flash::getFlashes();
        // redirect
        header('Location: http://localhost:8080/');
       }
}
else{
	$utilizador = new Utilizador($dao->getUser($_SESSION['user']));
    //print_r($utilizador->getArea());
}
?>