/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZaLoginDialog = function(parent, zIndex, className, appCtxt) {
    className = className || "LoginScreen";
    DwtComposite.call(this, {parent:parent, className:className, posStyle:DwtControl.ABSOLUTE_STYLE});

    this._zimbraAdminLoginURL = ZaZimbraAdmin.zimbraAdminLoginURL;

    this._origClassName = className;
    this._xparentClassName = className + "-Transparent";
    this.setBounds(0, 0, "100%", "100%");
    var htmlElement = this.getHtmlElement();
    htmlElement.style.zIndex = Dwt.Z_DIALOG + 1; //login screen covers all dialogs and error messages
    htmlElement.className = className;
    this.setVisible(false);
    
    //license expiration warning won't show before login.
	//var licenseStatus = ZaZimbraAdmin.getLicenseStatus();
	var params = ZLoginFactory.copyDefaultParams(ZaMsg);
	params.showPanelBorder = true;
	params.showForm = true;
	params.showUserField = true;
	params.showPasswordField = true;
	//params.showLicenseMsg = licenseStatus.licenseExists;
	//params.licenseMsg = licenseStatus.message;
	params.showRememberMeCheckbox = false;
	params.showLogOff = true;
	params.logOffAction = "ZaLoginDialog._loginDiffListener()";
	params.loginAction = "ZaLoginDialog._loginListener(this)";
	params.showButton = true;
    params.companyURL = ZaAppCtxt.getLogoURI () ;
    params.copyrightText = ZaItem.getSplashScreenCopyright();
    params.clientLevelNotice = ZabMsg.clientLevelNotice ? ZabMsg.clientLevelNotice :"";
    var html = ZLoginFactory.getLoginDialogHTML(params);
	this.setContent(html);
}

ZaLoginDialog.prototype = new DwtComposite;
ZaLoginDialog.prototype.constructor = ZaLoginDialog;
ZaLoginDialog.prototype.toString = 
function() {
	return "ZaLoginDialog";
}

ZaLoginDialog.prototype.getLoginURL = function () {
    var soapDoc = AjxSoapDoc.create("GetDomainInfoRequest", ZaZimbraAdmin.URN, null);
	var elBy = soapDoc.set("domain", location.hostname);
	elBy.setAttribute("by", "virtualHostname");

	var params = new Object();
	params.soapDoc = soapDoc;
    params.noAuthToken = true ;
    var reqMgrParams = {
		//controller: ZaApp.getInstance().getCurrentController()
	}
	var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetDomainInfoResponse;
    var obj = {};
    ZaItem.prototype.initFromJS.call(obj, resp.domain[0]);
    return obj.attrs["zimbraAdminConsoleLoginURL"] ;
}

ZaLoginDialog.prototype.registerCallback =
function(func, obj) {
	this._callback = new AjxCallback(obj, func);
}

ZaLoginDialog.prototype.clearPassword =
function() {
	ZLoginFactory.get(ZLoginFactory.PASSWORD_ID).value = "";
}

ZaLoginDialog.prototype.showNewPasswordFields = function () {
	ZLoginFactory.showNewPasswordFields();
}

ZaLoginDialog.prototype.hideNewPasswordFields = function () {
	ZLoginFactory.hideNewPasswordFields();
}

ZaLoginDialog.prototype.enableUnameField = function () {
    ZLoginFactory.get(ZLoginFactory.USER_ID).disabled = false;
}

ZaLoginDialog.prototype.disableUnameField = function () {
	ZLoginFactory.get(ZLoginFactory.USER_ID).disabled = true;
}

ZaLoginDialog.prototype.enablePasswordField = function () {
    ZLoginFactory.get(ZLoginFactory.PASSWORD_ID).disabled = false;
}

ZaLoginDialog.prototype.disablePasswordField = function () {
	ZLoginFactory.get(ZLoginFactory.PASSWORD_ID).disabled = true;
}

ZaLoginDialog.prototype.setError =
function(errorStr) {
	if(errorStr)
		ZLoginFactory.showErrorMsg(errorStr);
}

ZaLoginDialog.prototype.clearError = 
function () {
	ZLoginFactory.hideErrorMsg();
}

ZaLoginDialog.prototype.setFocus =
function(username) {
	ZLoginFactory.showUserField(username);
 }

ZaLoginDialog.prototype.setVisible = 
function(visible, transparentBg) {
	DwtComposite.prototype.setVisible.call(this, visible);
    //redirect to zimbraAdminConsoleLoginURL
    if (visible && this._zimbraAdminLoginURL != null && this._zimbraAdminLoginURL.length > 0) {
        if (window.onbeforeunload != null) {
            ZaZimbraAdmin.setOnbeforeunload(ZaZimbraAdmin._confirmAuthInvalidExitMethod);
        }
        
        location.replace(this._zimbraAdminLoginURL);
        return ;
    }

	for (var i = 0; i < ZLoginFactory.TAB_ORDER.length; i++) {
		var element = document.getElementById(ZLoginFactory.TAB_ORDER[i]);
		if (visible && element) {
			Dwt.associateElementWithObject(element, this);
		} else if(element) {
			Dwt.disassociateElementFromObject(null, this);
		}
	}

	if(visible) {
		if (AjxEnv.isIE) {
			var el = ZLoginFactory.getLoginPanel();
			/*
 			 *Bug fix 54362
			 * There are two named "loginForm" one is LoginDialog,
			 * the other one is "Splash Screen" for they shared the same 
			 * Html generation function 			
			 */
			var loginEl = this.getHtmlElement();
			for(var i = 0; i < el.length; i++){
				if(Dwt.contains(loginEl, el[i]))
					el[i]["onkeydown"] = ZLoginFactory.handleKeyPress;
			}
		} else {
			window["onkeypress"] = ZLoginFactory.handleKeyPress;
		}
		//set the focus on the user name field
		var userIdEl = ZLoginFactory.get(ZLoginFactory.USER_ID);
		if(!userIdEl.disabled)
			userIdEl.focus();		
	}
}

ZaLoginDialog.prototype.addChild =
function(child, childHtmlElement) {
    this._children.add(child);
}

ZaLoginDialog.prototype._loginSelListener =
function() {
	var username = AjxStringUtil.htmlEncode(ZLoginFactory.get(ZLoginFactory.USER_ID).value);
	if (!(username && username.length)) {
		this.setError(ZaMsg.enterUsername);
		return;
	}
	if (this._callback) {
		var password = ZLoginFactory.get(ZLoginFactory.PASSWORD_ID).value;
		var newPassword = "";
		var confPassword = "";
		var twoFactorCode = "";
		var trustedDevice = false;
		if(ZLoginFactory.isShown(ZLoginFactory.NEW_PASSWORD_ID) && ZLoginFactory.isShown(ZLoginFactory.PASSWORD_CONFIRM_ID)) {
			newPassword = ZLoginFactory.get(ZLoginFactory.NEW_PASSWORD_ID).value;
			confPassword = ZLoginFactory.get(ZLoginFactory.PASSWORD_CONFIRM_ID).value; 
		}
		if(ZLoginFactory.isShown(ZLoginFactory.TWO_FACTOR_CODE_FORM)) {
			twoFactorCode = ZLoginFactory.get(ZLoginFactory.TWO_FACTOR_CODE).value;
		}
		if(ZLoginFactory.isShown(ZLoginFactory.TRUST_DEVICE)) {
			trustedDevice = ZLoginFactory.get(ZLoginFactory.TRUST_DEVICE).value;
		}
		
		this._callback.run(username, password, newPassword, confPassword, twoFactorCode, trustedDevice);		
	}
}

ZaLoginDialog._loginListener =
function(target) {
	var element = target;
	while (element) {
		var object = Dwt.getObjectFromElement(element);
		if (object instanceof ZaLoginDialog) {
			object._loginSelListener();
			break;
		}
		element = element.parentNode;
	}
};

ZaLoginDialog._loginDiffListener =
function(ev) {
	ZmZimbraMail.logOff();
};

ZaLoginDialog.prototype.showTwoFactorCode = 
function() {
	ZLoginFactory.showTwoFactorCode();
}