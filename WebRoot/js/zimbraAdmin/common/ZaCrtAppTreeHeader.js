/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 8/17/11
 * Time: 12:12 AM
 * To change this template use File | Settings | File Templates.
 */

ZaCrtAppTreeHeader = function(parent, className, buttons) {
    var cssClass = className || "ZaCtrAppTreeHeader";
	DwtButton.call(this, parent, "", cssClass, Dwt.ABSOLUTE_STYLE);
    this.preObj = null;
	this._historyMgr = ZaZimbraAdmin.getInstance().getHistoryMgr();
    this._historyMgr.addChangeListener(new AjxListener(this, this.updateMenu));
    this.menu = new ZaPopupMenu(this);
    this.menu.setWidth(150);
    this.setMenu(this.menu);
    //this.setRightImg();
}

ZaCrtAppTreeHeader.prototype = new DwtButton;
ZaCrtAppTreeHeader.prototype.constructor = ZaCrtAppTreeHeader ;
ZaCrtAppTreeHeader.prototype._dropDownImg = "";
ZaCrtAppTreeHeader.prototype._dropDownDepImg = "";
ZaCrtAppTreeHeader.prototype._dropDownHovImg = "";
ZaCrtAppTreeHeader.defaultImg = "CollapseLeft";
ZaCrtAppTreeHeader.normalBgImg = "ImgArrowShapeNormal";
ZaCrtAppTreeHeader.hoverBgImg = "ImgArrowShapeHover";

ZaCrtAppTreeHeader.prototype.toString =
function() {
	return "ZaCrtAppTreeHeader";
}

ZaCrtAppTreeHeader.prototype.TEMPLATE = "admin.Widgets#ZaTreeHeaderButton";

ZaCrtAppTreeHeader.prototype._createHtmlFromTemplate = function(templateId, data) {
    data.bgImg = ZaCrtAppTreeHeader.normalBgImg;
    DwtButton.prototype._createHtmlFromTemplate.call(this, templateId, data);
    this._tabelEl = document.getElementById(data.id+"_table");
    this._arrowEl = document.getElementById(data.id+"_doubleArrow");
    this._imgEl = document.getElementById(data.id+"_img");
};

ZaCrtAppTreeHeader.prototype.setRightImg = function (imgName) {
    if (!this._imgEl)
        return;

    var localImg = imgName || ZaCrtAppTreeHeader.defaultImg;
    this._imgEl.innerHTML = AjxImg.getImageHtml(localImg);
}

ZaCrtAppTreeHeader.prototype._handleClick =
function(ev) {
    if (this._isArrowEvent(ev)) {
        var tree = ZaZimbraAdmin.getInstance().getOverviewPanelController().getOverviewPanel().getFolderTree();
        tree.setSelectionByPath(this.preObj.path, false);
    }
    // Nothing doing here
}

ZaCrtAppTreeHeader.prototype._getPreviousObject = function(path) {

    var tree = ZaZimbraAdmin.getInstance().getOverviewPanelController().getOverviewPanel().getFolderTree();
    var currentRoot = tree.getCurrentRootItem();
    var dataItem = currentRoot.getData("dataItem");
    var path = tree.getABPath(dataItem);
    var pathItems = ZaTree.getPathItems(path);
    if (pathItems.length > 1) {
        // Special case for search. We use a special path to specify a view
        if (pathItems[1] == ZaMsg.OVP_search) {
            pathItems = [pathItems[0]];
        } else {
            pathItems.pop();
        }
    }

    var displayName = pathItems[pathItems.length - 1];
    var resultPath = ZaTree.getPathByArray(pathItems);
    return new ZaHistory(resultPath, displayName);
}

ZaCrtAppTreeHeader.prototype._showHoverImage =
function(show) {
    if (this._tabelEl) {
        if (show) {
            Dwt.delClass(this._tabelEl, ZaCrtAppTreeHeader.normalBgImg, ZaCrtAppTreeHeader.hoverBgImg);
        } else {
            Dwt.delClass(this._tabelEl, ZaCrtAppTreeHeader.hoverBgImg, ZaCrtAppTreeHeader.normalBgImg);
        }
    }

}

ZaCrtAppTreeHeader.prototype._isDropDownEvent =
function(ev) {
	if (this._dropDownEventsEnabled && this._dropDownEl) {
		var mouseX = ev.docX;
		var dropDownX = Dwt.toWindow(this._dropDownEl, 0, 0, window).x;
        var isAfterDropDown = true;
		if (mouseX < dropDownX) {
			isAfterDropDown = false;
		}
        var isBeforeCollapse =  true;
        if (this._imgEl) {
            var imgX =  Dwt.toWindow(this._imgEl, 0, 0, window).x;
            if (mouseX >= imgX)
                isBeforeCollapse = false;
        }
        return isAfterDropDown && isBeforeCollapse;
	}
	return false;
};

ZaCrtAppTreeHeader.prototype._isArrowEvent =
function(ev) {
    if (this._arrowEl && this._textEl) {
        var arrowBounds = Dwt.getBounds(this._arrowEl);
        var textBounds = Dwt.getBounds(this._textEl);
        var start = arrowBounds.x;
        var end = textBounds.x + textBounds.width;
        var mouseX = ev.docX;
        if (mouseX < start)
            return false;
        if (mouseX >= end)
            return false;
        return true;
    }
    return false;
}

ZaCrtAppTreeHeader.prototype.setText = function (historyObject) {
    this.preObj = this._getPreviousObject();
    var displayText = this.getDisplayContent(this.preObj.displayName);
	DwtLabel.prototype.setText.call(this, displayText);
}

ZaCrtAppTreeHeader.prototype.getDisplayContent= function (text) {
    var displayText = text;
    if (text) {
        var titleWidth = Dwt.getSize(this._textEl);
        var totalTextWidth = AjxStringUtil.getWidth(text);
        if (totalTextWidth > titleWidth.x) {
            var totalNumber = text.length;
            var textLength = titleWidth.x - AjxStringUtil.getWidth("...");
            var maxNumberOfLetters = Math.floor(textLength*totalNumber/totalTextWidth);
            displayText = text.substring(0, maxNumberOfLetters) + "...";
        }
    }
    return displayText;
}

ZaCrtAppTreeHeader.prototype.popup =
function(menu) {
	menu = menu || this.getMenu();

    if (!menu) { return; }

    var parent = menu.parent;
	var parentBounds = parent.getBounds();
	var windowSize = menu.shell.getSize();
	var menuSize = menu.getSize();
	var parentElement = parent.getHtmlElement();
	// since buttons are often absolutely positioned, and menus aren't, we need x,y relative to window
	var parentLocation = Dwt.toWindow(parentElement, 0, 0);
	var leftBorder = (parentElement.style.borderLeftWidth == "") ? 0 : parseInt(parentElement.style.borderLeftWidth);

	var x;
    var dropDownEl = parent._dropDownEl;
    if (!dropDownEl) {
	    x = parentLocation.x + leftBorder;
    } else {
        var dropDownLocation = Dwt.toWindow(dropDownEl, 0, 0);
        x = dropDownLocation.x;
    }
	x = ((x + menuSize.x) >= windowSize.x) ? windowSize.x - menuSize.x : x;

	var y;

    var horizontalBorder = (parentElement.style.borderTopWidth == "") ? 0 : parseInt(parentElement.style.borderTopWidth);
    horizontalBorder += (parentElement.style.borderBottomWidth == "") ? 0 : parseInt(parentElement.style.borderBottomWidth);
    y = parentLocation.y + parentBounds.height + horizontalBorder;

	menu.popup(0, x, y);
};

ZaCrtAppTreeHeader.searchHistoryCache = {};
ZaCrtAppTreeHeader.isFound = function (path) {
    if(!ZaCrtAppTreeHeader.searchHistoryCache[path]) {
        ZaCrtAppTreeHeader.searchHistoryCache[path] = true;
        return  false;
    }
    return true;
}

ZaCrtAppTreeHeader.prototype.createMenu = function
() {
    var i = 0;
    var mi;
    var listener = new AjxListener(this, this.goToTreeItemListener);
    var allHistory = this._historyMgr.getAllHistory();

    ZaCrtAppTreeHeader.searchHistoryCache = {};
    if(allHistory.size() > 20) {
        var j = allHistory.size()-1;
        var findNum = 0;
        for (j = allHistory.size() - 1; j >= 0; j--) {
            var currentHistory = allHistory.get(j);
            if(!currentHistory.isShowInHistory)
                continue;

            if (ZaCrtAppTreeHeader.isFound(currentHistory.path))
                continue;

            findNum++;
            if (findNum == 20)
                break;
        }

        if (j > 0)
            i = j;
    }
    // Always add home here.
    var currentHistory;
    if (i > 0) {
        currentHistory = allHistory.get(0);
        mi = new DwtMenuItem({
		                parent: this.menu,
		                style:		DwtMenuItem.NO_STYLE,
		                id:     ZaId.getMenuItemId(this._contextId, i + currentHistory.path)
	    });
        mi.setText(currentHistory.displayName);
        mi.setData("history", currentHistory);
        mi.addSelectionListener(listener);
        i = i + 1;
    }

    ZaCrtAppTreeHeader.searchHistoryCache = {};
    var minIndex = i;
    for (i =  allHistory.size() - 1; i >= minIndex; i--) {
        currentHistory = allHistory.get(i);
        if (!currentHistory.isShowInHistory)
            continue;

        if (ZaCrtAppTreeHeader.isFound(currentHistory.path))
            continue;

        mi = new DwtMenuItem({
		                parent: this.menu,
		                style:		DwtMenuItem.NO_STYLE,
		                id:     ZaId.getMenuItemId(this._contextId, i + currentHistory.path)
	    });
        mi.setText(currentHistory.displayName);
        mi.setEnabled(currentHistory.enabled);
        mi.setData("history", currentHistory);
        mi.addSelectionListener(listener);
    }

    this.menu.createSeparator();

    mi = new DwtMenuItem({
                    parent: this.menu,
                    style:		DwtMenuItem.NO_STYLE,
                    id:     ZaId.getMenuItemId(this._contextId, "clearHistory")
    });
    mi.setText(ZaMsg.LBL_Treeheader_clearHistory);
    mi.setData("history", currentHistory);
    mi.addSelectionListener(new AjxListener(this, this.clearHistory));
}

ZaCrtAppTreeHeader.prototype.updateMenu =
function() {
    this.menu.removeChildren();
    this.createMenu();
}

ZaCrtAppTreeHeader.prototype.goToTreeItemListener = function (ev) {
    var historyObject =  ev.item.getData("history");
    historyObject.goToView();
}

ZaCrtAppTreeHeader.prototype.clearHistory = function (ev) {
    this._historyMgr.removeHistory();
}

