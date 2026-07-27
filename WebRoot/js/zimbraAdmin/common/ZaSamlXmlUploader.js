/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2026 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2026 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates ZaSamlXmlUploader.
 * @class
 * This class is used for SAML XML upload.
 *
 */
ZaSamlXmlUploader = function() {}
ZaSamlXmlUploader.prototype.constructor = ZaSamlXmlUploader;

ZaSamlXmlUploader.uploadSamlXml = function() {
	var parentItem = this.getParentItem();
	var formId = parentItem.items[0].getId();
	var formElement = document.getElementById(formId);
	var fileElementId = formElement.firstChild.id;

	var fileElement = document.getElementById(fileElementId);
	if(!fileElement || !fileElement.files || !fileElement.files[0]) {
		ZaApp.getInstance().dialogs["errorDialog"].setMessage(ZaMsg.fileUnselectedError, null, DwtMessageDialog.CRITICAL_STYLE, ZabMsg.zimbraAdminTitle);
		ZaApp.getInstance().dialogs["errorDialog"].popup();
		return;
	}

	if (!(this && this.getInstance && typeof this.getInstance === "function")) {
		// Wrong param. Do nothing.
		return;
	}

	var callerInstance = this.getInstance();
	var domainName;
	if (callerInstance instanceof ZaDomain) {
		domainName = callerInstance.name;
	}

	var soapDoc = AjxSoapDoc.create("ParseSAMLMetadataRequest", ZaZimbraAdmin.URN, null);
	if (domainName) {
		var elBy = soapDoc.set("domain", domainName);
		elBy.setAttribute("by", "name");
	}

	var uploader = new ZaSamlXmlUploader();
	var callback = new AjxCallback(this, uploader.uploadSamlXmlCallback, { domain: domainName });
	var csfeParams = new Object();
	csfeParams.soapDoc = soapDoc;
	csfeParams.asyncMode = true;
	csfeParams.callback = callback;
	var reqMgrParams = {
		controller: ZaApp.getInstance().getCurrentController()
	}

	var reader = new FileReader();
	reader.addEventListener("load", function() {
		var xmlData = reader.result;
		var docu = new DOMParser().parseFromString("<content></content>", "application/xml");
		var cdataSection = docu.createCDATASection(xmlData);
		var content = docu.querySelector("content");
		content.appendChild(cdataSection);
		soapDoc.getDoc().querySelector("ParseSAMLMetadataRequest").appendChild(content);
		ZaRequestMgr.invoke(csfeParams, reqMgrParams);
	});

	var contentData = reader.readAsText(fileElement.files[0]);
};

ZaSamlXmlUploader.prototype.uploadSamlXmlCallback = function(param, response) {
	var respObj = response && response._data;
	if (!respObj || response.isException() || !respObj.Body || !respObj.Body.ParseSAMLMetadataResponse) {
		var details;
		if (response && response.getException) {
			details = response.getException().msg;
		}
		ZaApp.getInstance().dialogs["errorDialog"].setMessage(ZaMsg.parseXmlFailed, details, DwtMessageDialog.CRITICAL_STYLE, ZabMsg.zimbraAdminTitle);
		ZaApp.getInstance().dialogs["errorDialog"].popup();
		return;
	}

	ZaApp.getInstance().dialogs["msgDialog"].setMessage(ZaMsg.parseXmlSuccessful, DwtMessageDialog.INFO_STYLE);
	ZaApp.getInstance().dialogs["msgDialog"].popup();

	if (param.domain) {
		model = ZaDomain;
	} else {
		model = ZaGlobalConfig;
	}
	var i;
	var xform = this.getForm();
	var responseData = respObj.Body.ParseSAMLMetadataResponse;
	if (responseData.certificate && responseData.certificate.length) {
		xform.setInstanceValue(responseData.certificate[0]._content, model.A_zimbraMyoneloginSamlSigningCert);
	} else {
		xform.setInstanceValue(null, model.A_zimbraMyoneloginSamlSigningCert);
	}

	if (responseData.nameIdFormat) {
		var choises = ZaSettings.samlNameIdFormatChoices();
		var choisesArray = [];
		for (i = 0; i < choises.length; i++) {
			choisesArray.push(choises[i].value);
		}
		var parsedNameIdFormat = [];
		for (i = 0; i < responseData.nameIdFormat.length; i++) {
			parsedNameIdFormat.push(responseData.nameIdFormat[i]._content);
		}
		// Choose in the following priority: emailAddress > unspecified > persistent > transient
		for (i = 0; i < choisesArray.length; i++) {
			if (parsedNameIdFormat.includes(choisesArray[i])) {
				xform.setInstanceValue(choisesArray[i], model.A_zimbraSamlNameIdFormat);
				break;
			}
		}
	} else {
		xform.setInstanceValue(null, model.A_zimbraSamlNameIdFormat);
	}

	if (responseData.ssoURL && responseData.ssoURL.length) {
		var ssoURL = [];
		for (i = 0; i < responseData.ssoURL.length; i++) {
			ssoURL.push(responseData.ssoURL[i]._content);
		}
		xform.setInstanceValue(ssoURL, model.A_zimbraSamlSSOURL);
	} else {
		xform.setInstanceValue(null, model.A_zimbraSamlSSOURL);
	}

	if (responseData.sloURL && responseData.sloURL.length) {
		var sloURL = [];
		for (i = 0; i < responseData.sloURL.length; i++) {
			sloURL.push(responseData.sloURL[i]._content);
		}
		xform.setInstanceValue(sloURL, model.A_zimbraSamlSLOURL);
	} else {
		xform.setInstanceValue(null, model.A_zimbraSamlSLOURL);
	}

	xform.refresh();
	xform.parent.setDirty(true);
};
