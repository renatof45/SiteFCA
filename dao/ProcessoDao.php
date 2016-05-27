<?php

final class ProcessoDao extends DAO {

    public function novoProc($publicar,$nome, $unidade, $manobras, $descricao) {
        $sql = 'INSERT INTO `galp`.`manobras-processo` (`nome`, `unidade`,`criador`,`relatorio`,`manobra`,`descricao`,`publicar`) VALUES (:nome, :unidade, :criador,:relatorio,:manobras,:descricao,:publicar);';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':publicar'=>$publicar,':descricao' => $descricao, ':nome' => $nome, ':unidade' => $unidade, ':criador' => $_SESSION['user'], ':relatorio' => $_SESSION['relatorio'], ':manobras' => $manobras));
    }

    public function updateProc($publicar,$id, $nome, $unidade, $manobras, $descricao) {
        $sql = 'UPDATE `galp`.`manobras-processo` SET `nome`=:nome,`relatorio`=:relatorio, `unidade`=:unidade, `manobra`=:manobra, `descricao`=:descricao,`publicar`=:publicar WHERE `id`=:id';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':publicar'=>$publicar, ':id' => $id, ':descricao' => $descricao, ':nome' => $nome, ':unidade' => $unidade, ':relatorio' => $_SESSION['relatorio'], ':manobra' => $manobras));
    }

    public function deleteProc($proc){
        $sql="DELETE FROM `galp`.`manobras-processo` WHERE `manobras-processo`.`id` = :id";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id' => $proc));
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
                                where status=0;") as $row) {
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

    public function getPassos($manobra) {
        $passos = array();
        foreach (parent::query('SELECT * FROM galp.`manobras-processo-passos` join utilizador on utilizador.ID= `manobras-processo-passos`.user where manobra_id=' . $manobra) as $row) {
            $result = array();
            $result['observacoes'] = $row['observacoes'];
            $result['utilizador'] = $row['Nome'];
            $result['user_id'] = $row['ID'];
            $result['data'] = $row['data'];
            array_push($passos, $result);
        }
        return $passos;
    }

    public function updatePassos($obs,$manobra, $passo, $monabra_id) {
        $sql = "INSERT INTO `galp`.`manobras-processo-passos` (`observacoes`,`manobra`, `passo`, `user`, `concluido`, `relatorio`, `manobra_id`) VALUES (:observacoes,:manobra, :passo, :user, :concluido, :relatorio, :manobra_id);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':observacoes'=>$obs, ':manobra' => $manobra, ':passo' => $passo, ':concluido' => 0, ':manobra_id' => $monabra_id, ':relatorio' => $_SESSION['relatorio'], ':user' => $_SESSION['user']));
    }

    public function deletePassos($manobra, $passo) {
        $sql = "DELETE FROM `galp`.`manobras-processo-passos` WHERE `manobra_id`=:manobra and `passo`=:passo;";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':manobra' => $manobra, ':passo' => $passo));
    }

    public function deleteManobra($manobra) {
        $sql = 'delete from `galp`.`manobras-processo-activas` where `id`=:id';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id' => $manobra));
        $sql = "DELETE FROM `galp`.`manobras-processo-passos` WHERE `manobra_id`=:manobra";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':manobra' => $manobra));
        $sql = "DELETE FROM `galp`.`status-equipamento` WHERE `manobra`=:manobra";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':manobra' => $manobra));
         $sql = "DELETE FROM `galp`.`relatorios-output` WHERE `manobra`=:manobra";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':manobra' => $manobra));
        
    }

    public function getAll() {
        $manobras = array();
        foreach (parent::query("SELECT * FROM galp.`manobras-processo` where `manobras-processo`.publicar=1") as $row) {
            $result = array();
            $result['nome'] = $row['nome'];
            $result['id'] = $row['id'];
            $result['criador'] = $row['criador'];
            $result['unidade'] = $row['unidade'];
            array_push($manobras, $result);
        }
        return $manobras;
    }
    
    public function novaRotina($nome,$unidada,$alerta,$descricao,$frequnecia){
        $sql="INSERT INTO `galp`.`rotinas` (`frequencia`, `unidade`, `nome`, `descricao`, `area`, `user`,  `alerta`,`relatorio`) VALUES (:frequencia, :unidade, :nome, :descricao, :area, :user,  :alerta,:relatorio);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':area'=>$_SESSION['area'],':frequencia'=>$frequnecia, ':alerta' => $alerta, ':descricao' => $descricao, ':unidade' => $unidada, ':nome' => $nome, ':relatorio' => $_SESSION['relatorio'], ':user' => $_SESSION['user']));
        return parent::getDb()->lastInsertId();
    }
    
    public function updateRotina($id,$nome,$unidada,$alerta,$descricao,$frequnecia){
        $sql="UPDATE `galp`.`rotinas` SET `frequencia`=:frequencia, `unidade`=:unidade, `nome`=:nome, `descricao`=:descricao, `area`=:area, `user`=:user,  `relatorio`=:relatorio, `alerta`=:alerta WHERE `id`=:id;";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id'=>$id,':area'=>$_SESSION['area'],':frequencia'=>$frequnecia, ':alerta' => $alerta, ':descricao' => $descricao, ':unidade' => $unidada, ':nome' => $nome, ':relatorio' => $_SESSION['relatorio'], ':user' => $_SESSION['user']));
       
    }
    
    public function getRotinasParaHoje(){
        $rotinas = array();
        foreach (parent::query("SELECT * FROM `galp`.`rotinas` where area=".$_SESSION['area']) as $row) {
            $result = array();
            $result['nome'] = $row['nome'];
            $result['id'] = $row['id'];
            $result['user'] = $row['user'];
            $result['unidade'] = $row['unidade'];
            $result['frequencia'] = $row['frequencia'];
            array_push($rotinas, $result);
        }
        return $rotinas;
    }

    public function getProc($manobra) {
        $manobras = array();

        foreach (parent::query("SELECT utilizador.Nome as criador,criador as user, unidades.id as unidade_id, descricao,manobra,designacao,`manobras-processo`.publicar, `manobras-processo`.id as id,`manobras-processo`.Nome FROM galp.`manobras-processo`
                                join unidades on unidades.id=`manobras-processo`.unidade
                                join utilizador on utilizador.id=`manobras-processo`.criador
                                where  `manobras-processo`.id=" . $manobra) as $row) {
            //$result=array();
            $manobras['nome'] = $row['Nome'];
            $manobras['id'] = $row['id'];
            $manobras['user'] = $row['user'];
            $manobras['criador'] = $row['criador'];
            $manobras['unidade'] = $row['designacao'];
            $manobras['manobra'] = $row['manobra'];
            $manobras['descricao'] = $row['descricao'];
            $manobras['unidade_id'] = $row['unidade_id'];
            $manobras['publicar'] = $row['publicar'];
        }
        return $manobras;
    }
    
    public function getMyprocs($user){
        $manobras = array();
        foreach (parent::query("SELECT * FROM galp.`manobras-processo` where criador=".$user) as $row) {
            $result = array();
            $result['nome'] = $row['nome'];
            $result['id'] = $row['id'];
            $result['criador'] = $row['criador'];
            $result['unidade'] = $row['unidade'];
            array_push($manobras, $result);
        }
        return $manobras;
    }

}
