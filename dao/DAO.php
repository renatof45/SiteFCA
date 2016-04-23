<?php

class DAO {

    private $db = null;

    public function __destruct() {
        // close db connection
        $this->db = null;
    }

    public function getDb() {
        if ($this->db !== null) {
            return $this->db;
        }
        $config = Config::getConfig("db");
        try {
            $this->db = new PDO($config['dsn'], $config['username'], $config['password']);
        } catch (Exception $ex) {
            throw new Exception('DB connection error: ' . $ex->getMessage());
        }
        return $this->db;
    }

    protected function executeStatement(PDOStatement $statement, array $params) {
        if (!$statement->execute($params)) {
            self::throwDbError($this->getDb()->errorInfo());
        }
        return $statement;
    }

    public function query($sql) {
        $statement = $this->getDb()->query($sql, PDO::FETCH_ASSOC);
        if ($statement === false) {
            self::throwDbError($this->getDb()->errorInfo());
        }
        return $statement;
    }

    private static function throwDbError(array $errorInfo) {
        // TODO log error, send email, etc.
        throw new Exception('DB error [' . $errorInfo[0] . ', ' . $errorInfo[1] . ']: ' . $errorInfo[2]);
    }

    protected static function formatDateTime(DateTime $date) {
        return $date->format(DateTime::ISO8601);
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
