<?php

final class PedidosTrabalhoValidator{
    
    public static function validate(PedidosTrabalho $pedido) {
        $errors = array();
       
        if (!$pedido->getDescricao()) {
            $errors[] = new Error('texto', 'A descrição tem de ser preenchida');
        }
        return $errors;
    }
}
?>
