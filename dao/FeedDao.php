<?php

final class FeedDao extends DAO {

    public function getAll() {
        $feeds = array();
        foreach (parent::query("SELECT * FROM galp.feed ;") as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['titulo'] = $row['titulo'];
            $result['descricao'] = $row['descricao'];
            $result['texto'] = $row['texto'];
            $result['data'] = $row['data'];
            $result['publicar'] = $row['publicar'];
            array_push($feeds, $result);
        }
        return $feeds;
    }

    public function getFeed($id) {
        foreach (parent::query("SELECT * FROM galp.feed where id=" . $id) as $row) {
            $result = array();
            $result['id'] = $row['id'];
            $result['titulo'] = $row['titulo'];
            $result['descricao'] = $row['descricao'];
            $result['texto'] = $row['texto'];
            $result['data'] = $row['data'];
            $result['publicar'] = $row['publicar'];
            return $result;
        }
    }

    public function update($id,$feed) {
        $sql = "UPDATE `galp`.`feed` SET `descricao`=:descricao,`publicar`=:publicar, `titulo`=:titulo, `texto`=:texto, `data`=:data WHERE `id`=:id;";
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':descricao' => $feed->getDescricao(),
            ':titulo' => $feed->getTitulo(),
            ':data' => parent::formatDateTime($feed->getData()),
            ':texto' => $feed->getTexto(),
            ':publicar' => $feed->getPublicar(),
            ':id' => $id
        ));
    }

    
    
    public function insert(Feed $feed) {
        $sql = 'INSERT INTO `galp`.`feed` (`descricao`, `titulo`, `data`, `texto`,`publicar`)
                VALUES (:descricao, :titulo,:data ,:texto,:publicar)';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':descricao' => $feed->getDescricao(),
            ':titulo' => $feed->getTitulo(),
            ':data' => parent::formatDateTime($feed->getData()),
            ':texto' => $feed->getTexto(),
            ':publicar' => $feed->getPublicar()
        ));
    }

}

?>
