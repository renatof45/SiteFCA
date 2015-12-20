<?php
$errors = array();
$oleos = new EncOleosDao();
$flashes=null;
if(array_key_exists('save', $_POST)){
	if($_POST['nome']==''){
		 $errors[] = new Error('nome', 'A Designação não pode ser vazia');
	}
	if (empty($errors)){
	    $oleo=$oleos->get_oleo_by_name($_POST['nome']);
	    if(count($oleo)){
		  Flash::addFlash('Já existe um óleo com essa Designação!');
		  if (Flash::hasFlashes()) {
              $flashes = Flash::getFlashes();
          } 
	    }
	    else{
	       $oleos->insert_into_oleos($_POST['nome']);
	       $oleo=$oleos->get_oleo_by_name($_POST['nome']);
	       Flash::addFlash('Óleo adicionado com sucesso!');
	      if (Flash::hasFlashes()) {
              $flashes = Flash::getFlashes();
          }    
       }
   }
}
?>