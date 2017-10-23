/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 9/5/11
 * Time: 1:00 AM
 * To change this template use File | Settings | File Templates.
 */

ZaTaskHeaderPanel = function(parent) {
    DwtComposite.call(this, parent, "TaskHeaderPanel", Dwt.ABSOLUTE_STYLE);
    this._expanded = false;
    this.getHtmlElement().innerHTML = this.getImgHtml();
    this.getHtmlElement().onclick = AjxCallback.simpleClosure(ZaTaskHeaderPanel.__handleClick, this);
    var showStatusPane = ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI];
    if (!showStatusPane) {
        for (var i = 0; i < ZaSettings.STATUS_PANE_ITEMS.length; i++) {
            if (ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.STATUS_PANE_ITEMS[i]]) {
                showStatusPane = true;
                break;
            }
        }
    }
    if (!showStatusPane){
        this.getHtmlElement().style.visibility = "hidden";
    }
}

ZaTaskHeaderPanel.expandedImg =  "ImgCollapseRight";
ZaTaskHeaderPanel.collapsedImg =  "ImgCollapseLeft";

ZaTaskHeaderPanel.prototype = new DwtComposite;
ZaTaskHeaderPanel.prototype.constructor = ZaTaskHeaderPanel;

ZaTaskHeaderPanel.prototype.getImgHtml = function() {
   if (this._expanded) {
       return ["<div class='", ZaTaskHeaderPanel.expandedImg, "' ></div>"].join("");
   } else {
       return ["<div class='", ZaTaskHeaderPanel.collapsedImg, "' ></div>"].join("");
   }
}

ZaTaskHeaderPanel.__handleClick =
function(ev) {
    this._expanded = !this._expanded;
    this.getHtmlElement().innerHTML = this.getImgHtml();
    ZaZimbraAdmin.getInstance().getTaskController().setExpanded(this._expanded);
}

