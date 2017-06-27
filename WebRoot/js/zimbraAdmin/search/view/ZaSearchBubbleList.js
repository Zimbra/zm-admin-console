/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: jxy
 * Date: 01/09/12
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */
ZaSearchBubbleList = function() {
     this._bubbleList = new AjxVector();
}

ZaSearchBubbleList.prototype.constructor = ZaSearchBubbleList;

ZaSearchBubbleList.prototype.toString =
function() {
    return "ZaSearchBubbleList";
}

ZaSearchBubbleList.prototype.size =
function(){
    return this._bubbleList.size();
}

ZaSearchBubbleList.prototype.getQueryFormBubbles =
function() {
    var query = "";
    var num = 0;
    this._filterQuery = {};
    for(var i=0 ; i< this._bubbleList.size();i++){
        var currentBubble = this._bubbleList.get(i);
        var filter = currentBubble.query;
        if( filter != null && filter.length > 0){
            if (currentBubble.type == 2) {
                if (!this._filterQuery[currentBubble.optionalType]) {
                    this._filterQuery[currentBubble.optionalType] = [];
                }
                this._filterQuery[currentBubble.optionalType].push(filter);
            }  else {
                query += filter;
            }
            num++;
        }

    }

    var filterQueryResult;
    var filterNum;
    for (var optionType in this._filterQuery) {
        filterQueryResult = "";
        filterNum = 0;
        for(var i=0; i < this._filterQuery[optionType].length; i++) {
            filterQueryResult += this._filterQuery[optionType][i];
            filterNum ++;
        }

        if (filterNum > 1)
            filterQueryResult =  "(|" + filterQueryResult + ")" ;

        if (filterQueryResult != null && filterQueryResult.length > 0) {
            num++;
            query += filterQueryResult;
        }
    }
    if(num > 1)
        query = "(&" + query + ")" ;

    return query;
}

ZaSearchBubbleList.prototype.isEnableForSearch =
function(){
    var ret = false;
    for(var i=0 ; i< this._bubbleList.size();i++){
        ret = ret || this._bubbleList.get(i).disableForSearch;
    }
    return !ret;
}

ZaSearchBubbleList.prototype.getSearchTypeFormBubbles =
function(){
    var searchTypeList = new Array();;
    var key = new Array();
    var data = {};

    var num = 0;
    for(var i=0 ; i< this._bubbleList.size();i++){
        var searchType = this._bubbleList.get(i).searchType;
        if(!AjxUtil.isEmpty(searchType)){
            for(var j = 0; j < searchType.length; j++){
                if (data[searchType[j]] == null){
                    data[searchType[j]] = 1;
                    key.push(searchType[j])
                }
                else
                    data[searchType[j]] ++;
            }
            num++;
        }
    }

    for(var i=0; i< key.length;i++){
        if(data[key[i]] == num)
            searchTypeList.push(key[i]);
    }
    if(!AjxUtil.isEmpty(searchTypeList))
        return searchTypeList;
}

ZaSearchBubbleList.prototype.getBubble =
function(index){
    return this._bubbleList.get(index);
}

ZaSearchBubbleList.prototype.getBubbleByDisplayName =
function(displayName){
    if(!displayName) return;
    for(var i=0 ; i< this._bubbleList.size();i++){
        if(this._bubbleList.get(i).displayName == displayName)
            return this._bubbleList.get(i);
    }
}

ZaSearchBubbleList.prototype._addBubble =
function (bubble,index) {
    if(!bubble) return;
    this._bubbleList.add(bubble,index);
}

ZaSearchBubbleList.prototype.addBubble =
function (params) {
    var bubble;
    if(params.unique){
        bubble = this.getBubbleByDisplayName(params.displayName);
        if(bubble)
            bubble.update(params);
        else {
            bubble =  new ZaSearchBubble(params);
            this._addBubble(bubble);
        }
    }else {
         bubble =  new ZaSearchBubble(params);
         this._addBubble(bubble);
    }
}


ZaSearchBubbleList.prototype.removeBubble =
function (bubble) {
    if(!bubble) return;
    this._bubbleList.remove(bubble);
}

ZaSearchBubbleList.prototype.removeAllBubbles =
function () {
    this._bubbleList.removeAll();
}


ZaSearchBubble = function(params) {
    params = params || {};
    params.id = this.id =  Dwt.getNextId();
	params.className =this.className = params.className || "addrBubble";

	DwtControl.call(this, params);

	this.type = params.type; //1:search 2:searchoption 3:searchsave
    if (params.type == 2) {
        this.optionalType = params.optionalType || 1;
    }
    this.query = params.query;
    this.searchType = params.searchType;
    this.parentCell = params.queryCell;
    this.parentId =  params.parentId;
    this.unique = params.unique || false;  //only one bubble
    this.disableForSearch = params.disableForSearch || false;
    this.displayName = this.getDisplayName(params.displayName);

    this._createHtml();

    this._setEventHdlrs([DwtEvent.ONMOUSEOVER]);
    this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this._mouseOverListener));

}

ZaSearchBubble.prototype = new DwtControl;
ZaSearchBubble.prototype.constructor = ZaSearchBubble;
ZaSearchBubble.prototype.toString =
function() {
    return "ZaSearchBubble";
}

ZaSearchBubble.displayNameList = new Object();

ZaSearchBubble.prototype.getDisplayName =
function (displayName) {
    var ret ;
    if (!ZaSearchBubble.displayNameList[displayName]||this.unique) {
        ZaSearchBubble.displayNameList[displayName] = 1;
        ret = displayName;
    } else {
        ret  = displayName + " " + ZaSearchBubble.displayNameList[displayName];
        ZaSearchBubble.displayNameList[displayName] ++;
    }
    return ret;
}

ZaSearchBubble.prototype._createElement =
function() {
	return document.createElement("SPAN")
}

ZaSearchBubble.prototype._createHtml =
function() {
	var el = this.getHtmlElement();
    var removeLinkId = this.id + "_remove";
    var removeLink = 'ZaSearchXFormView.removeBubble("' + this.id + '","'+ this.parentId +'");';
    var style = "display:inline-block;cursor:pointer;";
    var closeText = AjxImg.getImageHtml("BubbleDelete", style, "id='" + removeLinkId + "' onclick='" + removeLink + "'");
	var displayName = this.displayName && this.displayName.toString();
	var html = "<span id='"+this.id+"_displayName'>" + AjxStringUtil.htmlEncode(displayName) + "</span>" + closeText;
	el.innerHTML = html;
    this.reparentHtmlElement(this.parentCell);
}

ZaSearchBubble.prototype.setDisplayName =
function (displayName){
    this.displayName = displayName;
}

ZaSearchBubble.prototype.setQuery =
function (query){
    this.query = query;
}

ZaSearchBubble.prototype.setType =
function (type){
    this.type = type;
}

ZaSearchBubble.prototype.update =
function (params){
    this.type = params.type;
    this.query = params.query;
}

ZaSearchBubble.prototype._mouseOverListener =
function(ev) {
	this._mouseOverAction(ev);
}

ZaSearchBubble.prototype._mouseOverAction =
function(ev) {
	var toolTipContent = this.getToolTip();
	this.setToolTipContent(toolTipContent);
	return true;
}

ZaSearchBubble.prototype.getToolTip =
function(){
    return AjxStringUtil.htmlEncode(this.query);
}

