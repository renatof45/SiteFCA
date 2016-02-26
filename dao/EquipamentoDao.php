<?php

final class EquipamentoDao extends DAO {

    public function getAll($unidade) {
        $equipamento = array();
        foreach (parent::query("select equipamento.id as id id,equipamento.Equipamento
                                from equipamento join 
                                 where unidade=" . $unidade) as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['designacao'] = $row['designacao'];
            array_push($equipamento, $result);
        }
        return $equipamento;
    }

    public function getByType($type, $unidade) {
        $equipamento = array();
        foreach (parent::query("select equipamento.id as id,accoes.id as status,Equipamento
                                from equipamento join accoes on accoes.id=equipamento.estado
                                where unidade=" . $unidade . " and tipo=" . $type) as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['Equipamento'] = $row['Equipamento'];
            $result['estado'] = $row['status'];
            array_push($equipamento, $result);
        }
        return $equipamento;
    }

    public function getEstados() {
        $estados = array();
        foreach (parent::query("SELECT * FROM galp.accoes") as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['descricao'] = $row['descricao'];
            array_push($estados, $result);
        }
        return $estados;
    }

    public function getByUnidade($unidade) {
        $equipamento = array();
        foreach (parent::query("select id,Equipamento
                                from equipamento
                                 where unidade=" . $unidade) as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['Equipamento'] = $row['Equipamento'];
            array_push($equipamento, $result);
        }
        return $equipamento;
    }

    public function getEqipmentoById($id) {
        foreach (parent::query("select id,Equipamento
                                from equipamento
                                 where id=" . $id) as $row) {
            return $row['Equipamento'];
        }
    }

    public function getEstadoByIf($id) {
        $equipamento = array();
        foreach (parent::query("SELECT * FROM galp.accoes where id=" . $id) as $row) {
            return $row['descricao'];
        }
    }

    public function insertNovoEquipamento($equipamento, $unidade, $tipo) {
        $sql = "INSERT INTO `galp`.`equipamento` (`equipamento`, `unidade`, `estado`, `tipo`, `relatorio`) VALUES (:equipamento, :unidade, :estado, :tipo, :relatorio);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':estado' => '5', ':relatorio' => $_SESSION['relatorio'], ':unidade' => $unidade, ':tipo' => $tipo));
    }

    public function updateStatus($equipamento, $status) {
        $sql = 'UPDATE `galp`.`equipamento` SET `estado`=:estado,`relatorio`=:relatorio WHERE `id`=:equipamento';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':estado' => $status, ':relatorio' => $_SESSION['relatorio']));

        $sql = 'INSERT INTO `galp`.`status-equipamento` (`relatorio`, `equipamento`, `accao`) VALUES (:relatorio, :equipamento, :accao);';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':accao' => $status, ':relatorio' => $_SESSION['relatorio']));
    }

    public function getHistory($equipamento) {
        $history = array();
        foreach (parent::query("SELECT turno,relatorios.data,descricao,Nome FROM galp.`status-equipamento` 
                                  join relatorios on relatorios.id=`status-equipamento`.relatorio
                                  join accoes on accoes.id=`status-equipamento`.accao
                                  join utilizador on utilizador.id=relatorios.utilizador
                                  where `status-equipamento`.equipamento =" . $equipamento . " order by `status-equipamento`.data desc") as $row) {
            $result = array();
            $result['turno'] = $row['turno'];
            $result['data'] = $row['data'];
            $result['descricao'] = $row['descricao'];
            $result['Nome'] = $row['Nome'];
            array_push($history, $result);
        }
        return $history;
    }

    public function getHorasDeMarcha($equipamento, $status, $start) {
        date_default_timezone_set('Europe/Lisbon');
        $total = 0;
        $last_status = 0;
        $starttime = new DateTime('2000-00-00 00:00:00');
        $GLOBALS['total_time'] = new DateTime('2000-00-00 00:00:00');
        $query = null;
        $found = false;
        $first_date = false;
        if ($start == 'mes') {
            $query = 'WHERE MONTH(`data`) = MONTH(CURDATE()) and equipamento=';
        } elseif ($start == 'total') {
            $query = 'WHERE equipamento=';
        }
        foreach (parent::query("SELECT * FROM galp.`status-equipamento`  " . $query . $equipamento)as $row) {
            if ($row['accao'] == $status) {
                $GLOBALS['old_date'] = new DateTime($row['data']);
                $last_status = $row['accao'];
                $found = true;
            }
            if ($row['accao'] != $status && $found) {

                $GLOBALS['new_date'] = new DateTime($row['data']);
                $diff = $GLOBALS['new_date']->diff($GLOBALS['old_date']);
                $last_status = $row['accao'];
                $GLOBALS['total_time']->sub($diff);
                $found = false;
            }
        }
        if ($last_status == 5) {
            $new_date = new DateTime();
            $diff = $new_date->diff($GLOBALS['old_date']);
            $GLOBALS['total_time']->sub($diff);
            return $GLOBALS['total_time']->diff($starttime)->format("%H:%I:%S");
        } else {
            return $GLOBALS['total_time']->diff($starttime)->format("%H:%I:%S");
        }
    }

    public function getHorasDeMarcha1($equipamento, $status) {
        $horas = array();
        $found = false;
        $date = date('Y-m-d H:i:s');
        $total = 0;
        $accao = null;
        foreach (parent::query("SELECT * FROM galp.`horas-de-marcha`
             join galp.equipamento on equipamento.id=`horas-de-marcha`.equipamento
             where equipamento.id=" . $equipamento)as $row) {
            $found = true;
        }
        if (!$found) {
            $sql = 'INSERT INTO `galp`.`horas-de-marcha` (`equipamento`, `horas`, `last-status`,`data` ) VALUES (:equipamento,:horas,:laststatus,:data);';
            $statement = parent::getDb()->prepare($sql);
            parent::executeStatement($statement, array(':equipamento' => $equipamento, ':laststatus' => $status, ':horas' => 0, ':data' => $date));
        } else {
            $found = false;
            foreach (parent::query("SELECT data,horas,`last-status` FROM galp.`horas-de-marcha` where equipamento=" . $equipamento) as $row) {
                $total = $row['horas'];
                $accao = $row['last-status'];
                $firstfound = false;
                $startdate = $row['data'];
                //echo "SELECT * FROM galp.`status-equipamento` where data > '".$startdate."' and equipamento=".$equipamento." order by data;";
                foreach (parent::query("SELECT * FROM galp.`status-equipamento` where data > '" . $startdate . "' and equipamento=" . $equipamento . " order by data;") as $row1) {
                    $found = true;
                    //echo "teste1";
                    if ($row1['accao'] == 5) {
                        $startdate = $row1['data'];
                        $firstfound = true;
                    } elseif ($firstfound) {
                        $firstfound = false;
                        $date1 = new DateTime($startdate);
                        $date2 = new DateTime($row1['data']);
                        $diff = $date2->diff(($date1));
                        $total+=$diff->h;
                    }
                    $accao = $row1['accao'];
                    echo 'status : ' . $accao;
                }
            }
            date_default_timezone_set('Europe/Lisbon');
            $date2 = new DateTime();
            if (($accao == 5 && !$found) || $accao == 5) {
                $date1 = new DateTime($startdate);
                $diff = $date2->diff(($date1));
                $total+=$diff->h;
            }
            echo "total: " . $total;
            //echo $accao;
            $sql = "UPDATE `galp`.`horas-de-marcha` SET `data`=:data,`horas`=:horas, `last-status`=:laststatus WHERE `equipamento`=:equipamento;";
            $statement = parent::getDb()->prepare($sql);
            parent::executeStatement($statement, array(':equipamento' => $equipamento, ':horas' => $total, ':laststatus' => $accao, ':data' => $date2->format('Y-m-d H:i:s')));
        }
    }

}

?>