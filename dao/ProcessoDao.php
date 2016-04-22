<?php

final class ProcessoDao extends DAO {

    public function novoProc($nome, $unidade, $manobras, $descricao) {
        $sql = 'INSERT INTO `galp`.`manobras-processo` (`nome`, `unidade`,`criador`,`relatorio`,`manobra`,`descricao`) VALUES (:nome, :unidade, :criador,:relatorio,:manobras,:descricao);';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':descricao' => $descricao, ':nome' => $nome, ':unidade' => $unidade, ':criador' => $_SESSION['user'], ':relatorio' => $_SESSION['relatorio'], ':manobras' => $manobras));
    }

    public function updateProc($id, $nome, $unidade, $manobras, $descricao) {
        $sql = 'UPDATE `galp`.`manobras-processo` SET `nome`=:nome,`relatorio`=:relatorio, `unidade`=:unidade, `manobra`=:manobra, `descricao`=:descricao WHERE `id`=:id';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id' => $id, ':descricao' => $descricao, ':nome' => $nome, ':unidade' => $unidade, ':relatorio' => $_SESSION['relatorio'], ':manobra' => $manobras));
    }

    public function novaManobra($proc, $status) {
        $sql = "INSERT INTO `galp`.`manobras-processo-activas` (`procedimento`, `utilizador`, `relatorio`, `status`) VALUES (:procedimento, :utilizador, :relatorio, :status);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':status' => $status, ':procedimento' => $proc, ':utilizador' => $_SESSION['user'], ':relatorio' => $_SESSION['relatorio']));
        return parent::getDb()->lastInsertId();
    }

    public function updateManobra($manobra, $status) {
        $sql = "UPDATE `galp`.`manobras-processo-activas` SET `status`=:status WHERE `id`=:manobra";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':status' => $status, ':manobra' => $manobra));
    }

    public function getAllPendentes() {
        $pendentes = array();
        foreach (parent::query("SELECT galp.`manobras-processo-activas`.id  as manobra_id,galp.`manobras-processo-activas`.data as data, unidades.id as unidade,`manobras-processo`.id as proc_id,Nome FROM galp.`manobras-processo-activas`
                                join galp.`manobras-processo` on galp.`manobras-processo`.id=galp.`manobras-processo-activas`.procedimento
                                join unidades on unidades.id=`manobras-processo`.unidade
                                where status=1;") as $row) {
            $result = array();
            $result['manobra_id'] = $row['manobra_id'];
            $result['Nome'] = $row['Nome'];
            $result['proc_id'] = $row['proc_id'];
            $result['unidade'] = $row['unidade'];
            $result['data'] = $row['data'];
            array_push($pendentes, $result);
        }
        return $pendentes;
    }

    public function updatePassos($manobra, $passo, $monabra_id) {
        $sql = "INSERT INTO `galp`.`manobras-processo-passos` (`manobra`, `passo`, `user`, `concluido`, `relatorio`, `manobra_id`) VALUES (:manobra, :passo, :user, :concluido, :relatorio, :manobra_id);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':manobra' => $manobra, ':passo' => $passo, ':concluido' => 0, ':manobra_id' => $monabra_id, ':relatorio' => $_SESSION['relatorio'], ':user' => $_SESSION['user']));
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

    public function getProc($manobra) {
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
