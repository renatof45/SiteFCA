<?php

final class EquipamentoDao extends DAO {

    public function getAll1($unidade) {
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
                                where unidade=" . $unidade . " and equipamento.tipo=" . $type) as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['Equipamento'] = $row['Equipamento'];
            $result['estado'] = $row['status'];
            array_push($equipamento, $result);
        }
        return $equipamento;
    }

    public function getAllByType($type) {
        $equipamento = array();
        foreach (parent::query("select unidade,id,status,Equipamento
                                from equipamento
                                where  equipamento.tipo=" . $type . " order by Equipamento") as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['Equipamento'] = $row['Equipamento'];
            $result['estado'] = $row['status'];
            $result['unidade'] = $row['unidade'];
            array_push($equipamento, $result);
        }
        return $equipamento;
    }

    public function getAll() {
        $equipamento = array();
        foreach (parent::query("select unidade,id,status,Equipamento,tipo
                                from equipamento ") as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['Equipamento'] = $row['Equipamento'];
            $result['estado'] = $row['status'];
            $result['unidade'] = $row['unidade'];
            $result['tipo'] = $row['tipo'];
            //$result['manutencao'] = $row['manutencao'];
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
        foreach (parent::query("select id,Equipamento,descricao,tipo
                                from equipamento
                                 where id=" . $id) as $row) {
            return array('equipamento' => $row['Equipamento'], 'descricao' => $row['descricao'],'tipo'=>$row['tipo']);
        }
    }

    public function getEstadoByEquipamento($equipamento) {
        $estados = array();
        foreach (parent::query("SELECT * FROM galp.`status-equipamento`
                               where equipamento =" . $equipamento . "  and `data` <= now()
                               ORDER BY `data` DESC
                               LIMIT 1;") as $row) {
            return array('id' => $row['id'], 'estado' => $row['status'], 'data' => $row['data'], 'descricao' => $row['descricao'], 'comentario' => $row['comentario'], 'equipamento' => $this->getEqipmentoById($equipamento));
        }
    }

    public function getEstadoByIf($id) {
        $equipamento = array();
        foreach (parent::query("SELECT * FROM galp.accoes where id=" . $id) as $row) {
            return $row['descricao'];
        }
    }

    public function insertNovoEquipamento($equipamento, $unidade, $descricao, $tipo) {
        $sql = "INSERT INTO `galp`.`equipamento` (`equipamento`, `unidade`, `estado`, `tipo`, `relatorio`,`descricao`) VALUES (:equipamento, :unidade, :estado, :tipo, :relatorio,:descricao);";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':estado' => '5', ':relatorio' => $_SESSION['relatorio'], ':unidade' => $unidade, ':tipo' => $tipo, ':descricao' => $descricao));
    }

    public function updateEtapas($status, $accao) {
        $sql = "INSERT INTO `galp`.`status-etapas` (`status`, `accao`, `relatorio`) VALUES (:status, :accao, :relatorio)";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':accao' => $accao, ':status' => $status, ':relatorio' => $_SESSION['relatorio']));
    }
    
    public function updateEquipamento($equipamento, $id, $descricao) {
        //UPDATE `galp`.`equipamento` SET `relatorio`='141', `descricao`='Bomba de carga da unidade' WHERE `id`='1';
        $sql = "UPDATE `galp`.`equipamento` SET `equipamento`=:equipamento,`relatorio`=:relatorio, `descricao`=:descricao WHERE `id`=:id";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':id' => $id, ':relatorio' => $_SESSION['relatorio'], ':descricao' => $descricao));
    }
    
    public function deleteEquipamneto($equipamento){
        $sql = "DELETE FROM `galp`.`equipamento`  WHERE `id`=:id";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id' => $equipamento));
        $sql = "DELETE FROM galp.`status-equipamento`  WHERE `equipamento`=:id";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':id' => $equipamento));
    }

    public function getEtapas($status) {
        $etapas = array();
        foreach (parent::query("SELECT * FROM galp.`status-etapas` where status=" . $status) as $row) {
            array_push($etapas, $row);
        }
        return $etapas;
    }

    public function updateStatus($equipamento, $status, $comentario, $descricao) {
        $sql = 'UPDATE `galp`.`equipamento` SET `status`=:status,`relatorio`=:relatorio WHERE `id`=:equipamento';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':status' => $status, ':relatorio' => $_SESSION['relatorio']));

        $sql = 'INSERT INTO `galp`.`status-equipamento` (`relatorio`, `equipamento`, `status`,`comentario`,`descricao`) VALUES (:relatorio, :equipamento, :status,:comentario,:descricao);';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':equipamento' => $equipamento, ':status' => $status, ':relatorio' => $_SESSION['relatorio'], ':descricao' => $descricao, ':comentario' => $comentario));
    }

    public function getAccoes($tipo) {
        $accoes = array();
        foreach (parent::query("SELECT * FROM galp.accoes where tipo=" . $tipo) as $row) {
            array_push($accoes, $row['descricao']);
        }
        return $accoes;
    }

    public function getHistory($equipamento) {
        $history = array();
        $etapas = array();
        foreach (parent::query("SELECT * FROM galp.`status-equipamento` where equipamento=" . $equipamento . " ORDER BY `data` DESC") as $row1) {
            foreach (parent::query("SELECT * FROM galp.`status-etapas` where status=" . $row1['id']) as $row2) {
                array_push($etapas, $row2);
            }
            array_push($history, array('status' => $row1, 'etapas' => $etapas));
            unset($etapas);
            $etapas = array();
        }
        return $history;
    }

    public function getHorasDeMarcha($equipamento, $status, $start) {
        date_default_timezone_set('Europe/Lisbon');
        $total = 0;
        $last_status = '';
        $starttime = new DateTime('2000-00-00 00:00:00');
        $GLOBALS['total_time'] = new DateTime('2000-00-00 00:00:00');
        $query = null;
        $found = false;
        $get_result = false;
        $first_date = false;
        if ($start == 'mes') {
            $query = 'WHERE MONTH(`data`) = MONTH(CURDATE()) and equipamento=';
        } elseif ($start == 'total') {
            $query = 'WHERE equipamento=';
        }
        foreach (parent::query("SELECT * FROM galp.`status-equipamento`  " . $query . $equipamento)as $row) {
            $get_result = true;
           
            if ($row['status'] == 'Em Serviço' || $row['status'] == 'Em Serviço - Com anomalia' ) {
                 //print_r($row['status']);
                $GLOBALS['old_date'] = new DateTime($row['data']);
                $last_status = $row['status'];
                $found = true;
            }
            if ($found) {
                $GLOBALS['new_date'] = new DateTime($row['data']);
                $diff = $GLOBALS['new_date']->diff($GLOBALS['old_date']);
                $last_status = $row['status'];
                $GLOBALS['total_time']->add($diff);
                $found = false;
            }
        }
        if (!$get_result) {
            foreach (parent::query("SELECT status FROM galp.`equipamento`  WHERE id=" . $equipamento)as $row) {
                if ($row['status'] == 'Em Serviço') {
                    $now = new DateTime();
                    $days = intval($now->format('d'));
                    return (24 * $days + intval($now->format('h'))) - 24;
                }
            }
        }
        if ($last_status == 'Em Serviço' || $last_status == 'Em Serviço - Com anomalia') {
            
            //print_r($GLOBALS['total_time']);
            $new_date = new DateTime();
            $diff = $new_date->diff($GLOBALS['old_date']);
            $GLOBALS['total_time']->add($diff);
            $diff = $GLOBALS['total_time']->diff($starttime);
            $hours = $diff->h;
            $hours = $hours + ($diff->days * 24);
            //echo $equipamento . ' - '. $hours .' ; ';
            return $hours;
        } else {
            //print_r($GLOBALS['total_time']);
            $diff = $GLOBALS['total_time']->diff($starttime);
            $hours = $diff->h;
            $hours = $hours + ($diff->days * 24);
            //echo $equipamento . ' - '. $hours.' ; ';
            return $hours;
        }
    }

}

?>