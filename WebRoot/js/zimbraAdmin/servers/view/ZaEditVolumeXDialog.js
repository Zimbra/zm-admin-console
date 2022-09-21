/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016, 2022 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016, 2022 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaEditVolumeXDialog
* @contructor ZaEditVolumeXDialog
* @author Greg Solovyev
* @param parent
* param app
**/
ZaEditVolumeXDialog = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent,null, title, w, h);
	this._containedObject = {};
	this.initForm(ZaServer.volumeObjModel,this.getMyXForm());
	this._helpURL = ZaEditVolumeXDialog.helpURL;
}

ZaEditVolumeXDialog.prototype = new ZaXDialog;
ZaEditVolumeXDialog.prototype.constructor = ZaEditVolumeXDialog;
ZaEditVolumeXDialog.helpURL = location.pathname + ZaUtil.HELP_URL + "managing_servers/adding_a_new_storage_volume_to_the_server.htm?locid="+AjxEnv.DEFAULT_LOCALE;

ZaEditVolumeXDialog.prototype.getMyXForm = function (params) {
	var xFormObject = {
		numCols: 1,
		items: [
			{
				type: _ZAWIZGROUP_,
				isTabGroup: true,
				items: [
					{
						ref: ZaServer.A_VolumeName,
						type: _TEXTFIELD_,
						label: ZaMsg.LBL_VM_VolumeName,
						labelLocation: _LEFT_,
						width: 250,
					},
					{
						ref: ZaServer.A_VolumeRootPath,
						type: _TEXTFIELD_,
						label: ZaMsg.LBL_VM_VolumeRootPath,
						labelLocation: _LEFT_,
						width: 250,
						enableDisableChecks: !params || params.isVolumeTypeInternal,
					},
					{
						ref: ZaServer.A_VolumeType,
						type: _OSELECT1_,
						choices: ZaServer.volumeTypeChoices,
						width: 250,
						label: ZaMsg.LBL_VM_VolumeType,
						enableDisableChecks: !params || params.isVolumeTypeInternal,
					},
					{
						ref: ZaServer.A_VolumeCompressBlobs,
						type: _WIZ_CHECKBOX_,
						label: ZaMsg.VM_VolumeCompressBlobs,
						trueValue: true,
						falseValue: false,
						visibilityChecks: [
							function () {
								return !params || params.isVolumeTypeInternal;
							},
						],
					},
					{
						type: _GROUP_,
						numCols: 3,
						colSpan: 2,
						colSizes: ["200px", "150px", "125px"],
						visibilityChecks: [
							function () {
								return !params || params.isVolumeTypeInternal;
							},
						],
						items: [
							{
								ref: ZaServer.A_VolumeCompressionThreshold,
								type: _TEXTFIELD_,
								label: ZaMsg.LBL_VM_VolumeCompressThreshold,
								labelLocation: _LEFT_,
							},
							{
								type: _OUTPUT_,
								label: null,
								labelLocation: _NONE_,
								value: ZaMsg.NAD_bytes,
								align: _LEFT_,
							},
						],
					},
				],
			},
		],
	};
	return xFormObject;
}
