<?php
final class PedidosTrabalho{
    
    const URGENTE = 1;
    const EMERGENTE = 2;
    const NORMAL = 3;
    /** @var int */
    private $descricao;
    /** @var DateTime */
    private $data;
    
    private $equipamento;


    private $area;
    /** @var int */
    private $prioridade;
    
    private $unidade;
    
    public function __construct() {
        $this->area = $_SESSION['area'];
        $now= new DateTime();
        $this->data=$now;
    }
   
    
   public function getArea(){
        return $this->area;
    }
    public function getequipamento(){
        return $this->equipamento;
    }


     public function setequipamento($equipamento){
        $this->equipamento=$equipamento;
    }
    public function getUnidade(){
        return $this->unidade;
    }

    public function setUnidade($unidade){
        $this->unidade=$unidade;
    }
    
   
    
    public function getDescricao(){
        return $this->texto;
    }
    
    public function setDescricao($texto){
        $this->texto= $texto;
    }
    
    public function getData(){
        return $this->data;
    }
    
    public function setData($data){
        $this->dataInicio = $data;
    }
    
    
    public function setPrioridade($tipo){
        $this->prioridade = $tipo;
        
    }
    
    public function getPrioridade(){
      return  $this->prioridade;
        
    }
    


}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>