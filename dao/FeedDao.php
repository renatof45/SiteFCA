<?php

final class FeedDao extends DAO{

      public function getAll(){
         $feeds = array();
        foreach (parent::query("SELECT * FROM galp.feed;") as $row) {
            $result=array();
            $result['id']=$row['id'];
            $result['titulo']=$row['titulo'];
            $result['descricao']=$row['descricao'];
            $result['texto']=$row['texto'];
            $result['data']=$row['data'];
            array_push($feeds, $result);
        }
        return $feeds;
    }
    
     public function insert(Feed $feed) {
        $sql = 'INSERT INTO `galp`.`feed` (`descricao`, `titulo`, `data`, `texto`)
                VALUES (:descricao, :titulo,:data ,:texto)';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':descricao' => $feed->getDescricao(),
            ':titulo' => $feed->getTitulo(),
            ':data' =>  parent::formatDateTime($feed->getData()) ,
            ':texto' => $feed->getTexto()
        ));
    }
}
?>
