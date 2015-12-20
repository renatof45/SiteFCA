<?php

final class AutorizacaoValidator{
    
    public static function validate(Autorizacao $aut) {
        $errors = array();
        if (!$aut->getNumero()) {
            $errors[] = new Error('numero', 'Numero não pode ser vazio');
        }
        if (!$aut->getTexto()) {
            $errors[] = new Error('texto', 'A descrição tem de ser preenchida');
        }
        return $errors;
    }
}
?>
