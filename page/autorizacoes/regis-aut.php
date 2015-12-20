<?php
$flashes=null;

$dao=new AutorizacaoDao();

$trabalhos=$dao->findTrabalhosParaRegisto($_GET['tipo']);
//print_r($dao->findUltimoRegisto(227));
if(array_key_exists('id', $_GET)){
	//print_r($_GET['hora']);
    //$hora= date('Y-m-d H:i:s',strtotime($_GET['hora']));
    $dao->registo($_GET['id'], date('Y-m-d'),$_GET['hora']);
    Flash::addFlash('Autorização registada com sucesso!');
    $flashes = Flash::getFlashes();
}
?>