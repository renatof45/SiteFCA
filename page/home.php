<?php
$utilizador = new Utilizador(null);
$dao=new UtilizadorDao();
$errors = array();
$user_id = 0;
$user_name = '';
$teste='';
//print_r($_POST);

if (array_key_exists('sub', $_POST)) {
   
    $user=$dao->getUser($_POST['numero']);
    $teste='teste2' . $teste;
    if ($user['id'] == intval($_POST['numero']) && $user['pass']==$_POST['pass']) {
            reset($user['area']);
            $_SESSION['area'] = key($user['area']);
            $_SESSION['user'] = $_POST['numero'];
            $_SESSION['user_name'] = $user['nome'];
            //header("location : http://localhost/");
    }
}
if (array_key_exists('user', $_SESSION)) {
    $teste='teste1';
    
      $user_name=$_SESSION['user_name'];
}
if (array_key_exists('signin', $_POST)) {
    $areas = array();
    $dao = new DAO();
    if (array_key_exists('option1', $_POST)){
      array_push($areas,$_POST['option1']);
    }
    if (array_key_exists('option2', $_POST)){
      array_push($areas,$_POST['option2']);
    }
    if (array_key_exists('option3', $_POST)){
      array_push($areas,$_POST['option3']);
    }
    if (array_key_exists('option4', $_POST)){
      array_push($areas,$_POST['option4']);
    }
    if (array_key_exists('option5', $_POST)){
      array_push($areas,$_POST['option5']);
    }
    $params = array(
            'numero' => $_POST['utilizador']['numero'],
            'pass'  => $_POST['utilizador']['pass'],
            'nome' => $_POST['utilizador']['nome'],
            'tipo' => 1,
            'area'=> $areas
        );
    
    UtilizadorMapper::map($utilizador,$params);

    $errors = UtilizadorValidator::validate($utilizador);

    if (empty($errors)) {

        $dao = new UtilizadorDao();
        $dao->insert($utilizador);
        Flash::addFlash('Utilizador gravado com sucesso!');
        // redirect
        //Utils::redirect('home', array());
       }
    
}
//echo $teste;
?>
