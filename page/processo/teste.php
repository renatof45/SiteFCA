<?php


$excel = new COM("Excel.Application");
$workbook = $excel->Workbooks->Open("g:\RelatorioC.xls");
$worksheet = $workbook->Worksheets(2);
/*for($i=8;$i<14;$i++){
	for($j=3;$j<53;$j++){	
       $cell=$worksheet->Cells($i,$j);
	   $valeu=explode(">",$cell->value);
	   if(count($valeu)>1)
	       print_r($valeu[0]."<br/>");// $value[0];
	}
}*/
 $cell=$worksheet->Cells(9,6);
 print_r($cell->value."<br/>");
$excel->Application->ActiveWorkbook->Save();
$excel->application->ActiveWorkbook->Close("False");
$excel->Quit();
//echo "teste:".$cell->value;