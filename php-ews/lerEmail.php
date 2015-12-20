<?php
require_once('ExchangeWebServices.php');
require_once('NTLMSoapClient.php');
require_once('NTLMSoapClient/Exchange.php');
require_once('EWS_Exception.php');
require_once('EWSType.php');

spl_autoload_register(
	function ($class) {
		$class = explode('_', $class);
		if ($class[0] == 'EWSType')
			require_once $class[0] . '/' . $class[1] . '.php';
	}
);
$message_id = ''; // Id of the email message
$save_dir = __DIR__; // Saves into the current dir
	
		$server = 'webmail.galpenergia.com';
		$username = 'oil\\711241';
		$password = 'egfqnws';
		
		$ews = new ExchangeWebServices($server, $username, $password);


$request = new EWSType_GetItemType();

$request->ItemShape = new EWSType_ItemResponseShapeType();
$request->ItemShape->BaseShape = EWSType_DefaultShapeNamesType::ALL_PROPERTIES;

$request->ItemIds = new EWSType_NonEmptyArrayOfBaseItemIdsType();
$request->ItemIds->ItemId = new EWSType_ItemIdType();
$request->ItemIds->ItemId->Id = $message_id; 

$response = $ews->GetItem($request);

if( $response->ResponseMessages->GetItemResponseMessage->ResponseCode == 'NoError' &&
    $response->ResponseMessages->GetItemResponseMessage->ResponseClass == 'Success' ) {

    $message = $response->ResponseMessages->GetItemResponseMessage->Items->Message;

    if(!empty($message->Attachments->FileAttachment)) {
        // FileAttachment attribute can either be an array or instance of stdClass...
        $attachments = array();
        if(is_array($message->Attachments->FileAttachment) === FALSE ) {
            $attachments[] = $message->Attachments->FileAttachment;
        }
        else {
            $attachments = $message->Attachments->FileAttachment;
        }

        foreach($attachments as $attachment) {
            $request = new EWSType_GetAttachmentType();
            $request->AttachmentIds->AttachmentId = $attachment->AttachmentId;
            $response = $ews->GetAttachment($request);

            // Assuming response was successful ...
            $attachments = $response->ResponseMessages->GetAttachmentResponseMessage->Attachments;
            $content = $attachments->FileAttachment->Content;

            file_put_contents($save_dir.'/'.$attachment->Name, $content);
        }
    }
    else {
        echo "No attachments found\n";
    }	
}
?>