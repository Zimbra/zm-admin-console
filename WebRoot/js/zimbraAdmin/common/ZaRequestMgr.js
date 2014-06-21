/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2012 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2012 Zimbra, Inc. All Rights Reserved. 
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
 * @author Charles Cao
 * ZaRequestMgr: used to send the soap request to the server and handle the following events:
 * 		1) show the busy dialog when it is a synchronous call and takes long time
 */
ZaRequestMgr = function () {}
/**
 * 
 * @param csfeParams: the parameters used by ZmCsfeCommand to send the request to the server
 * @param params: other parameters used by the ZaRequestMgr. 
 * 			Typical parameters are 
 * 			1) controller
 * 			2) busyMsg	
 * 
 */
ZaRequestMgr.invoke = function (csfeParams, params) {
	var command = new ZmCsfeCommand();
	var controller = (params != null ? params.controller : null) ;
	var delay = !(params.delay === null || params.delay===undefined) ? params.delay : 500;
	var id = params.busyId ? params.busyId : Dwt.getNextId () ;
	//add the busy icon for the synchronous calls
	if (!csfeParams.asyncMode && controller || (params.showBusy && controller)) {
		controller._shell.setBusyDialogText(params.busyMsg != null ? params.busyMsg :ZaMsg.splashScreenLoading);
		controller._currentRequest = command ; //_currentRequest obj will be used in the cancel operation
		var cancelCallback = new AjxCallback(controller, controller.cancelBusyOverlay, params );
		//if(window.console && window.console.log) console.log("Set busy for dialog " + id) ;
		controller._shell.setBusy(true, id, true, delay, cancelCallback);
	}
	
	try {
		ZaZimbraAdmin.getInstance().cancelNoOp();
		csfeParams.noAuthToken = true;
		var response = command.invoke(csfeParams) ;
		if (!csfeParams.asyncMode && controller) {
			//if(window.console && window.console.log) console.log("Clear busy dialog " + id) ;
			controller._shell.setBusy(false, id, false); //remove the busy overlay
		}
		if (! csfeParams.asyncMode)	{
			ZaZimbraAdmin.getInstance().scheduleNoOp();
			return 	response;
		}	
	}catch (ex) {
		if(ex && ex.code && !(ex.code == ZmCsfeException.SVC_AUTH_EXPIRED || 
				ex.code == ZmCsfeException.SVC_AUTH_REQUIRED || 
				ex.code == ZmCsfeException.NO_AUTH_TOKEN ||
                                ex.code == ZmCsfeException.AUTH_TOKEN_CHANGED
			 )) {
			ZaZimbraAdmin.getInstance().scheduleNoOp();
		}
		if (!csfeParams.asyncMode && controller  || (params.showBusy && controller)) {
			controller._shell.setBusy(false, id); //remove the busy overlay
		}
		throw ex ;	
	}
}


