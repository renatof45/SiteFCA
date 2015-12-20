<?php
if($_SESSION['user']=='711241'){
$errors = array();
$oleos = new EncOleosDao();
    $oleo_list=$oleos->get_Oleos();
    $oleo_post=array();
    if(array_key_exists('oleo', $_POST)){
         $oleo_post[0]=$_POST['oleo'];
         $oleo_post[1]=$oleos->getOleos($_POST['oleo']);
    }
    else if(array_key_exists('oleo', $_GET)){
        $oleo_post[0]=$_GET['oleo'];
        $oleo_post[1]=$oleos->get_Oleos($_GET['oleo']);
    }
    else{
         $oleo_post[0]=1;
          $oleo_post[1]=$oleos->getOleos(1);
    }
    $errors = array();
    $oleos = new EncOleosDao();
    $result = $oleos->setOleos($oleo_post[0]);
    $oleo_list=$oleos->get_Oleos();
    $codigos = $oleos->get_Codigo_by_Oleo($oleo_post[0]);
    //print_r($codigos);
    if (array_key_exists('save', $_POST)) {
        $code_check=true;
        $oleos->delete_from_area_oloes($oleo_post[0]);
        //$oleos->delete_from_embalagens($oleo_post[0]);
        
        if ($_POST['codigo20']['codigo'] != ''){
            if(array_key_exists('20L', $codigos))
                $oleos->update_embalagens($codigos['20L']['codigo_oleo'],$_POST['codigo20']['codigo']); 
            else
                $oleos->insert_into_embalagens($_POST['codigo20']['codigo'],'20L',$oleo_post[0]);    
            if ($_POST['codigo20']['areaa']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo20']['areaa']['checked'], $codigos['20L']['id'], $_POST['codigo20']['areaa']['descricao'], $_POST['codigo20']['areaa']['stock']);
            }
            if ($_POST['codigo20']['areab']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo20']['areab']['checked'], $codigos['20L']['id'], $_POST['codigo20']['areab']['descricao'], $_POST['codigo20']['areab']['stock']);
            }
            if ($_POST['codigo20']['areac']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo20']['areac']['checked'], $codigos['20L']['id'], $_POST['codigo20']['areac']['descricao'], $_POST['codigo20']['areac']['stock']);
            }
            if ($_POST['codigo20']['vuvb']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo20']['vuvb']['checked'], $codigos['20L']['id'], $_POST['codigo20']['vuvb']['descricao'], $_POST['codigo20']['vuvb']['stock']);
            }
            if ($_POST['codigo20']['hds']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo20']['hds']['checked'], $codigos['20L']['id'], $_POST['codigo20']['hds']['descricao'], $_POST['codigo20']['hds']['stock']);
            }
        }else{
            if(array_key_exists('20L', $codigos)){
                $oleos->delete_from_embalagens($codigos['20L']['codigo_oleo']);
            }
        }
        if ($_POST['codigo205']['codigo'] != '') {
            if(array_key_exists('205L', $codigos))
                $oleos->update_embalagens($codigos['205L']['codigo_oleo'],$_POST['codigo205']['codigo']); 
            else
                $oleos->insert_into_embalagens($_POST['codigo205']['codigo'],'205L',$oleo_post[0]);
            if ($_POST['codigo205']['areaa']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo205']['areaa']['checked'], $codigos['205L']['id'], $_POST['codigo205']['areaa']['descricao'], $_POST['codigo205']['areaa']['stock']);
            }
            if ($_POST['codigo205']['areab']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo205']['areab']['checked'], $codigos['205L']['id'], $_POST['codigo205']['areab']['descricao'], $_POST['codigo205']['areab']['stock']);
            }
            if ($_POST['codigo205']['areac']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo205']['areac']['checked'], $codigos['205L']['id'], $_POST['codigo205']['areac']['descricao'], $_POST['codigo205']['areac']['stock']);
            }
            if ($_POST['codigo205']['vuvb']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo205']['vuvb']['checked'], $codigos['205L']['id'], $_POST['codigo205']['vuvb']['descricao'], $_POST['codigo205']['vuvb']['stock']);
            }
            if ($_POST['codigo205']['hds']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo205']['hds']['checked'], $codigos['205L']['id'], $_POST['codigo205']['hds']['descricao'], $_POST['codigo205']['hds']['stock']);
            }
        }else{
            if(array_key_exists('205L', $codigos)){
                $oleos->delete_from_embalagens($codigos['205L']['codigo_oleo']);
            }
        }
        if ($_POST['codigo1000']['codigo'] != '') {
            if(array_key_exists('1000L', $codigos))
                $oleos->update_embalagens($codigos['1000L']['codigo_oleo'],$_POST['codigo1000']['codigo']); 
            else
                $oleos->insert_into_embalagens($_POST['codigo1000']['codigo'],'1000L',$oleo_post[0]);
            if ($_POST['codigo1000']['areaa']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo1000']['areaa']['checked'], $codigos['1000L']['id'], $_POST['codigo1000']['areaa']['descricao'], $_POST['codigo1000']['areaa']['stock']);
            }
            if ($_POST['codigo1000']['areab']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo1000']['areab']['checked'], $codigos['1000L']['id'], $_POST['codigo1000']['areab']['descricao'], $_POST['codigo1000']['areab']['stock']);
            }
            if ($_POST['codigo1000']['areac']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo1000']['areac']['checked'], $codigos['1000L']['id'], $_POST['codigo1000']['areac']['descricao'], $_POST['codigo1000']['areac']['stock']);
            }
            if ($_POST['codigo1000']['vuvb']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo1000']['vuvb']['checked'], $codigos['1000L']['id'], $_POST['codigo1000']['vuvb']['descricao'], $_POST['codigo1000']['vuvb']['stock']);
            }
            if ($_POST['codigo1000']['hds']['checked']) {
                $oleos->insert_into_area_oleos($oleo_post[0], $_POST['codigo1000']['hds']['checked'], $codigos['1000L']['id'], $_POST['codigo1000']['hds']['descricao'], $_POST['codigo1000']['hds']['stock']);
            }
        }else{
            if(array_key_exists('1000L', $codigos)){
                $oleos->delete_from_embalagens($codigos['1000L']['codigo_oleo']);
            }
        }
    }
    $codigos = $oleos->get_Codigo_by_Oleo($oleo_post[0]);
    $result = $oleos->setOleos($oleo_post[0]);
    $areaC=[];
    $hds=[];
    $areaB=[];
    $areaA=[];
    $vuvb=[];
    if (array_key_exists(1, $result)) {
        $areaC = $result[1];
    }
    if (array_key_exists(2, $result)) {
        $hds = $result[2];
    }
    if (array_key_exists(3, $result)) {
        $areaB = $result[3];
    }
    if (array_key_exists(4, $result)) {
        $areaA = $result[4];
    }
    if (array_key_exists(5, $result)) {
        $vuvb = $result[5];
    }
    //print_r($result)
}

?>
