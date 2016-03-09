/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2014 Zimbra, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * @overview
 * Utility functions to upload files using HTML5
 */
ZaUploader = function() {
};
ZaUploader.prototype.constructor = ZaUploader;
/**
 * Returns a string representation of the object.
 *
 * @return        {String}        a string representation of the object
 */
ZaUploader.prototype.toString =
function() {
    return "ZaUploader";
};
/**
 *
 * @param fileElementId
 * @param url
 * @param callback
 *
 */
ZaUploader.prototype.upload =
function(fileElementId, url, callback) {
       var element = document.getElementById(fileElementId);
    if(element && element.files && element.files.length > 0) {
        var file = element.files[0];
        if(file) {
            var fileName = file.name || file.fileName;
            var req = new XMLHttpRequest(); // we do not call this function in IE
            req.open("POST", url, true);
            req.setRequestHeader("Cache-Control", "no-cache");
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Content-Type",  (file.type || "application/octet-stream") + ";");
            req.setRequestHeader("Content-Disposition", 'attachment; filename="'+ AjxUtil.convertToEntities(fileName) + '"');
            if (window.csrfToken) {
                req.setRequestHeader("X-Zimbra-Csrf-Token", window.csrfToken);
            }
            req.onreadystatechange = this._handleUploadResponse.bind(this, req, fileName, callback);
            req.send(file);
            delete req;
        } else {
            throw(new AjxException(ZaMsg.ERROR_INVALID_FILE_NAME, AjxException.UNKNOWN, "ZaUploader.prototype.upload"));
        }
    }
};
ZaUploader.prototype._handleUploadResponse =
function(req, fileName, callback) {
    if (req.readyState === 4) {
        var response = null;
        var aid      = null;
        var status   = req.status;
        if (status === 200) {
            var resp = eval("["+req.responseText+"]");
            response = resp.length && resp[2];
            if (response) {
                response = response[0];
                if (response) {
                    aid = response.aid;
                    callback.run(status, aid);
                }
            }
        } else {
            callback.run(status, null);
        }
    }
};