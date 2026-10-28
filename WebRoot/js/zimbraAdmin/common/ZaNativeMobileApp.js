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

// TODO: update them with right keys
ZaNativeMobileApp.A2_id = "id";
ZaNativeMobileApp.A2_account = "account";
ZaNativeMobileApp.A2_createdAt = "createdAt";
ZaNativeMobileApp.A2_lastAccessedAt = "lastAccessedAt";

ZaNativeMobileApp.initializeSessionList = function() {
	var modelClass = ZaNativeMobileApp.getModelClassObject(this.getInstance());
	if (!this.getForm().getInstanceValue(modelClass.A2_nativeMobileAppSessions)) {
		this.getForm().setInstanceValue([], modelClass.A2_nativeMobileAppSessions);
	}
};

ZaNativeMobileApp.getModelClassObject = function(modelInstance) {
	if (modelInstance instanceof ZaAccount) return ZaAccount;
	else if (modelInstance instanceof ZaCos) return ZaCos;
	else if (modelInstance instanceof ZaDomain) return ZaDomain;
};

ZaNativeMobileApp.getSessions = function(callback) {
	// Call SOAP request to get sessions
	// TODO: replace with a right soap API
	var soapDoc = AjxSoapDoc.create("DumpSessionsRequest", ZaZimbraAdmin.URN, null);
	soapDoc.setMethodAttribute("listSessions", "1");

	var responseCallback = new AjxCallback(null, ZaNativeMobileApp.handleGetSessionsResponse, callback);
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
	var respObj = response && response._data;
	if (!respObj) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	} else if (response.isException()) {
		ZaApp.getInstance().getCurrentController()._handleException(response.getException(), "ZaNativeMobileApp.handleGetSessionsResponse", null, false);
		return;
	} else if (!respObj.Body || !respObj.Body.DumpSessionsResponse) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	}

	var DumpSessionsResponse = respObj.Body.DumpSessionsResponse;
	var soapSessions = DumpSessionsResponse && DumpSessionsResponse.soap && DumpSessionsResponse.soap[0] && DumpSessionsResponse.soap[0].s || []
	var adminSessions = DumpSessionsResponse && DumpSessionsResponse.admin && DumpSessionsResponse.admin[0] && DumpSessionsResponse.admin[0].s || [];
	callback.run(soapSessions.concat(adminSessions));
};

ZaNativeMobileApp.revokeSession = function(revokeAll, callback) {
	var sessions;
	if (!revokeAll) {
		var modelClass = ZaNativeMobileApp.getModelClassObject(this.getInstance());
		sessions = this.getForm().getInstanceValue(modelClass.A2_nativeMobileAppSessions_Selection);
	}

	// Call SOAP request to revoke session(s)
	// TODO: replace with a right soap API
	var soapDoc = AjxSoapDoc.create("GetConfigRequest", ZaZimbraAdmin.URN, null);
	var attr = soapDoc.set("a", "");
	attr.setAttribute("n", "zimbraAdminPort");
	if (revokeAll) {
		// Do something
	}

	var responseCallback = new AjxCallback(null, ZaNativeMobileApp.handleRevokeSessionResponse, callback);
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
	var respObj = response && response._data;
	if (!respObj) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	} else if (response.isException()) {
		ZaApp.getInstance().getCurrentController()._handleException(response.getException(), "ZaNativeMobileApp.handleRevokeSessionResponse", null, false);
		return;
	} else if (!respObj.Body || !respObj.Body.GetConfigResponse) {
		var dialog = this.getErrorDialog(ZaMsg.ERROR_RECEIVED_EMPTY_RESPONSE);
		dialog.popup();
		return;
	}

	// TODO: Check response

	callback.run();
}

/**
 * Creates ZaNativeMobileAppSessionListView.
 * @class
 * This class is used for native mobile app session list view.
 *
 */
ZaNativeMobileAppSessionListView = function(parent, className, posStyle, headerList) {
	ZaListView.call(this, parent, className, posStyle, headerList);
}

ZaNativeMobileAppSessionListView.prototype = new ZaListView;
ZaNativeMobileAppSessionListView.prototype.constructor = ZaNativeMobileAppSessionListView;
ZaNativeMobileAppSessionListView.prototype.toString = function() {
	return "ZaNativeMobileAppSessionListView";
};

ZaNativeMobileAppSessionListView.sessionListHeader = [
	new ZaListHeaderItem(ZaNativeMobileApp.A2_id, ZaMsg.LBL_NativeMobileAppSessionId, null, "200px", 1, ZaNativeMobileApp.A2_id, true, true),
	new ZaListHeaderItem(ZaNativeMobileApp.A2_account, ZaMsg.LBL_NativeMobileAppSessionAccount, null, "300px", 2, ZaNativeMobileApp.A2_account, true, true),
	new ZaListHeaderItem(ZaNativeMobileApp.A2_createdAt, ZaMsg.LBL_NativeMobileAppSessionCreated, null, "300px", 3, ZaNativeMobileApp.A2_createdAt, true, true),
	new ZaListHeaderItem(ZaNativeMobileApp.A2_lastAccessedAt, ZaMsg.LBL_NativeMobileAppSessionLastAccessed, null, "auto", 4, ZaNativeMobileApp.A2_lastAccessedAt, true, true)
];

ZaNativeMobileAppSessionListView.sessionSelectionListener = function(ev) {
	var modelClass = ZaNativeMobileApp.getModelClassObject(this.getInstance());
	this.getForm().setInstanceValue(this.getSelection(), modelClass.A2_nativeMobileAppSessions_Selection);
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
			if (field === ZaNativeMobileApp.A2_createdAt || field === ZaNativeMobileApp.A2_lastAccessedAt) {
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
	var message = this.initialMessageRendered ?
		ZaMsg.LBL_NativeMobileAppNoActiveSession :
		AjxMessageFormat.format(ZaMsg.LBL_NativeMobileAppClickLoad, [ZaMsg.LBL_NativeMobileAppSessionsLoadButton]);
	this.initialMessageRendered = true;

	var buffer = new AjxBuffer();
	var	div = document.createElement("div");
	
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
	var callback = new AjxCallback(this, ZaNativeMobileAppSessionListView.setSessions);
	ZaNativeMobileApp.getSessions.call(this, callback);
};

ZaNativeMobileAppSessionListView.setSessions = function(sessions) {
	var sessionList = [];
	if (sessions) {
		for (var i = 0; i < sessions.length; i++) {
			var s = sessions[i];
			sessionList.push({ id: s.sid, account: s.name, createdAt: s.cd, lastAccessedAt: s.ld });
		}
	}

	var modelClass = ZaNativeMobileApp.getModelClassObject(this.getInstance());
	this.getForm().setInstanceValue([], modelClass.A2_nativeMobileAppSessions);
	this.getForm().setInstanceValue(sessionList, modelClass.A2_nativeMobileAppSessions);
	this.getForm().setInstanceValue([], modelClass.A2_nativeMobileAppSessions_Selection);
};

ZaNativeMobileAppSessionListView.revokeButtonListener = function(revokeAll) {
	if(!ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]) {
		ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"] =
			new ZaMsgDialog(
				ZaApp.getInstance().getAppCtxt().getShell(), null,
				[DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null,
				ZaId.CTR_PREFIX + "DELETE_RETENTION_POLICY_ConfirmMessage"
			);

		ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]
			.setMessage(ZaMsg.Q_RevokeNativeMobileApp, DwtMessageDialog.WARNING_STYLE);
	}

	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].registerCallback(
		DwtDialog.YES_BUTTON, ZaNativeMobileAppSessionListView.revokeSession, this, revokeAll);
	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].popup();
};

ZaNativeMobileAppSessionListView.revokeSession = function(revokeAll) {
	if (ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]) {
		ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].popdown();
	}

	// Fetch sessions after revocation through a callback
	var callback = new AjxCallback(this, ZaNativeMobileAppSessionListView.loadButtonListener);
	ZaNativeMobileApp.revokeSession.call(this, revokeAll, callback);
};


// Sort functions
ZaNativeMobileAppSessionListView.prototype._sortColumn = function (columnItem, bSortAsc){
	var sortField = columnItem.getSortField();
	if (sortField === ZaNativeMobileApp.A2_id) {
		bSortAsc ?
			this._list.sort(ZaNativeMobileAppSessionListView.compareIdAsc) :
			this._list.sort(ZaNativeMobileAppSessionListView.compareIdDesc);
	} else if (sortField === ZaNativeMobileApp.A2_account) {
		bSortAsc ?
			this._list.sort(ZaNativeMobileAppSessionListView.compareAccountAsc) :
			this._list.sort(ZaNativeMobileAppSessionListView.compareAccountDesc);
	} else if (sortField === ZaNativeMobileApp.A2_createdAt) {
		bSortAsc ?
			this._list.sort(ZaNativeMobileAppSessionListView.compareCreatedAtAsc) :
			this._list.sort(ZaNativeMobileAppSessionListView.compareCreatedAtDesc);
	} else if (sortField === ZaNativeMobileApp.A2_lastAccessedAt) {
		bSortAsc ?
			this._list.sort(ZaNativeMobileAppSessionListView.compareLastAccessedAtAsc) :
			this._list.sort(ZaNativeMobileAppSessionListView.compareLastAccessedAtDesc);
	}
	this.setUI();
}

ZaNativeMobileAppSessionListView.compareIdAsc = function(a, b) {
	var al = a.id.toLowerCase();
	var bl = b.id.toLowerCase();
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareIdDesc = function(a, b) {
	var al = a.id.toLowerCase();
	var bl = b.id.toLowerCase();
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareAccountAsc = function(a, b) {
	var al = a.account.toLowerCase();
	var bl = b.account.toLowerCase();
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareAccountDesc = function(a, b) {
	var al = a.account.toLowerCase();
	var bl = b.account.toLowerCase();
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareCreatedAtAsc = function(a, b) {
	var al = a.createdAt;
	var bl = b.createdAt;
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareCreatedAtDesc = function(a, b) {
	var al = a.createdAt;
	var bl = b.createdAt;
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareLastAccessedAtAsc = function(a, b) {
	var al = a.lastAccessedAt;
	var bl = b.lastAccessedAt;
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareLastAccessedAtDesc = function(a, b) {
	var al = a.lastAccessedAt;
	var bl = b.lastAccessedAt;
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
}
