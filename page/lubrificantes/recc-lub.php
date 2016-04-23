<?php
if(array_key_exists('id', $_GET)){
    $dao=new EncOleosDao();
    $dao->update($_GET['id']);
    Flash::addFlash('Óleo rececionado com sucesso!');
    Utils::redirect('enc-pendentes');
}
?>
