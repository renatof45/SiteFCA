<?php

final class Embalagens{


	private $embalagens;

	private $designacao;

	private $tipo;

	private $area;

	public function setDesignacao($designacao){
        $this->nome=$nome;
	}

	public function setNumero($numero){
        $this->numero=$numero;
	}

	public function setTipo($tipo){
		$this->tipo=$tipo;
	}

    public function setArea($area){
    	$this->area=$area;
    }
  
	public function getNome(){
		 return $this->nome;
	}

	public function getNumero(){
          return $this->numero; 
	}

	public function getTipo(){
		 return $this->tipo;
	}

	public function getArea(){
		 return $this->area;
	}
}