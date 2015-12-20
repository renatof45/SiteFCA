<?php
final class UtilizadorMapper {

    private function __construct() {
    }

    
    
    public static function map(Utilizador $utilizador, array $properties) {
        if (array_key_exists('numero', $properties)) {
            $utilizador->setNumero($properties['numero']);
        }
        if (array_key_exists('nome', $properties)) {
            $utilizador->setNome($properties['nome']);
        }
        
       if (array_key_exists('tipo', $properties)) {
            $utilizador->setTipo($properties['tipo']);
        }
        if (array_key_exists('area', $properties)) {
            $utilizador->setArea($properties['area']);
        }
         if (array_key_exists('pass', $properties)) {
            $utilizador->setPass($properties['pass']);
        }
       
        
    }
   

}
?>