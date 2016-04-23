<?php
final class EncOleosMapper{
    private function __construct() {
    }
    
    
    public static function map(EncOleos $oleos, array $properties) {
        if (array_key_exists('oleo', $properties)) {
            $oleos->setOleo($properties['oleo']);
        }
        if (array_key_exists('embalagem', $properties)) {
            $oleos->setEmbalagem($properties['embalagem']);
        }
         
        if (array_key_exists('quantidade', $properties)) {
            $oleos->setQuantidade($properties['quantidade']);
        }
       if (array_key_exists('tipo', $properties)) {
            $oleos->setTipo($properties['tipo']);
        }
        if (array_key_exists('descricao', $properties)) {
           $oleos->setDescricao($properties['descricao']);
        }
        if (array_key_exists('status', $properties)) {
            $oleos->setStatus($properties['status']);
        }
    }
    private static function createDateTime($input) {
        return DateTime::createFromFormat('Y-n-j', $input);
    }
}
?>
