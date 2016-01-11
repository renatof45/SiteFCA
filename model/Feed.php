<?php

final class Feed{
    
    private $descricao;
    private $titulo;
    /** @var DateTime */
    private $data;
    private $texto;
    
    public function __construct() {
        $now = new DateTime();
        $this->data = $now;
    }
    
    
     public function getDescricao() {
        return $this->descricao;
    }

    public function setDescricao($descricao) {
        $this->descricao = $descricao;
    }
    
      public function getTitulo() {
        return $this->titulo;
    }

    public function setTitulo($titulo) {
        $this->titulo = $titulo;
    }
    
      public function getTexto() {
        return $this->texto;
    }

    public function setTexto($texto) {
        $this->texto = $texto;
    }

    public function getData() {
        return $this->data;
    }

    public function setData($data) {
        $this->dataInicio = $data;
    }
}


?>
