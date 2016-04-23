<?php

final class Utilizador{


	private $numero;

	private $nome;

	private $tipo;

	private $area;

	private $pass;

   

	public function __construct ($utilizador){
	  if($utilizador!=null){
        $this->numero=$utilizador['id'];
        $this->nome=$utilizador['nome'];
        $this->area=$utilizador['area'];
        $this->pass=$utilizador['pass'];
        //$this->tipo=$utilizador['tipo'];
    }
	}

	public function setNome($nome){
        $this->nome=$nome;
	}

	public function setNumero($numero){
        $this->numero=$numero;
	}

	public function setTipo($tipo){
		$this->tipo=$tipo;
	}

	public function setPass($pass){
		$this->pass=$pass;
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

	public function getPass(){
		return $this->pass;
	}

	public function getArea(){
		 return $this->area;
	}
}