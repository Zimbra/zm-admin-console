/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”);
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an “AS IS” basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

ZaAuthenticate = function(appCtxt) {
	if (arguments.length == 0) return;
	this._appCtxt = appCtxt;
	this.uname = "";
}


ZaAuthenticate.processResponseMethods = new Array();

ZaAuthenticate.prototype.toString = 
function() {
	return "ZaAuthenticate";
}

ZaAuthenticate.prototype.changePassword = 
function (uname,oldPass,newPass,callback) {
    var soapDoc = AjxSoapDoc.create("ChangePasswordRequest", "urn:zimbraAccount");
    var el = soapDoc.set("account", uname);
    el.setAttribute("by", "name");
    soapDoc.set("oldPassword", oldPass);
    soapDoc.set("password", newPass);

	var command = new ZmCsfeCommand();
	var params = new Object();
	params.soapDoc = soapDoc;	
	params.asyncMode = true;
	params.noAuthToken=true;
	params.callback = callback;
	command.invoke(params);	
}

ZaAuthenticate.prototype.execute =
function (uname, pword, callback) {
	var soapDoc = AjxSoapDoc.create("AuthRequest", ZaZimbraAdmin.URN, null);
	this.uname = uname;
	soapDoc.set("name", uname);
	soapDoc.set("password", pword);
	soapDoc.set("virtualHost", location.hostname);
	var command = new ZmCsfeCommand();
	var params = new Object();
	params.soapDoc = soapDoc;	
	params.asyncMode = true;
	params.noAuthToken=true;
    params.ignoreAuthToken = true;
    params.skipExpiredToken = true;
	params.callback = callback;
	command.invoke(params);	
}

ZaAuthenticate.prototype._processResponse =
function(resp) {
	var els = resp.childNodes;
	var len = els.length;
	var el, sessionId;
	AjxCookie.setCookie(document, ZaSettings.ADMIN_NAME_COOKIE, this.uname, null, "/");			    	
	for (var i = 0; i < len; i++) {
		el = els[i];
/*		if (el.nodeName == "authToken")
			authToken = el.firstChild.nodeValue;
  		else if (el.nodeName == "lifetime")
			lifetime = el.firstChild.nodeValue;*/
		if (el.nodeName=="session")
			sessionId = el.firstChild.nodeValue;
	}
	ZmCsfeCommand.noAuth = false;

	//Instrumentation code start
	if(ZaAuthenticate.processResponseMethods) {
		var cnt = ZaAuthenticate.processResponseMethods.length;
		for(var i = 0; i < cnt; i++) {
			if(typeof(ZaAuthenticate.processResponseMethods[i]) == "function") {
				ZaAuthenticate.processResponseMethods[i].call(this,resp);
			}
		}
	}	
	//Instrumentation code end		
}
