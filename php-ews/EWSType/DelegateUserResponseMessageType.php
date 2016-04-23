<?php
/**
 * Definition of the DelegateUserResponseMessageType type
 * 
 * @author James I. Armes <http://www.jamesarmes.net>
 */

/**
 * Definition of the DelegateUserResponseMessageType type
 * 
 * @author James I. Armes <http://www.jamesarmes.net>
 */
class EWSType_DelegateUserResponseMessageType extends EWSType {
	/**
	 * DelegateUser property
	 * 
	 * @var EWSType_DelegateUserType
	 */
	public $DelegateUser;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->schema = array(
			array(
				'name' => 'DelegateUser',
				'required' => false,
				'type' => 'DelegateUserType',
			),
		); // end $this->schema
	} // end function __construct()
} // end class DelegateUserResponseMessageType