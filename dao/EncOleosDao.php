<?php
class EncOleosDao extends DAO{
    
    
    public function update($encID){
        $sql='UPDATE encomendas set Data_de_rececao= :Data_de_rececao where ID=:id';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':Data_de_rececao' => self::formatDateTime(new DateTime()),
            ':id' => $encID,
        ));
    }

   public function update_embalagens($old_code,$new_code){
     $sql='UPDATE emabalagens set Codigo_oleo= :new_code where Codigo_oleo=:old_code';
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':old_code' => $old_code,
            ':new_code' => $new_code
        ));
   }

   public function delete_from_area_oloes($oleo){
      $sql="DELETE FROM `area-oleos` WHERE oleo=:id";
      $statement = parent::getDb()->prepare($sql);
      parent::executeStatement($statement, array(
           ':id' => $oleo,
        ));
   }

   public function delete_from_embalagens($code){
      $sql="delete from emabalagens where Codigo_oleo=:code";
      $statement = parent::getDb()->prepare($sql);
      parent::executeStatement($statement, array(
           ':code' => $code,
        ));
   }
   

   public function get_Codigo_by_Oleo($oleo){
      $result=array();
      foreach (parent::query('SELECT ID,Codigo_oleo, Capacidade FROM galp.emabalagens where oleo='.$oleo.';') as $row) {
        $aux=array();
        $aux['id']=$row['ID'];
        $aux['codigo_oleo']=$row['Codigo_oleo'];
         $result[$row['Capacidade']]=$aux;
      }
      return $result;
   }
    
   public function insert_into_area_oleos($oleo,$area,$embalagem,$descriçao,$stock_minimo){
       $sql="insert into  `area-oleos` (area,oleo,Utilização,embalagem,stock_minimo) 
             VALUES (:area,:oleo,:utilizacao,:embalagem,:stock)";
       $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':area' => $area,
            ':oleo' => $oleo,
            ':embalagem' => $embalagem,
            ':utilizacao' => $descriçao,
            ':stock' => $stock_minimo
        ));

   }

  public function insert_into_oleos($name){
    $sql="insert into oleo(Designacao) VALUES(:name)";
    $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, array(
            ':name' => $name
        ));
  }

   public function insert_into_embalagens($code,$capacidade,$oleo){
    $sql="insert into emabalagens(oleo,Codigo_oleo,Capacidade) VALUES (:oleo,:codigo,:capacidade)";
    $statement = parent::getDb()->prepare($sql);
    parent::executeStatement($statement, array(
        ':oleo' => $oleo,
        ':capacidade' => $capacidade,
        ':codigo' => $code
    ));
}
    
    public function findPendentes() {
        $result = array();
        foreach (parent::query('SELECT oleo.Designacao, Emabalagens.Capacidade, Area.Area, Encomendas.Data_de_encomenda, Utilizador.Nome, Encomendas.Tipo,Encomendas.ID,Encomendas.Descricao
                                FROM Utilizador INNER JOIN (oleo INNER JOIN (Emabalagens INNER JOIN ((Area INNER JOIN `area-oleos` ON Area.ID = `area-oleos`.area) INNER JOIN Encomendas ON Area.ID = Encomendas.area) ON Emabalagens.ID = Encomendas.Embalagem) ON (oleo.ID = Encomendas.Oleo) AND (oleo.ID = Emabalagens.oleo) AND (oleo.ID = `area-oleos`.oleo)) ON Utilizador.ID = Encomendas.Utilizador
                                WHERE (((Encomendas.Data_de_rececao) Is Null) AND ((Area.ID)='.$_SESSION['area'].'));') as $row) {
            $encomenda = array();
            $encomenda['Designacao']=$row['Designacao'];
            $encomenda['Capacidade']=$row['Capacidade'];
            $encomenda['Area']=$row['Area'];
            $encomenda['Data_de_encomenda']=$row['Data_de_encomenda'];
            $encomenda['Nome']=$row['Nome'];
            $encomenda['Tipo']=$row['Tipo'];
            $encomenda['ID']=$row['ID'];
            $encomenda['Descricao']=$row['Descricao'];
            $result[$encomenda['ID']] = $encomenda;
        }
        return $result;
    }
    
    
    
    public function insert(EncOleos $EncOleos) {
       
        $sql = 
            "INSERT INTO `galp`.`encomendas` (`Data_de_encomenda`, `Utilizador`, `Oleo`, `Qantidade`, `Embalagem`, `area`, `Tipo`,`Descricao`) 
             VALUES (:dataEncomenda, :utilizador, :oleo, :quantidade, :embalagem, :area, :tipo, :descricao)";
        return $this->execute($sql, $EncOleos);
    }
  
    
   private function getParams(EncOleos $EncOleos) {
        $params = array(
            ':oleo' => $EncOleos->getOleo(),
            ':dataEncomenda' => DAO::formatDateTime($EncOleos->getDataEncomenda()),
            ':embalagem' => $EncOleos->getEmbalagem(),
            ':quantidade' => $EncOleos->getQuantidade(),
            ':tipo' => $EncOleos->getTipo(),
            ':utilizador'=>$EncOleos->getUtilizador(),
            ':area'=>$EncOleos->getArea(),
            ':descricao'=>$EncOleos->getDescricao(),
            
        );
        
        return $params;
    }
    
    
    private function execute($sql, EncOleos $EncOleos) {
        $statement = parent::getDb()->prepare($sql);
        parent::executeStatement($statement, $this->getParams($EncOleos));
       
        return $EncOleos;
    }
    
    
    public function preencherPDF ($embalagem,$area){
    
    $result= parent::query("SELECT oleo.Designacao, Emabalagens.codigo_oleo, Emabalagens.Capacidade, Area.unidades, Area.`Centro de custo`, Area.Area
                           FROM Area INNER JOIN ((oleo INNER JOIN Emabalagens ON oleo.ID = Emabalagens.oleo) INNER JOIN `area-oleos` ON oleo.ID = `area-oleos`.oleo) ON Area.ID = `area-oleos`.area
                           WHERE (((Emabalagens.ID)=".$embalagem.")and area.ID=".$area.");");
    foreach ($result as $row){
        $oleo=array();
        $oleo['Designacao']=$row['Designacao'];
        $oleo['codigo_oleo']=$row['codigo_oleo'];
        $oleo['Capacidade']=$row['Capacidade'];
        $oleo['unidades']=$row['unidades'];
        $oleo['Centro de custo']=$row['Centro de custo'];
        $oleo['Area']=$row['Area'];
    }
    return $oleo;
}

public function setOleos($oleo){
    $oleos=array();
    $result= parent::query("SELECT oleo.Designacao, area.ID,emabalagens.Codigo_oleo,emabalagens.Capacidade,`area-oleos`.Utilização,`area-oleos`.stocK_minimo FROM galp.`area-oleos` 
                            join area on area.ID=`area-oleos`.area 
                            join oleo on `area-oleos`.oleo=oleo.ID
                            join emabalagens on emabalagens.ID=`area-oleos`.embalagem
                            where `area-oleos`.oleo=".$oleo.";");
    foreach ($result as $row){
        $oleo=array();
        $oleo['Designacao']=$row['Designacao'];
        $oleo['codigo_oleo']=$row['Codigo_oleo'];
        $oleo['Capacidade']=$row['Capacidade'];
        $oleo['Utilização']=$row['Utilização'];
        $oleo['Area']=$row['ID'];
        $oleo['stock']=$row['stocK_minimo'];
        $oleos[$row['ID']][$row['Capacidade']]=$oleo;
    }
    return $oleos;

}



 public function check_SAP_Code($code){
    $counter=0;
    $result=parent::query("SELECT * FROM emabalagens where Codigo_oleo='".$code."'");
    foreach ($result as $row) {
        $counter++;
    }

    if ($counter)
        return 1;
    else
        return 0;
 }


public function getOleosbyCodigo($codigo){
    $oleos=array();
    $result= parent::query("SELECT oleo.Designacao, area.ID,emabalagens.Codigo_oleo,emabalagens.Capacidade,`area-oleos`.Utilização,`area-oleos`.stocK_minimo FROM galp.`area-oleos` 
                            join area on area.ID=`area-oleos`.area 
                            join oleo on `area-oleos`.oleo=oleo.ID
                            join emabalagens on emabalagens.ID=`area-oleos`.embalagem
                            where emabalagens.Codigo_oleo='".$codigo."';");
    foreach ($result as $row){
        $oleo=array();
        $oleo['Designacao']=$row['Designacao'];
        $oleo['codigo_oleo']=$row['Codigo_oleo'];
        $oleo['Capacidade']=$row['Capacidade'];
        $oleo['Utilização']=$row['Utilização'];
        $oleo['Area']=$row['ID'];
        $oleo['stock']=$row['stocK_minimo'];
        $oleos[$row['ID']][$row['Capacidade']]=$oleo;
    }
    return $oleos;

}

public function getOleo($oleo){
    $result= parent::query('select Designacao from oleo where ID='.$oleo);
    foreach ($result as $row){
        return $row['Designacao'];
    }
        
}


public function getOleos($area){
        $result = array();
   
         foreach (parent::query('SELECT DISTINCT designacao, oleo FROM galp.`area-oleos` INNER JOIN oleo WHERE `area-oleos`.oleo = oleo.id AND `area-oleos`.area='.$area.';') as $row){
             $oleo=array();
             $oleo['id']=$row['oleo'];
             $oleo['Designacao']=$row['designacao'];
             array_push($result,$oleo);            
         }
        
        return $result;   
}

public function get_Oleos(){
    $result=array();
    foreach (parent::query("SELECT * FROM oleo;") as $row) {
        $aux=array();
        $aux['ID']=$row['ID'];
        $aux['Designacao']=$row['Designacao'];
        $result[$row['ID']]=$aux;
    }
    return $result;
}

public function get_oleo_by_name($name){
    $result=array();
    foreach (parent::query("SELECT * FROM galp.oleo where Designacao='".$name."';") as $row) {
        $aux=array();
        $aux['ID']=$row['ID'];
        $aux['Designacao']=$row['Designacao'];
        $result=$aux;
    }
    return $result;
}

public function getEmabalagem($oleo){
    $result = array();
    foreach (parent::query("SELECT  emabalagens.Capacidade, emabalagens.ID, emabalagens.Codigo_oleo
                         FROM (oleo INNER JOIN `area-oleos` ON oleo.ID = `area-oleos`.oleo) INNER JOIN Emabalagens ON `Area-oleos`.embalagem = Emabalagens.id
                         WHERE (((oleo.ID)=".$oleo.") AND ((`Area-oleos`.area)=".$_SESSION['area']."));") as $row){
            $embalagem=array();
            $embalagem['id']=$row['ID'];
            $embalagem['Capacidade']=$row['Capacidade'];
            $embalagem['codigo']=$row['Codigo_oleo'];
            $result[$embalagem['id']]=$embalagem;
            }
            return $result;
    
}

public function getLubHistory($oleo){
    $encomendas = array();
    foreach (parent::query("SELECT `Data_de_encomenda`,`Data_de_rececao`,utilizador.Nome,Qantidade,emabalagens.Capacidade,area.Area,encomendas.Qantidade
                            FROM `encomendas` join utilizador on encomendas.Utilizador=utilizador.ID 
                            join emabalagens on encomendas.Embalagem=emabalagens.ID 
                            join area on encomendas.area=area.ID 
                            WHERE encomendas.Oleo=".$oleo) as $row){
            $encomenda=array();
             $encomenda['Qantidade']=$row['Qantidade'];
            $encomenda['Data_de_encomenda']=$row['Data_de_encomenda'];
            $encomenda['Data_de_rececao']=$row['Data_de_rececao'];
            $encomenda['Capacidade']=$row['Capacidade'];
            $encomenda['Nome']=$row['Nome'];
            $encomenda['Area']=$row['Area'];
            array_push($encomendas,$encomenda);
            }
            return $encomendas;
    
}

public function getLubHistorybyDate($datainicio,$datafim){
    $encomendas = array();
    foreach (parent::query("SELECT `Data_de_encomenda`,`Data_de_rececao`,utilizador.Nome,Qantidade,emabalagens.Capacidade,area.Area,oleo.Designacao,encomendas.Qantidade
                            FROM `encomendas` join utilizador on encomendas.Utilizador=utilizador.ID 
                            join emabalagens on encomendas.Embalagem=emabalagens.ID 
                            join area on encomendas.area=area.ID
                            join oleo on encomendas.Oleo=oleo.ID
                            WHERE encomendas.`Data_de_encomenda`<= '".$datafim."' and encomendas.`Data_de_encomenda`>= '".$datainicio."'") as $row){
            $encomenda=array();
            $encomenda['Designacao']=$row['Designacao'];
            $encomenda['Qantidade']=$row['Qantidade'];
            $encomenda['Data_de_encomenda']=$row['Data_de_encomenda'];
            $encomenda['Data_de_rececao']=$row['Data_de_rececao'];
            $encomenda['Capacidade']=$row['Capacidade'];
            $encomenda['Nome']=$row['Nome'];
            $encomenda['Area']=$row['Area'];
            array_push($encomendas,$encomenda);
            }
            return $encomendas;
    
}
}

?>
