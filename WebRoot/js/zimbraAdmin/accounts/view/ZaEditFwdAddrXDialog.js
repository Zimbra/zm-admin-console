/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaEditAliasXDialog
* @contructor ZaEditAliasXDialog
* @author Greg Solovyev
* @param parent
* param app
**/
ZaEditFwdAddrXDialog = function(parent,  w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, null, title, w, h);
    this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_accounts/forwarding_mail.htm?locid="+AjxEnv.DEFAULT_LOCALE;
    this._containedObject = {};
	this.initForm(ZaAlias.myXModel,this.getMyXForm());
}

ZaEditFwdAddrXDialog.prototype = new ZaXDialog;
ZaEditFwdAddrXDialog.prototype.constructor = ZaEditFwdAddrXDialog;

ZaEditFwdAddrXDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
            {type:_GROUP_,isTabGroup:true, items: [ //allows tab key iteration
                {ref:ZaAccount.A_name, type:_TEXTFIELD_, label:ZaMsg.Enter_EmailAddr,width:230,visibilityChecks:[],enableDisableChecks:[]}
                ]
            }
        ]
	};
	return xFormObject;
}
