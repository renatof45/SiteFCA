<?php

final class UtilizadorValidator{
    
    public static function validate(Utilizador $utilizador) {
        $errors = array();
        if (!$utilizador->getNumero()) {
            $errors[] = new Error('numero', 'Numero não pode ser vazio');
        }
        if (!$utilizador->getNome()) {
            $errors[] = new Error('nome', 'O nome tem de ser preenchido');
        }
        if (!$utilizador->getArea()){
            $errors[] = new Error('area', 'Tem de escolher pelo menos uma area!');
        }
        if (!$utilizador->getArea()){
            $errors[] = new Error('pass', 'A password tem de ser preenchida');
        }
         $dao = new UtilizadorDao();
         if($dao->checkUser($utilizador->getNumero())){
            $errors[] = new Error('num', 'O numero mecanografico já existe');
         }
        return $errors;
    }
}
?>