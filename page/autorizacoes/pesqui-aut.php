<?php

$dao = new AutorizacaoDao();
if($_GET['tipo']==1)
   $trabalhos = $dao->findCaducadasSemRegisto();
  
elseif ($_GET['tipo']==2) {
	$trabalhos = $dao->findTrabalhosEmCurso();
	
}
else{
	$trabalhos = $dao->findTrabalhosdoDia();
	
}
?>
