/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
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
    var params = new Object();
    params.noAuthToken=true;
    params.ignoreAuthToken = true;
    if(uname && pword) {
        soapDoc.set("name", uname);
        soapDoc.set("password", pword);
    } else {
        soapDoc.getMethod().setAttribute("refresh", "1");
    }
    soapDoc.set("virtualHost", location.hostname);
    soapDoc.set("csrfTokenSecured", 1);
    var command = new ZmCsfeCommand();
    params.soapDoc = soapDoc;
    params.asyncMode = true;
    params.skipExpiredToken = true;
    params.callback = callback;
    command.invoke(params);
}