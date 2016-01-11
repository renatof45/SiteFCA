<?php

final class FeedValidator{
    
    public static function validate(Feed $feed) {
        $errors = array();
       
        if (!$feed->getDescricao()) {
            $errors[] = new Error('descricao', 'A descrição tem de ser preenchida');
        }
        if (!$feed->getTitulo()) {
            $errors[] = new Error('titulo', 'Tem de atribuir um titulo!');
        }
        return $errors;
    }
}
?>
