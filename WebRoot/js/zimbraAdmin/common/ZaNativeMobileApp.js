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
 * Creates ZaNativeMobileApp.
 * @class
 * This class is used for native mobile app settings.
 *
 */
ZaNativeMobileApp = function() {
	// do nothing
};

ZaNativeMobileApp.prototype.constructor = ZaNativeMobileApp;

ZaNativeMobileApp.A2_accountEmail = "accountEmail";
ZaNativeMobileApp.A2_deviceId = "deviceId";
ZaNativeMobileApp.A2_deviceName = "deviceName";
ZaNativeMobileApp.A2_created = "created";
ZaNativeMobileApp.A2_lastUsed = "lastUsed";

ZaNativeMobileApp.initializeSessionList = function() {
	if (!this.getForm().getInstanceValue(ZaAccount.A2_nativeMobileAppSessions)) {
		// a) An empty array must be set at initial load.
		// b) Values of sessions and selection are removed from an instance when Save button is clicked.
		//    Load sessions from the form and reset selection.
		this.getForm().setInstanceValue([], ZaAccount.A2_nativeMobileAppSessions);

		var storedSessions = ZaNativeMobileApp.getStoredSessions(this.getForm());
		if (!storedSessions) {
			this.getForm().nativeMobileAppSessions = [];
			storedSessions = [];
		} else {
			// Set it to FALSE as Load button has been clicked.
			this.getForm().setInstanceValue('FALSE', ZaAccount.A2_nativeMobileAppSessionsInProgress);
		}

		if (storedSessions.length) {
			this.getForm().setInstanceValue(storedSessions, ZaAccount.A2_nativeMobileAppSessions);
			this.getForm().setInstanceValue([], ZaAccount.A2_nativeMobileAppSessions_Selection);
		}
	}
};

ZaNativeMobileApp.getStoredSessions = function(form) {
	return form.nativeMobileAppSessions;
};

ZaNativeMobileApp.setStoredSessions = function(form, sessions) {
	form.nativeMobileAppSessions = sessions;
};

ZaNativeMobileApp.getStoredSortBy = function(form) {
	return form.nativeMobileAppSessionsSortBy;
};

ZaNativeMobileApp.setStoredSortBy = function(form, sortBy) {
	form.nativeMobileAppSessionsSortBy = sortBy;
};

ZaNativeMobileApp.getSessions = function(callback) {
	var name = this.getInstance().name;
	var soapDoc = AjxSoapDoc.create("GetOAuth2ActiveSessionsRequest", ZaZimbraAdmin.URN, null);
	var attr = soapDoc.set("account", name);
	attr.setAttribute("by", "name");

	var responseCallback = new AjxCallback(this, ZaNativeMobileApp.handleGetSessionsResponse, callback);
	var csfeParams = new Object();
	csfeParams.soapDoc = soapDoc;
	csfeParams.asyncMode = true;
	csfeParams.callback = responseCallback;
	var reqMgrParams = {
		controller: ZaApp.getInstance().getCurrentController()
	}

	ZaRequestMgr.invoke(csfeParams, reqMgrParams);
};

ZaNativeMobileApp.handleGetSessionsResponse = function(callback, response) {
	// Enable buttons
	this.getForm().setInstanceValue('FALSE', ZaAccount.A2_nativeMobileAppSessionsInProgress);

	var respObj = response && response._data;
	if (!respObj) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	} else if (response.isException()) {
		ZaApp.getInstance().getCurrentController()._handleException(response.getException(),
			"ZaNativeMobileApp.handleGetSessionsResponse", null, false);
		return;
	} else if (!respObj.Body || !respObj.Body.GetOAuth2ActiveSessionsResponse) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	}

	var sessions = respObj.Body.GetOAuth2ActiveSessionsResponse.mobileDevice || [];
	callback.run(sessions);
};

ZaNativeMobileApp.revokeSession = function(revokeAll, callback) {
	sessions = this.getForm().getInstanceValue(ZaAccount.A2_nativeMobileAppSessions_Selection);
	var account = sessions[0] && sessions[0].accountEmail || this.getInstance().name;
	var deviceId = revokeAll ? null : sessions[0].deviceId;

	var soapDoc = AjxSoapDoc.create("RevokeAccountOAuthRefreshTokensRequest", ZaZimbraAdmin.URN, null);
	var attr = soapDoc.set("account", account);
	attr.setAttribute("by", "name");
	if (deviceId) {
		var attr = soapDoc.set("deviceId", deviceId);
	}

	var responseCallback = new AjxCallback(this, ZaNativeMobileApp.handleRevokeSessionResponse, callback);
	var csfeParams = new Object();
	csfeParams.soapDoc = soapDoc;
	csfeParams.asyncMode = true;
	csfeParams.callback = responseCallback;
	var reqMgrParams = {
		controller: ZaApp.getInstance().getCurrentController()
	}

	ZaRequestMgr.invoke(csfeParams, reqMgrParams);
};

ZaNativeMobileApp.handleRevokeSessionResponse = function(callback, response) {
	// Enable buttons
	this.getForm().setInstanceValue('FALSE', ZaAccount.A2_nativeMobileAppSessionsInProgress);
	this.getForm().setInstanceValue([], ZaAccount.A2_nativeMobileAppSessions_Selection);

	var respObj = response && response._data;
	if (!respObj) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	} else if (response.isException()) {
		ZaApp.getInstance().getCurrentController()._handleException(response.getException(),
			"ZaNativeMobileApp.handleRevokeSessionResponse", null, false);
		return;
	} else if (!respObj.Body || !respObj.Body.RevokeAccountOAuthRefreshTokensResponse) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	}

	var result = respObj.Body.RevokeAccountOAuthRefreshTokensResponse;
	callback.run(result);
};

/**
 * Creates ZaNativeMobileAppSessionListView.
 * @class
 * This class is used for native mobile app session list view.
 *
 */
ZaNativeMobileAppSessionListView = function(parent, className, posStyle, headerList) {
	ZaListView.call(this, parent, className, posStyle, headerList);
};

ZaNativeMobileAppSessionListView.prototype = new ZaListView;
ZaNativeMobileAppSessionListView.prototype.constructor = ZaNativeMobileAppSessionListView;
ZaNativeMobileAppSessionListView.prototype.toString = function() {
	return "ZaNativeMobileAppSessionListView";
};

ZaNativeMobileAppSessionListView.getSessionListHeader = function() {
	var headers = [
		new ZaListHeaderItem(ZaNativeMobileApp.A2_deviceName, ZaMsg.LBL_NativeMobileAppSessionDeviceName, null, "250px", 1,
			ZaNativeMobileApp.A2_deviceName, true, true),
		new ZaListHeaderItem(ZaNativeMobileApp.A2_deviceId, ZaMsg.LBL_NativeMobileAppSessionDeviceId, null, "250px", 2,
			ZaNativeMobileApp.A2_deviceId, true, true),
		new ZaListHeaderItem(ZaNativeMobileApp.A2_created, ZaMsg.LBL_NativeMobileAppSessionCreated, null, "250px", 3,
			ZaNativeMobileApp.A2_created, true, true),
		new ZaListHeaderItem(ZaNativeMobileApp.A2_lastUsed, ZaMsg.LBL_NativeMobileAppSessionLastUsed, null, "auto", 4,
			ZaNativeMobileApp.A2_lastUsed, true, true)
	];
	return headers;
};

ZaNativeMobileAppSessionListView.sessionSelectionListener = function() {
	this.getForm().setInstanceValue(this.getSelection(), ZaAccount.A2_nativeMobileAppSessions_Selection);
};

ZaNativeMobileAppSessionListView.prototype._createItemHtml = function(item) {
	var html = new Array(50);
	var	div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
	div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];
	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

	var formatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG);

	var idx = 0;
	html[idx++] = "<table width='100%' cellspacing='0' cellpadding='0'>";
	html[idx++] = "<tr>";
	if (this._headerList) {
		var cnt = this._headerList.length;
		for(var i = 0; i < cnt; i++) {
			var field = this._headerList[i]._field;
			if (field === ZaNativeMobileApp.A2_created || field === ZaNativeMobileApp.A2_lastUsed) {
				var unixTime = item[field];
				var date = new Date(unixTime);
				var dateTimeString = formatter.format(date);
				html[idx++] = "<td align='left' height='20px' width='" + this._headerList[i]._width + this._headerList[i]._widthUnits + "'>";
				html[idx++] = dateTimeString;
				html[idx++] = "</td>";
			} else {
				html[idx++] = "<td align='left' height='20px' width='" + this._headerList[i]._width + this._headerList[i]._widthUnits + "'>";
				html[idx++] = AjxStringUtil.htmlEncode(item[field]);
				html[idx++] = "</td>";
			}
		}
	} else {
		html[idx++] = "<td width='100%'>";
		html[idx++] = "</td>";
	}

	html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
};

ZaNativeMobileAppSessionListView.prototype._setNoResultsHtml = function() {
	var message;
	var status = this.parent.getInstanceValue(ZaAccount.A2_nativeMobileAppSessionsInProgress);
	if (!status) {
		// Load button has not been clicked yet. (status is undefined.)
		message = AjxMessageFormat.format(ZaMsg.LBL_NativeMobileAppClickLoad, [ZaMsg.LBL_NativeMobileAppSessionsLoadButton]);
	} else if (this.parent.getInstanceValue(ZaAccount.A2_nativeMobileAppSessionsInProgress) === "TRUE") {
		message = ZaMsg.LBL_NativeMobileAppSessionLoading;
	} else {
		message = ZaMsg.LBL_NativeMobileAppNoActiveSession;
	}

	var	div = document.createElement("div");
	var buffer = new AjxBuffer();
	buffer.append(
		"<table width='100%' cellspacing='0' cellpadding='1'>",
		"<tr><td class='NoResults'><br>",
		message,
		"</td></tr></table>"
	);

	div.innerHTML = buffer.toString();
	this._addRow(div);
};

ZaNativeMobileAppSessionListView.loadButtonListener = function() {
	// Disable buttons
	this.getForm().setInstanceValue('TRUE', ZaAccount.A2_nativeMobileAppSessionsInProgress);
	this.getForm().setInstanceValue([], ZaAccount.A2_nativeMobileAppSessions);

	var callback = new AjxCallback(this, ZaNativeMobileAppSessionListView.setSessions);
	ZaNativeMobileApp.getSessions.call(this, callback);
};

ZaNativeMobileAppSessionListView.setSessions = function(sessions) {
	var sessionList = [];
	if (sessions) {
		for (var i = 0; i < sessions.length; i++) {
			var s = sessions[i];
			sessionList.push({
				accountEmail: s.accountEmail,
				deviceId: s.deviceId,
				deviceName: s.deviceName,
				created: parseInt(s.created, 10),
				lastUsed: parseInt(s.lastUsed, 10)
			});
		}
	}

	// Default sort: last used in Desc
	var sortByFunc = ZaNativeMobileApp.getStoredSortBy(this.getForm()) || ZaNativeMobileAppSessionListView.compareLastUsedDesc;
	sessionList.sort(sortByFunc);

	this.getForm().setInstanceValue([], ZaAccount.A2_nativeMobileAppSessions);
	this.getForm().setInstanceValue(sessionList, ZaAccount.A2_nativeMobileAppSessions);
	this.getForm().setInstanceValue([], ZaAccount.A2_nativeMobileAppSessions_Selection);
	ZaNativeMobileApp.setStoredSessions(this.getForm(), sessionList);
};

ZaNativeMobileAppSessionListView.revokeButtonListener = function(revokeAll) {
	if(!ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]) {
		ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"] =
			new ZaMsgDialog(
				ZaApp.getInstance().getAppCtxt().getShell(), null,
				[DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null,
				ZaId.CTR_PREFIX + "REVOKE_NATIVE_MOBILE_APP_SESSION_ConfirmMessage"
			);
	}

	var account = this.getInstance().name;
	var message;
	if (revokeAll) {
		message = AjxMessageFormat.format(ZaMsg.Q_RevokeNativeMobileAppAllSessions, [account]);
	} else {
		var selectedSession = this.getForm().getInstanceValue(ZaAccount.A2_nativeMobileAppSessions_Selection);
		var deviceId = selectedSession && selectedSession[0] && selectedSession[0].deviceId;
		message = AjxMessageFormat.format(ZaMsg.Q_RevokeNativeMobileAppSingleSession, [account, deviceId]);
	}

	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]
		.setMessage(message, DwtMessageDialog.WARNING_STYLE);
	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].registerCallback(
		DwtDialog.YES_BUTTON, ZaNativeMobileAppSessionListView.revokeSession, this, revokeAll);
	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].popup();
};

ZaNativeMobileAppSessionListView.revokeSession = function(revokeAll) {
	if (ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]) {
		ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].popdown();
	}

	// Disable buttons
	this.getForm().setInstanceValue('TRUE', ZaAccount.A2_nativeMobileAppSessionsInProgress);

	var callback = new AjxCallback(this, ZaNativeMobileAppSessionListView.revokeSessionCallback);
	ZaNativeMobileApp.revokeSession.call(this, revokeAll, callback);
};

ZaNativeMobileAppSessionListView.revokeSessionCallback = function(result) {
	if (!ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionCompletionDialog"]) {
		ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionCompletionDialog"] =
			new ZaMsgDialog(
				ZaApp.getInstance().getAppCtxt().getShell(), null,
				[DwtDialog.OK_BUTTON], null,
				ZaId.CTR_PREFIX + "REVOKE_NATIVE_MOBILE_APP_SESSION_COMPLETION_ConfirmMessage"
			);
	}

	var revokedCount = result.revokedTokensCount && result.revokedTokensCount[0] && result.revokedTokensCount[0]._content || 0;
	var message = AjxMessageFormat.format(ZaMsg.LBL_NativeMobileAppSessionRevoked, [revokedCount]);
	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionCompletionDialog"]
		.setMessage(message, DwtMessageDialog.INFO_STYLE);
	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionCompletionDialog"].popup();

	// Refetch sessions in background
	ZaNativeMobileAppSessionListView.loadButtonListener.call(this);
};

// Sort functions
ZaNativeMobileAppSessionListView.prototype._sortColumn = function (columnItem, bSortAsc){
	var sortField = columnItem.getSortField();

	// Find a sort function
	var sortFunctionName = "compare" + sortField.slice(0, 1).toUpperCase() + sortField.slice(1) + (bSortAsc ? "Asc" : "Desc");
	var sortFunction = ZaNativeMobileAppSessionListView[sortFunctionName];

	this._list.sort(sortFunction);

	// Store a copied array so that the sorted list is shown after Save is clicked.
	ZaNativeMobileApp.setStoredSessions(this.parent, [].concat(this._list.getArray()));

	// Store a reference of the sort function so that a list is sorted when Load is clicked.
	ZaNativeMobileApp.setStoredSortBy(this.parent, sortFunction);

	this.setUI();
};

ZaNativeMobileAppSessionListView.compareDeviceIdAsc = function(a, b) {
	var al = a.deviceId.toLowerCase();
	var bl = b.deviceId.toLowerCase();
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareDeviceIdDesc = function(a, b) {
	var al = a.deviceId.toLowerCase();
	var bl = b.deviceId.toLowerCase();
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareDeviceNameAsc = function(a, b) {
	var al = a.deviceName.toLowerCase();
	var bl = b.deviceName.toLowerCase();
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareDeviceNameDesc = function(a, b) {
	var al = a.deviceName.toLowerCase();
	var bl = b.deviceName.toLowerCase();
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareCreatedAsc = function(a, b) {
	var al = a.created;
	var bl = b.created;
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareCreatedDesc = function(a, b) {
	var al = a.created;
	var bl = b.created;
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareLastUsedAsc = function(a, b) {
	var al = a.lastUsed;
	var bl = b.lastUsed;
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
};

ZaNativeMobileAppSessionListView.compareLastUsedDesc = function(a, b) {
	var al = a.lastUsed;
	var bl = b.lastUsed;
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
};
