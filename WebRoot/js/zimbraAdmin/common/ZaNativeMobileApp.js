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
	new ZaListHeaderItem(ZaNativeMobileApp.A2_id, ZaMsg.attrDesc_zimbraId, null, "300px", 1, ZaNativeMobileApp.A2_id, true, true),
	new ZaListHeaderItem(ZaNativeMobileApp.A2_account, ZaMsg.NAD_Account, null, "300px", 2, ZaNativeMobileApp.A2_account, true, true),
	new ZaListHeaderItem(ZaNativeMobileApp.A2_createdAt, "Created", null, "auto", 3, ZaNativeMobileApp.A2_createdAt, true, true)
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
	
	var idx = 0;
	html[idx++] = "<table width='100%' cellspacing='0' cellpadding='0'>";

	html[idx++] = "<tr>";
	if (this._headerList) {
		var cnt = this._headerList.length;
		for(var i = 0; i < cnt; i++) {
			var field = this._headerList[i]._field;
			if (field == ZaNativeMobileApp.A2_createdAt) {
				html[idx++] = "<td align='left' height='20px' width='" + this._headerList[i]._width + this._headerList[i]._widthUnits + "'>";
				var time = item[ZaNativeMobileApp.A2_createdAt];
				html[idx++] = ZaItem.formatServerTime(time);
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
	var message = this.initialMessageRendered ? "No active session exists." : "Click Load button to fetch active sessions.";
	this.initialMessageRendered = true;

	var buffer = new AjxBuffer();
	var	div = document.createElement("div");
	
	buffer.append("<table width='100%' cellspacing='0' cellpadding='1'>",
				  "<tr><td class='NoResults'><br>",
				  message,
				  "</td></tr></table>");
	
	div.innerHTML = buffer.toString();
	this._addRow(div);
};

ZaNativeMobileAppSessionListView.loadButtonListener = function() {
	// Dummy
	var sessionList = [
		{ id: "111-111", account: "test1@dev.zimbra.com", createdAt: "20261026030451.111Z"},
		{ id: "222-222", account: "test2@dev.zimbra.com", createdAt: "20261027020341.222Z"}
	]

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
			.setMessage(
				"You are about to revoke mobile app session(s). A user will be logged out from a mobile app. It will be applied without clicking Save button. Do you want to proceed?",
				DwtMessageDialog.WARNING_STYLE
			);
	}

	ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].registerCallback(
		DwtDialog.YES_BUTTON, ZaNativeMobileAppSessionListView.revokeSession, this, revokeAll);
    ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].popup();
};

ZaNativeMobileAppSessionListView.revokeSession = function(revokeAll) {
    if (ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"]) {
        ZaApp.getInstance().dialogs["RevokeNativeMobileAppSessionConfirmMessageDialog"].popdown();
	}

	var modelClass = ZaNativeMobileApp.getModelClassObject(this.getInstance());
	var allSessions = this.getForm().getInstanceValue(modelClass.A2_nativeMobileAppSessions);
	var selectedSessions = this.getForm().getInstanceValue(modelClass.A2_nativeMobileAppSessions_Selection);

	var sessionsToRevoke = revokeAll ? [].concat(allSessions) : selectedSessions;
	if (!sessionsToRevoke || !sessionsToRevoke.length) {
		return;
	}

	// Call SOAP request to remove session(s)

	// Call SOAP request to get sessions
	for (var i = 0; i < sessionsToRevoke.length; i++ ) {
		AjxUtil.arrayRemove(allSessions, sessionsToRevoke[i]);
	}
	var sessions = allSessions;
	this.getForm().setInstanceValue(sessions, modelClass.A2_nativeMobileAppSessions);
	this.getForm().setInstanceValue([], modelClass.A2_nativeMobileAppSessions_Selection);
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
	var al = a.createdAt.toLowerCase();
	var bl = b.createdAt.toLowerCase();
	if (al < bl) return -1;
	if (al > bl) return 1;
	return 0;
}

ZaNativeMobileAppSessionListView.compareCreatedAtDesc = function(a, b) {
	var al = a.createdAt.toLowerCase();
	var bl = b.createdAt.toLowerCase();
	if (al < bl) return 1;
	if (al > bl) return -1;
	return 0;
}