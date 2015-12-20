<?php
final class EncOleos{
    
 /** @var int */
    private $oleo;
    /** @var string */
    private $descricao;
    /** @var DateTime */
    private $dataEncomenda;
    /** @var DateTime */
    private $dataRececao;
    /** @var int */
    private $quantidade;
    /** @var int */
    private $area;
    /** @var int */
    private $tipo;
     /** @var int */
    private $utilizador;
     /** @var int */
    private $embalagem;
    /** @var string um de PENDENTE/RECECIONADO */
    private $status;
    
    const STATUS_PENDENTE = "PENDENTE";
    const STATUS_RECECIONADO = "RECECIONADO";
    
    public function __construct() {
        $this->area = $_SESSION['area'];
        $this->utilizador=$_SESSION['user'];
        $this->dataEncomenda=new DateTime();
        $this->setStatus(self::STATUS_PENDENTE);
        
    }
    
    
     public function getOleo(){
        return $this->oleo;
    }
    
    public function setOleo($oleo){
       
        $this->oleo = (int) $oleo;
    }
    
    public function getDescricao(){
        return $this->descricao;
    }
    
    public function setDescricao($Descricao){
        $this->descricao= $Descricao;
    }
    
    public function getDataEncomenda(){
        return $this->dataEncomenda;
    }
    
    public function setDataEncomenda($dataEncomenda){
        $this->dataEncomenda = $dataEncomenda;
    }
    
    public function getDataRececao(){
        return $this->dataRececao;
    }
    
    public function setDataRececao($dataRecacao){
        $this->dataRececao = $dataRecacao;
    }
    
    public function getQuantidade(){
        return $this->quantidade;
    }
    
       public function setQuantidade($quantidade){
        $this->quantidade=$quantidade;
    }
    
    public function setTipo($tipo){
        $this->tipo = $tipo;
        
    }
    
    public function getTipo(){
      return  $this->tipo;
        
    }
    
     public function getUtilizador(){
       return $this->utilizador;
        
    }
    
    public function setEmbalagem($embalagem){
       $this->embalagem=$embalagem;
        
    }
    
    public function getEmbalagem(){
        return $this->embalagem;
    }
    
    public function getArea(){
      return  $this->area;
    }
    
    public function getStatus() {
        return $this->status;
    }

    public function setStatus($status) {
       
        $this->status = $status;
    }
}

?>
