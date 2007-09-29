/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Yahoo! Public License
 * Version 1.0 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaGlobalStatsController 
* @contructor ZaGlobalStatsController
* @param appCtxt
* @param container
* @param app
* @author Greg Solovyev
**/
function ZaGlobalStatsController(appCtxt, container, app) {

	ZaController.call(this, appCtxt, container, app);
	this._helpURL = "/zimbraAdmin/adminhelp/html/WebHelp/monitoring/checking_usage_statistics.htm";	
}

ZaGlobalStatsController.prototype = new ZaController();
ZaGlobalStatsController.prototype.constructor = ZaGlobalStatsController;

//ZaGlobalStatsController.STATUS_VIEW = "ZaGlobalStatsController.STATUS_VIEW";

ZaGlobalStatsController.prototype.show = 
function() {
    if (!this._contentView) {
		this._contentView = new ZaGlobalStatsView(this._container, this._app);
		var elements = new Object();
		this._ops = new Array();
		this._ops.push(new ZaOperation(ZaOperation.NONE));
		this._ops.push(new ZaOperation(ZaOperation.HELP, ZaMsg.TBB_Help, ZaMsg.TBB_Help_tt, "Help", "Help", new AjxListener(this, this._helpButtonListener)));				
		this._toolbar = new ZaToolBar(this._container, this._ops);    		
		
		elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
		elements[ZaAppViewMgr.C_TOOLBAR_TOP] = this._toolbar;		
		this._app.createView(ZaZimbraAdmin._STATISTICS, elements);
	}
	this._app.pushView(ZaZimbraAdmin._STATISTICS);
//	this._app.setCurrentController(this);
}

