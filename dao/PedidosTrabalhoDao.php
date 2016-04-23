<?php


final class PedidosTrabalhoDao extends DAO{
    
    

    public function getByEquipamento($equipamento){
        $result = array();
        foreach (parent::query('SELECT * FROM galp.`pedidos-trabalho` where autorizacao is null and equipamento='.$equipamento) as $row) {
            $pedido = array();
            $pedido['prioridade']=$row['prioridade'];
            $pedido['id']=$row['id'];
            $pedido['unidade']=$row['unidade'];
            $pedido['descricao']=$row['descricao'];
            $pedido['data']=$row['data'];
            $pedido['equipamento']=$row['equipamento'];
            array_push($result,$pedido);
        }
        return $result;
    }

    public function getByStatus($status){
          $result = array();
        foreach (parent::query('SELECT utilizador.Nome,`pedidos-trabalho`.data,`pedidos-trabalho`.id,`pedidos-trabalho`.prioridade,`pedidos-trabalho`.descricao,unidades.designacao,equipamento.equipamento
                                FROM galp.`pedidos-trabalho` join unidades on unidades.id=`pedidos-trabalho`.unidade 
                                join equipamento on equipamento.id=`pedidos-trabalho`.equipamento 
                                join utilizador on utilizador.ID=`pedidos-trabalho`.utilizador
                                where `pedidos-trabalho`.estado ='.$status) as $row) {
            $pedido = array();
            $pedido['prioridade']=$row['prioridade'];
            $pedido['id']=$row['id'];
            $pedido['descricao']=$row['descricao'];
            $pedido['data']=$row['data'];
            $pedido['equipamento']=$row['equipamento'];
            $pedido['designacao']=$row['designacao'];
            $pedido['utilizador']=$row['Nome'];
            array_push($result,$pedido);
        }
        return $result;
    }

     public function update($pedido,$autorizacao){

        $sql='UPDATE `galp`.`pedidos-trabalho` SET `autorizacao`=:autorizacao WHERE `id`=:pedido';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':autorizacao' => $autorizacao,
            ':pedido' => $pedido,
        ));
    }
    
    public function insert(PedidosTrabalho $pedido) {
       
        $sql = '
            INSERT INTO `pedidos-trabalho` (equipamento,descricao,data,unidade,prioridade,utilizador,relatorio)
                VALUES (:equipamento, :descricao,:data , :unidade,:prioridade,:utilizador,:relatorio)';
        return $this->execute($sql, $pedido);
    }
    
    
     
    private function getParams(PedidosTrabalho $pedido) {
        
        //$autorizacao->setDataFim($autorizacao->getDataFim()->add(new DateInterval('P'.$autorizacao->getValidade().'D')));
        $params = array(
            ':equipamento' => $pedido->getequipamento(),
            ':data'=>  $pedido->getData()->format('Y-m-d H:i:s'),
            ':descricao' => $pedido->getDescricao(),
            ':unidade' => $pedido->getUnidade(),
            ':prioridade' => $pedido->getPrioridade(),
            ':utilizador' => $_SESSION['user'],
            ':relatorio' => $_SESSION['relatorio']
            );
        //print_r($params);
        return $params;
    }
    
    private function execute($sql, PedidosTrabalho $pedido) {
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, $this->getParams($pedido));
       
        return $pedido;
    }
}


?>