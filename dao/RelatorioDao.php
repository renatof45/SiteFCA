<?php

class RelatorioDao extends DAO {

    public function insertNewRelatorio($dados, $relatorio, $versao) {
        $sql = "INSERT INTO `galp`.`relatorios-output` (`dados`, `relatorio`, `area`, `versao`) VALUES (:dados, :relatorio, :area, :versao);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':dados' => $dados, ':relatorio' => $relatorio, ':versao' => $versao, ':area' => $_SESSION['area']));
    }

    public function isShiftOpen($data, $turno) {
        $result = parent::query('select * from relatorios', PDO::FETCH_ASSOC);
        foreach ($result as $relatorio) {
            if ($relatorio['turno'] == $turno && $relatorio['data'] == $data) {
                return $relatorio['id'];
            }
        }
        return 0;
    }

    public function updateRelatrio1($dados) {
        $sql = 'UPDATE galp.`relatorios-output` SET `dados`=:dados WHERE `relatorio`=:relatorio';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':dados' => $dados,
            ':relatorio' => $_SESSION['relatorio']
        ));
    }

    public function updateRelatrio($comentario,$dados, $accao, $manobra) {
        $sql = "INSERT INTO `galp`.`relatorios-output` (`comentario`,`dados`, `relatorio`, `area`, `versao`,`accao`,`manobra`,`user`) VALUES (:comentario,:dados, :relatorio, :area, :versao, :accao,:manobra,:user);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':comentario'=>$comentario,  ':user'=>$_SESSION['user'], ':manobra' => $manobra, ':accao' => $accao, ':dados' => $dados, ':relatorio' => $_SESSION['relatorio'], ':versao' => self::getCurrentVersao(), ':area' => $_SESSION['area']));
    }

    public function deleteRelatorio($accao) {
        $sql = 'DELETE FROM `galp`.`relatorios-output` where accao=:accao';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':accao' => $accao));
    }

    public function getLastRelatorio1() {
        foreach (parent::query('SELECT max(id) as id FROM galp.`relatorios-output`  where area=' . $_SESSION['area'], PDO::FETCH_ASSOC) as $row) {
            $result = parent::query('SELECT * FROM galp.`relatorios-output`  where id=' . $row['id'], PDO::FETCH_ASSOC);
            foreach ($result as $relatorio) {
                return $relatorio;
            }
        }
    }

    public function getLastRelatorio($index) {
        foreach (parent::query('SELECT * FROM galp.`relatorios-output` where area='.$_SESSION['area'].' ORDER BY id DESC LIMIT '.($index+1).',1', PDO::FETCH_ASSOC) as $row) {
            if ($row['manobra'] != 0) {
                $result = parent::query('SELECT nome,manobra FROM galp.`manobras-processo-activas` '
                                . 'join galp.`manobras-processo` on galp.`manobras-processo`.id=galp.`manobras-processo-activas`.procedimento'
                                . ' where galp.`manobras-processo-activas`.id=' . $row['manobra'], PDO::FETCH_ASSOC);
                foreach ($result as $manobra) {
                    $result = parent::query('SELECT * FROM galp.`relatorios-output`  join utilizador on utilizador.ID=galp.`relatorios-output`.user  where galp.`relatorios-output`.id=' . $row['id'], PDO::FETCH_ASSOC);
                    foreach ($result as $relatorio) {
                        return(array('relatorio' => $relatorio, 'manobra' => $manobra));
                    }
                }
            } else {
                $result = parent::query('SELECT * FROM galp.`relatorios-output` join utilizador on utilizador.ID=galp.`relatorios-output`.user  where galp.`relatorios-output`.id=' . $row['id'], PDO::FETCH_ASSOC);
                foreach ($result as $relatorio) {
                    return(array('relatorio' => $relatorio, 'manobra' => $row['manobra']));
                }
            }
        }
    }

    public function getDadosRelatorio($index){
        //$sql='SELECT * FROM galp.`relatorios-output` where area='.$_SESSION['area'].' ORDER BY id DESC LIMIT '.$index+1.',1';
    }

    public function getCurrentRelatorio() {
        $result = parent::query('select * from relatorios', PDO::FETCH_ASSOC);
        foreach ($result as $relatorio) {
            if ($relatorio['turno'] == $turno && $relatorio['data'] == $data) {
                return $relatorio['id'];
            }
        }
        return 0;
    }

    public function insert($turno, $data) {
        $sql = "INSERT INTO `galp`.`relatorios` (`turno`, `data`,`utilizador`,`area`) VALUES (:turno, :data, :utilizador,:area)";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':turno' => $turno, ':data' => $data, ':utilizador' => $_SESSION['user'], ':area' => $_SESSION['area']));
        return self::isShiftOpen($data, $turno);
    }

    public function getCurrentVersao() {
        $versao = null;
        $result = parent::query('SELECT  versao FROM galp.`relatorios-templates` where status=1 and area=' . $_SESSION['area'], PDO::FETCH_ASSOC);
        foreach ($result as $v) {
            $versao = $v['versao'];
        }
        return $versao;
    }

    public function updateTemplate($relatorio, $separadores, $versao) {

        $now = new DateTime();
        $data = parent::formatDateTime($now);
        $sql = "UPDATE `galp`.`relatorios-templates` SET `template`=:template,  `data`=:data, `separadores`=:separadores WHERE `versao`=:versao;";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':separadores' => $separadores, ':template' => $relatorio, ':data' => $data, ':versao' => $versao));
    }
    
    public function checkVersao(){
        $result = parent::query('SELECT versao FROM  `relatorios-output` where id = (SELECT max(id) FROM  `relatorios-output` where area='.$_SESSION['area'].');', PDO::FETCH_ASSOC);
        foreach ($result as $v) {
            if($result==null){
                return array('check'=>'false','versao'=>$v['versao']);
            }
            $versao_old=$v['versao'];
            $result1 = parent::query('SELECT versao FROM  `relatorios-templates` where status = "1" and area=' . $_SESSION['area'], PDO::FETCH_ASSOC);
            foreach ($result1 as $v1) {
                if($versao_old==$v1['versao']){
                    return array('check'=>'true','versao'=>$v1['versao']);
                }
                else{
                    return array('check'=>'false','versao'=>$v1['versao']);
                }      
            }
        }
    }

    public function setDefaultVersao($versao) {
        $sql = "UPDATE `galp`.`relatorios-templates` SET `status`=:before WHERE `status`=:after and area=:area;";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':after' => 1, ':before' => 0,':area'=>$_SESSION['area']));
        $sql = "UPDATE `galp`.`relatorios-templates` SET `status`=:status WHERE `versao`=:versao and area=:area;";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':status' => 1, ':versao' => $versao,':area'=>$_SESSION['area']));
    }

    public function createVersao($tipo, $versao) {
        $result = parent::query('SELECT max(versao) as versao FROM galp.`relatorios-templates` where  area=' . $_SESSION['area'], PDO::FETCH_ASSOC);
        foreach ($result as $v) {
            $versao_nova=$v['versao'];
        }
        if ($tipo == 1 || $versao==null) {
            $sql = 'INSERT INTO `galp`.`relatorios-templates` (`template`, `area`,`versao`,`utilizador`,`separadores`) VALUES (:template, :area, :versao,:utilizador,:separadores)';
                $statement = parent::getDb()->prepare($sql);
                parent::executeStatement($statement, array(':separadores' => '', ':template' => '', ':area' => $_SESSION['area'], ':versao'=> $versao_nova+1, ':utilizador' => $_SESSION['user']));
        } else {
            $result = parent::query('SELECT  * FROM galp.`relatorios-templates` where versao=' . $versao . ' and area=' . $_SESSION['area'], PDO::FETCH_ASSOC);
            foreach ($result as $v) {
                //$versao = $v['versao'];
                $sql = 'INSERT INTO `galp`.`relatorios-templates` (`template`, `area`,`versao`,`utilizador`,`separadores`) VALUES (:template, :area, :versao,:utilizador,:separadores)';
                $statement = parent::getDb()->prepare($sql);
                parent::executeStatement($statement, array(':separadores' => $v['separadores'], ':template' => $v['template'], ':area' => $_SESSION['area'], ':versao'=> $versao_nova+1, ':utilizador' => $_SESSION['user']));
            }
        }
    }

    public function deleteVersao($versao){
         $sql = "DELETE FROM `galp`.`relatorios-templates` WHERE `relatorios-templates`.`versao` = :versao and area=:area";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':versao' => $versao, ':area'=>$_SESSION['area']));
    }

    public function getVersoes() {
        $sql = 'SELECT utilizador.ID as user,utilizador.Nome as username,`relatorios-templates`.id as id, versao,data,status FROM galp.`relatorios-templates` join utilizador on utilizador.id=`relatorios-templates`.utilizador where area=' . $_SESSION['area'];
        $versoes = array();
        foreach (parent::query($sql) as $row) {
            $array = array();
            $array['id'] = $row['id'];
            $array['versao'] = $row['versao'];
            $array['user'] = $row['user'];
            $array['username'] = $row['username'];
            $array['data'] = $row['data'];
            $array['status'] = $row['status'];
            array_push($versoes, $array);
        }
        return $versoes;
    }

    public function getRelatorio($versao) {
        //$versao = null;
        $template = array();

        if ($versao != null) {
            $result = parent::query('SELECT  *  FROM galp.`relatorios-templates` where area=' . $_SESSION['area'] . ' and versao=' . $versao, PDO::FETCH_ASSOC);
            foreach ($result as $relatorio) {
                $template['id'] = $relatorio['id'];
                $template['utilizador'] = $relatorio['utilizador'];
                $template['area'] = $relatorio['area'];
                $template['data'] = $relatorio['data'];
                $template['template'] = $relatorio['template'];
                $template['separadores'] = $relatorio['separadores'];
                $template['versao'] = $relatorio['versao'];
            }
            return $template;
        }
    }

    public function getTrabalhos() {
        $trabalhos = array();
        foreach (parent::query("SELECT unidades.designacao as unidade, autorizacoes.`Descricao do trabalho` as desricao FROM galp.autorizacoes
                             join registos on autorizacoes.ID=registos.autorizacao
                             join unidades on unidades.id=autorizacoes.unidade
                              where registos.relatorio=" . $_SESSION['relatorio']) as $row) {
            $array = array();
            $array['unidade'] = $row['unidade'];
            $array['desricao'] = $row['desricao'];
            array_push($trabalhos, $array);
        }
        return $trabalhos;
    }

    public function getEquipamentos() {
        $equipamentos = array();
        foreach (parent::query("SELECT equipamento.equipamento as designacao, equipamento.tipo as tipo, accoes.descricao as status FROM galp.equipamento 
                                join `status-equipamento` on `status-equipamento`.equipamento=equipamento.id
                                join accoes on `status-equipamento`.accao=accoes.id
                                where `status-equipamento`.relatorio=" . $_SESSION['relatorio']) as $row) {
            $array = array();
            $array['equipamento'] = $row['designacao'];
            $array['tipo'] = $row['tipo'];
            $array['status'] = $row['status'];
            array_push($equipamentos, $array);
        }
        return $equipamentos;
    }

}

?>