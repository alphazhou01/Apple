Ext.namespace("Ext.ux.AppFrame.AttachPicture");
Ext.ux.AppFrame.AttachPicture.Panel = function (fileID, tableName, tableKey, applyToPanel, config) {
    ///<summary>查询附件列表</summary>
    var default_config = {
        collapsible: true, // 可折叠
        collapsed: false,  //初始折叠状态
        width: 700,
        height: 600,
        id: 'GTPAttachPicturePanel', //Panel id上传控件的唯一ID，（请不要随便更改）
        title: res_panelTitle,     //文件上传页名称
        closeAction: "hide",
        frame: true,

        fileID: fileID,           //附件记录ID
        tableName: tableName,     //表名
        tableKey: tableKey,       //表记录Key
        appNamespace: "gtp",      //业务的命名空间

        applyTo: applyToPanel,    //附加到面板容器

        fileStatus: true,         // fileStatus true:编辑附件（添加，删除，下载，浏览）功能，false：查看状态（下载，浏览）功能

        filters: "图片(*.jpg:*.bmp:*.jpeg:*.png)|*.jpg;*.bmp;*.jpeg;*.png",   //添加附件类型

        cls: "ext-ux-uploaddialog-dialog",
        layout: 'absolute',
        allow_close_on_upload: false,

        tbar: [],                //工具条

        html: '<table style="width:100%"><tbody id="tbFile"></tbody></table>'    //图片面板
    };
    config = Ext.applyIf(config || {}, default_config);
    Ext.ux.AppFrame.AttachPicture.Panel.superclass.constructor.call(this, config)
};


Ext.extend(Ext.ux.AppFrame.AttachPicture.Panel, Ext.Panel, {

    fileAttachmentServerUrl: "Services/FileService/FsAjax.ashx",

    //初始化附件
    initComponent: function () {
        Ext.ux.AppFrame.AttachPicture.Panel.superclass.initComponent.call(this);
        this.GetFileAttachmentTableKey();
        this.LoadAttachPicture();
    },

    //设置当前控件状态，空方法，使用者需重写
    SetState: function () {
        //重写
    },

    //根据TableName,TableKey,获取相关业务附件信息
    GetFileAttachmentList: function (tableName, tableKey) {
        var params = "&tableName=" + tableName;
        params += "&tableKey=" + tableKey;
        params += "&type=2";
        var retObj = this.AjaxSyncCall(this.GetRootUrl(), params);
        return retObj;
    },

    //删除附件
    DeleteFileAttachment: function (fileID, tableName, tableKey) {
        var params = "&fileID=" + fileID;
        params += "&tableName=" + tableName;
        params += "&tableKey=" + tableKey;
        params += "&type=3";
        var obj = this.AjaxSyncCall(this.GetRootUrl(), params);
        if (obj.success)
            return true
        else
            return false;
    },

    //保存附件信息
    AddFileAttachment: function (fileID, viewGuid, editGuid, fileName, fileSize, fileDesc, tableName, tableKey, appNamespace) {
        var params = "&fileID=" + fileID;
        params += "&viewGuid=" + viewGuid;
        params += "&editGuid=" + editGuid;
        params += "&fileName=" + fileName;
        params += "&fileSize=" + fileSize;
        params += "&fileDesc=" + fileDesc;
        params += "&tableName=" + tableName;
        params += "&tableKey=" + tableKey;
        params += "&appNamespace=" + appNamespace;
        params += "&type=1";
        var obj = this.AjaxSyncCall(this.GetRootUrl(), params);
        if (obj.success)
            return true
        else
            return false;
    },

    //生成临时 TableKey (由服务器端生成 Guid)
    GetFileAttachmentTableKey: function () {
        if (Ext.isEmpty(this.tableKey)) {
            var params = "&type=5";
            var NewTableKey = AjaxSyncCall(GetRootUrl(), params);
            if (NewTableKey.success) {
                var retTableKey = NewTableKey.Guid;
                if (!Ext.isEmpty(retTableKey))
                    Ext.getCmp('GTPAttachPicturePanel').tableKey = retTableKey;
            }
        }
    },

    //更新TableKey (tempTableKey --->  tableKey  )
    UpdateFileAttachmentKey: function (tableName, tempTableKey, tableKey) {
        var params = "&tableName=" + tableName;
        params += "&tempTableKey=" + tempTableKey;
        params += "&tableKey=" + tableKey;
        params += "&type=6";
        var obj = this.AjaxSyncCall(this.GetRootUrl(), params);
        if (obj.success)
            return true
        else
            return false;
    },

    //异步访问
    AjaxSyncCall: function (urlStr, paramsStr) {
        var obj;
        var value;
        if (window.ActiveXObject) {
            obj = new ActiveXObject('Microsoft.XMLHTTP');
        } else if (window.XMLHttpRequest) {
            obj = new XMLHttpRequest();
        }
        obj.open('POST', urlStr, false);
        obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        obj.send(paramsStr);
        var result = Ext.util.JSON.decode(obj.responseText);
        return result;
    },

    //获取Root路径
    GetRootUrl: function () {
        var rootUrl = GTPFileClient._getLocationRootDir();
        if (!rootUrl.endWith("/"))
            rootUrl += "/";
        rootUrl = rootUrl + this.fileAttachmentServerUrl;
        return rootUrl;
    },

    //展开面板
    ExpandPanel: function () {
        Ext.getCmp('GTPAttachPicturePanel').expand();
    },
    //收缩面板
    CollapsePanel: function () {
        Ext.getCmp('GTPAttachPicturePanel').collapse();
    },

    //保存附件
    SaveAttach: function (_filePath, _tableName, _tableKey, _appNamespace) {
        ///<summary>保存附件</summary>

        //获取要保存到服务器的附件
        //显示进度条
        GTPFileClient.FileClientSetOptionSilent(true);
        GTPFileClient.FileClientSetOptionAppNamespace(_appNamespace);
        var result = GTPFileClient.FileClientUpload(_filePath, null, null, null, "", null, null);
        /**************保存上传成功的附件信息到数据库**************/
        if (result.Files.length > 0) {
            //将上传成功的附件信息，保存到数据库服务器
            this.AddFileAttachment(result.Files[0].FileID, result.Files[0].ViewGuid, result.Files[0].EditGuid, result.Files[0].FileName,
                 result.Files[0].FileSize, result.Files[0].FileDesc, _tableName, _tableKey, _appNamespace);
        }
        /**************保存上传成功的附件信息到数据库**************/

        return result.Files[0].FileID;
    },

    //删除附件
    DeleteAttach: function (_fileID, _tableName, _tableKey, _fileName, _fileEditGuid) {
        ///<summary>删除附件</summary>
        //删除附件信息（服务器端控制是否物理删除文件，现在为假删除 Deleted=1）
        var result = GTPFileClient.FileClientDelete(_fileID, _fileEditGuid, _fileName);
        for (var i = 0; i < result.Files.length; i++) {
            //删除用户附件关联记录（表：T_FS_ATTACHMENT）
            var obj = this.DeleteFileAttachment(result.Files[i].FileID, _tableName, _tableKey);
        }
    },

    //得到附件图片的URL
    GetAttachPictureURL: function (_fileID, _tableName, _tableKey) {
        ///<summary>显示效果图</summary>
        var _attachmentList = this.GetFileAttachmentList(_tableName, _tableKey);
        var returnValue;

        if (_attachmentList && _attachmentList.total > 0) {
            for (var k = 0; k < _attachmentList.total; k++) {
                if (_attachmentList.root[k].FileID == _fileID) {

                    var imgurl = GTPFileClient.FileClientGetDownloadUrl(_attachmentList.root[k].FileID, _attachmentList.root[k].ViewGUID, false, _attachmentList.root[k].EditGUID);

                    returnValue = {
                        EditGUID: _attachmentList.root[k].EditGUID,
                        FileID: _attachmentList.root[k].FileID,
                        FileName: _attachmentList.root[k].FileName,
                        TableKey: _attachmentList.root[k].TableKey,
                        TableName: _attachmentList.root[k].TableName,
                        ViewGUID: _attachmentList.root[k].ViewGUID,
                        URL: imgurl
                    };
                }
            }
        }
        return returnValue;
    },

    //加载附件图片
    LoadAttachPicture: function () {
        var GTPAttachPicturePanel = Ext.getCmp('GTPAttachPicturePanel');
        GTPAttachPicturePanel.setTitle(this.title);

        var _URLInfo = (this.fileID && this.tableName && this.tableKey) ? this.GetAttachPictureURL(this.fileID, this.tableName, this.tableKey) : undefined;
        if (_URLInfo) {

            var imgAppend = "<img src='" + _URLInfo.URL + "' style='height: 100%; width: 100%;' />";

            var tbodyFile = Ext.getDom('tbFile');
            if (tbodyFile) {
                var htmText = "<tr id=" + _URLInfo.FileID + " fileID='" + _URLInfo.FileID + "' fileName='" + _URLInfo.FileName + "' editGuid='" + _URLInfo.EditGUID + "'><td align='center'> "
                + "<div style='height: 500px; width: 600px'>" + imgAppend + "</div>"
                + "</td><td></td></tr>";

                Ext.DomHelper.append(tbodyFile, htmText);
                Ext.getCmp('GTPAttachPicturePanel').expand();
            }
            else {
                var htmText = "<table style='width:100%' align='center'><tbody id='tbFile'><tr id=" + _URLInfo.FileID + " fileID='" + _URLInfo.FileID + "' fileName='" + _URLInfo.FileName + "' editGuid='" + _URLInfo.EditGUID + "'><td align='center'> "
                + "<div style='height: 500px; width: 600px'>" + imgAppend + "</div>"
                + "</td><td></td></tr></tbody></table>";

                this.html = htmText;
            }
        }
        else {

            var tbodyFile = Ext.getDom('tbFile');
            if (tbodyFile) {
                var htmText = "<tr><td align='center'>没有" + this.title + "</td></tr>";

                Ext.DomHelper.append(tbodyFile, htmText);
                Ext.getCmp('GTPAttachPicturePanel').expand();
                //this.getEl('tbFile').update(htmText);
            }
            else {
                var htmText = "<table style='width:100%' align='center'><tbody id='tbFile'><tr><td align='center'>没有" + this.title + "</td></tr></tbody></table>";
                this.html = htmText;
            }
        }
    },

    //打开附件
    ViewAttachPicture: function () {
        var _attachUrl = this.GetAttachPictureURL(this.fileID, this.tableName, this.tableKey);
        if (_attachUrl) {
            //GTPFileClient.ShellExecute(_attachUrl.URL);
            Ext.AppFrame.Attachment.ViewFile(_attachUrl.FileID, _attachUrl.FileName, _attachUrl.ViewGUID);
        }
    },

    //添加或修改，返回新增记录ID
    UpdateAttachPicture: function () {
        var files = GTPFileClient.ShellDialogSelectFiles("上传" + this.title, "", this.filters, "0", "", false);
        if (files.Result && files.Files.length > 0) {

            var FilePath = files.Files[0];

            var fileID = this.SaveAttach(FilePath, this.tableName, this.tableKey, this.appNamespace);

            return fileID;
        }
    },

    //删除附件图片
    DeleteAttachPicture: function () {
        var tbody = Ext.getDom('tbFile');
        var trObj = "";
        if (!Ext.isEmpty(tbody)) {
            for (var i = 0; i <= tbody.children.length; i++) {
                i = 0;
                trObj = tbody.children[i];
                if (trObj != undefined) {
                    var temp_fileid;
                    var temp_filename;
                    var temp_editguid;
                    for (var d = 0; d < trObj.attributes.length; d++) {
                        if (trObj.attributes[d].name == "fileid") {
                            temp_fileid = trObj.attributes[d].value;
                        }
                        else if (trObj.attributes[d].name == "filename") {
                            temp_filename = trObj.attributes[d].value;
                        }
                        else if (trObj.attributes[d].name == "editguid") {
                            temp_editguid = trObj.attributes[d].value;
                        }
                    }

                    if (temp_fileid && temp_filename && temp_editguid) {
                        this.DeleteAttach(temp_fileid, temp_filename, this.tableKey, temp_editguid);
                    }
                    tbody.removeChild(trObj);
                }
            }
        }

        return true;
    }

});

//效果图
Ext.ux.AppFrame.AttachPicture.AddToolBar = function (attachPicturePanel, afterUpdateHandler) {
    //附件个性开发添加 顶部按钮处自定义
    var addBar = attachPicturePanel.getTopToolbar();
    addBar.add(
        [{
            text: "添加效果图", //添加
            iconCls: "ext-ux-uploaddialog-addbtn",
            id: "btnAddAttachPicture",
            handler: function () {
                var newid = attachPicturePanel.UpdateAttachPicture();
                if (newid) {
                    attachPicturePanel.DeleteAttachPicture();

                    var oldid = attachPicturePanel.fileID;

                    if (afterUpdateHandler)
                        afterUpdateHandler(attachPicturePanel.tableKey, newid);

                    attachPicturePanel.fileID = newid;

                    attachPicturePanel.LoadAttachPicture();

                    ButtonVisible();
                }
            },
            scope: this
        }, {
            xtype: 'tbseparator', id: "tbseparator1"
        },
        {
            text: "重新上传", //重新上传
            iconCls: "ext-ux-uploaddialog-editbtn",
            id: "btnEditAttachPicture",
            handler: function () {
                var newid = attachPicturePanel.UpdateAttachPicture();
                if (newid) {
                    attachPicturePanel.DeleteAttachPicture();

                    var oldid = attachPicturePanel.fileID;

                    attachPicturePanel.fileID = newid;

                    if (afterUpdateHandler)
                        afterUpdateHandler(attachPicturePanel.tableKey, newid);

                    attachPicturePanel.LoadAttachPicture();
                }
            },
            scope: this
        }, {
            xtype: 'tbseparator', id: "tbseparator2"
        },
        {
            text: "删除效果图", //删除
            iconCls: "ext-ux-uploaddialog-removebtn",
            id: "btnDeleteAttachPicture",
            handler: function () {
                attachPicturePanel.DeleteAttachPicture();

                var oldid = attachPicturePanel.fileID;

                var newid = 0;

                attachPicturePanel.fileID = newid;

                if (afterUpdateHandler)
                    afterUpdateHandler(attachPicturePanel.tableKey, newid);

                attachPicturePanel.LoadAttachPicture();

                ButtonVisible();
            },
            scope: this
        }, {
            xtype: 'tbseparator', id: "tbseparator3"
        },
        {
            text: "查看效果图", //查看原图
            iconCls: "ext-ux-uploaddialog-viewbtn",
            id: "btnViewAttachPicture",
            handler: function () {
                attachPicturePanel.ViewAttachPicture();
            },
            scope: this
        }]);

    attachPicturePanel.doLayout();

    // 附件保存按钮是否显示 saveBtnShow：true 表示显示；false 表示隐藏
    AddButtonShow = function (state) {
        if (state) {
            Ext.getCmp('btnAddAttachPicture').show();
            Ext.getCmp('tbseparator1').show();
        }
        else {
            Ext.getCmp('btnAddAttachPicture').hide();
            Ext.getCmp('tbseparator1').hide();
        }
    };

    //全部下载按钮是否显示 downBtnShow：true 表示显示；false 表示隐藏
    EditButtonShow = function (state) {
        if (state) {
            Ext.getCmp('btnEditAttachPicture').show();
            Ext.getCmp('tbseparator2').show();
        }
        else {
            Ext.getCmp('btnEditAttachPicture').hide();
            Ext.getCmp('tbseparator2').hide();
        }
    };

    // 附件保存按钮是否显示 saveBtnShow：true 表示显示；false 表示隐藏
    DeleteButtonShow = function (state) {
        if (state) {
            Ext.getCmp('btnDeleteAttachPicture').show();
            Ext.getCmp('tbseparator3').show();
        }
        else {
            Ext.getCmp('btnDeleteAttachPicture').hide();
            Ext.getCmp('tbseparator3').hide();
        }
    };

    //全部下载按钮是否显示 downBtnShow：true 表示显示；false 表示隐藏
    ViewButtonShow = function (state) {
        if (state) {
            Ext.getCmp('btnViewAttachPicture').show();
        }
        else {
            Ext.getCmp('btnViewAttachPicture').hide();
        }
    };

    ButtonVisible = function () {
        var idstate = (attachPicturePanel.fileID && attachPicturePanel.fileID) > 0 ? true : false;
        AddButtonShow(!attachPicturePanel.fileStatus && !idstate);
        EditButtonShow(!attachPicturePanel.fileStatus && idstate);
        DeleteButtonShow(!attachPicturePanel.fileStatus && idstate);
        ViewButtonShow(idstate);
    };

    attachPicturePanel.SetState = ButtonVisible;

    ButtonVisible();

};



