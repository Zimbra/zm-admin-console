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
 * Creates ZaSamlTest.
 * @class
 * This class is used for SAML test.
 *
 */
ZaSamlTest = function() {
	// do nothing
};

ZaSamlTest.instance = null;
ZaSamlTest.getInstance = function() {
	if(!ZaSamlTest.instance) {
		ZaSamlTest.instance = new ZaSamlTest();
	}
	return ZaSamlTest.instance;
};

ZaSamlTest.prototype.constructor = ZaSamlTest;

ZaSamlTest.prototype.doSamlTest = function(caller) {
	if (this.samlTestWindow) {
		var dialog = this.getErrorDialog("A window for SAML test is still open. Please close it to start testing.");
		dialog.popup();
		return;
	}

	if (!(caller && caller.getInstance && typeof caller.getInstance === "function")) {
		// Wrong param. Do nothing.
		return;
	}

	var callerInstance = caller.getInstance();
	var domainName;
	if (callerInstance instanceof ZaDomain) {
		domainName = callerInstance.name;
	}

	// Do not use property value shorthand to avoid an build error. e.g. { caller }
	this.getSamlTestInfo({ caller: caller, domain: domainName })
};

ZaSamlTest.prototype.getSamlTestInfo = function(param) {
	var soapDoc = AjxSoapDoc.create("GenerateSamlTestRequest", ZaZimbraAdmin.URN, null);
	if (param && param.domain) {
		var elBy = soapDoc.set("domain", param.domain);
		elBy.setAttribute("by", "name");
	}
	if (param && param.force) {
		soapDoc.setMethodAttribute("force", true);
	}

	var callback = new AjxCallback(this, this.handleSamlTestInfoResponse, param);
	var csfeParams = new Object();
	csfeParams.soapDoc = soapDoc;
	csfeParams.asyncMode = true;
	csfeParams.callback = callback;
	var reqMgrParams = {
		controller: ZaApp.getInstance().getCurrentController()
	}

	ZaRequestMgr.invoke(csfeParams, reqMgrParams);
};

ZaSamlTest.prototype.handleSamlTestInfoResponse = function(param, response) {
	var respObj = response && response._data;
	if (!respObj) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	} else if (response._data.code === "saml.TEST_IN_PROGRESS") {
		var dialog = this.getConfirmationDialog(ZaMsg.samlInTestingByAnotherAdmin, param);
		dialog.popup();
		return;
	} else if (response._data.code === "saml.TEST_ORIGIN_MISSING") {
		var dialog = this.getErrorDialog(ZaMsg.samlTestConfigurationError);
		dialog.popup();
		return;
	} else if (response.isException()) {
		ZaApp.getInstance().getCurrentController()._handleException(response.getException(), "ZaSamlTest.prototype.handleSamlTestInfoResponse", null, false);
		return;
	} else if (!respObj.Body || !respObj.Body.GenerateSamlTestResponse) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	}

	var GenerateSamlTestResponse = respObj.Body.GenerateSamlTestResponse;
	var url = GenerateSamlTestResponse.url;
	var relayState = GenerateSamlTestResponse.relayState;
	if (!url || !relayState) {
		var dialog = this.getErrorDialog(ZaMsg.samlTestInitializationError);
		dialog.popup();
		return;
	} else {
		this.samlTestWindow = window.open(url, "_blank");
		this.intervalId = setInterval(this.checkChildWindow.bind(this, param), 1000);

		// Get the current form. There is a case that a form of param.caller.getForm() may not be active.
		// Values are updated via getDisplayValue in XFormViewer.
		// Show test status as "In progress".
		var xform = ZaApp.getInstance().getAppViewMgr().getCurrentViewContent().getMyForm();
		xform.refresh();
	}
};

ZaSamlTest.prototype.forceTesting = function(param, event) {
	this.confirmationDialog.popdown();
	param["force"] = true;
	this.getSamlTestInfo(param);
};

ZaSamlTest.prototype.checkChildWindow = function(param) {
	var isWindowClosed;
	if (!this.samlTestWindow) {
		isWindowClosed = true;
	} else if (this.samlTestWindow.closed) {
		this.samlTestWindow = null;
		isWindowClosed = true;
	}

	if (isWindowClosed) {
		clearInterval(this.intervalId);
		var soapDoc;
		if (param.domain) {
			soapDoc = AjxSoapDoc.create("GetDomainRequest", ZaZimbraAdmin.URN, null);
			var attribute = [
				ZaGlobalConfig.A_zimbraSamlTestTimestamp,
				ZaGlobalConfig.A_zimbraSamlTestErrorMessage
			].join(",");
			soapDoc.setMethodAttribute("domain", param.domain);
			soapDoc.setMethodAttribute("applyConfig", false);
			soapDoc.setMethodAttribute("attr", attribute);
			var elBy = soapDoc.set("domain", param.domain);
			elBy.setAttribute("by", "name");
		} else {
			soapDoc = AjxSoapDoc.create("GetAllConfigRequest", ZaZimbraAdmin.URN, null);
			var attr = soapDoc.set("a");
			attr.setAttribute("n", ZaDomain.A_zimbraSamlTestTimestamp);
			attr = soapDoc.set("a");
			attr.setAttribute("n", ZaDomain.A_zimbraSamlTestErrorMessage);
		}

		var callback = new AjxCallback(this, this.handleTestResults, param);
		var csfeParams = new Object();
		csfeParams.soapDoc = soapDoc;
		csfeParams.asyncMode = true;
		csfeParams.callback = callback;
		var reqMgrParams = {
			controller: ZaApp.getInstance().getCurrentController()
		}

		ZaRequestMgr.invoke(csfeParams, reqMgrParams)
	}
};

ZaSamlTest.prototype.handleTestResults = function(param, response) {
	var respObj = response && response._data;
	if (!respObj || response.isException()) {
		var dialog = this.getErrorDialog(ZaMsg.samlTestResultFetchError);
		dialog.popup();
		return;
	}

	if (respObj.Body) {
		var model;
		if (param.caller.getInstance() instanceof ZaDomain) {
			model = ZaDomain;
		} else {
			model = ZaGlobalConfig;
		}

		var responseData;
		if (param && param.domain) {
			responseData = respObj.Body.GetDomainResponse && respObj.Body.GetDomainResponse.domain[0];
		} else {
			responseData = respObj.Body.GetAllConfigResponse;
		}
		if (!responseData) {
			var dialog = this.getErrorDialog(ZaMsg.samlTestResultFetchError);
			dialog.popup();
			return;
		}

		var attrs = responseData.a;
		var timestamp, errorMessage;
		var attrName = [
				model.A_zimbraSamlTestTimestamp,
				model.A_zimbraSamlTestErrorMessage
			];

		for (var i = 0; i < attrs.length; i++) {
			if (timestamp && errorMessage) {
				break;
			}
			if (attrs[i].n === attrName[0]) {
				timestamp = attrs[i]._content;
				continue;
			}
			if (attrs[i].n === attrName[1]) {
				errorMessage = attrs[i]._content;
				continue;
			}
		}

		var currentForm = ZaApp.getInstance().getAppViewMgr().getCurrentViewContent().getMyForm();
		if (this.isSameModel(param.caller.getForm(), currentForm)) {
			currentForm.setInstanceValue(timestamp, attrName[0]);
			currentForm.setInstanceValue(errorMessage, attrName[1]);
		}
		// Update UI anyway to unset "In progress" status.
		currentForm.refresh();
	}
};

ZaSamlTest.prototype.getConfirmationDialog = function(message, param) {
	// Create new dialog with a custom listener.
	// Do not use any existing dialog in ZaApp.getInstance().dialogs.
	if (!this.confirmationDialog) {
		this.confirmationDialog = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON]);
	}
	if (message) {
		this.confirmationDialog.setMessage(message, DwtMessageDialog.WARNING_STYLE, ZaMsg.LBL_confirmation);
	}
	this.confirmationDialog.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this.forceTesting, [param]));
	return this.confirmationDialog;
};

ZaSamlTest.prototype.getErrorDialog = function(message) {
	if (!this.errorDialog) {
		this.errorDialog = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.OK_BUTTON]);
	}
	if (message) {
		this.errorDialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE, ZabMsg.zimbraAdminTitle);
	}
	return this.errorDialog;
};

ZaSamlTest.prototype.getLastSamlTestResult = function(caller) {
	if (this.samlTestWindow) {
		return ZaMsg.samlStatusInProgress;
	}

	var model;
	if (caller.getInstance() instanceof ZaDomain) {
		model = ZaDomain;
	} else {
		model = ZaGlobalConfig;
	}

	var attrs = caller.getInstance().attrs;
	var timestamp = attrs[model.A_zimbraSamlTestTimestamp];
	var errorCode = attrs[model.A_zimbraSamlTestErrorMessage]

	if (!timestamp) {
		return ZaMsg.samlStatusNotTested;
	} else if (errorCode) {
		var reason = this.getSamlTestErrorMessage(errorCode);
		return AjxMessageFormat.format(ZaMsg.samlStatusFailed, [ reason ]);
	}
	return ZaMsg.samlStatusSucceeded;
};

ZaSamlTest.prototype.getLastTestTimestamp = function(value) {
	if (this.samlTestWindow) {
		return ZaMsg.samlStatusInProgress;
	}

	return ZaItem.formatServerTime(value);
};

ZaSamlTest.prototype.isSameModel = function(callerForm, currentForm) {
	var callerFormInstance = callerForm.getInstance();
	var currentFormInstance = currentForm.getInstance();
	return callerFormInstance.name === currentFormInstance.name && callerFormInstance.type === currentFormInstance.type;
};

ZaSamlTest.prototype.getSamlTestErrorMessage = function(errorCode) {
	if (
		errorCode === "SSO:ACCOUNT_LOCKED" ||
		errorCode === "SSO:ACCOUNT_LOCKOUT" ||
		errorCode === "SSO:ACCOUNT_CLOSED" ||
		errorCode === "SSO:ACCOUNT_PENDING" ||
		errorCode === "SSO:ACCOUNT_MAINTENANCE"
	) {
		return ZaMsg.samlTestError_ACCOUNT_INACTIVE;
	}

	var msgKey = errorCode.replace("SSO:", "samlTestError_");
	return ZaMsg[msgKey] || ZaMsg.samlTestError_Unknown;
};
