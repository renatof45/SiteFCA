<?php
$oleos = new EncOleosDao();
$encOleos = new EncOleos();
$edit=null;
$oleoID=0;
$flashes = null;
$errors = array();
//print_r($_GET);


if (array_key_exists('oleo', $_POST)) {
    $oleoID=$_POST['oleo'];
}
else
    $oleoID=$oleos->getOleos($_SESSION['area'])[0]['id'];
    

if (array_key_exists('encomendar', $_GET) && $_GET['encomendar']==1) {
    // for security reasons, do not map the whole $_POST['todo']
  if($_GET['tipo']==2){ 
    $data = array(
        'oleo' => $_POST['oleo'],
        'tipo' => $_GET['tipo'],
        'descricao' => $_POST['descricao'],
        'quantidade' => $_POST['quantidade'],
        'embalagem'=>$_POST['embalagem'],
    );
  }
  else{
       $data = array(
        'oleo' => $_POST['oleo'],
        'tipo' => $_GET['tipo'],
        'quantidade' => $_POST['quantidade'],
        'embalagem'=>$_POST['embalagem'],
    );
  }
     $result=$oleos->preencherPDF($_POST['embalagem'],$_SESSION['area']);
     date_default_timezone_set('Europe/Lisbon');
     $hoje=date('d-m-Y');
     $pdf = new FPDF();
     $pdf->AddPage();
     $pdf->SetFont('Arial','B',16);
     $title="Nota de Encomenda de oleos";
     $clienteT="Cliente";
     $cliente="Petrogal - Refinaria do Porto - Fabrica de Combustiveis";
     $moradaT="Morada";
     $morada="Leca da Palmeira";
     $email="COM@galpenergia.corp";
     $emailT="Email";
     $tel="229982118";
     $telT="Telefone chefe de turno";
     $centroT="Centro de custo";
     $centro=$result['Centro de custo'];
     $w = $pdf->GetStringWidth($title)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,9,$title,1,1,'C');
     $pdf->SetFont('Arial','B',14);
     $w = $pdf->GetStringWidth($clienteT)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,20,$clienteT);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth($cliente)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,30,$cliente);
     $pdf->SetFont('Arial','B',14);
     $w = $pdf->GetStringWidth($moradaT)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,50,$moradaT);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth($morada)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,60,$morada);
     $pdf->SetFont('Arial','B',14);
     $w = $pdf->GetStringWidth($emailT)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,80,$emailT);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth($email)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,90,$email);
     $pdf->SetFont('Arial','B',14);
     $w = $pdf->GetStringWidth($telT)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,110,$telT);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth($tel)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,120,$tel);
     $pdf->SetFont('Arial','B',14);
     $w = $pdf->GetStringWidth($centroT)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,140,$centroT);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth($centro)+6;
     $pdf->SetX((210-$w)/2);
     $pdf->Cell($w,150,$centro);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth("Oleo:");
     $pdf->SetX(105-$w);
     $pdf->Cell($w,200,"Oleo:".$result['Designacao']);
     $pdf->SetFont('Arial','',14);
     $w = $pdf->GetStringWidth("Area-Localidade:");
     $pdf->SetX(105-$w);
     $pdf->Cell($w,210,"Area-Localidade:.".$result['Area']." - ".$result['unidades']);
     $w = $pdf->GetStringWidth("Data:");
     $pdf->SetX(105-$w);
     $pdf->Cell($w,220,"Data:".$hoje);
     $w = $pdf->GetStringWidth("Tipo de embalagem:");
     $pdf->SetX(105-$w);
     $pdf->Cell($w,230,"Tipo de embalagem:".$result['Capacidade']);
     $w = $pdf->GetStringWidth("Quantidade:");
     $pdf->SetX(105-$w);
     $pdf->Cell($w,240,"Quantidade:".$_POST['quantidade']);
     $w = $pdf->GetStringWidth("Codigo:");
     $pdf->SetX(105-$w);
     $pdf->Cell($w,250,"Codigo:".$result['codigo_oleo']);
     $erromail=false;
     $pdf->Output("Nota de encomenda de oleos.pdf");

     $dao = new DAO();
     $row = $dao->getDb()->query('SELECT utilizador.ID FROM `area-utilizador` join utilizador on utilizador.ID=`area-utilizador`.`utilizador` WHERE area='.$_SESSION['area'], PDO::FETCH_ASSOC);
    $mails=array();
    $index=0;
    foreach ($row as $user) {
          $mails[$index]=$user['ID'];
          $index++;
      }

     try{
          new EwsSendEmail($_POST['palavra'],$mails);
     }
     catch(SoapFault $ex) {
           $errors[] = new Error('numero', 'Erro ao enviar o Email');
           $errors[] = new Error('numero', 'A encomenda não foi realizada, tente outra vez!');
           
          $erromail=true;
     }
     if(!$erromail){
        EncOleosMapper::map($encOleos, $data);
    // validate
        $oleos->insert($encOleos);
        //print_r($areaID);
        Flash::addFlash('Óleo encomendado com sucesso');
        Flash::addFlash('E-mail enviado aos utilizadores');
       
            if (Flash::hasFlashes()) {
                $flashes = Flash::getFlashes();
            }
     } 

}
?>
