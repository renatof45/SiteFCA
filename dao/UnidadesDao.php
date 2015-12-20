<?php

final class UnidadesDao extends DAO{

      public function findUnidades($area){
         $unidades = array();
        foreach (parent::query("select id,designacao
                                from unidades
                                 where area=".$area) as $row) {
            $result=array();
            $result['id']=$row['id'];
            $result['designacao']=$row['designacao'];
            array_push($unidades, $result);
        }
        return $unidades;
    }


  


}


?>