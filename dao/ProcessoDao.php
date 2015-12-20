<?php

final class ProcessoDao extends DAO{
   


   public function novaManobra($nome,$unidade,$passos){
        $sql='INSERT INTO `galp`.`manobras-processo` (`nome`, `unidade`,`criador`,`relatorio`) VALUES (:nome, :unidade, :criador,:relatorio);';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':nome'=>$nome,':unidade'=>$unidade, ':criador'=>$_SESSION['user'],':relatorio'=>$_SESSION['relatorio']));
        $manobra = parent::getDb()->lastInsertId();
        foreach ($passos as $passo) {
        	$sql="INSERT INTO `galp`.`manobras-processo-passos` (`descricao`, `manobra`) VALUES (:descricao, :manobra);";
            $statement = parent::getDb()->prepare($sql);
            parent::executeStatement($statement, array(':manobra'=>$manobra,':descricao'=>$passo));
        }
}
 
    public function getAll($unidade){
    	$manobras=array();
          foreach (parent::query("SELECT * FROM galp.`manobras-processo` where unidade=".$unidade) as $row) {
            $result=array();
            $result['nome']=$row['nome'];
            $result['id']=$row['id'];
            array_push($manobras, $result);
        }
        return $manobras;

    }

    public function getManobra($manobra){
    	$manobras=array();

          foreach (parent::query("SELECT * FROM galp.`manobras-processo` where id=".$manobra) as $row) {
            //$result=array();
            $manobras['nome']=$row['nome'];
            $manobras['id']=$row['id'];
            $manobras['passos']=array();
            foreach (parent::query("SELECT * FROM galp.`manobras-processo-passos` where manobra=".$manobra) as $row) {
                array_push($manobras['passos'], $row['descricao']);
            }
        }
        return $manobras;
    }
}
