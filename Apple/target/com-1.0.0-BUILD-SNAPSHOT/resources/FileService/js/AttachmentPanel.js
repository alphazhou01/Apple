
Ext.ux.AttachmentPanel = function (config) {
    Ext.ux.AttachmentPanel.superclass.constructor.call(this, config);
}
Ext.extend(Ext.ux.AttachmentPanel, Ext.Panel, {
    //layout: 'fit',
    bodyBorder: false,
    border: false,
    id: 'AttachmentPanel' + Ext.id(),
    tableName: "T6",
    tableKey: "T6key",
    appNamespace: "GTP",
    immediate: true,
    isModify: false,
    cls: 'x-attachment-panel',
    fileStatus: true,     //上传true/下载false
    isView: true,
    fileTitle: "",
    defaultExt: "",
    readOnly: false,
    showDirection: 'horizontal',
    viewAutoHeight: false,
    filters: "",           //设置附件选择类型；如：压缩(*.rar)|*.rar|图片(*.jpg:*.bmp:*.jpeg:*.png)|*.jpg;*.bmp;*.jpeg;*.png|所有文件(*.*)|*.*
    filterIndex: 0,        //"文件类型"组合框中当前选中的文件过滤器的索引, 第一个文件过滤器索引值是1.比如 FileDialog.Filter = "Text files(*.txt)|*.txt|One filter(*.hhh)|*.hhh|All Files(*.*)|*.*",那么如果你的FilterIndex=2,那么你的文件对话框"文件类型"组合框就是"One filter(*.hhh)" 
    initialDir: "",        //打开附件的磁盘目录； 如：C:\
    multiSelect: true,     //打开选择文件对话框时是否可以选择多个附件，true:多选；false:单选；默认true
    //maxUploadSize: 2097152000, 
    // maxDownloadSize: 524288000, 
    maxFileNameSize: 100, //设置上传文件名的最大允许长度（包括后缀名）
    tbarCssClass: 'x-attachment-panel-tbar',
    userID: '',
    userName: '',
    oneSelf: '1',        //  oneSelf:1  显示自己的附件； oneSelf：2 显示他人的附件； 3 显示所有的附件；
    permission: false,    //用户是否可以删除附件的权限， true：可以删除所以人的附件；false:只能删除自己的附件；【扩展】:0:任何人都不能删除
    store: {},
    initComponent: function () {
        this.maxUploadSize = this.maxUploadSize || GTPFileClient.GetFileLimitMaxSize("GTP.Services.FileService", "DefaultUploadMaxFileSize");
        this.maxDownloadSize = this.maxDownloadSize || GTPFileClient.GetFileLimitMaxSize("GTP.Services.FileService", "DefaultDownloadMaxFileSize");
        this.showDeletePrompt = this.showDeletePrompt || GTPFileClient.IsShowDeletePrompt("GTP.Services.FileService", "ShowDeletePrompt");
        this.editWordAttachmentByWebOffice = this.editWordAttachmentByWebOffice || GTPFileClient.IsEditWordAttachmentByWebOffice("GTP.Services.FileService", "EditWordAttachmentByWebOffice");

        this.btnAllDownload = Ext.create({
            xtype: 'netlinkbutton',
            text: '全部下载',
            hidden: this.fileStatus,
            iconCls: "btn-download-all",
            handler: function (o) {
                this.downloadAllAttachment();
            },
            scope: this
        });
        this.tbar = [{
            xtype: 'netlinkbutton',
            text: '添加附件',
            hidden: !this.fileStatus || !this.isView,
            iconCls: "btn-add-attachment",
            handler: function (o) {
                this.addAttachment();
            },
            scope: this
        }, this.btnAllDownload];

        if (!this.fileStatus) {
            this.title = " ";
            this.border = false;
            this.style = "border-width:1px;"
        }

        this.bodyStyle = "background-color:transparent;background:none";

        var attControl = this.id;
        Ext.ux.AttachmentPanel.superclass.initComponent.call(this);

        this.addEvents('afteradd', 'afterremove', 'afteredite', 'afterrename');

        this.store = new Ext.data.ArrayStore({
            proxy: new Ext.data.MemoryProxy(),
            fields: ['ID', 'FileID', 'FileName', 'FileSize', 'IsSize', 'IsSelf', 'State', 'FileFlag', 'FilePath', 'FileDesc', 'ViewGUID', 'EditGUID', 'UserID', 'UserName', 'UploadTime']
            /*sortInfo: {
            field: 'FileID',
            direction: 'DESC'
            }*/
        });
        this.getCurrentUserID();
        this.loadAttachment(this.store);
        this.fullFilesView(this.store);
        this.add(this.filesView);
        this.getAttachmentTableKey();
        this.setAttachmentTitle();
    },
    //下载所有附件
    downloadAllAttachment: function () {
        try {
            var folderPath = GTPFileClient.ShellDialogSelectFolder(res_messageDownLoad, this.initialDir);
            if (!Ext.isEmpty(folderPath)) {
                this.initialDir = folderPath;

                if (folderPath.charAt(folderPath.length - 1) != '\\') {
                    folderPath += '\\';
                }
                var fileidlist = new String();
                var viewgidlist = new String();
                var savepathlist = new String();
                for (var i = 0; i < this.store.data.length; i++) {
                    var objdata = this.store.getAt(i);
                    if (fileidlist.length >= 1)
                        fileidlist += '|';
                    fileidlist += objdata.get("FileID");
                    if (viewgidlist.length >= 1)
                        viewgidlist += '|';
                    viewgidlist += objdata.get("ViewGUID");
                    if (savepathlist.length >= 1)
                        savepathlist += '|';
                    savepathlist += folderPath + objdata.get("FileName");
                };
                GTPFileClient.FileClientSetOptionSilent(false);
                var result = GTPFileClient.FileClientDownload(fileidlist, viewgidlist, savepathlist, 0);
                if (this.checkResult(result) == false) return result;
            }
        } catch (e) {
            this.getClientConnect();
        }
    },
    checkResult: function (result) {//检验处理结果
        if (result) {
            var retCode = result.Result, errMsg = result.ErrorMessage;

            if (errMsg && retCode == "-2") {
                if (result.Canceled === "True") {
                    Gtp.net.MessageBox.info("提示", '已经中止文件上传！');
                } else {
                    Gtp.net.MessageBox.error("错误", errMsg);
                }
                return false;
            }
        }
    },
    //下载附件
    downloadFile: function (rec) {
        try {
            var file = rec.data;
            var fileName = GTPFileClient.ShellDialogSaveFileEx(file.FileName, res_messageDownLoad, "", "所有文件(*.*)", 0, this.initialDir);
            if (fileName != "") {
                var fileSaveToList = "";
                fileSaveToList += fileName;
                GTPFileClient.FileClientSetOptionSilent(false);
                var result = GTPFileClient.FileClientDownload(file.FileID, file.ViewGUID, fileSaveToList);
                if (this.checkResult(result) == false) return result;
            }
        } catch (e) {
            this.getClientConnect();
        }
    },

    //设置附件预览的标题
    setAttachmentTitle: function () {
        if (!this.fileStatus) {
            var count = this.getAttachmentCount();
            this.setTitle('<span style="font-size:14px;font-weight:bold;">附件</span><span style="font-size:12px;font-weight:normal;">(' + count + ' 个)</span>');
            if (count == 0) {
                this.btnAllDownload.hide();
            }
        }
    },

    getCurrentUserID: function () {
        if (Ext.isEmpty(this.userID)) {
            if (GTPFileClient.FsAjaxFullUrl == "") {
                GTPFileClient.InitialAjaxPageUrl();
            }
            var params = "type=500";
            var user = GTPFileClient._ajaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
            user = Ext.util.JSON.decode(user);
            if (user.success) {
                this.userID = user.userID;
                this.userName = user.userName;
            }
        }
    },

    //添加附件预览或上传文件预览
    fullFilesView: function (store) {
        if (this.fileStatus) {  //上传
            this.filesView = new Ext.ux.FilesAddView({ store: store, attachmentId: this.id, curuserId: this.userID, autoHeight: this.viewAutoHeight, showDirection: this.showDirection });
        }
        else {
            this.filesView = new Ext.ux.FilesView({ store: store, attachmentId: this.id, curuserId: this.userID, permission: this.permission, readOnly: this.readOnly });
        }
    },

    addAttachmentItemData: function (store, attach) {
        var displayValue = "block";
        if (this.permission === false) {
            displayValue = this.userID == attach.UserID ? 'block' : 'none';
        } else if (this.permission === 0) {
            displayValue = 'none';
        };
        var isSelf = this.userID == attach.UserID ? true : false;
        store.add(new Ext.data.Record({
            State: "0",
            FileName: attach.FileName,
            FileSize: GTPFileClient.fileSize(attach.FileSize),
            IsSize: attach.FileSize,
            FilePath: "",
            ID: attach.ID,
            FileID: attach.FileID,
            FileDesc: attach.FileDesc,
            FileFlag: displayValue,
            ViewGUID: attach.ViewGUID,
            EditGUID: attach.EditGUID,
            IsSelf: isSelf,
            UserID: attach.UserID,
            UserName: attach.UserName,
            UploadTime: attach.UploadTime
        }));
    },

    //加载附件
    loadAttachment: function (store) {
        store.removeAll();
        var attachList = GTPFileClient.GetFileAttachmentList(this.tableName, this.tableKey);
        if (attachList.success) {
            for (var i = 0; i < attachList.Items.length; i++) {
                attach = attachList.Items[i];
                if (this.oneSelf == '1' && this.userID == attach.UserID) {
                    this.addAttachmentItemData(store, attach);
                }
                else if (this.oneSelf == '2' && this.userID != attach.UserID) {
                    this.addAttachmentItemData(store, attach);
                }
                else if (this.oneSelf == '3') {
                    this.addAttachmentItemData(store, attach);
                }
            }
        }
    },

    getFileSize: function (file) {
        var result = GTPFileClient.ShellGetLocalFilesInfo(file);
        var iFilesize = result.Files[0].FileSize;
        return iFilesize;
    },

    getFileExtension: function (filename) {
        var result = null;
        var parts = filename.split("\\");
        if (parts.length > 1) {
            filelength = parts.length - 1;
            result = parts[filelength];
        }
        return result
    },
    getClientConnect: function () {
        var ret = GTPFileClient.FileClientConnect(GTPFileClient._fileServerGuid, GTPFileClient._fileServerUrl, "");
        if (!ret)
            alert("网络连接中断。");
        return ret;
    },
    getModifyFileFlag: function () {
        var hStore = this.filesView.store.getModifiedRecords();
        if (!Ext.isEmpty(hStore))
            this.isModify = true;
        return this.isModify;
    },

    getAttachmentCount: function () {
        return this.filesView.store.getCount();
    },
    getPhysicalAttachmentCount: function () {
        var tempStroe = this.filesView.store.query("State", "0");
        if (tempStroe)
            return tempStroe.items.length;
        else
            return 0;
    },
    getAttachmentTableKey: function () {
        if (Ext.isEmpty(this.tableKey)) {
            var retTableKey = GTPFileClient.CreateFileAttachmentKey();
            if (!Ext.isEmpty(retTableKey)) {
                this.tableKey = retTableKey;
            }
        }
    },

    updateAttachmentKey: function (tableName, tempTableKey, tableKey) {
        var obj = GTPFileClient.UpdateFileAttachmentKey(tableName, tempTableKey, tableKey);
        return obj;
    },

    deleteAttachment: function (file) {
        var me = this;

        function delRecord() {
            attachment.filesView.store.each(function (rec) {
                if (rec.data.FileID == fileId) {
                    if (rec.data.State != -1) {
                        deleteStore.add(new deleteDataRecord({
                            FileID: rec.data.FileID,
                            FileName: rec.data.FileName,
                            ViewGUID: rec.data.ViewGUID,
                            EditGUID: rec.data.EditGUID
                        }));
                    }
                    attachment.isModify = true;
                    if (attachment.store)
                        attachment.store.remove(rec);
                    return false;
                }
            });
            me.fireEvent('afterremove', deleteStore);
            attachment.immediateSaveFile();
        }

        var fileId = file.name;
        var attachment = this;
        if (this.showDeletePrompt) {
            Ext.MessageBox.confirm('提示', '确定删除该文件？', function (btn) {
                if (btn == 'yes') {
                    delRecord();

                }
            })
        } else {
            delRecord();

        }
    },

    //显示操作菜单
    showMenu: function (expandDom) {
        if (!this.optionMenu) {
            this.optionMenu = new Ext.menu.Menu({
                renderTo: document.body,
                listeners: {
                    "beforehide": function (menu) {
                        menu.removeAll();
                    }
                }
            });
        }

        var fileID = parseInt(Ext.get(expandDom).getAttribute("fileid")),
            expandEl = Ext.get(expandDom);
        this.optionMenu.add({
            itemId: 'getHistory',
            text: '查看历史',
            handler: this.getFileHistory.createDelegate(this, [expandDom]),
            scope: this
        });

        if (this.store.query("FileID", fileID).itemAt(0).get("FileFlag") != 'none') {
            this.optionMenu.insert(0, {
                itemId: 'rename',
                text: '重命名',
                handler: this.renameAttachment.createDelegate(this, [expandDom]),
                scope: this
            });
        }
        if (maskIFramePluginControl)
            maskIFramePluginControl(true);
        this.optionMenu.showAt([expandEl.getX() + expandEl.getWidth() - 40, expandEl.getY() + expandEl.getHeight()]);
    },

    // 重命名附件
    renameAttachment: function (file) {
        var me = this;
        var fileID = parseInt(Ext.get(file).getAttribute("fileid")),
            record = this.store.query("FileID", fileID).itemAt(0);
        if (record) {
            var oldName = record.get("FileName"),
                lastIndex = oldName.lastIndexOf("."),
                FileType = "";
            if (lastIndex != -1) {
                FileType = oldName.substring(lastIndex);
                oldName = oldName.substring(0, lastIndex);
            }

            this.renameWindow = new Ext.Window({
                cls: 'x-window-dlg',
                layout: 'form',
                labelAlign: 'top',
                title: "更改附件名称",
                closeAction: 'close',
                modal: true,
                width: 250,
                items: [{
                    id: 'fileName',
                    xtype: 'textfield',
                    fieldLabel: '请输入新名称',
                    anchor: '100%' //控制文本框的长度
                }],
                fbar: {
                    items: [{
                        text: '确定',
                        handler: function () {
                            var newName = this.renameWindow.get("fileName").getValue().trim();
                            if (!newName) {
                                alert("文件名不能为空");
                            } else if (/[\\\/\:\*\?\"\<\>\|]/i.test(newName)) {
                                alert("文件名不能包含下列任何字符：\\/:*?\"<>|");
                            } else if (newName.length > 220) {
                                alert("文件名不能超过220字符");
                            } else {
                                if (GTPFileClient.renameAttachment(record.data.FileID, newName + FileType, this.tableName, this.tableKey, this.userID) == true) {
                                    //record.set("FileName", newName + FileType); // TODO:: 报错，record不包含fields引用
                                    record.data["FileName"] = newName + FileType;
                                    record.store.fireEvent('update', record.store, record, Ext.data.Record.COMMIT);
                                    me.fireEvent('afterrename', record, newName + FileType);
                                }
                                this.renameWindow[this.renameWindow.closeAction]();
                            }
                        },
                        scope: this
                    }, {
                        text: '取消',
                        handler: function () {
                            this.renameWindow[this.renameWindow.closeAction]();
                        },
                        scope: this
                    }]
                }
            });
            this.renameWindow.get("fileName").setValue(oldName);
            this.renameWindow.show();
        }
    },

    // 显示附件修改历史
    getFileHistory: function (file) {
        var fileID = parseInt(Ext.get(file).getAttribute("fileid")),
            id = file.id,
            rec = this.store.query("FileID", fileID).itemAt(0),
            sfileName = rec.get("FileName");
        this.lastViewHistortyAttchmentId = file.id;
        var historyList = GTPFileClient.getFileHistory(id);
        if (historyList.success) {
            if (!this.historyListWindow) {
                this.historyListWindow = new Ext.Window({
                    closeAction: "hide",
                    width: 600,
                    height: 400,
                    modal: true,
                    layout: 'fit',
                    items: [this.cmp_content = this.getContent()],
                    fbar: [{
                        text: "关闭",
                        id: "btnClose",
                        scope: this,
                        handler: function () {
                            this.historyListWindow[this.historyListWindow.closeAction]();
                        }
                    }]
                });
            }
            this.historyListWindow.setTitle("附件修改历史-" + sfileName);
            this.cmp_content.store.loadData(historyList.Items);
            this.historyListWindow.show();
        }
    },

    getContent: function () {
        var recordType = Ext.data.Record.create(['HistoryID', 'FileID', 'ViewGUID', 'FileName', 'FileSize', 'UserName', 'Operation', { name: 'OperationTime', type: 'date'}]),
            store = new Ext.data.Store({
                reader: new Ext.data.JsonReader({}, recordType)
            }),
            cm = new Ext.grid.ColumnModel({ columns: [
                new Ext.grid.RowNumberer(),
                {
                    header: '操作',
                    width: 50,
                    align: 'center',
                    dataIndex: 'Operation',
                    renderer: function (value) {
                        switch (value) {
                            case 0:
                                return "上传"
                            case 1:
                                return '删除';
                            case 2:
                                return '修改';
                            case 3:
                                return '重命名';
                            case 4:
                                return "更改备注";
                            default:
                                return "";
                        }
                    }
                }, {
                    header: '修改人',
                    width: 100,
                    align: 'center',
                    dataIndex: 'UserName'
                }, {
                    header: '修改时间',
                    width: 180,
                    xtype: 'datecolumn',
                    align: 'center',
                    dateFormat: 'Y-m-d H:i:s',
                    dataIndex: 'OperationTime'
                }, {
                    header: '文件名',
                    width: 100,
                    align: 'center',
                    dataIndex: 'FileName'
                }, {
                    header: '文件大小',
                    width: 100,
                    align: 'center',
                    dataIndex: 'FileSize',
                    renderer: function (value) {
                        return GTPFileClient.fileSize(value);
                    }
                }, {
                    width: 40,
                    align: 'center',
                    dataIndex: '',
                    scope: this,
                    renderer: this.renderViewHistoryFile
                }
            ]
            });

        return new Ext.grid.GridPanel({
            header: false,
            store: store,
            colModel: cm,
            enableHdMenu: false,
            viewConfig: {
                forceFit: true
            }
        });
    },

    renderViewHistoryFile: function (value, meta, record, rowIndex, colIndex, store) {
        var attachMentPanelId = this.id;
        return '<a href="javascript:void(0)" onclick="Ext.getCmp(\'' + attachMentPanelId + '\').openHistoryFile(' + rowIndex + ')">查看</a>';
    },

    openHistoryFile: function (rowIndex) {
        var rec = this.cmp_content.store.getAt(rowIndex),
            sfileName = rec.data.FileName || "",
            postfixName = sfileName.lastIndexOf('.') != -1 ? sfileName.substring(sfileName.lastIndexOf('.')) : "",
            LocalTempDir = GTPFileClient.ShellGetLocalTempDir() + "\\" + rec.data.FileID + "-" + rec.data.FileName;
        if (postfixName && ".doc.docx.wps".indexOf(postfixName.toLowerCase()) != -1 && this.editWordAttachmentByWebOffice) {
            //用webOffice打开
            $G.open({
                url: "/Services/FileService/WebOfficePage/WebOfficePageIFrameContainer.htm",
                title: rec.data.FileName + "-WebOffice",
                target: "_modal",
                features: {
                    dialogWidth: '900px',
                    dialogHeight: '800px',
                    scroll: 'no'
                },
                parameters: {
                    fileName: sfileName,
                    userName: this.userName || $G.PageContext.userName,
                    isHistory: true,
                    fileID: rec.get("FileID"),
                    id: this.lastViewHistortyAttchmentId,
                    historyId: rec.get("HistoryID"),
                    ViewGUID: rec.get("ViewGUID")
                }
            });
        } else {
            if (rec._isDownLoad === true) { // 已下载
                if (GTPFileClient.ShellExecute(LocalTempDir) <= 32) {
                    var result = GTPFileClient.FileClientDownload(rec.data.FileID, rec.data.ViewGUID, LocalTempDir);
                    if (this.checkResult(result) == false) return result;
                    if (result.Result != -2) {
                        if (GTPFileClient.ShellExecute(LocalTempDir) > 32) {
                            rec._isDownLoad = true;
                        }
                    }
                }
            } else { // 下载后打开
                var result = GTPFileClient.FileClientDownload(rec.data.FileID, rec.data.ViewGUID, LocalTempDir);
                if (this.checkResult(result) == false) return result;
                if (result.Result != -2) {
                    if (GTPFileClient.ShellExecute(LocalTempDir) > 32) {
                        rec._isDownLoad = true;
                    }
                }
            }
        }
    },

    //添加附件
    addAttachment: function () {
        var me = this;
        var files = GTPFileClient.ShellDialogSelectFiles(this.fileTitle, this.defaultExt, this.filters, this.filterIndex, this.initialDir, this.multiSelect);
        if (files) {
            var newFiles = [], len = files.Files.length;
            for (var j = 0; j < len; j++) {
                var name = this.getFileExtension(files.Files[j]);
                if (this.ValidateFileExtension(name) && name.length <= this.maxFileNameSize) {
                    newFiles.push(files.Files[j]);
                }
            }
            if (newFiles.length < len) {
                Gtp.net.MessageBox.confirm('提示', '上传文件列表中含有不支持文件格式或文件名过长<br/>是否跳过', function (btn, text, opt) {
                    if (btn == 'yes') {
                        this.addToStore(newFiles);

                    }
                    this.immediateSaveFile();
                }, this)
            } else {
                this.addToStore(newFiles);
                this.immediateSaveFile();
            }

        }

    },
    addToStore: function (newFiles) {
        for (var i = 0; i < newFiles.length; i++) {
            var name = this.getFileExtension(newFiles[i]);
            var size = this.getFileSize(newFiles[i]);
            if (size < this.maxUploadSize) {      //添加附件后缀名验证
                var state = Math.random();
                this.isModify = true;
                this.filesView.store.add(new Ext.data.Record({
                    FileID: state,
                    FileName: name,
                    FileSize: GTPFileClient.fileSize(size),
                    IsSize: size,
                    State: -1,
                    FileFlag: "block",
                    FilePath: newFiles[i],
                    FileDesc: "",
                    ViewGUID: "",
                    IsSelf: true,
                    EditGUID: "",
                    UserID: this.userID,
                    UserName: this.userName,
                    UploadTime: new Date().toLocaleString()
                }));
            } else {
                Gtp.net.MessageBox.info("系统提示", "上传附件中含有超过" + GTPFileClient.fileSize(this.maxUploadSize) + "的文件，将不予上传");
            }
        }
    },
    ValidateFileExtension: function (name) {
        var postfixName = name ? name.substring(name.lastIndexOf('.')) : undefined
        //GTPFileClient._supportFiles = '.DOC,.docx,.xls,.xlsx,.ppt,.pptx';
        var fileSuffixList = Ext.isEmpty(GTPFileClient._supportFiles) ? [] : GTPFileClient._supportFiles.toLowerCase().split(';');
        if (fileSuffixList && fileSuffixList.length > 0) {
            if (!Ext.isEmpty(postfixName)) {
                return fileSuffixList.indexOf(postfixName.toLowerCase()) != -1 ? true : false;
            } else {
                return false;
            }
        } else {
            return true;
        }
    },
    //提示操作
    showConfirmDialog: function (file) {
        var attachmentPanel = this;
        var fileId = file.name;
        var tempStroe = this.filesView.store.query("FileID", fileId);
        var record = tempStroe.items[0];
        var msg = res_winDownloadDialog;
        var buttons = { yes: " 打开", no: "保存", cancel: "取消", ok: '编辑' };
        if (this.readOnly) {
            delete buttons.ok;
            delete buttons.no;
        } else if (!this.permission) {
            delete buttons.ok;

        } else {
            delete buttons.yes;
            msg = res_winEditDialog;
        }
        var ms = Gtp.net.MessageBox.show({
            title: "提示",
            msg: msg,
            buttons: buttons,
            icon: Ext.MessageBox.QUESTION,
            fn: function processResult2(e) {
                if (e == 'yes') {
                    attachmentPanel.openAttachment(record);

                }
                else if (e == "no") {
                    attachmentPanel.downloadFile(record);
                } else if (e == 'ok') {
                    attachmentPanel.editFile(record);

                }
            },
            minWidth: 300
        });
    },

    viewOrdownloadAttachmentOrEdit: function (file, e) {
        var attachmentPanel = this;
        var fileId = file.name;
        var tempStroe = this.filesView.store.query("FileID", fileId);
        var record = tempStroe.items[0];
        if (e == 'view') {
            this.openAttachment(record);
        }
        else if (e == 'download') {
            this.downloadFile(record);
        } else if (e == 'edit') {
            this.editFile(record);
        }
    },

    //打开附件
    openAttachment: function (rec, returnFileInfo) {
        var attachment = this, openInfo = {};
        if (rec.data.FileID == -1) {
            var fileName = rec.data.FilePath;
            openInfo.path = fileName;
            if (returnFileInfo) {
                openInfo.info = GTPFileClient.ShellGetLocalFilesInfo(openInfo.path, true);
            }

            var sfileName = this.getFileExtension(fileName) || fileName || "",
                postfixName = sfileName.substring(sfileName.lastIndexOf('.'));
            if (".doc.docx.wps.ppt.pptx.xls.xlsx.vsdx.vsd.accdb.pub.mpp".indexOf(postfixName.toLowerCase()) != -1 && this.readOnly) {
                $G.open({
                    url: "/Services/FileService/WebOfficePage/WebOfficePage.aspx",
                    title: rec.data.FileName + "-WebOffice",
                    target: "_modal",
                    features: {
                        dialogWidth: '900px',
                        dialogHeight: '800px',
                        scroll: 'no'
                    },
                    parameters: {
                        fileName: sfileName,
                        userName: this.userName || $G.PageContext.userName,
                        isEdit: false,
                        readOnly: true
                    }
                });
            }
            else if (".doc.docx.wps".indexOf(postfixName.toLowerCase()) != -1 && this.editWordAttachmentByWebOffice) {
                //用webOffice打开
                $G.open({
                    url: "/Services/FileService/WebOfficePage/WebOfficePage.aspx",
                    title: rec.data.FileName + "-WebOffice",
                    target: "_modal",
                    features: {
                        dialogWidth: '900px',
                        dialogHeight: '800px',
                        scroll: 'no'
                    },
                    parameters: {
                        fileName: sfileName,
                        userName: this.userName || $G.PageContext.userName,
                        isEdit: returnFileInfo === true
                    }
                });
            } else {

                GTPFileClient.ShellExecute(fileName);

            }
        }
        else {
            if (rec.data.IsSize < attachment.maxDownloadSize) {
                var LocalTempDir;
                openInfo.path = LocalTempDir = GTPFileClient.ShellGetLocalTempDir() + "\\" + rec.data.FileName;
                var result = GTPFileClient.FileClientDownload(rec.data.FileID, rec.data.ViewGUID, LocalTempDir);

                openInfo.result = result.Result;

                if (this.checkResult(result) == false) return openInfo;

                if (returnFileInfo) {
                    openInfo.info = GTPFileClient.ShellGetLocalFilesInfo(openInfo.path, true);
                }
                if (result.Result != -2) {
                    var sfileName = rec.data.FileName || "",
                        postfixName = sfileName.lastIndexOf('.') != -1 ? sfileName.substring(sfileName.lastIndexOf('.')) : "";


                    if (".doc.docx.wps.ppt.pptx.xls.xlsx.vsdx.vsd.accdb.pub.mpp".indexOf(postfixName.toLowerCase()) != -1 && this.readOnly) {
                        $G.open({
                            url: "/Services/FileService/WebOfficePage/WebOfficePage.aspx",
                            title: rec.data.FileName + "-WebOffice",
                            target: "_modal",
                            features: {
                                dialogWidth: '900px',
                                dialogHeight: '800px',
                                scroll: 'no'
                            },
                            parameters: {
                                fileName: sfileName,
                                userName: this.userName || $G.PageContext.userName,
                                isEdit: false,
                                readOnly: true
                            }
                        });
                    }
                    else if (postfixName && ".doc.docx.wps".indexOf(postfixName.toLowerCase()) != -1 && this.editWordAttachmentByWebOffice) {
                        //用webOffice打开
                        $G.open({
                            url: "/Services/FileService/WebOfficePage/WebOfficePage.aspx",
                            title: rec.data.FileName + "-WebOffice",
                            target: "_modal",
                            features: {
                                dialogWidth: '900px',
                                dialogHeight: '800px',
                                scroll: 'no'
                            },
                            parameters: {
                                fileName: sfileName,
                                userName: this.userName || $G.PageContext.userName,
                                isEdit: returnFileInfo === true
                            }
                        });
                    } else {

                        GTPFileClient.ShellExecute(LocalTempDir);

                    }
                }
            }
            else {
                // Ext.Msg.alert("系统提示", "打开附件大小不能大于" + GTPFileClient.fileSize(attachment.maxDownloadSize) + "，请下载后打开。");
                Gtp.net.MessageBox.info("系统提示", "打开附件大小不能大于" + GTPFileClient.fileSize(attachment.maxDownloadSize) + "，请下载后打开。");
            }
        }
        return openInfo;
    },

    //立即上传文件到服务器
    immediateSaveFile: function () {
        if (this.immediate) {
            var r = this.saveFile();
            if (r && r.Result != -2) {
                this.loadAttachment(this.filesView.store);
            } else if (r && r.Result == -2 && r.Canceled === 'True') {//解决上传中止还显示上传附件
                this.loadAttachment(this.filesView.store);
            }
        }
    },


    deleteTempFileStore: function (guid) {
        //删除临时表中的记录
        this.GTPFileStore.each(function (rec) {
            if (rec.data.FileID == guid) {
                if (this.store)
                    this.store.remove(rec);
            }
        });
    },

    physicalDeleteFile: function (_this, isUpdeta) {
        var ret = true;
        var fileIdList = "";
        var fileNameList = "";
        var fileEditGuidList = "";
        var store = deleteStore,
            l = store.data.items.length;

        if (l == 0) return ret;

        for (var i = 0; i < l; i++) {
            if (i > 0) {
                fileIdList += "|";
                fileNameList += "|";
                fileEditGuidList += "|";
            }
            fileIdList += store.data.items[i].data.FileID;
            fileNameList += store.data.items[i].data.FileName;
            fileEditGuidList += store.data.items[i].data.EditGUID;
        }
        var result = GTPFileClient.FileClientDelete(fileIdList, fileEditGuidList, fileNameList);
        if (this.checkResult(result) == false) return result;
        if (!isUpdeta) {
            for (var i = 0; i < result.Files.length; i++) {
                var obj = GTPFileClient.DeleteFileAttachment(result.Files[i].FileID, this.tableName, this.tableKey, this.userID);
                if (!obj) {
                    ret = false;
                }
            }
        }
        deleteStore.removeAll();
        return ret;
    },

    //保存(上传)文件到服务器
    saveFile: function (isUpdate) {
        var ret = true;
        var filePath = "";
        var filedesc = "";
        var result = "";
        var tempStroe = this.filesView.store.query("State", "-1");
        for (var i = 0; i < tempStroe.items.length; i++) {
            if (tempStroe.items[i].data.State == -1) {
                if (i > 0) {
                    filePath += "|";
                    filedesc += "|";
                }
                filePath += tempStroe.items[i].data.FilePath;
                filedesc += tempStroe.items[i].data.FileDesc;
            }
        }
        try {
            var GTPFileAttachment = this;
            if (tempStroe.items.length > 0) {
                GTPFileClient.FileClientSetOptionSilent(false);
                if (!isUpdate) {
                    result = GTPFileClient.FileClientUploadAndSaveAttachmentData(this.tableName, this.tableKey, this.appNamespace, filePath, "", "", "", "", null, true);
                    this.fireEvent('afteradd', result);
                } else {
                    result = GTPFileClient.FileClientUploadAndUpdateAttachmentData(this.tableName, this.tableKey, this.appNamespace, filePath, "", "", "", "", null, true);

                }

                if (this.checkResult(result) == false) return result;

                var totalCount = result.TotalCount;
                var completedCount = result.CompletedCount;
                for (var z = completedCount; z < totalCount; z++) {
                    this.deleteTempFileStore(tempStroe.items[z].data.FileID);
                }
            }
            // if (tempStroe.getCount() > 0 && result != false || tempStroe.getCount() == 0) {
            ret = this.physicalDeleteFile(this, isUpdate);
            // }
        }
        catch (e) {
            ret = this.getClientConnect();
        }
        return result;
    },
    //在线编辑
    editFile: function (rec) {
        var attachment = this;
        var openInfo = attachment.openAttachment(rec, true);
        if (openInfo.result == -2) {

            //Ext.Msg.alert("系统提示", "另一个程序正在使用此文件,打开失败！");
            // Gtp.net.MessageBox.info("系统提示", "另一个程序正在使用此文件,打开失败！");
        } else {
            Ext.MessageBox.confirm("编辑", '编辑文件后选"是"则提交修改文件，选"否"则放弃修改<br/><br/>(请在编辑完成后关闭编辑工具，否则可能由于文件被编辑工具独占而无法上传)', function (btn, text, opt) {
                //检验下载的本地文件
                if (Ext.isEmpty(openInfo.path)) {
                    Gtp.net.MessageBox.info('错误', "未能正确获取文件");
                    return;
                }
                if (btn == 'yes') {
                    attachment.updateFile(openInfo, rec);

                    if (GTPFileClient._stillOpened_ == true) {
                        Ext.Msg.getDialog().show();
                    }
                }
            }, this);
        }

    },

    updateFile: function (openInfo, rec) {
        var me = this;
        var fileInfoBeforeEdit = openInfo.info.Files[0];
        var fileChanged = GTPFileClient.ShellCheckIsFileChanged(openInfo.path, fileInfoBeforeEdit, true);
        var fileInfoAfterEdit = GTPFileClient.ShellGetLocalFilesInfo(openInfo.path).Files[0];
        if (fileChanged) {
            //            deleteStore.add(new deleteDataRecord({
            //                FileID: rec.data.FileID,
            //                FileName: rec.data.FileName,
            //                ViewGUID: rec.data.ViewGUID,
            //                EditGUID: rec.data.EditGUID
            //            }));
            var name = this.getFileExtension(fileInfoAfterEdit.FileName);
            var size = fileInfoAfterEdit.FileSize;
            var isSaveSuccess = false;
            if (size < this.maxUploadSize) {
                var state = Math.random();
                this.isModify = true;
                this.filesView.store.add(new Ext.data.Record({
                    FileID: state,
                    FileName: name,
                    FileSize: GTPFileClient.fileSize(size),
                    IsSize: size,
                    State: -1,
                    FileFlag: "block",
                    IsSelf: true,
                    FilePath: fileInfoAfterEdit.FileName,
                    FileDesc: "",
                    ViewGUID: "",
                    EditGUID: "",
                    UserID: this.userID,
                    UserName: this.userName,
                    UploadTime: new Date().toLocaleString()
                }));
                var ret = this.saveFile(true);
                var xmlDoc = GTPFileClient._xmlDocumentFromString(ret.XML);
                var rootNode = xmlDoc.getElementsByTagName("file")[0];
                var newFileID = rootNode.getAttribute("NewFileID");
                GTPFileClient.UpdetaInfor(this.tableName, this.tableKey, rec.data.EditGUID, rec.data.FileID, newFileID, this.userID)
                me.fireEvent('afteredite', rec, ret, rootNode);
                this.loadAttachment(this.filesView.store);
            } else {
                Gtp.net.MessageBox.info("系统提示", "文件大小超过" + GTPFileClient.fileSize(this.maxUploadSize) + ",请调整文件大小");
            }
        }


    },
    //以下几个方法是为了满足在线表单使用而添加的，其他地方慎用--start

    setPanelReadOnly: function (readOnly) {
        var comp = this;
        if (readOnly == true) { //设置附件面板的只读状态,并且将toolbar的高度加进去
            if (comp.rawPermission == undefined) {
                comp.rawPermission = comp.permission;
            }
            comp.permission = 0
            comp.hasReadOnly = true;
        } else {
            if (comp.rawPermission != undefined) {
                comp.permission = comp.rawPermission;
            }
            if (readOnly == false) {
                comp.hasReadOnly = false;
            }
        }
        this.handleToolbar(!readOnly);
        comp.loadAttachment(comp.filesView.store);
    },
    handleToolbar: function (showToolbar) {
        var toolbar = this.topToolbar;
        var height = this.getHeight();
        if (toolbar.isVisible() == false && showToolbar == true) {
            toolbar.show();
            if (this.autoHeight !== true) {
                this.setHeight(height - toolbar.getHeight());
            }
        } else if (toolbar.isVisible() == true && showToolbar == false) {
            toolbar.hide();
            if (this.autoHeight !== true) {
                this.setHeight(height + toolbar.getHeight());
            }
        }
    },
    canUpload: function (flag) {
        if (this.hasReadOnly != true) {
            this.handleToolbar(flag);
        }
    },
    canEdit: function (flag) {
        if (this.hasReadOnly != true) {
            var comp = this;
            if (flag == false) { //设置附件面板的只读状态,并且将toolbar的高度加进去
                if (comp.rawPermission == undefined) {
                    comp.rawPermission = comp.permission;
                }
                comp.permission = 0
            } else {
                if (comp.rawPermission != undefined) {
                    comp.permission = comp.rawPermission;
                }
            }
            comp.loadAttachment(comp.filesView.store);
        }
    }
    //以上几个方法是为了满足在线表单使用而添加的--end
});

Ext.reg('attachmentpanel', Ext.ux.AttachmentPanel);

var deleteDataRecord = Ext.data.Record.create([{
    name: "FileID"
}, {
    name: "FileName"
}, {
    name: "ViewGUID"
}, {
    name: "EditGUID"
}]);

var data = "";
var deleteStore = new Ext.data.Store({
    proxy: new Ext.data.MemoryProxy(data),
    reader: new Ext.data.ArrayReader({}, deleteDataRecord)
});


//下载附件预览
Ext.ux.FilesView = Ext.extend(Ext.DataView, {
    itemSelector: 'li.x-fileview-list-item',
    cls: 'x-fileview-list',
    IdField: 'ID',
    fileIdField: 'FileID',
    autoHeight: true,
    singleSelect: true,
    initComponent: function () {
        var viewFile = "Ext.getCmp('" + this.attachmentId + "').viewOrdownloadAttachmentOrEdit(this,'view');return&nbsp;false;";
        var downloadFile = "Ext.getCmp('" + this.attachmentId + "').viewOrdownloadAttachmentOrEdit(this,'download');return&nbsp;false;";
        var getHistory = "Ext.getCmp('" + this.attachmentId + "').getFileHistory(this);return&nbsp;false;";
        var renameAttachment = "Ext.getCmp('" + this.attachmentId + "').renameAttachment(this);return&nbsp;false;";
        var editFile = "Ext.getCmp('" + this.attachmentId + "').viewOrdownloadAttachmentOrEdit(this,'edit');return&nbsp;false;";

        var openHtml = '<a href="javascript:void(0)" name="{' + this.fileIdField + '}" onclick ="{' + viewFile + '}">打开</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        var editHtml = '<a href="javascript:void(0)" name="{' + this.fileIdField + '}" onclick ="{' + editFile + '}">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        var renameHtml = '<a href="javascript:void(0)" fileid="{' + this.fileIdField + '}" onclick ="{' + renameAttachment + '}">重命名</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        var downloadHtml = '<a href="javascript:void(0)" name="{' + this.fileIdField + '}" onclick ="{' + downloadFile + '}">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        if (this.readOnly) {
            downloadHtml = '';
            editHtml = '';
            renameHtml = '';
        }
        else if (!this.permission) {
            editHtml = '';
            renameHtml = '';
        } else {
            openHtml = '';
        }

        if (!this.tpl) {
            this.tpl = new Ext.XTemplate(
                '<div>',
                    '<tpl for="." >',
                            '<div class="x-fileview">',
                                '<div id="att{FileID}-img" class="x-fileview-img"></div>',
                                '<div class="x-fileview-text" >',
                                    '<div><span id="att{FileID}-title" class="x-fileview-title">{FileName}<span class="x-fileview-size">({FileSize})</span></span></div>',
                                    '<div style="line-height:19px;">',
                                         downloadHtml + openHtml + editHtml + renameHtml,
                                        '<a href="javascript:void(0)" fileid = "{' + this.fileIdField + '}" id="{' + this.IdField + '}" onclick ="{' + getHistory + '}">查看历史</a>',
                                    '</div>',
                                '</div>',
                            '</div>',
                    '</tpl>',
                '</div>'
                );
        };
        Ext.ux.FilesView.superclass.initComponent.call(this);
    },
    afterRender: function () {
        Ext.ux.FilesView.superclass.afterRender.call(this);
        this.gettip(this.curuserId, this.store);
    },
    //添加查看附件的tip
    gettip: function (userid, store) {
        for (var i = 0; i < store.data.length; i++) {
            var objdata = store.getAt(i);
            var attimg = 'att' + objdata.get("FileID") + '-img';
            var atttitle = 'att' + objdata.get("FileID") + '-title';
            var htmltext = '<p><span class="tip-filename" >文件名:' + objdata.get("FileName") + '</span>上传人:' + objdata.get("UserName") + '<br/>上传时间:' + objdata.get("UploadTime") + '<p>';
            new Ext.ToolTip({
                target: attimg,
                html: htmltext,
                autoHide: true,
                closable: false,
                trackMouse: true
            });
            new Ext.ToolTip({
                target: atttitle,
                html: htmltext,
                autoHide: true,
                closable: false,
                trackMouse: true
            });
        }; //end for
        Ext.QuickTips.init();
    }
});



//上传附件
Ext.ux.FilesAddView = Ext.extend(Ext.DataView, {
    itemSelector: 'li.x-filebox',
    selectedClass: 'x-filebox-focus',
    overClass: 'x-filebox-over',
    cls: 'x-filebox-list',
    IdField: 'ID',
    fileIdField: 'FileID',
    fileNameField: 'FileName',
    fileSizeField: 'FileSize',
    userIdField: 'UserID',
    userNameField: 'UserName',
    fileFlagField: 'FileFlag',
    uploadTimeField: 'UploadTime',
    isSelfField: 'IsSelf',
    singleSelect: true,
    initComponent: function () {
        if (!this.autoHeight)
            this.style = 'max-height: 45px;';
        var viewFile = "Ext.getCmp('" + this.attachmentId + "').showConfirmDialog(this);return&nbsp;false;";
        var deleteFile = "Ext.getCmp('" + this.attachmentId + "').deleteAttachment(this);return&nbsp;false;";
        var showMenu = "Ext.getCmp('" + this.attachmentId + "').showMenu(this);return&nbsp;false;";
        var diplayFile = "none";
        //var userid1 = this.curuserId;
        var store1 = this.store;
        var htmltext1 = '<p class=\'tip-filename\'>文件名:{' + this.fileNameField + '}<p>';
        var htmltext2 = '<p><span class=\'tip-filename\' >文件名:{' + this.fileNameField + '}</span>上传人:{' + this.userNameField + '}<br/>上传时间:{' + this.uploadTimeField + '}<p>';
        var htmltext = '<tpl if="' + this.isSelfField + ' == ' + "true" + '">' + htmltext1 + '</tpl>' +
                       '<tpl if="' + this.isSelfField + ' == ' + "false" + '">' + htmltext2 + '</tpl>';

        if (!this.tpl) {
            this.tpl = new Ext.XTemplate(
                '<ul class="' + this.showDirection + '">',
                    '<tpl for=".">',
                        '<tpl if="' + this.fileFlagField + ' == ' + "'none'" + '">',
                           '<li class="x-filebox x-filebox-nonclose">',
                              '<a id="file-{' + this.fileIdField + '}" name="{' + this.fileIdField + '}" ext:qtip="' + htmltext + '" class="x-filebox-link" onclick ={' + viewFile + '} href="javascript:void(0)">{' + this.fileNameField + '}</a>',
                              '<span class="x-filebox-size">({' + this.fileSizeField + '})</span>',
                              '<a class="x-filebox-expand" fileid = "{' + this.fileIdField + '}" id="{' + this.IdField + '}"  href="javascript:void(0)" onclick ={' + showMenu + '}></a>',
                           '</li>',
                        '</tpl>',
                        '<tpl if="' + this.fileFlagField + ' != ' + "'none'" + '">',
                           '<li class="x-filebox">',
                              '<a id="file-{' + this.fileIdField + '}" name="{' + this.fileIdField + '}" ext:qtip="' + htmltext + '" class="x-filebox-link" onclick ={' + viewFile + '} href="javascript:void(0)">{' + this.fileNameField + '}</a>',
                              '<span class="x-filebox-size">({' + this.fileSizeField + '})</span>',
                              '<a class="x-filebox-expand" fileid = "{' + this.fileIdField + '}" id="{' + this.IdField + '}"  href="javascript:void(0)" onclick ={' + showMenu + '}></a>',
                              '<a class="x-filebox-close" name={' + this.fileIdField + '} href="javascript:void(0)" onclick ={' + deleteFile + '}></a>',
                           '</li>',
                        '</tpl>',
                    '</tpl>',
                '</ul>'
            );
        };
        Ext.ux.FilesView.superclass.initComponent.call(this);
        this.addEvents(
            'keydown'
        );
    },
    //【已过时】添加上传附件的tip
    gettip: function (userid, store) {
        for (var i = 0; i < store.data.length; i++) {
            var objdata = store.getAt(i);
            var target = 'file-' + objdata.get("FileID");
            if (objdata.get("UserID") == userid) {
                new Ext.ToolTip({
                    target: target,
                    title: objdata.get("FileName"),
                    autoHide: true,
                    closable: false,
                    trackMouse: true
                });
            }
            else {
                var htmltext = '<p>上传人:' + objdata.get("UserName") + '<br/>上传时间:' + objdata.get("UploadTime") + '<p>';
                new Ext.ToolTip({
                    target: target,
                    title: objdata.get("FileName"),
                    html: htmltext,
                    autoHide: true,
                    closable: false,
                    trackMouse: true
                });
            }
        } //end for
        Ext.QuickTips.init();
    },
    afterRender: function (obj) {
        Ext.ux.FilesView.superclass.afterRender.call(this);
        this.focusEl = new Ext.Element(this.el.child('ul/a'));
        this.mon(this.el, 'keydown', this.onKeyDown, this);
        this.on('beforeclick', this.onBeforeclick, this);
    },
    onBeforeclick: function () {
        var focusEl = this.focusEl;
        if (Ext.isGecko) {
            focusEl.focus();
        } else {
            focusEl.focus.defer(1, focusEl);
        }
    },
    onKeyDown: function (e) {
        var k = e.getKey();
        if (k == e.DELETE) {
            var records = this.getSelectedRecords();
            Ext.each(records, function (record) {
                this.getStore().remove(record);
            }, this);
        }
    }
});

