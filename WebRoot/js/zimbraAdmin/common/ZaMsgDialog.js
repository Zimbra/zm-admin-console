/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
* Creates a new message dialog.
* @constructor
* @class
* This class represents a reusable message dialog box. Messages can be informational, warning, or
* critical.
*/
ZaMsgDialog = function(parent, className, buttons, extraButtons, contextId) {
	this._app = ZaApp.getInstance();
    	var id = contextId? ZaId.getDialogId(ZaId.DLG_MSG, contextId):ZaId.getDialogId(ZaId.DLG_MSG);
 	DwtMessageDialog.call(this, parent, className, buttons, extraButtons, id);
}


ZaMsgDialog.prototype = new DwtMessageDialog;
ZaMsgDialog.prototype.constructor = ZaMsgDialog;

ZaMsgDialog.CLOSE_TAB_DELETE_BUTTON = "close tab and delete";
ZaMsgDialog.CLOSE_TAB_DELETE_BUTTON_DESC = 
	new DwtDialog_ButtonDescriptor (ZaMsgDialog.CLOSE_TAB_DELETE_BUTTON, ZaMsg.bt_close_tab_delete, DwtDialog.ALIGN_RIGHT);
ZaMsgDialog.NO_DELETE_BUTTON = "no delete" ;
ZaMsgDialog.NO_DELETE_BUTTON_DESC = 
	new DwtDialog_ButtonDescriptor (ZaMsgDialog.NO_DELETE_BUTTON, ZaMsg.bt_no_delete, DwtDialog.ALIGN_RIGHT);
