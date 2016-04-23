<?php
final class Autorizacao{
    
    const VERMELHA = 1;
    const VERDE = 2;
    /** @var int */
    private $numero;
    /** @var string */
    private $texto;
    /** @var DateTime */
    private $dataInicio;
    /** @var DateTime */
    private $dataFim;
    /** @var int */
    private $firma;
    /** @var int */
    private $area;
    /** @var int */
    private $tipo;
    /** @var int */
    private $validade;

    private $unidade;
    
    public function __construct() {
        $this->area = $_SESSION['area'];
    }
   
    public static function todosTipos() {
        return array(
            self::VERMELHA,
            self::VERDE,
        );
    }
    
    public function setValidade($validade){
        $this->validade=$validade;
    }
    
    public function getValidade(){
       return $this->validade;
    }
    
    public function getArea(){
        return $this->area;
    }
    public function getNumero(){
        return $this->numero;
    }
    public function getUnidade(){
        return $this->unidade;
    }

    public function setUnidade($unidade){
        $this->unidade=$unidade;
    }
    
    public function setNumero($numero){
        if ($this->numero !== null && $this->numero != $id) {
            throw new Exception('Cannot change identifier to ' . $numero . ', already set to ' . $this->numero);
        }
        $this->numero = (int) $numero;
    }
    
    public function getTexto(){
        return $this->texto;
    }
    
    public function setTexto($texto){
        $this->texto= $texto;
    }
    
    public function getDataInicio(){
        return $this->dataInicio;
    }
    
    public function setDataInicio($data){
        $this->dataInicio = $data;
    }
    
    public function getDataFim(){
        return $this->dataFim;
    }
    
    public function setDataFim($data){
        $this->dataFim = $data;
    }
    

        public function getFirma(){
        return $this->firma;
    }
    
       public function setFirma($firma){
        $this->firma=$firma;
    }
    
    public function setTipo($tipo){
        $this->tipo = $tipo;
        
    }
    
    public function getTipo(){
      return  $this->tipo;
        
    }
    


}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
