/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”);
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an “AS IS” basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2012, 2013 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 4/1/12
 * Time: 2:11 AM
 * To change this template use File | Settings | File Templates.
 */


ZaAboutDialog = function(parent, className, w, h) {
    if (arguments.length == 0) return;
    var clsName = className || "DwtBaseDialog AboutScreen";
    DwtBaseDialog.call(this, parent, clsName,  "");
    w = w || "579px";
    h = h || "264px";
    this.setSize(w, h);
    this.addCloseListener();
    this.addFocusBlurListener();
}

ZaAboutDialog.prototype = new DwtBaseDialog;
ZaAboutDialog.prototype.constructor = ZaAboutDialog;
ZaAboutDialog.prototype.TEMPLATE = "admin.Widgets#ZaAboutDialog";
ZaAboutDialog.prototype.closeIcon = "ImgAboutClose";
ZaAboutDialog.prototype.closeHoverIcon = "ImgAboutCloseHover";

ZaAboutDialog.prototype._createHtmlFromTemplate = function (templateId, data) {
    data.dragId = this._dragHandleId;
    data.closeIcon = this.closeIcon ? this.closeIcon : "ImgAboutClose";
    var date = AjxDateFormat.getDateInstance().format(ZaServerVersionInfo.buildDate);
    data.version = AjxBuffer.concat(ZaMsg.splashScreenVersion, " ", ZaServerVersionInfo.version , " " , date);
    data.copyright = ZaItem.getAboutScreenCopyright();
    data.aboutBanner = "ImgAboutBanner";
    data.logoURL = ZaAppCtxt.getLogoURI();
    DwtComposite.prototype._createHtmlFromTemplate.call(this, templateId, data);
    this._contentEl = document.getElementById(data.id+"_content");
    this._closeIconEl = document.getElementById(data.id+"_close");
}

ZaAboutDialog.prototype.addCloseListener = function () {
    if (this._closeIconEl) {
        Dwt.setHandler(this._closeIconEl, DwtEvent.ONCLICK, AjxCallback.simpleClosure(this.popdown, this));
    }
}

ZaAboutDialog.prototype.addFocusBlurListener = function () {
    if (this._closeIconEl && this._closeIconEl.firstChild) {
        var enterEvent = AjxEnv.isIE? DwtEvent.ONMOUSEENTER: DwtEvent.ONMOUSEOVER;
        var leaveEvent = AjxEnv.isIE? DwtEvent.ONMOUSELEAVE: DwtEvent.ONMOUSEOUT;
        Dwt.setHandler(this._closeIconEl.firstChild, enterEvent, AjxCallback.simpleClosure(this.changeCloseIcon, this, true));
        Dwt.setHandler(this._closeIconEl.firstChild, leaveEvent, AjxCallback.simpleClosure(this.changeCloseIcon, this, false));
    }
}

ZaAboutDialog.prototype.changeCloseIcon = function (isHover) {
    if (this._closeIconEl && this._closeIconEl.firstChild) {
        if (isHover) {
            Dwt.delClass(this._closeIconEl.firstChild, this.closeIcon, this.closeHoverIcon);
        } else {
            Dwt.delClass(this._closeIconEl.firstChild, this.closeHoverIcon, this.closeIcon);
        }
    }
}

