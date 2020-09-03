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

/**
* @class ZaGlobalMessageVolumePage 
* @contructor ZaGlobalMessageVolumePage
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaGlobalMessageVolumePage = function(parent) {
	DwtTabViewPage.call(this, parent);
	this._fieldIds = new Object(); //stores the ids of all the form elements

	//this._createHTML();
	this.initialized=false;
	this.setScrollStyle(DwtControl.SCROLL);	
}
 
ZaGlobalMessageVolumePage.prototype = new DwtTabViewPage;
ZaGlobalMessageVolumePage.prototype.constructor = ZaGlobalMessageVolumePage;

ZaGlobalMessageVolumePage.prototype.toString = 
function() {
	return "ZaGlobalMessageVolumePage";
}

ZaGlobalMessageVolumePage.prototype.showMe =  function(refresh) {
    this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
	if (this.parent.getHtmlElement().offsetHeight > 26) { 						// if parent visible, use offsetHeight
		this._contentEl.style.height=this.parent.getHtmlElement().offsetHeight-26;
	} else {
		var parentHeight = parseInt(this.parent.getHtmlElement().style.height);	// if parent not visible, resize page to fit parent
		var units = AjxStringUtil.getUnitsFromSizeString(this.parent.getHtmlElement().style.height);
		if (parentHeight > 26) {
			this._contentEl.style.height = (Number(parentHeight-26).toString() + units);
		}
	}
	this._contentEl.style.width = this.parent.getHtmlElement().style.width;	// resize page to fit parent

	if(refresh) {
		this.setObject();
	}
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-volume-48hours', 'zmmtastats', [ 'mta_volume' ], [ 'bytes' ], 'now-48h', 'now', { convertToCount: 1 });
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-volume-30days',  'zmmtastats', [ 'mta_volume' ], [ 'bytes' ], 'now-30d', 'now', { convertToCount: 1 });
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-volume-60days',  'zmmtastats', [ 'mta_volume' ], [ 'bytes' ], 'now-60d', 'now', { convertToCount: 1 });
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-volume-year',    'zmmtastats', [ 'mta_volume' ], [ 'bytes' ], 'now-1y',  'now', { convertToCount: 1 });
}

ZaGlobalMessageVolumePage.prototype.setObject =
function () {
    // noop
}

ZaGlobalMessageVolumePage.prototype._createHtml = 
function () {
	DwtTabViewPage.prototype._createHtml.call(this);
	var idx = 0;
	var html = new Array(50);
	html[idx++] = "<div class='StatsHeader'>" + ZaMsg.Stats_MV_Header + "</div>";	
	html[idx++] = "<div class='StatsDiv'>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsHour) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-volume-48hours'></canvas><div id='loggerchartglobal-message-volume-48hours'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsDay) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-volume-30days'></canvas><div id='loggerchartglobal-message-volume-30days'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsMonth) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-volume-60days'></canvas><div id='loggerchartglobal-message-volume-60days'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsYear) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-volume-year'></canvas><div id='loggerchartglobal-message-volume-year'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "</div>";
	this.getHtmlElement().innerHTML = html.join("");
}