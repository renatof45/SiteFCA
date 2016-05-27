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

class EwsSendEmail {

    protected function sendEmail($pass, $content,$subject,$to,$from) {
        $server = 'webmail.galpenergia.com';
        $username = 'oil\\' . $from;
        $password = $pass;


        $ews = new ExchangeWebServices($server, $username, $password);

        // Create message
        $msg = new EWSType_MessageType();

        $toAddresses = array();
        $toAddresses[0] = new EWSType_EmailAddressType();
        $toAddresses[0]->EmailAddress = $to.'@galpenergia.corp';
        $toAddresses[0]->Name = '';

        // Multiple recipients
        //$toAddresses[1] = new EWSType_EmailAddressType();
        //$toAddresses[1]->EmailAddress = 'sara.smith@domain.com';
        //$toAddresses[1]->Name = 'Sara Smith';

        $msg->ToRecipients = $toAddresses;

        $fromAddress = new EWSType_EmailAddressType();
        $fromAddress->EmailAddress = $from.'@galpenergia.corp';
        $fromAddress->Name = '';

        $msg->From = new EWSType_SingleRecipientType();
        $msg->From->Mailbox = $fromAddress;

        $msg->Subject = $subject;

        $msg->Body = new EWSType_BodyType();
        $msg->Body->BodyType = 'HTML';
        $msg->Body->_ = $content;

        $msgRequest = new EWSType_CreateItemType();
        $msgRequest->Items = new EWSType_NonEmptyArrayOfAllItemsType();
        $msgRequest->Items->Message = $msg;
        $msgRequest->MessageDisposition = 'SendAndSaveCopy';
        $msgRequest->MessageDispositionSpecified = true;

        $response = $ews->CreateItem($msgRequest);
        var_dump($response);
    }

    function __construct($pass, $content,$subject,$to,$from) {
        $this->sendEmail($pass, $content,$subject,$to,$from);
    }

}

?>