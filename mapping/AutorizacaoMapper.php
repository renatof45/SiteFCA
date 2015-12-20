<?php
final class AutorizacaoMapper {

    private function __construct() {
    }

    
    
    public static function map(Autorizacao $autorizacao, array $properties) {
        if (array_key_exists('numero', $properties)) {
            $autorizacao->setNumero($properties['numero']);
        }
        if (array_key_exists('texto', $properties)) {
            $autorizacao->setTexto($properties['texto']);
        }
        if (array_key_exists('dataInicio', $properties)) {
            $dataInicio = self::createDateTime($properties['dataInicio']);
            
                $autorizacao->setDataInicio($dataInicio);
            
            
        }
        if (array_key_exists('dataFim', $properties)) {
           $dataFim = self::createDateTime($properties['dataFim']);
            $autorizacao->setDataFim($dataFim);
        }
       if (array_key_exists('tipo', $properties)) {
            $autorizacao->setTipo($properties['tipo']);
        }
        if (array_key_exists('firma', $properties)) {
            $autorizacao->setFirma($properties['firma']);
        }
         if (array_key_exists('validade', $properties)) {
            $autorizacao->setValidade($properties['validade']);
        }
        if (array_key_exists('unidade', $properties)) {
            $autorizacao->setUnidade($properties['unidade']);
        }
        
    }
    private static function createDateTime($input) {
        return DateTime::createFromFormat('Y-n-j', $input);
    }

}
?>
