<?php
class firmaDao extends DAO{
   private $id;
   private $nome;
   
   

public function setID($id){
    $this->id=$id;
}  

public function getID(){
    return $this->id;
}

public function setNome($nome){
    $this->nome=$nome;
    
}

public function getNome(){
    return $this->nome;
}

public function getFirmas(){
         $result = array();
        
         foreach (parent::query('select * from firma') as $row){
             $firmas = new firmaDao();
             $firmas->setID($row['ID']);
             $firmas->setNome($row['Nome']);
             $result[$firmas->getID()]=$firmas;            
         }
        
        return $result;
    }

    public function isertFirma($firma){
        $sql="insert into firma (nome) values(:firma)";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':firma' => $firma
            ));
        return parent::getDb()->lastInsertId();
    }

}
?>
