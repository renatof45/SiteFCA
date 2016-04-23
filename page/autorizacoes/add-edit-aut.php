<?php


$errors = array();
$edit = array_key_exists('id', $_GET);
$autorizacao = new Autorizacao();
$dao = new AutorizacaoDao();
$equipamentodao= new EquipamentoDao();
$unidades=$dao->findUnidades($_SESSION['area']);
$dueOn = new DateTime();



if(array_key_exists('unidade', $_GET)){
       $equipamentos=$equipamentodao->getByUnidade($_GET['unidade']);
    }
    else
       $equipamentos=$equipamentodao->getByUnidade($unidades[0]['id']);
if (array_key_exists('firma', $_GET)) {
    $dao = new firmaDAO();
    $id=$dao->isertFirma($_GET['firma']);
    //print_r($id);
    Flash::addFlash('Inserida nova firma!');
}

elseif (array_key_exists('save', $_POST)) {
   
    $data = array(
        'numero' => $_POST['autorizacao']['numero'],
        'tipo' => $_POST['autorizacao']['tipo'],
        'texto' => $_POST['autorizacao']['texto'],
        'dataInicio' => $_POST['autorizacao']['dataInicio'],
        'dataFim' => $_POST['autorizacao']['dataInicio'],
        'validade'=>$_POST['autorizacao']['dataFim'],
        'firma'=>$_POST['autorizacao']['firma'],
        'unidade'=>$_POST['autorizacao']['unidade'],
    );
        
    // map
    AutorizacaoMapper::map($autorizacao, $data);
    // validate
       $errors = AutorizacaoValidator::validate($autorizacao);
       if (empty($errors)) {
        $dao = new AutorizacaoDao();
        $dao->insert($autorizacao);
        Flash::addFlash('Autorização gravada com sucesso!');
        if(array_key_exists('pedido', $_POST)){
            $pedidodao= new PedidosTrabalhoDao();
            $pedidodao->update($_POST['pedido'],$_POST['autorizacao']['numero']);
        }         
        // redirect
        //Utils::redirect('add-edit-aut', array());
       }

}

$flashes = Flash::getFlashes();
?>
