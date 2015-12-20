<?php
$dao=new EncOleosDao();
$flashes = null;
if(array_key_exists('id', $_GET)){
    $dao->update($_GET['id']);
    Flash::addFlash('Óleo rececionado com sucesso!');
    if (Flash::hasFlashes()) {
                $flashes = Flash::getFlashes();
            }
}
$pendentes = $dao->findPendentes();

?>
