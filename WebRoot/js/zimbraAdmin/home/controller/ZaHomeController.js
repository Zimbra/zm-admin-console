/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 8/26/11
 * Time: 3:47 AM
 * To change this template use File | Settings | File Templates.
 */
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaHomeController
* @contructor ZaHomeController
* @param appCtxt
* @param container
* @author Ming Zhang
**/
ZaHomeController = function(appCtxt, container) {
	ZaXFormViewController.call(this, appCtxt, container,"ZaHomeController");
	this._UICreated = false;
	this.objType = ZaEvent.S_HOME;
	this.tabConstructor = ZaHomeXFormView;
}

ZaHomeController.prototype = new ZaXFormViewController();
ZaHomeController.prototype.constructor = ZaHomeController;

ZaHomeController.prototype.toString = function () {
	return "ZaHomeController";
};

ZaApp.prototype.getHomeViewController =
function(viewId) {
	if(!viewId)
		viewId = ZaZimbraAdmin._HOME_VIEW;

	if (viewId && this._controllers[viewId] != null) {
		return this._controllers[viewId];
	}else{
		var c  = this._controllers[viewId] = new ZaHomeController(this._appCtxt, this._container, this);
		return c ;
	}
}

ZaHomeController.prototype.show =
function(entry) {
    if (!this._UICreated)  {
        this._contentView = this._view = new this.tabConstructor(this._container, entry);
        var elements = new Object();
        elements[ZaAppViewMgr.C_APP_CONTENT] = this._view;

        ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements) ;
        ZaApp.getInstance()._controllers[this.getContentViewId()] = this ;
        this._UICreated = true;
    }

    entry = new ZaHome();
    entry.load("", "", true);
    entry[ZaModel.currentTab] = "1";
    entry[ZaModel.currentStep] = 1;
    this._currentObject = entry;
    this._view.setObject(entry);
    ZaApp.getInstance().pushView(this.getContentViewId()) ;
    entry.schedulePostLoading();
}

ZaHomeController.prototype.setInstanceValue =
function (value, ref) {
    var xformView = this._view._localXForm;
    xformView.setInstanceValue (value, ref);
}

ZaHomeController.prototype.showWarningPanel =
function() {
    var xformView = this._view._localXForm;
    if (xformView.getInstanceValue(ZaHome.A2_showWarningPanel) != true) {
        xformView.setInstanceValue(true, ZaHome.A2_showWarningPanel);
    }
}

ZaHomeController.prototype.getAppBarAction =
function () {
    if (AjxUtil.isEmpty(this._appbarOperation)) {
    	this._appbarOperation[ZaOperation.HELP]=new ZaOperation(ZaOperation.HELP,ZaMsg.TBB_Help, ZaMsg.TBB_Help_tt, "Help", "Help", new AjxListener(this, this._helpButtonListener));
    }

    return this._appbarOperation;
}

ZaHomeController.prototype.getAppBarOrder =
function () {
    if (AjxUtil.isEmpty(this._appbarOrder)) {
    	this._appbarOrder.push(ZaOperation.HELP);
    }

    return this._appbarOrder;
}