/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
* Creates an error dialog which basically means it will have a "Report" button
* @constructor
* @class
* A normal DwtMessageDialog w/ a "Report" button that will post user info to the 
* server when clicked.
*/
ZaErrorDialog = function(parent, contextId) {
	//if (arguments.length === 0) {return;}
	if(!parent) return;

	var detailButton = new DwtDialog_ButtonDescriptor(ZaErrorDialog.DETAIL_BUTTON, AjxMsg.detail, DwtDialog.ALIGN_LEFT);
	var id = contextId? ZaId.getDialogId(ZaId.DLG_ERR,contextId):ZaId.getDialogId(ZaId.DLG_ERR); 
	DwtMessageDialog.call(this, parent, null, null, [detailButton],id);

	// setup the detail button
	this._detailCell = document.getElementById(this._detailCellId);
	var detailBtn = this._button[ZaErrorDialog.DETAIL_BUTTON];
	detailBtn.setImage("SelectPullDownArrow");
	this.registerCallback(ZaErrorDialog.DETAIL_BUTTON, this._showDetail, this);
    this._setAllowSelection();
}

ZaErrorDialog.prototype = new DwtMessageDialog;
ZaErrorDialog.prototype.constructor = ZaErrorDialog;

ZaErrorDialog.prototype.toString = function() {
	return "ZaErrorDialog";
};

//
// Constants
//

ZaErrorDialog.DETAIL_BUTTON = ++DwtDialog.LAST_BUTTON;

//
// Data
//

ZaErrorDialog.prototype._detailsVisible = false;

ZaErrorDialog.prototype.CONTROLS_TEMPLATE = "zimbra.Widgets#ZmErrorDialogControls";

//
// Public methods
//

ZaErrorDialog.prototype.reset =
function() {
	this.setDetailString();
	DwtMessageDialog.prototype.reset.call(this);
};

ZaErrorDialog.prototype.setMessage =
function(msgStr, detailStr, style, title) {
	msgStr = AjxStringUtil.htmlEncode(msgStr);

	// If we have a <br> tag in string then we need to maintain decode it, so it will be considered as html tag
	msgStr = msgStr.replace(/&lt;br\s?(\/)?&gt;/gi, '<br />');

	this._msgStr = msgStr;
	this._msgStyle = style;
	this._msgTitle = title;

    // clear the 'detailsVisible' flag and reset the 'showDetails' button icon
    this._detailsVisible = false;
    this._button[ZaErrorDialog.DETAIL_BUTTON].setImage("SelectPullDownArrow");

    DwtMessageDialog.prototype.setMessage.call(this, msgStr, style, title);
	this.setDetailString(detailStr);
};

/**
* Sets the text that shows up when the Detail button is pressed.
*
* @param text	detail text
*/
ZaErrorDialog.prototype.setDetailString = 
function(text) {
	if (!(this._buttonElementId[ZaErrorDialog.DETAIL_BUTTON])) {return;}

    this._detailStr = text;

    this._button[ZaErrorDialog.DETAIL_BUTTON].setVisible(text != null);
    if (this._detailsEl) {
        this._detailsEl.value = text || "";
	}
};



//
// Protected methods
//

ZaErrorDialog.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtMessageDialog.prototype._createHtmlFromTemplate.call(this, templateId, data);
    this._detailsContainerEl = document.getElementById(data.id+"_details_container");
    this._detailsEl = document.getElementById(data.id+"_details");
};

ZaErrorDialog.prototype._getContentHtml =
function() {
	this._detailCellId = Dwt.getNextId();
	var html = new Array();
	var idx = 0;

	html[idx++] = DwtMessageDialog.prototype._getContentHtml.call(this);
	html[idx++] = "<div id='" + this._detailCellId + "'></div>";
	
	return html.join("");
};


// Displays the detail text
ZaErrorDialog.prototype._showDetail = function() {
    this._detailsVisible = !this._detailsVisible;

    var msg = this._msgStr;
    if (this._detailsVisible) {
    	msg += "<div style='overflow:auto;height:100px'>";
        msg += "<hr> " + this._detailStr;
        msg += "</div>";
    }
    DwtMessageDialog.prototype.setMessage.call(this, msg, this._msgStyle, this._msgTitle);
    this._button[ZaErrorDialog.DETAIL_BUTTON].setImage(this._detailsVisible ? "SelectPullUpArrow" : "SelectPullDownArrow");
};
