<?php

final class ProcessoDao extends DAO {

    public function novaManobra($nome, $unidade, $manobras,$descricao) {
        $sql = 'INSERT INTO `galp`.`manobras-processo` (`nome`, `unidade`,`criador`,`relatorio`,`manobra`,`descricao`) VALUES (:nome, :unidade, :criador,:relatorio,:manobras,:descricao);';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':descricao'=>$descricao,':nome' => $nome, ':unidade' => $unidade, ':criador' => $_SESSION['user'], ':relatorio' => $_SESSION['relatorio'], ':manobras' => $manobras));
    }
    public function updateManobra($id,$nome,$unidade,$manobras,$descricao){
        $sql='UPDATE `galp`.`manobras-processo` SET `nome`=:nome,`relatorio`=:relatorio, `unidade`=:unidade, `manobra`=:manobra, `descricao`=:descricao WHERE `id`=:id';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id'=>$id, ':descricao'=>$descricao,':nome' => $nome, ':unidade' => $unidade, ':relatorio' => $_SESSION['relatorio'], ':manobra' => $manobras));
    }

    public function updatePassos($manobra,$passo){
        
    }
    
    public function getAll() {
        $manobras = array();
        foreach (parent::query("SELECT * FROM galp.`manobras-processo`") as $row) {
            $result = array();
            $result['nome'] = $row['nome'];
            $result['id'] = $row['id'];
            $result['criador'] = $row['criador'];
            $result['unidade'] = $row['unidade'];
            array_push($manobras, $result);
        }
        return $manobras;
    }

    public function getManobra($manobra) {
        $manobras = array();

        foreach (parent::query("SELECT descricao,manobra,designacao,`manobras-processo`.id as id,Nome FROM galp.`manobras-processo`
                                join unidades on unidades.id=`manobras-processo`.unidade
                                where `manobras-processo`.id=" . $manobra) as $row) {
            //$result=array();
            $manobras['nome'] = $row['Nome'];
            $manobras['id'] = $row['id'];
            $manobras['unidade'] = $row['designacao'];
            $manobras['manobra'] = $row['manobra'];
            $manobras['descricao'] = $row['descricao'];
        }
        return $manobras;
    }

}
