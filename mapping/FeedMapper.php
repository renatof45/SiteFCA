<?php

final class FeedMapper {

    public static function map(Feed $feed, array $properties) {
        if (array_key_exists('titulo', $properties)) {
            $feed->setTitulo($properties['titulo']);
        }
        if (array_key_exists('descricao', $properties)) {
            $feed->setDescricao($properties['descricao']);
        }
    
        if (array_key_exists('texto', $properties)) {
            $feed->setTexto($properties['texto']);
        }
        if (array_key_exists('publicar', $properties)) {
            $feed->setPublicar($properties['publicar']);
        }
        
    }

    private static function createDateTime($input) {
        return DateTime::createFromFormat('Y-n-j', $input);
    }

}

?>
