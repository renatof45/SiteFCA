<?php

class RelatorioDao extends DAO {

    public function isShiftOpen($data, $turno) {
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

    public function guardarRelatorio($relatorio) {
        $versao = null;
        $result = parent::query('SELECT  MAX(versao) AS versao FROM galp.`relatorios-templates` where area=' . $_SESSION['area'], PDO::FETCH_ASSOC);
        foreach ($result as $v) {
            $versao = $v['versao'];
        }
        $now = new DateTime();
        $data = parent::formatDateTime($now);
        $versao++;
        $sql = "INSERT INTO `galp`.`relatorios-templates` (`template`,`utilizador`,`area`,`versao`,`data`) VALUES (:template,:utilizador,:area,:versao,:data);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':template' => $relatorio, ':data' => $data, ':utilizador' => $_SESSION['user'], ':area' => $_SESSION['area'], ':versao' => $versao));
    }

    public function getRelatorio() {
        $versao = null;
        $template = array();
        $result = parent::query('SELECT  MAX(versao) AS versao FROM galp.`relatorios-templates` where area=' . $_SESSION['area'], PDO::FETCH_ASSOC);

        foreach ($result as $v) {
            $versao = $v['versao'];
        }
        if ($versao != null) {
            $result = parent::query('SELECT  *  FROM galp.`relatorios-templates` where area=' . $_SESSION['area'] . ' and versao=' . $versao, PDO::FETCH_ASSOC);
            foreach ($result as $relatorio) {
                $template['id'] = $relatorio['id'];
                $template['utilizador'] = $relatorio['utilizador'];
                $template['area'] = $relatorio['area'];
                $template['data'] = $relatorio['data'];
                $template['template'] = $relatorio['template'];
            }
            return $template;
        }
    }

}

?>