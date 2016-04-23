<?php
final class PedidosTrabalhoMapper {

    private function __construct() {
    }

    
    
    public static function map(PedidosTrabalho $pedido, array $properties) {
        if (array_key_exists('equipamento', $properties)) {
            $pedido->setequipamento($properties['equipamento']);
        }
        if (array_key_exists('descricao', $properties)) {
            $pedido->setDescricao($properties['descricao']);
        }
        if (array_key_exists('data', $properties)) {
            $data = self::createDateTime($properties['data']);
            
                $pedido->setData($data);
            
            
        }
      
       if (array_key_exists('prioridade', $properties)) {
            $pedido->setPrioridade($properties['prioridade']);
        }
        if (array_key_exists('unidade', $properties)) {
            $pedido->setUnidade($properties['unidade']);
        }
        
    }
    private static function createDateTime($input) {
        return DateTime::createFromFormat('Y-n-j', $input);
    }

}
?>