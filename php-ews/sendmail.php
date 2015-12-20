<?php
require_once('ExchangeWebServices.php');
require_once('NTLMSoapClient.php');
require_once('NTLMSoapClient/Exchange.php');
require_once('EWS_Exception.php');
require_once('EWSType.php');

require_once('EWSType/MessageType.php');
require_once('EWSType/EmailAddressType.php');
require_once('EWSType/BodyType.php');
require_once('EWSType/SingleRecipientType.php');
require_once('EWSType/CreateItemType.php');
require_once('EWSType/ArrayOfRecipientsType.php');
require_once('EWSType/NonEmptyArrayOfAllItemsType.php');
require_once('EWSType/ItemType.php');
require_once('EWSType/ExchangeImpersonationType.php');
require_once('EWSType/ConnectingSIDType.php');
require_once('EWSType/FileAttachmentType.php');
require_once('EWSType/CreateAttachmentType.php');
require_once('EWSType/SendItemType.php');
require_once('EWSType/ItemIdType.php');
require_once('EWSType/TargetFolderIdType.php');
require_once('EWSType/DistinguishedFolderIdType.php');
require_once('EWSType/NonEmptyArrayOfAttachmentsType.php');
require_once('EWSType/NonEmptyArrayOfBaseItemIdsType.php');
class EwsSendEmail
{
	protected function sendEmail($pass,$emails)
	{
		$server = 'webmail.galpenergia.com';
		$username = 'oil\\'.$_SESSION['user'];
		$password = $pass;
		
    
		$ews = new ExchangeWebServices($server, $username, $password);
		
		// Create message
		$msg = new EWSType_MessageType();
		$toAddresses = array();
		$index=0;
		/*$toAddresses[$index] = new EWSType_EmailAddressType();
		    $toAddresses[$index]->EmailAddress = 'raul.abreu@galpenergia.com';
		    $toAddresses[$index]->Name = 'Raul Abreu';
		    $index++;
		/*$toAddresses[$index] = new EWSType_EmailAddressType();
		    $toAddresses[$index]->EmailAddress = 'assuncao.ribeiro@galpenergia.com';
		    $toAddresses[$index]->Name = 'assuncao ribeiro';
		    $index++;
		$toAddresses[$index] = new EWSType_EmailAddressType();
		    $toAddresses[$index]->EmailAddress = 'maria.candida@galpenergia.com';
		    $toAddresses[$index]->Name = 'maria candida';
		    $index++;
		foreach ($emails as $mail) {
			$toAddresses[$index] = new EWSType_EmailAddressType();
		    $toAddresses[$index]->EmailAddress = $mail.'@galpenergia.corp';
		    $toAddresses[$index]->Name = '';
		    $index++;
		}*/
		$toAddresses[$index] = new EWSType_EmailAddressType();
		    $toAddresses[$index]->EmailAddress = '71124vvvv1@galpenergia.corp';
		    $toAddresses[$index]->Name = 'Renato Ferreira';
		$msg->ToRecipients = $toAddresses;
                
        $fromAddress = new EWSType_EmailAddressType();
		$fromAddress->EmailAddress = $_SESSION['user'].'@galpenergia.corp';
		$fromAddress->Name = '';

		$msg->From = new EWSType_SingleRecipientType();
		$msg->From->Mailbox = $fromAddress;
		$msg->Subject = 'Nota de encomenda do óleos';
		
		$msg->Body = new EWSType_BodyType();
		$msg->Body->BodyType = 'HTML';
		$msg->Body->_ = '<p style="font-size: 18px;"><b>Nota de encomenda do óleos</b></p>';
		
		// Save message
		$msgRequest = new EWSType_CreateItemType();
		$msgRequest->Items = new EWSType_NonEmptyArrayOfAllItemsType();
		$msgRequest->Items->Message = $msg;
		$msgRequest->MessageDisposition = 'SaveOnly';
		$msgRequest->MessageDispositionSpecified = true;
		
		$msgResponse = $ews->CreateItem($msgRequest);
		$msgResponseItems = $msgResponse->ResponseMessages->CreateItemResponseMessage->Items;
		
		// Create attachment(s)
		$attachments = array();
		$attachments[0] = new EWSType_FileAttachmentType();
		$attachments[0]->Content = file_get_contents(dirname(__FILE__).'\..\web\Nota de encomenda de oleos.pdf');
		$attachments[0]->Name = 'Nota de encomenda de oleos.pdf';
		$attachments[0]->ContentType = 'application/pdf';
		
		// Attach files to message
		$attRequest = new EWSType_CreateAttachmentType();
		$attRequest->ParentItemId = $msgResponseItems->Message->ItemId;
                $attRequest->Attachments = new EWSType_NonEmptyArrayOfAttachmentsType();
		$attRequest->Attachments->FileAttachment = $attachments;
		
		$attResponse = $ews->CreateAttachment($attRequest);
		$attResponseId = $attResponse->ResponseMessages->CreateAttachmentResponseMessage->Attachments->FileAttachment->AttachmentId;
		
		// Save message id from create attachment response
		$msgItemId = new EWSType_ItemIdType();
		$msgItemId->ChangeKey = $attResponseId->RootItemChangeKey;
		$msgItemId->Id = $attResponseId->RootItemId;
		
		// Send and save message
		$msgSendRequest = new EWSType_SendItemType();
                $msgSendRequest->ItemIds = new EWSType_NonEmptyArrayOfBaseItemIdsType();
		$msgSendRequest->ItemIds->ItemId = $msgItemId;
		$msgSendRequest->SavedItemFolderId = new EWSType_TargetFolderIdType();
		$sentItemsFolder = new EWSType_DistinguishedFolderIdType();
		$sentItemsFolder->Id = 'sentitems';
		$msgSendRequest->SavedItemFolderId->DistinguishedFolderId = $sentItemsFolder;
		$msgSendRequest->SaveItemToFolder = true;
		$msgSendResponse = $ews->SendItem($msgSendRequest);
			
        }
	function __construct($pass,$emails)
	{
		$this->sendEmail($pass,$emails);
	}
}

?>