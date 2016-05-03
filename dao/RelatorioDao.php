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
    
    public function updateRelatrio($dados,$accao){
        $sql = "INSERT INTO `galp`.`relatorios-output` (`dados`, `relatorio`, `area`, `versao`,`accao`) VALUES (:dados, :relatorio, :area, :versao, :accao);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':accao'=>$accao,  ':dados' => $dados, ':relatorio' => $_SESSION['relatorio'], ':versao' => self::getCurrentVersao(), ':area' => $_SESSION['area']));
    }

    public function getLastRelatorio() {
        $found = false;
        $dados = null;
        foreach (parent::query('SELECT * FROM galp.`relatorios-output`  where relatorio=' . $_SESSION['relatorio'], PDO::FETCH_ASSOC) as $row) {
            $found = true;
        }
        if ($found) {
            $result = parent::query('SELECT * FROM galp.`relatorios-output`  where relatorio=' . $_SESSION['relatorio'], PDO::FETCH_ASSOC);
            foreach ($result as $relatorio) {
                return $relatorio;
            }
        } else {
            foreach (parent::query('SELECT * FROM galp.`relatorios-output`  where relatorio=' . (intval($_SESSION['relatorio']) - 1), PDO::FETCH_ASSOC) as $row) {
                $dados = $row['dados'];
            }
            self::insertNewRelatorio($dados, $_SESSION['relatorio'], self::getCurrentVersao());
            $result = parent::query('SELECT * FROM galp.`relatorios-output`  where relatorio=' . $_SESSION['relatorio'], PDO::FETCH_ASSOC);
            foreach ($result as $relatorio) {
                return $relatorio;
            }
        }
        return 0;
    }
    
    public function getCurrentRelatorio(){
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
        $result = parent::query('SELECT  MAX(versao) AS versao FROM galp.`relatorios-templates` where area=' . $_SESSION['area'], PDO::FETCH_ASSOC);
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