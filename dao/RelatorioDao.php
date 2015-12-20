<?php
class RelatorioDao extends DAO{



  public function isShiftOpen($data,$turno){
       $result= parent::query('select * from relatorios', PDO::FETCH_ASSOC);
       foreach ($result as $relatorio) {
        if ($relatorio['turno'] == $turno && $relatorio['data']==$data) {
            return $relatorio['id'];
        }
    }
    return 0;
   }

   public function insert($turno,$data){
   		$sql="INSERT INTO `galp`.`relatorios` (`turno`, `data`,`utilizador`,`area`) VALUES (:turno, :data, :utilizador,:area)";
   		$statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(':turno'=>$turno,':data'=>$data,':utilizador'=>$_SESSION['user'],':area'=>$_SESSION['area']));
        return self::isShiftOpen($data,$turno);
   }



}

?>