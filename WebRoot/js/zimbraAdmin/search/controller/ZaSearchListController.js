/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* @constructor
* @class ZaSearchListController This is a singleton class that controls all the user interaction with the list of ZaAccount objects
* @param appCtxt
* @param container
* @param app
* @extends ZaController
* @author Greg Solovyev
**/
ZaSearchListController = function(appCtxt, container) {
	ZaListViewController.call(this, appCtxt, container,"ZaSearchListController");
    //Account operations
	this._toolbarOperations = new Array();
	this._popupOperations = new Array();
	this._popupOperationsOnAppBar = new Array();

	this._currentPageNum = 1;
	this._currentQuery = null;
	this._currentDomain = null;
	this._currentSortField = ZaAccount.A_uid;
	this._currentSortOrder = "1";
	this.searchTypes = [ZaSearch.ALIASES,ZaSearch.DLS,ZaSearch.ACCOUNTS, ZaSearch.RESOURCES, ZaSearch.DOMAINS, ZaSearch.COSES];
	this.pages = new Object();
	this._searchPanel = null;
	this._searchField = null;
	this._helpURL = ZaSearchListController.helpURL;
	this._helpButtonText = ZaMsg.helpManageAccounts;
	this._UICreated = false;
    this._readFromQuery = false;
	this._isAdvancedSearch = false ;
	this._searchFieldInput = null ; //the input of the search field for basic search, it is also be used as the tab title
	this.objType = ZaEvent.S_ACCOUNT;	
	this.fetchAttrs = ZaSearch.standardAttributes;
    this.searchResultFilter = [ZaAccount.A_accountStatus];  // for Alias currently
    this._filterObj = null;
}

ZaSearchListController.prototype = new ZaListViewController();
ZaSearchListController.prototype.constructor = ZaSearchListController;
ZaSearchListController.helpURL = location.pathname + ZaUtil.HELP_URL + "search/search.htm?locid="+AjxEnv.DEFAULT_LOCALE;

ZaController.initToolbarMethods["ZaSearchListController"] = new Array();
ZaController.initPopupMenuMethods["ZaSearchListController"] = new Array();
ZaController.changeActionsStateMethods["ZaSearchListController"] = new Array();
ZaSearchListController.prototype.show = function (doPush) {
	var busyId = Dwt.getNextId();
	var callback = new AjxCallback(this, this.searchCallback, {limit:this.RESULTSPERPAGE,CONS:null,show:doPush, busyId:busyId, resultFilter:this._filterObj});
	/*
	if (this._currentQuery == null) {
		this._currentQuery =  (ZaSearch._currentQuery ? ZaSearch._currentQuery : "");
	}*/
	var searchParams = {
			query: this._currentQuery, 
			types:this.searchTypes,
			sortBy:this._currentSortField,
			offset:this.RESULTSPERPAGE*(this._currentPageNum-1),
			sortAscending:this._currentSortOrder,
			limit:this.RESULTSPERPAGE,
			attrs:this.fetchAttrs,
			callback:callback,
			controller: this,
			showBusy:true,
			busyId:busyId,
			busyMsg:ZaMsg.BUSY_SEARCHING,
			skipCallbackIfCancelled:false
	}
	var searchQueryList = new Array();
	var isAliasSpec = false;
	for(var i = 0; this.searchTypes && i < this.searchTypes.length; i++) {
		if(this.searchTypes[i] == ZaSearch.ALIASES)
			isAliasSpec = true;
	}
	if(isAliasSpec && !this._currentDomain) {
		searchQueryList.push(searchParams);
		var keyword = ZaSearchListController._getSearchKeyWord(this._currentQuery);
		ZaSearchListController.searchAliasDomain(keyword,this,searchQueryList);
	}else {
		if(this._currentDomain) searchParams.domain = this._currentDomain;
		ZaSearch.searchDirectory(searchParams);
	}

}

ZaSearchListController.version = 1;
ZaSearchListController.prototype._show = 
function (list, openInNewTab, openInSearchTab,hasmore,isShowBubble) {
	this._updateUI(list, openInNewTab, openInSearchTab,hasmore);
	//ZaApp.getInstance().pushView(ZaZimbraAdmin._SEARCH_LIST_VIEW);
    ZaApp.getInstance().pushView(this.getContentViewId());
    if(isShowBubble) {
        this._uiContainer.setQueryFieldVisible(true);
    }else{
       //this._uiContainer.removeAllBubbles(true);
        this._uiContainer.setQueryFieldVisible(false);
    }

    var currentQueryValue = this._uiContainer.getQueryFormBubbles();
    currentQueryValue = currentQueryValue ? currentQueryValue: "";
    this._uiContainer.setQueryField(currentQueryValue);
}



/**
* searh panel
*/	
ZaSearchListController.prototype.getSearchPanel = 
function () {
	if(!this._searchPanel) {
	    this._searchPanel = new DwtComposite(ZaApp.getInstance().getAppCtxt().getShell(), "SearchPanel", DwtControl.ABSOLUTE_STYLE, null, ZaId.getOverviewId(ZaId.PANEL_APPSEARCH));
	    
		// Create search toolbar and setup browse tool bar button handlers
		this._searchToolBar = new ZaSearchToolBar(this._searchPanel, null, ZaId.PANEL_APPSEARCH);
	    
		// Setup search field handler
		this._searchField = this._searchToolBar.getSearchField();
		this._searchField.registerCallback(ZaSearchListController.prototype._searchFieldCallback, this);	
		this._searchPanel.zShow(true);		
	}
	return this._searchPanel;
}

ZaSearchListController.prototype.set = 
function(accountList) {
	this.show(accountList);
}

ZaSearchListController.prototype.setPageNum = 
function (pgnum) {
	this._currentPageNum = Number(pgnum);
}

ZaSearchListController.prototype.getPageNum = 
function () {
	return this._currentPageNum;
}

ZaSearchListController.prototype.getTotalPages = 
function () {
	return this.numPages;
}

ZaSearchListController.prototype.setFetchAttrs = 
function (fetchAttrs) {
	this.fetchAttrs = fetchAttrs;
}

ZaSearchListController.prototype.getFetchAttrs = 
function () {
	return this.fetchAttrs;
}

ZaSearchListController.prototype.setQuery = 
function (query) {
	this._currentQuery = query;
}

ZaSearchListController.prototype.getQuery = 
function () {
	return this._currentQuery;
}

ZaSearchListController.prototype.setSearchTypes = 
function (searchTypes) {
	this.searchTypes = searchTypes;
}

ZaSearchListController.prototype.getSearchTypes = 
function () {
	return this.searchTypes;
}

ZaSearchListController.prototype.setSortOrder = 
function (sortOrder) {
	this._currentSortOrder = sortOrder;
}

ZaSearchListController.prototype.getSortOrder = 
function () {
	return this._currentSortOrder;
}

ZaSearchListController.prototype.setSortField = 
function (sortField) {
	this._currentSortField = sortField;
}

ZaSearchListController.prototype.getSortField = 
function () {
	return this._currentSortField;
}

ZaSearchListController.prototype._batchSearchforDomain =
function (domainArr, searchQueryList, childQueries, isShowBubble) {
	var paramsArr;
    var searchTypes = ZaSearch.ALIASES;
    var searchQuery = "(uid=*";
    if(!childQueries) searchQuery += ")";
    else if(childQueries && !(childQueries instanceof Array)) searchQuery += childQueries + "*)";
    else if(childQueries instanceof Array && childQueries.length == 1) searchQuery += childQueries[0] + "*)";
    else if(childQueries instanceof Array && childQueries.length > 1)  searchQuery += childQueries[1] + ")";

    var controller = ZaApp.getInstance().getSearchListController();

	if(searchQueryList && searchQueryList instanceof Array)
		paramsArr = searchQueryList;
	else paramsArr = new Array();
        var busyId = Dwt.getNextId();
	var inParams = {limit:controller.RESULTSPERPAGE,show:true, openInSearchTab: true,busyId:busyId, isShowBubble:isShowBubble};
        var callback = new AjxCallback(controller, controller.searchCallback, inParams);
	for(var i =0; i < domainArr.length; i++) {
	        var searchParams = {
        	                query:searchQuery,
                	        types:searchTypes,
	                        showBusy:true,
        	                busyId:busyId,
	                        busyMsg:ZaMsg.BUSY_SEARCHING,
        	                skipCallbackIfCancelled:false,
	                        sortBy:controller._currentSortField,
        	                attrs:ZaSearch.standardAttributes,
                	        callback:callback,
	                        controller: controller,
        	                domain: domainArr[i]
	        }
		paramsArr.push(searchParams);
	}
	controller.multipleSearchCallback(inParams, paramsArr);

}


ZaSearchListController.searchAliasDomainCallback = 
function(params,resp) {

        if(params.busyId)
                        ZaApp.getInstance().getAppCtxt().getShell().setBusy(false, params.busyId);
        try {
                if(!resp) {
                        throw(new AjxException(ZaMsg.ERROR_EMPTY_RESPONSE_ARG, AjxException.UNKNOWN, "ZaSearchListController.searchAliasDomainCallback"));
                }
                if(resp.isException()) {
                        throw(resp.getException());
                } else {
                        var response = resp.getResponse().Body.SearchDirectoryResponse;
			var domainArr = new Array(); 
                        if (response.domain && response.domain.length > 0) {
                                for (var i =0; i < response.domain.length; i ++) {
                                       var domain = response.domain[i].name ;
						domainArr.push(domain);
                                }
				
                        }
			ZaSearchListController.prototype._batchSearchforDomain(domainArr,params.searchQueryList, params.childQueries, params.isShowBubble);
                }
        } catch (ex) {
		this._handleException(ex, "ZaSearchListController.searchAliasDomainCallback", null, false); 
	}

}

ZaSearchListController.searchAliasDomain =
function (value, searchCtl,searchQueryList,isShowBubble) {
        var busyId = Dwt.getNextId();
        var controller = searchCtl? searchCtl:this;

        var query = "(" + ZaDomain.A_domainName;
        if(value.length > 0) query += "=" + value[0] + "*)";
        else query = "";

        var callback = new AjxCallback(controller, ZaSearchListController.searchAliasDomainCallback,
            {busyId:busyId, searchQueryList:searchQueryList, childQueries:value, isShowBubble:isShowBubble});
        var searchParams = {

                        query: query,
                        types: [ZaSearch.DOMAINS],
                        sortBy: ZaDomain.A_domainName,
                        attrs: [ZaDomain.A_domainName],
                        callback:callback,
                        controller: controller, 
                        showBusy:true,
                        busyId:busyId,
                        busyMsg:ZaMsg.BUSY_SEARCHING_DOMAINS,
			skipCallbackIfCancelled:false
        }
        ZaSearch.searchDirectory(searchParams);

}

ZaSearchListController._getSearchKeyWord =
function(query) {
	var keyword = "";
	var sw = "zimbraDomainName=*";
        var domflag = "@";
	var ew = "*";
	if(!query) return keyword;
	var start = query.indexOf(sw);
	if(start < 0 || start > query.length-1)
	    return [];
	var end = query.indexOf(ew,start+sw.length);
	if(end > query.length-1)
	    return [];
	keyword = query.substr(start+sw.length,end-start-sw.length);
        // handle the case of "str@str"
        start = keyword.indexOf(domflag);
	if(start < 0 || start > query.length-1)
	    return [keyword];
	return [keyword.substr(start+1,keyword.length),keyword.substr(0,start)];
}

/*********** Search Field Callback */
ZaSearchListController.prototype._searchFieldCallback =
function(params) {
	var searchQueryList = new Array();
	if(this.setSearchTypes)
		this.setSearchTypes(params.types);

	this._currentQuery = params.query;
	this._currentSortField = params.sortBy;
	var busyId = Dwt.getNextId();	
	var callback = new AjxCallback(this, this.searchCallback, {limit:this.RESULTSPERPAGE,show:true, openInSearchTab: true,busyId:busyId, resultFilter:this._filterObj, isShowBubble:params.isShowBubble});
        var postCallback = new AjxCallback(this, this.updateSearchTree);
        var searchParams = {
                        query:this._currentQuery,//params.query,
                        types:params.types,
                        showBusy:true,
                        busyId:busyId,
                        busyMsg:ZaMsg.BUSY_SEARCHING,
                        skipCallbackIfCancelled:false,
                        sortBy:params.sortBy,
                        offset:this.RESULTSPERPAGE*(this._currentPageNum-1),
                        sortAscending:this._currentSortOrder,
                        limit:this.RESULTSPERPAGE,
                        attrs:ZaSearch.standardAttributes,
                        callback:callback,
                        controller:this
        }

	var isAliasSpec = false;
	for(var i = 0; params.types && i < params.types.length; i++) {
		if(params.types[i] == ZaSearch.ALIASES)
			isAliasSpec = true;
	}

	if(isAliasSpec) {
		this.scrollSearchParams={
			query:this._currentQuery,//params.query,
			types:params.types,
			showBusy:true,
			busyId:busyId,
			busyMsg:ZaMsg.BUSY_SEARCHING,
			skipCallbackIfCancelled:false,
			sortBy:params.sortBy,
			sortAscending:this._currentSortOrder,
			attrs:ZaSearch.standardAttributes,
			controller:this,
			scrollType:"isAliasSearch",
			postCallback: postCallback
		}
		searchQueryList.push(searchParams);
		var keyword = ZaSearchListController._getSearchKeyWord(params.query);
		ZaSearchListController.searchAliasDomain(keyword,this,searchQueryList, params.isShowBubble);
	} else {
		this.scrollSearchParams={
			query:this._currentQuery,//params.query,
			types:params.types,
			showBusy:true,
			busyId:busyId,
			busyMsg:ZaMsg.BUSY_SEARCHING,
			skipCallbackIfCancelled:false,
			sortBy:params.sortBy,
			sortAscending:this._currentSortOrder,
			attrs:ZaSearch.standardAttributes,
			controller:this,
			postCallback: postCallback,
			isInitialRequest: true
		}
		ZaSearch.searchDirectory(searchParams);
    }
}


ZaSearchListController.initPopupMenuMethod = function () {
    this._popupOperations[ZaOperation.EDIT] = new ZaOperation(
        ZaOperation.EDIT,
        ZaMsg.TBB_Edit,
        ZaMsg.ACTBB_Edit_tt,
        "Edit",
        "EditDis",
        new AjxListener(
            this,
            ZaSearchListController.prototype._editButtonListener
        )
    );

    this._popupOperations[ZaOperation.DELETE] = new ZaOperation(
        ZaOperation.DELETE,
        ZaMsg.TBB_Delete,
        ZaMsg.ACTBB_Delete_tt,
        "Delete",
        "DeleteDis",
        new AjxListener(
            this,
            ZaSearchListController.prototype._deleteButtonListener
        )
    );

    this._popupOperations[ZaOperation.CHNG_PWD] = new ZaOperation(
        ZaOperation.CHNG_PWD,
        ZaMsg.ACTBB_ChngPwd,
        ZaMsg.ACTBB_ChngPwd_tt,
        "Padlock",
        "PadlockDis",
        new AjxListener(
            this,
            ZaAccountListController.prototype._chngPwdListener
        )
    );

    this._popupOperations[ZaOperation.EXPIRE_SESSION] = new ZaOperation(
        ZaOperation.EXPIRE_SESSION,
        ZaMsg.ACTBB_ExpireSessions,
        ZaMsg.ACTBB_ExpireSessions_tt,
        "ExpireSession",
        "ExpireSessionDis",
        new AjxListener(
            this,
            ZaAccountListController.prototype._expireSessionListener
        )
    );

    this._popupOperations[ZaOperation.MOVE_ALIAS] = new ZaOperation(
        ZaOperation.MOVE_ALIAS,
        ZaMsg.ACTBB_MoveAlias,
        ZaMsg.ACTBB_MoveAlias_tt,
        "MoveAlias",
        "MoveAlias",
        new AjxListener(
            this,
            ZaAccountListController.prototype._moveAliasListener
        )
    );

}
ZaController.initPopupMenuMethods["ZaSearchListController"].push(ZaSearchListController.initPopupMenuMethod);

ZaSearchListController.prototype.reset =
function () {
    this._currentPageNum = 1;
	this._currentQuery = null;
	this._currentSortField = ZaAccount.A_uid;
	this._currentSortOrder = "1";
	this.pages = new Object();
	this.objType = ZaEvent.S_ACCOUNT;	
}

//private and protected methods
ZaSearchListController.prototype._createUI = 
function () {
	//create accounts list view
	// create the menu operations/listeners first
    this._uiContainer =  new ZaSearchXFormView(this._container)
    this._contentView = this._uiContainer.widget;
	ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
	this._newDLListener = new AjxListener(this, ZaSearchListController.prototype._newDistributionListListener);
	this._newAcctListener = new AjxListener(this, ZaSearchListController.prototype._newAccountListener);
	this._newResListener = new AjxListener(this, ZaSearchListController.prototype._newResourceListener);

	//add the acount number counts
		
	var elements = new Object();

    elements[ZaAppViewMgr.C_APP_CONTENT] = this._uiContainer;
    ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements);
    this._initPopupMenu();
    this._actionMenu =  new ZaPopupMenu(this._contentView, "ActionMenu", null, this._popupOperations, ZaId.VIEW_SCHLIST, ZaId.MENU_POP);
    this._initPopupMenuAtAppBar();

    //set a selection listener on the account list view
    this._contentView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
    this._contentView.addActionListener(new AjxListener(this, this._listActionListener));

	this._removeConfirmMessageDialog = ZaApp.getInstance().dialogs["ConfirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON],null,ZaId.CTR_PREFIX + ZaId.VIEW_SCHLIST + "_ConfirmMessage");			
	this._UICreated = true;

}

ZaSearchListController.prototype.closeButtonListener =
function(ev, noPopView, func, obj, params) {
	if (noPopView) {
		func.call(obj, params) ;
	}else{
		ZaApp.getInstance().popView () ;
	}
	
	//reset the search text when the search list view/tab is closed
	if(this._searchField) {
		var searchFieldXForm = this._searchField._localXForm ;
		var searchFieldItem = searchFieldXForm.getItemsById(ZaSearch.A_query)[0];
		searchFieldItem.getElement().value = "" ;
	}
}

// new account button was pressed
ZaSearchListController.prototype._newAccountListener =
function(ev) {

	try {
		var newAccount = new ZaAccount();
		if(!ZaApp.getInstance().dialogs["newAccountWizard"])
			ZaApp.getInstance().dialogs["newAccountWizard"] = new ZaNewAccountXWizard(this._container);	

		ZaApp.getInstance().dialogs["newAccountWizard"].setObject(newAccount);
		ZaApp.getInstance().dialogs["newAccountWizard"].popup();
	} catch (ex) {
		this._handleException(ex, "ZaSearchListController.prototype._newAccountListener", null, false);
	}
}

ZaSearchListController.prototype._newDistributionListListener =
function(ev) {
	try {
		var newDL = new ZaDistributionList();
		ZaApp.getInstance().getDistributionListController().show(newDL);
	} catch (ex) {
		this._handleException(ex, "ZaSearchListController.prototype._newDistributionListListener", null, false);
	}

};

ZaSearchListController.prototype._newResourceListener =
function(ev) {
	try {
		var newResource = new ZaResource();
		if(!ZaApp.getInstance().dialogs["newResourceWizard"])
			ZaApp.getInstance().dialogs["newResourceWizard"] = new ZaNewResourceXWizard(this._container);	

		ZaApp.getInstance().dialogs["newResourceWizard"].setObject(newResource);
		ZaApp.getInstance().dialogs["newResourceWizard"].popup();
	} catch (ex) {
		this._handleException(ex, "ZaSearchListController.prototype._newResourceListener", null, false);
	}
}


/**
* This listener is called when the item in the list is double clicked. It call ZaAccountViewController.show method
* in order to display the Account View
**/
ZaSearchListController.prototype._listSelectionListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		if(ev.item) {
			this._editItem(ev.item);
		}
	} else {
		this.changeActionsState();
	}
}

ZaSearchListController.prototype._listActionListener =
function (ev) {
	this.changeActionsState();
	this._actionMenu.popup(0, ev.docX, ev.docY);
}

/**
* This listener is called when the Edit button is clicked. 
* It call ZaAccountViewController.show method
* in order to display the Account View
**/
ZaSearchListController.prototype._editButtonListener =
function(ev) {
	if(this._contentView.getSelectionCount() == 1) {
		var item = this._contentView.getSelection()[0];
		this._editItem(item);
	}
}

/**
* This listener is called when the Delete button is clicked. 
* It call ZaAccountViewController.show method
* in order to display the Account View
**/
ZaSearchListController.prototype._deleteButtonListener =
function(ev) {
	ZaAccountListController.prototype._deleteButtonListener.call(this, ev);
}

ZaSearchListController.prototype._deleteAccountsInRemoveList =
function (ev) {
	ZaAccountListController.prototype._deleteAccountsInRemoveList.call (this, ev) ;
}

ZaSearchListController.prototype._editItem = function (item) {
	var type = item.type;
	if (type == ZaItem.ACCOUNT) {
		ZaApp.getInstance().getAccountViewController().show(item);
	} else if (type == ZaItem.DL) {
		ZaApp.getInstance().getDistributionListController().show(item);
	} else if(type == ZaItem.ALIAS) {
		var targetObj = item.getAliasTargetObj() ;
		
		if (item.attrs[ZaAlias.A_targetType] == ZaAlias.TARGET_TYPE_ACCOUNT) {			
			ZaApp.getInstance().getAccountViewController().show(targetObj, true);
		}else if (item.attrs[ZaAlias.A_targetType] == ZaAlias.TARGET_TYPE_DL){
			ZaApp.getInstance().getDistributionListController().show(targetObj, true);
		}
	} else if (type == ZaItem.RESOURCE ){
		ZaApp.getInstance().getResourceController().show(item);
	} else if (type==ZaItem.DOMAIN) {
        if (item.attrs[ZaDomain.A_domainType] == ZaDomain.domainTypes.local) {
            ZaApp.getInstance().getDomainController().show(item);
        } else if (item.attrs[ZaDomain.A_domainType] == ZaDomain.domainTypes.alias) {
            ZaApp.getInstance().getDomainAliasWizard(true).editDomainAlias (item, true);
        }
	}else if (type==ZaItem.COS) {
                ZaApp.getInstance().getCosController().show(item);
    }
    ZaZimbraAdmin.getInstance().getOverviewPanelController().addAccountItem(item);

};


ZaSearchListController.changeActionsStateMethod = function () {

    var cnt = this._contentView.getSelectionCount();
    if (cnt == 1) {
        var item = this._contentView.getSelection()[0];
        if (item) {
            if (item.type != ZaItem.ALIAS) {
                if (this._popupOperations[ZaOperation.MOVE_ALIAS]) {
                    this._popupOperations[ZaOperation.MOVE_ALIAS].enabled = false;
                }
            }

            if (item.type == ZaItem.ALIAS || item.type == ZaItem.DL) {
                if(this._popupOperations[ZaOperation.CHNG_PWD]) {
                    this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
                }
            }

            if ((
                    (item.type == ZaItem.ALIAS) &&
                    (item.attrs[ZaAlias.A_targetType] == ZaItem.DL)
                ) ||
                (item.type == ZaItem.DL)) {

                if (this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
                    this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
                }

            } else if (item.type == ZaItem.DL) {

                if(this._popupOperations[ZaOperation.MOVE_ALIAS])	{
                    this._popupOperations[ZaOperation.MOVE_ALIAS].enabled = false;
                }

            } else if (item.type == ZaItem.ACCOUNT) {

                var enable = false;

                if (ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE') {
                    enable = true;
                } else if (AjxUtil.isEmpty(item.rights)) {
                    item.loadEffectiveRights("id", item.id, false);
                }

                if (!enable) {
                    if (!ZaItem.hasRight(ZaAccount.DELETE_ACCOUNT_RIGHT, item)) {
                        if (this._popupOperations[ZaOperation.DELETE]) {
                            this._popupOperations[ZaOperation.DELETE].enabled = false;
                        }
                    }

                    if (!ZaItem.hasAnyRight([ZaAccount.SET_PASSWORD_RIGHT, ZaAccount.CHANGE_PASSWORD_RIGHT], item)) {
                        if (this._popupOperations[ZaOperation.CHNG_PWD]) {
                            this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
                        }
                    }

                    if (!ZaItem.hasWritePermission(ZaAccount.A_zimbraAuthTokenValidityValue, item)) {
                        if(this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
                            this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
                        }
                    }
                }

            } else if ((item.type == ZaItem.ALIAS) && (item.attrs[ZaAlias.A_targetType] == ZaItem.ACCOUNT))  {

                if (!item.targetObj) {
                    item.targetObj = item.getAliasTargetObj() ;
                }

                var enable = false;

                if (ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE') {
                    enable = true;
                } else if (AjxUtil.isEmpty(item.targetObj.rights)) {
                    item.targetObj.loadEffectiveRights("id", item.id, false);
                }

                if (!enable) {
                    if (!ZaItem.hasRight(ZaAccount.DELETE_ACCOUNT_RIGHT,item.targetObj)) {
                        if (this._popupOperations[ZaOperation.DELETE]) {
                            this._popupOperations[ZaOperation.DELETE].enabled = false;
                        }
                    }

                    if (!ZaItem.hasAnyRight([ZaAccount.SET_PASSWORD_RIGHT, ZaAccount.CHANGE_PASSWORD_RIGHT], item.targetObj)) {
                        if(this._popupOperations[ZaOperation.CHNG_PWD]) {
                            this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
                        }
                    }

                    if (!ZaItem.hasWritePermission(ZaAccount.A_zimbraAuthTokenValidityValue,item.targetObj)) {
                        if(this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
                            this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
                        }
                    }
                }

            } else if ((item.type == ZaItem.ALIAS) && (item.attrs[ZaAlias.A_targetType] == ZaItem.RESOURCE)) {

                if (!item.targetObj) {
                    item.targetObj = item.getAliasTargetObj() ;
                }

                var enable = false;

                if (ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE') {
                    enable = true;
                } else if (AjxUtil.isEmpty(item.targetObj.rights)) {
                    item.targetObj.loadEffectiveRights("id", item.id, false);
                }

                if (!enable) {
                    if (!ZaItem.hasRight(ZaResource.DELETE_CALRES_RIGHT,item.targetObj)) {
                        if(this._popupOperations[ZaOperation.DELETE]) {
                            this._popupOperations[ZaOperation.DELETE].enabled = false;
                        }
                    }

                    if (!ZaItem.hasRight(ZaResource.SET_CALRES_PASSWORD_RIGHT, item.targetObj)) {
                        if(this._popupOperations[ZaOperation.CHNG_PWD]) {
                            this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
                        }
                    }
                }

            } else if (item.type == ZaItem.RESOURCE) {

                var enable = false;

                if (ZaZimbraAdmin.currentAdminAccount.attrs[ZaAccount.A_zimbraIsAdminAccount] == 'TRUE') {
                    enable = true;
                } else if (AjxUtil.isEmpty(item.rights)) {
                    item.loadEffectiveRights("id", item.id, false);
                }

                if (!enable) {
                    if (!ZaItem.hasRight(ZaResource.DELETE_CALRES_RIGHT,item)) {
                        if (this._popupOperations[ZaOperation.DELETE]) {
                            this._popupOperations[ZaOperation.DELETE].enabled = false;
                        }
                    }

                    if (!ZaItem.hasRight(ZaResource.SET_CALRES_PASSWORD_RIGHT, item)) {
                        if (this._popupOperations[ZaOperation.CHNG_PWD]) {
                            this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
                        }
                    }
                }

            } else if ( item.type == ZaItem.DOMAIN || item.type == ZaItem.COS ) {

                if (this._popupOperations[ZaOperation.DELETE]) {
                    this._popupOperations[ZaOperation.DELETE].enabled = false;
                }

                if (this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
                    this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
                }

                if (this._popupOperations[ZaOperation.CHNG_PWD]) {
                    this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
                }
            }

        } else {

            if (this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
                this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
            }

            if (this._popupOperations[ZaOperation.EDIT]) {
                this._popupOperations[ZaOperation.EDIT].enabled = false;
            }

            if (this._popupOperations[ZaOperation.CHNG_PWD]) {
                this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
            }

            if (this._popupOperations[ZaOperation.MOVE_ALIAS]) {
                this._popupOperations[ZaOperation.MOVE_ALIAS].enabled = false;
            }

            if (this._popupOperations[ZaOperation.DELETE]) {
                this._popupOperations[ZaOperation.DELETE].enabled = false;
            }
        }

    } else if (cnt > 1) {

        if (this._popupOperations[ZaOperation.EDIT]) {
            this._popupOperations[ZaOperation.EDIT].enabled = false;
        }

        if (this._popupOperations[ZaOperation.CHNG_PWD]) {
            this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
        }

        if (this._popupOperations[ZaOperation.MOVE_ALIAS]) {
            this._popupOperations[ZaOperation.MOVE_ALIAS].enabled = false;
        }

        if (this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
            this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
        }

    } else {

        if (this._popupOperations[ZaOperation.EXPIRE_SESSION]) {
            this._popupOperations[ZaOperation.EXPIRE_SESSION].enabled = false;
        }

        if (this._popupOperations[ZaOperation.EDIT]) {
            this._popupOperations[ZaOperation.EDIT].enabled = false;
        }

        if (this._popupOperations[ZaOperation.DELETE]) {
            this._popupOperations[ZaOperation.DELETE].enabled = false;
        }

        if (this._popupOperations[ZaOperation.CHNG_PWD]) {
            this._popupOperations[ZaOperation.CHNG_PWD].enabled = false;
        }

        if (this._popupOperations[ZaOperation.MOVE_ALIAS])	{
            this._popupOperations[ZaOperation.MOVE_ALIAS].enabled = false;
        }

    }

    for (var i = 0; i < cnt; i++) {
        var itemObj = this._contentView.getSelection()[i];
        if (itemObj && itemObj.type==ZaItem.ACCOUNT) {
            if (itemObj.attrs[ZaAccount.A_zimbraIsSystemAccount] == "TRUE") {
                if (this._popupOperations[ZaOperation.DELETE]) {
                    this._popupOperations[ZaOperation.DELETE].enabled = false;
                }
            }
        }
    }
}
ZaController.changeActionsStateMethods["ZaSearchListController"].push(ZaSearchListController.changeActionsStateMethod);

/**
 * Get the count statistics that will show in the search tree
 * @param resp response
 * @param orig Optional. The count statics will be added to <code>orig</code> if it is provided.
 * It is used for batch request.
 */
ZaSearchListController.prototype.getSearchResultStats =
function(resp, orig) {
    var result = {};
    if (orig) {
        result = orig;
    }

    if (!resp || !resp.searchTotal) {
        return result;
    }

    if (resp.more || ((orig && orig.more))) {
        result.more = true;
    }

    if (result.searchTotal) {
        result.searchTotal += resp.searchTotal;
    } else {
        result.searchTotal = resp.searchTotal;
    }

    if (resp[ZaItem.ACCOUNT] instanceof Array) {
        if (result[ZaItem.ACCOUNT])
            result[ZaItem.ACCOUNT] += resp[ZaItem.ACCOUNT].length;
        else {
            result[ZaItem.ACCOUNT] = resp[ZaItem.ACCOUNT].length;
        }
    }

    if (resp[ZaItem.ALIAS] instanceof Array) {
        if (result[ZaItem.ALIAS]) {
            result[ZaItem.ALIAS] += resp[ZaItem.ALIAS].length;
        }
        else {
            result[ZaItem.ALIAS] = resp[ZaItem.ALIAS].length;
        }
    }

    if (resp[ZaItem.DOMAIN] instanceof Array) {
        if (result[ZaItem.DOMAIN])
            result[ZaItem.DOMAIN] += resp[ZaItem.DOMAIN].length;
        else {
            result[ZaItem.DOMAIN] = resp[ZaItem.DOMAIN].length;
        }
    }

    if (resp[ZaItem.DL] instanceof Array) {
        if (result[ZaItem.DL])
            result[ZaItem.DL] += resp[ZaItem.DL].length;
        else {
            result[ZaItem.DL] = resp[ZaItem.DL].length;
        }
    }
    return result;
}

ZaSearchListController.prototype.updateSearchTree =
function(searchTotal, hasMore,  vectArray) {
    if (!vectArray)
        return "";

    var array = vectArray.getArray();
    var result = {}
    result.searchTotal = searchTotal;
    result.more = hasMore;
    result [ZaItem.ACCOUNT] = 0;
    result [ZaItem.DOMAIN] = 0;
    result [ZaItem.DL] = 0;
    for (var i = 0;i < array.length; i++) {
        if (array[i].type == ZaItem.ACCOUNT) {
            result[ZaItem.ACCOUNT]++;
        } else if (array[i].type == ZaItem.DOMAIN) {
            result[ZaItem.DOMAIN]++;
        } else if (array[i].type == ZaItem.DL) {
            result[ZaItem.DL]++;
        }
    }
    ZaZimbraAdmin.getInstance().getOverviewPanelController().fireSearchEvent(result);
}


ZaSearchListController.prototype._initPopupMenuAtAppBar = function(){

    if (AjxUtil.isEmpty(this._popupOrder)) {
        // in new UI, this._popupOrder is used to arrange the order of the items of PopUpMenu under the gear button,
        // instead of right-click menu

        // make the original right-click menu items first
        for(var ix in this._popupOperations) {
            this._popupOrder.push(ix)
        }
        //then add extra menu items set by other amdin extensions or zimlets
        for(var ix in this._popupOperationsOnAppBar) {
            this._popupOrder.push(ix)
        }
    }

    //merge the original right-click menu items and the extra menu items
    for(var ix in this._popupOperations) {
        this._popupOperationsOnAppBar[ix] = this._popupOperations[ix];
    }
}

//used for showing the PopUpMenu under the gear button in the new UI
ZaSearchListController.prototype.getPopUpOperation =
function () {
    return this._popupOperationsOnAppBar;
}
