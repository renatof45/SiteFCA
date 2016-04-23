<?php


final class AutorizacaoDao extends DAO{
    
    
     public function registo($ID,$data,$hora){
        $sql='insert into registos(autorizacao,data,hora,relatorio) values (:autorizacao,:data,:hora,:relatorio)';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':data' => $data,
            ':autorizacao' => $ID,
            ':hora'=> $hora,
            ':relatorio' => $_SESSION['relatorio']
        ));
    }
    
    public function findTrabalhosParaRegisto($tipo) {
        $result = array();
        foreach (parent::query("select autorizacoes.tipo,autorizacoes.ID,autorizacoes.Numero,autorizacoes.`Descricao do trabalho`,firma.Nome,autorizacoes.`Data fim`,autorizacoes.`Data inicio`
                                 from autorizacoes join firma on autorizacoes.Firma=firma.ID
                                 where `Data inicio` < '".self::formatDateTime(new DateTime())."' and `Data fim` > '".self::formatDateTime(new DateTime())."' and area =".$_SESSION['area']." and tipo=".$tipo
                                 .' order by autorizacoes.Numero') as $row) {
            $autorizacao = array();
            $autorizacao['tipo']=$row['tipo'];
            $autorizacao['ID']=$row['ID'];
            $autorizacao['Numero']=$row['Numero'];
            $autorizacao['Descricao']=$row['Descricao do trabalho'];
            $autorizacao['Data fim']=$row['Data fim'];
            $autorizacao['Data inicio']=$row['Data inicio'];
            $autorizacao['Firma']=$row['Nome'];
            $result[$autorizacao['ID']] = $autorizacao;
        }
        return $result;
    }

    public function findUltimoRegisto($id){
        foreach(parent::query("SELECT max(id) FROM registos WHERE autorizacao=".$id) as $row){
            //print_r($row);
        if($row['max(id)']!=null){
            foreach(parent::query("SELECT data,hora FROM registos WHERE id=".$row['max(id)']) as $row2)
            return $row2;
        }
        else
           return array('data'=> 'Sem nenhum registo','hora'=>'');
    }
    }

    public function findTrabalhosdoDia(){
        $result = array();
        foreach (parent::query("select autorizacoes.tipo,autorizacoes.ID,autorizacoes.Numero,autorizacoes.`Descricao do trabalho`,firma.Nome,autorizacoes.`Data fim`,autorizacoes.`Data inicio`
                                 from autorizacoes join firma on autorizacoes.Firma=firma.ID
                                 where autorizacoes.area=".$_SESSION['area']." and `Data inicio` < '".self::formatDateTime(new DateTime())."' and `Data fim` > '".self::formatDateTime(new DateTime())."'") as $row) {
            $autorizacao = array();
            $autorizacao['tipo']=$row['tipo'];
            $autorizacao['ID']=$row['ID'];
            $autorizacao['Numero']=$row['Numero'];
            $autorizacao['Descricao']=$row['Descricao do trabalho'];
            $autorizacao['Data fim']=$row['Data fim'];
            $autorizacao['Data inicio']=$row['Data inicio'];
            $autorizacao['Firma']=$row['Nome'];
            $result[$autorizacao['ID']] = $autorizacao;
        }
        return $result;
    }
    
    public function findUnidades($area){
         $unidades = array();
        foreach (parent::query("select id,designacao
                                from unidades
                                 where area=".$area) as $row) {
            $result=array();
            $result['id']=$row['id'];
            $result['designacao']=$row['designacao'];
            array_push($unidades, $result);
        }
        return $unidades;
    }
    
    public function findTrabalhosEmCurso() {
        $result = array();
        $date=new DateTime();
        $date1=$date->format('Y-m-d');
        $date->modify('+1 day');
        $date2=$date->format('Y-m-d');
        foreach (parent::query("select autorizacoes.unidade,unidades.designacao,autorizacoes.tipo,autorizacoes.ID,autorizacoes.Numero,autorizacoes.`Descricao do trabalho`,firma.Nome,autorizacoes.`Data fim`,autorizacoes.`Data inicio`
                                from autorizacoes join firma on autorizacoes.Firma=firma.ID 
                                join registos on autorizacoes.id=registos.autorizacao
                                join unidades on unidades.id=autorizacoes.unidade
                                where autorizacoes.area=".$_SESSION['area']." and registos.data BETWEEN  '".$date1."' and '".$date2."' ") as $row) {
            $autorizacao = array();
            $autorizacao['tipo']=$row['tipo'];
            $autorizacao['ID']=$row['ID'];
            $autorizacao['Numero']=$row['Numero'];
            $autorizacao['Descricao']=$row['Descricao do trabalho'];
            $autorizacao['Data fim']=$row['Data fim'];
            $autorizacao['Data inicio']=$row['Data inicio'];
            $autorizacao['Firma']=$row['Nome'];
            $autorizacao['unidade']=$row['unidade'];
            $autorizacao['designacao']=$row['designacao'];
            $result[$autorizacao['ID']] = $autorizacao;
        }
        return $result;
    }
    


     
    public function findCaducadasSemRegisto(){
         $result = array();
        foreach (parent::query("select autorizacoes.tipo,autorizacoes.ID,autorizacoes.Numero,autorizacoes.`Descricao do trabalho`,firma.Nome,autorizacoes.`Data fim`,autorizacoes.`Data inicio`
                                from autorizacoes join firma on autorizacoes.Firma=firma.ID
                                WHERE autorizacoes.area=".$_SESSION['area']." and autorizacoes.ID not IN (SELECT Autorizacao FROM registos where Autorizacao is not null) and autorizacoes.`Data fim` <'".self::formatDateTime(new DateTime())."'
                                order by autorizacoes.Numero") as $row) {
            $autorizacao = array();
            $autorizacao['ID']=$row['ID'];
            $autorizacao['tipo']=$row['tipo'];
            $autorizacao['Numero']=$row['Numero'];
            $autorizacao['Descricao']=$row['Descricao do trabalho'];
            $autorizacao['Data fim']=$row['Data fim'];
            $autorizacao['Data inicio']=$row['Data inicio'];
            $autorizacao['Firma']=$row['Nome'];
            
            $result[$autorizacao['ID']] = $autorizacao;
        }
        return $result;
    }
    

    
    public function insert(Autorizacao $autorizacao) {
       
        $sql = '
            INSERT INTO autorizacoes (Firma,`Descricao do trabalho`,`Data inicio`, `Data fim`, numero, Area, tipo,unidade,relatorio)
                VALUES (:firma, :texto,:dataInicio , :dataFim, :numero, :area, :tipo, :unidade,:relatorio)';
        return $this->execute($sql, $autorizacao);
    }
    
    
     
    private function getParams(Autorizacao $autorizacao) {
        
        $autorizacao->setDataFim($autorizacao->getDataFim()->add(new DateInterval('P'.$autorizacao->getValidade().'D')));
        $params = array(
            ':numero' => $autorizacao->getNumero(),
            ':dataInicio' => DAO::formatDateTime($autorizacao->getDataInicio()),
            ':dataFim'=>  DAO::formatDateTime($autorizacao->getDataFim()),
            ':firma' => $autorizacao->getFirma(),
            ':texto' => $autorizacao->getTexto(),
            ':tipo' => $autorizacao->getTipo(),
            ':area' => $autorizacao->getArea(),
            ':unidade' => $autorizacao->getUnidade(),
            ':relatorio' => $_SESSION['relatorio']
            );
        
        return $params;
    }
    
    private function execute($sql, Autorizacao $autorizacao) {
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, $this->getParams($autorizacao));
       
        return $autorizacao;
    }
}


?>