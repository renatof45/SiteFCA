<?php
class UtilizadorDao extends DAO{
    

   public function insert(Utilizador $utilizador) {
   	  $sql='INSERT INTO utilizador (ID,Nome,Tipo,Pass) values (:id,:nome,:tipo,:pass);';
   	  $this->execute($sql, $utilizador);
   	  $lenght=count($utilizador->getArea());
   	  echo $lenght;
   	  $sql='insert into `area-utilizador` (area, utilizador) values (:area,:utilizador);';
      $areas=$utilizador->getArea();
   	  foreach($areas as $area){
   	  	$statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':area'=>$area,':utilizador'=>$utilizador->getNumero()));
   	  }
   }
   
  public function resetPass($user,$pass){
       $sql = 'UPDATE galp.`utilizador` SET `Pass`=:pass WHERE `ID`=:user';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':pass' => $pass,
            ':user' => $user
        ));
  }
   
  public function delete($numero){
      $sql="DELETE FROM `area-utilizador` WHERE utilizador=:id";
      $statement = parent::getDb()->prepare($sql);
      parent::executeStatement($statement, array(
           ':id' => $numero,
        ));
      $sql="DELETE FROM `utilizador` WHERE id=:id";
      $statement = parent::getDb()->prepare($sql);
      parent::executeStatement($statement, array(
           ':id' => $numero,
        ));
  }

 

   public function checkUser($numero){
   	  $result= parent::query('select * from utilizador', PDO::FETCH_ASSOC);
   	  foreach ($result as $user) {
        if ($user['ID'] == $numero) {
            return true;
        }
    }
   }

  public function getTipo($user){
      foreach (parent::query('SELECT Tipo
                                FROM utilizador
                                where utilizador.id='.$user) as $row) {
          return $row['Tipo'];
          
      }
  }
   

   public function getUser($numero){
        $user = array();
        $areas = array();
        foreach (parent::query('SELECT utilizador.id,utilizador.nome,utilizador.pass,utilizador.Tipo
                                FROM utilizador
                                where utilizador.id='.$numero) as $row) {
            $user['id']=$row['id'];
            $user['nome']=$row['nome'];
            $user['pass']=$row['pass'];
            $user['tipo']=$row['Tipo'];
        }

        foreach (parent::query('SELECT `area-utilizador`.area as id, area.area as nome
                                FROM `area-utilizador` join area on `area-utilizador`.area=area.id
                                where `area-utilizador`.utilizador='.$numero) as $row) {
            //$area=array();
            $areas[$row['id']]=$row['nome'];
            //$area['designacao']=$row['nome'];
            //array_push($areas,$area);
        }
        $user['area']=$areas;
        return $user;
   }


   private function getParams(Utilizador $utilizador) {
        $params = array(
            ':id' => $utilizador->getNumero(),
            ':nome' => $utilizador->getNome(),
            ':tipo' => $utilizador->getTipo(), 
            ':pass'=> $utilizador->getPass()     
        );
        
        return $params;
    }

   


   private function execute($sql, Utilizador $utilizador) {
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, $this->getParams($utilizador));
       
        return $utilizador;
    }

}
?>