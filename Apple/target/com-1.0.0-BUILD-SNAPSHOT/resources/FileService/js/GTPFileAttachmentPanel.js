
Ext.namespace("Ext.ux.Utils");
Ext.ux.Utils.EventQueue = function (handler, scope) {
    if (!handler) {
        throw "Handler is required."
    }
    this.handler = handler;
    this.scope = scope || window;
    this.queue = [];
    this.is_processing = false;
    this.postEvent = function (event, data) {
        data = data || null;
        this.queue.push({
            event: event,
            data: data
        });
        if (!this.is_processing) {
            this.process()
        }
    };
    this.FlushEventQueue = function () {
        this.queue = []
    },
    this.process = function () {
        while (this.queue.length > 0) {
            this.is_processing = true;
            var event_data = this.queue.shift();
            this.handler.call(this.scope, event_data.event, event_data.data)
        }
        this.is_processing = false
    }
};
Ext.ux.Utils.FSA = function (initial_state, trans_table, trans_table_scope) {
    this.current_state = initial_state;
    this.trans_table = trans_table || {};
    this.trans_table_scope = trans_table_scope || window;
    Ext.ux.Utils.FSA.superclass.constructor.call(this, this.processEvent, this)
};
Ext.extend(Ext.ux.Utils.FSA, Ext.ux.Utils.EventQueue, {
    current_state: null,
    trans_table: null,
    trans_table_scope: null,
    state: function () {
        return this.current_state
    },
    processEvent: function (event, data) {
        var transitions = this.currentStateEventTransitions(event);
        if (!transitions) {
            throw "State '" + this.current_state
					+ "' has no transition for event '" + event + "'."
        }
        for (var i = 0, len = transitions.length; i < len; i++) {
            var transition = transitions[i];
            var predicate = transition.predicate || transition.p || true;
            var action = transition.action || transition.a || Ext.emptyFn;
            var new_state = transition.state || transition.s
					|| this.current_state;
            var scope = transition.scope || this.trans_table_scope;
            if (this.computePredicate(predicate, scope, data, event)) {
                this.callAction(action, scope, data, event);
                this.current_state = new_state;
                return
            }
        }
        throw "State '" + this.current_state
				+ "' has no transition for event '" + event
				+ "' in current context"
    },
    currentStateEventTransitions: function (event) {
        return this.trans_table[this.current_state]
				? this.trans_table[this.current_state][event] || false
				: false
    },
    computePredicate: function (predicate, scope, data, event) {
        var result = false;
        switch (Ext.type(predicate)) {
            case "function":
                result = predicate.call(scope, data, event, this);
                break;
            case "array":
                result = true;
                for (var i = 0, len = predicate.length; result && (i < len); i++) {
                    if (Ext.type(predicate[i]) == "function") {
                        result = predicate[i].call(scope, data, event, this)
                    } else {
                        throw ["Predicate: ", predicate[i],
								' is not callable in "', this.current_state,
								'" state for event "', event].join("")
                    }
                }
                break;
            case "boolean":
                result = predicate;
                break;
            default:
                throw ["Predicate: ", predicate, ' is not callable in "',
						this.current_state, '" state for event "', event]
						.join("")
        }
        return result
    },
    callAction: function (action, scope, data, event) {
        switch (Ext.type(action)) {
            case "array":
                for (var i = 0, len = action.length; i < len; i++) {
                    if (Ext.type(action[i]) == "function") {
                        action[i].call(scope, data, event, this)
                    } else {
                        throw ["Action: ", action[i], ' is not callable in "',
								this.current_state, '" state for event "',
								event].join("")
                    }
                }
                break;
            case "function":
                action.call(scope, data, event, this);
                break;
            default:
                throw ["Action: ", action, ' is not callable in "',
						this.current_state, '" state for event "', event]
						.join("")
        }
    }
});

//*******************************************************************************//
//****************Ext.ux.GTPFileAttachmentPanel组件******************************//
//*******************************************************************************//
Ext.namespace("Ext.ux.GTPFileAttachmentPanel");
Ext.ux.GTPFileAttachmentPanel.FileRecord = Ext.data.Record.create([
{
    name: "Guid"      //附件临时Guid
},
{
    name: "FileID"    //附件记录ID
}, {
    name: "FileName"  //附件名称
}, {
    name: "state",    //附件状态
    type: "int"
}, {
    name: "FileFlag"  //附件标示
}, {
    name: "FileSize"  //附件大小
}, {
    name: "FilePath"  //附件物理路径
}, {
    name: "FileDesc"  //附件备注
}, {
    name: "ViewGUID"  //查看权限码
}, {
    name: "EditGUID"  //编辑权限码
}]);
Ext.ux.GTPFileAttachmentPanel.FileRecord.STATE_QUEUE = 0;
Ext.ux.GTPFileAttachmentPanel.Dialog = function (config) {
    var default_config = {
        // collapsible: true, // 可折叠
        height: 230,
        autoWidth: true,
        layout: 'anchor',
        minHeight: 200,
        id: 'GTPFileAttachmentPanel' + Ext.id(),
        title: res_titleAttachment,
        cls: "ext-ux-uploaddialog-dialog",
        tableName: "",          //相关业务的表名
        tableKey: "",           //相关业务的表Key
        appNamespace: "",         //相关业务的命名空间
        isView: true,           //控制所有附件操作按钮显示 true：表示显示; false:表示隐藏保存按钮：默认为true
        fileStatus: false,                // fileStatus true:编辑附件（添加，删除，下载，浏览）功能，false：查看状态（下载，浏览）功能
        saveBtnShow: true,                //保存附件按钮 true：表示显示; false:表示隐藏保存按钮：默认为true
        closeBtnShow: true,               //关闭按钮     true：表示显示; false:表示隐藏保存按钮：默认为true
        immediate: false,                 //附件保存方式 true：表示立即保存；false:为点击保存按钮才上传附件到服务器
        allow_close_on_upload: false,
        isModify: false,          //附件是否被编辑过；true:已编辑；false:未编辑；
        fileTitle: "",         //文件对话框中 初始的文件名
        DefaultExt: "",        //默认文件扩展名
        filters: "",           //设置附件选择类型；如：压缩(*.rar)|*.rar|图片(*.jpg:*.bmp:*.jpeg:*.png)|*.jpg;*.bmp;*.jpeg;*.png|所有文件(*.*)|*.*
        filterIndex: 0,        //"文件类型"组合框中当前选中的文件过滤器的索引, 第一个文件过滤器索引值是1.比如 FileDialog.Filter = "Text files(*.txt)|*.txt|One filter(*.hhh)|*.hhh|All Files(*.*)|*.*",那么如果你的FilterIndex=2,那么你的文件对话框"文件类型"组合框就是"One filter(*.hhh)" 
        initialDir: "",        //打开附件的磁盘目录； 如：C:\
        multiSelect: true,     //打开选择文件对话框时是否可以选择多个附件，true:多选；false:单选；默认true
        maxUploadSize: 2097152000,   //上传附件限制默认最大值；
        maxDownloadSize: 524288000,   //超500M文件不能直接打开 
        //工具栏按钮：添加附件，删除附件，下载附件，打开附件，保存，关闭
        tbar: [{
            text: res_textAddAttachment,
            iconCls: "ext-ux-uploaddialog-addbtn",
            name: "gtpBtnAddFile",
            handler: function () { this.AddFile(); },
            scope: this
        }, {
            xtype: 'tbseparator', name: "tbseparator1"
        }, {
            text: res_textDeleteAttachment,
            iconCls: "ext-ux-uploaddialog-removebtn",
            name: "gtpBtnDeleteFile",
            handler: function () {
                var selections = this.grid_panel.getSelectionModel().getSelections();
                this.fsa.postEvent("remove-files", selections);
            },
            scope: this
        }, {
            xtype: 'tbseparator', name: "tbseparator2"
        }, {
            text: res_textDownLoadAttachment,
            iconCls: "ext-ux-uploaddialog-downloadbtn",
            name: "gtpBtnDownLoadFile",
            handler: function () {
                var selections = this.grid_panel.getSelectionModel().getSelections();
                this.fsa.postEvent("download-files", selections)
            },
            scope: this
        }, {
            xtype: 'tbseparator', name: "tbseparator3"
        }, {
            text: res_textViewAttachment,
            iconCls: "ext-ux-uploaddialog-viewbtn",
            name: "gtpBtnViewFile",
            handler: function () {
                var selections = this.grid_panel.getSelectionModel().getSelections();
                this.fsa.postEvent("view-files", selections)
            },
            scope: this
        }, {
            xtype: 'tbseparator', name: "tbseparator4"
        }, {
            text: res_btnSavefile,
            iconCls: "ext-ux-uploaddialog-save",
            name: "gtpBtnSave",
            handler: function () {
                this.SaveFile();
            },
            scope: this
        }, {
            xtype: 'tbseparator', name: "tbseparator5"
        }, {
            text: res_btnClose,
            iconCls: "ext-ux-uploaddialog-cancel",
            name: "gtpBtnColse",
            handler: function () {
                window.close();
            },
            scope: this
        }]
    };
    config = Ext.applyIf(config || {}, default_config);
    config.layout = "absolute";
    Ext.ux.GTPFileAttachmentPanel.Dialog.superclass.constructor.call(this, config)
};

Ext.extend(Ext.ux.GTPFileAttachmentPanel.Dialog, Ext.Panel, {
    GTPFilePanelStore: null,
    fsa: null,
    state_tpl: null,
    edit_tpl: null,
    clickFileName_tpl: null,
    winArr: {},
    grid_panel: null,
    is_uploading: false,
    initComponent: function () {
        Ext.ux.GTPFileAttachmentPanel.Dialog.superclass.initComponent.call(this);
        this.GetFileAttachmentTableKey();
        this.maxUploadSize = GTPFileClient.GetFileLimitMaxSize("GTP.Services.FileService", "DefaultUploadMaxFileSize");
        this.maxDownloadSize = GTPFileClient.GetFileLimitMaxSize("GTP.Services.FileService", "DefaultDownloadMaxFileSize");
        this.DisplayButton();
        var tt = {
            "created": {
                "window-render": [{
                    action: [this.CreateGrid],
                    state: "rendering"
                }],
                "destroy": [{
                    action: this.FlushEventQueue,
                    state: "destroyed"
                }]
            },
            "rendering": {
                "grid-render": [{
                    state: "ready"
                }],
                "destroy": [{
                    action: this.FlushEventQueue,
                    state: "destroyed"
                }]
            },
            "ready": {
                "file-selected": [{
                    action: this.AddFile
                }, {}],
                "grid-selection-change": [{
                }],
                "remove-files": [{
                    action: [this.RemoveFile,
    									this.FireFileRemoveEvent]
                }],
                "download-files": [{
                    action: [this.DownloadFile]
                }],
                "view-files": [{
                    action: [this.ViewFile]
                }],
                "save-files": [{
                    action: [this.SaveFile]
                }],
                "destroy": [{
                    action: this.FlushEventQueue,
                    state: "destroyed"
                }]
            },
            "destroyed": {}
        };
        this.fsa = new Ext.ux.Utils.FSA("created", tt, this);
        this.addEvents({
            "filetest": true,
            "fileadd": true,
            "fileremove": true
        });
        this.on("render", this.OnWindowRender, this);
        this.on("beforehide", this.OnWindowBeforeHide, this);
        this.on("destroy", this.OnWindowDestroy, this);
        this.state_tpl = new Ext.Template("<div class='ext-ux-uploaddialog-state ext-ux-uploaddialog-state-{state}'>&#160;</div>").compile();
        var editStyle = "";
        if (this.fileStatus)
            editStyle = "display:none";
        else
            editStyle = "display:block";

        this.edit_tpl = new Ext.Template("<div  title=" + res_btnEdittext + " class='ext-ux-uploaddialog-state ext-ux-uploaddialog-editbtn' style=" + editStyle + "  onclick=Ext.getCmp('" + this.id + "').OpenNoteWin(\"{edit}\") >&#160;</div>").compile();
        this.clickFileName_tpl = new Ext.Template("<div> <label style='{fontStyle}' onclick = Ext.getCmp('" + this.id + "').ShowConfirmDialog('show')>{fileName}</label></div>").compile();

    },
    //控制按钮显示 closeBtnShow：关闭按钮；saveBtnShow：保存按钮；fileStatus：编辑权限与查看权限时按钮显示；isView：控制所有按钮显示
    DisplayButton: function () {
        if (!this.closeBtnShow) {
            this.toolbars[0].items.items[10].hide();
            this.toolbars[0].items.items[9].hide();
        }
        if (!this.saveBtnShow) {
            this.toolbars[0].items.items[8].hide();
            this.toolbars[0].items.items[7].hide();
        }
        if (this.fileStatus) {
            this.toolbars[0].items.items[1].hide();
            this.toolbars[0].items.items[3].hide();
            this.toolbars[0].items.items[0].hide();
            this.toolbars[0].items.items[2].hide();
        }
        if (!this.isView) {
            this.toolbars[0].items.items[1].hide();
            this.toolbars[0].items.items[3].hide();
            this.toolbars[0].items.items[5].hide();
            this.toolbars[0].items.items[7].hide();
            this.toolbars[0].items.items[9].hide();
            this.toolbars[0].items.items[0].hide();
            this.toolbars[0].items.items[2].hide();
            this.toolbars[0].items.items[4].hide();
            this.toolbars[0].items.items[6].hide();
            this.toolbars[0].items.items[8].hide();
            this.toolbars[0].items.items[10].hide();
        }
    },

    //用户点击附件名称时弹出附件（下载，打开，取消）对话框；
    ShowConfirmDialog: function (str) {
        if (this.winArr[str] == null || this.winArr[str].isDestroyed) {
            var GTPFileAttachmentPanel = this;
            var win = new Ext.Window({
                width: 300,
                height: 100,
                border: false,
                frame: true,
                bodyBorder: false,
                modal: true,        //是否是模态窗体   
                plain: true, //true则主体背景透明，false则主体有小差别的背景色，默认为false    
                html: "<div style=\"font-size:12px;text-align: center;\">" + res_winDownloadDialog + "</div>",
                buttons: [
            { text: res_btnOpen, handler: function () {
                var selections = GTPFileAttachmentPanel.grid_panel.getSelectionModel().getSelections();
                GTPFileAttachmentPanel.ViewFile(selections);
                win.hide();
            }
            },
            { text: res_btnSavefile, handler: function () {
                var selections = GTPFileAttachmentPanel.grid_panel.getSelectionModel().getSelections();
                GTPFileAttachmentPanel.DownloadFile(selections);
                win.hide();
            }
            },
            { text: res_btnCancel, handler: function () { win.hide(); } }],
                buttonAlign: "center" //footer部按钮排列位置,这里是中间
            });
            this.winArr[str] = win;
        }
        this.winArr[str].show();
    },
    //计算附件大小(mb,kb,byte)
    GetTotalSize: function (data) {
        return Ext.util.Format.fileSize(data);
    },
    CreateGrid: function () {
        //从服务器中加载历史附件信息到数据容器中
        GTPFileAttachmentPanel = this;
        var fileUrl = GTPFileClient.FsAjaxFullUrl + "?tableName=" + this.tableName + "&tableKey=" + this.tableKey + "&type=2";
        GTPFilePanelStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({ url: fileUrl }),
            autoLoad: { params: {} },
            listeners: { load: function () {
                GTPFileAttachmentPanel.ModifyPanelTitle();
            }
            },
            reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'root'
            },
             Ext.ux.GTPFileAttachmentPanel.FileRecord
            )
        });

        // Grid表格表头设置
        var cm = new Ext.grid.ColumnModel([{
            header: res_stateColTitle,
            width: 60,
            resizable: false,
            dataIndex: "state",
            sortable: false,
            renderer: this.RenderStateCell.createDelegate(this)
        }, {
            header: res_fileNameColTitle,
            width: 350,
            dataIndex: "FileName",
            sortable: true,
            renderer: this.RenderEditFileNameCell.createDelegate(this)
        }, {
            header: res_fileSizeColTitle,
            width: 100,
            dataIndex: "FileSize",
            sortable: true,
            renderer: this.GetTotalSize.createDelegate()

        }, {
            header: res_noteColTitle,
            width: 300,
            dataIndex: "FileDesc",
            sortable: true,
            renderer: this.RenderFilenameCell.createDelegate(this)
        }, {
            header: res_operateColTitle,
            width: 70,
            resizable: false,
            sortable: false,
            renderer: this.RenderEditCell.createDelegate(this)
        }]);

        //Grid设置

        this.grid_panel = new Ext.grid.GridPanel({
            ds: GTPFilePanelStore,
            cm: cm,
            height: 190,
            frame: true,
            border: true,
            viewConfig: {
                autoFill: true,
                forceFit: true
            }
        });
        this.grid_panel.on("render", this.OnGridRender, this);
        this.add(this.grid_panel);
        this.grid_panel.getSelectionModel().on("selectionchange",
    				this.OnGridSelectionChange, this)
    },

    RenderStateCell: function (data, cell, record, row_index, column_index,
    			store) {
        if (record.data.FileID != -1)
            data = 1
        return this.state_tpl.apply({
            state: data
        })
    },
    //编辑附件备注
    RenderEditCell: function (data, cell, record, row_index, column_index,
    			store) {
        data = Encrypt(Ext.encode(record.data));
        return this.edit_tpl.apply({ edit: data })
    },

    //在表格中附件名称显示样式:新添加的附件以斜体下划线显示；历史数据下划线显示
    RenderEditFileNameCell: function (data, cell, record, row_index, column_index,
    			store) {
        var font = "";
        if (record.data.FileID == -1)
            font = "text-decoration:underline;font-style:oblique;";
        else
            font = "text-decoration:underline;";
        return this.clickFileName_tpl.apply({ fileName: record.data.FileName, fontStyle: font })
    },

    RenderFilenameCell: function (data, cell, record, row_index, column_index,
    			store) {
        var view = this.grid_panel.getView();
        var f = function () {
            try {
                Ext.fly(view.getCell(row_index, column_index))
    						.child(".x-grid3-cell-inner").dom["qtip"] = data
            } catch (e) {
            }
        };
        f.defer(1000);
        return data
    },
    // 返回true:文件信息被编辑，false:未被编辑
    GetModifyFileFlag: function () {
        var gridPanel = this.grid_panel.getStore().getModifiedRecords();
        var hStore = HistoryStore.getModifiedRecords();
        if (!Ext.isEmpty(gridPanel))
            this.isModify = true;
        if (!Ext.isEmpty(hStore))
            this.isModify = true;
        return this.isModify;
    },

    //添加附件
    AddFile: function () {
        //选择附件（支持多选）
        // var files = GTPFileClient.ShellDialogSelectFiles("", "", "压缩(*.rar)|*.rar|图片(*.jpg:*.bmp:*.jpeg:*.png)|*.jpg;*.bmp;*.jpeg;*.png|所有文件(*.*)|*.*", "2", "", false);
        var files = GTPFileClient.ShellDialogSelectFiles(this.fileTitle, this.DefaultExt, this.filters, this.filterIndex, this.initialDir, this.multiSelect);
        if (files) {
            if (files.Result) {
                for (var i = 0; i < files.Files.length; i++) {
                    var Name = GetFileSize(files.Files[i]);
                    if (Name < this.maxUploadSize) {
                        var tempStore = this.grid_panel.getStore();
                        var guid = Math.random();
                        //添加到附件临时表中
                        tempStore.add(new Ext.ux.GTPFileAttachmentPanel.FileRecord({
                            Guid: guid,
                            state: Ext.ux.GTPFileAttachmentPanel.FileRecord.STATE_QUEUE,
                            FileName: GetFileExtension(files.Files[i]),
                            FileSize: GetFileSize(files.Files[i]),
                            FilePath: files.Files[i],
                            FileID: -1,
                            FileDesc: "",
                            FileFlag: "",
                            ViewGUID: "",
                            EditGUID: ""
                        }));
                    }
                    else {
                        Ext.Msg.alert("系统提示", "上传附件大小不能超过:" + Ext.util.Format.fileSize(this.maxUploadSize) + "");
                        // return false;
                    }
                }
            }
            //是否立即保存附件信息
            this.ImmediateSaveFile();
        }
    },
    //附件下载
    DownloadFile: function (file_records) {
        if (file_records.length == 0) {
            alert(res_messageDownLoad);
        }
        else {
            //选择保存路径
            var folderPath = GTPFileClient.ShellDialogSelectFolder(res_messageDownLoad, folder);
            if (folderPath != "") {
                var fileFlag = false;
                var fileIdList = "";
                var fileViewGuidList = "";
                var fileSaveToList = "";
                for (var i = 0; i < file_records.length; i++) {
                    if (file_records[i].data.FileID == -1) {
                        alert(res_messageDownLoadError);
                        fileFlag = true;
                    }
                    else {
                        if (i > 0) {
                            fileIdList += "|";
                            fileViewGuidList += "|";
                            fileSaveToList += "|";
                        }
                        fileIdList += file_records[i].data.FileID;
                        fileViewGuidList += file_records[i].data.ViewGUID;
                        var folder = folderPath + "\\";
                        fileSaveToList += folder + file_records[i].data.FileName;
                    }
                }
                if (!fileFlag) {
                    //支持多个附件下载
                    var result = GTPFileClient.FileClientDownload(fileIdList, fileViewGuidList, fileSaveToList);
                }
            }
        }

    },
    //打开附件
    ViewFile: function (file_records) {
        if (file_records.length == 0) {
            alert(res_messageView);
            return;
        }
        //一次只能打开一个附件
        if (file_records.length > 1) {
            alert(res_messageViewError);
            return;
        }
        else {
            //直接打开客户端附件
            if (file_records[0].data.FileID == -1) {
                var fileName = file_records[0].data.FilePath;
                GTPFileClient.ShellExecute(fileName);
            }
            //从服务器端下载附件到本地后，打开附件
            else {
                if (file_records[0].data.FileSize < this.maxDownloadSize) {
                    var LocalTempDir = GTPFileClient.ShellGetLocalTempDir();
                    LocalTempDir = LocalTempDir + "\\" + file_records[0].data.FileName;
                    var result = GTPFileClient.FileClientDownload(file_records[0].data.FileID, file_records[0].data.ViewGUID, LocalTempDir);
                    GTPFileClient.ShellExecute(LocalTempDir);
                }
                else {
                    Ext.Msg.alert("系统提示", "打开附件大小不能大于" + Ext.util.Format.fileSize(this.maxDownloadSize) + "，请下载后打开。");
                }
            }
        }
    },
    //删除附件
    RemoveFile: function (file_records) {
        if (file_records.length == 0) {
            alert(res_messageRemove);
        }
        else {
            var GTPFileAttachmentPanel = this;
            var delIds = "";
            Ext.MessageBox.confirm(res_confirmOk, res_confirmDelAllFile, function (btn) {
                if (btn == 'yes') {
                    var tempStore = GTPFileAttachmentPanel.grid_panel.getStore();
                    for (var i = 0, len = file_records.length; i < len; i++) {
                        var r = file_records[i];
                        if (file_records[i].data.FileID != -1) {
                            //将历史附件记录添加到，临时附件删除表中（准备删除历史附件记录）
                            this.HistoryStore.add(new HistoryRecord({
                                FileID: file_records[i].data.FileID,
                                FileName: file_records[i].data.FileName,
                                ViewGUID: file_records[i].data.ViewGUID,
                                EditGUID: file_records[i].data.EditGUID
                            }));
                        }
                        tempStore.remove(r);
                    }
                    //是否；立即保存附件
                    GTPFileAttachmentPanel.ImmediateSaveFile();
                }

            });
        }
    },

    //*******************************修改文件附件备注信息************************************//
    //打开修改附件备注子页面
    OpenNoteWin: function (r) {
        //文件数据（一行）解密 ----当数据列信息中有空格或者特殊字符时文本信息丢失的情况
        var attachmentPanel = this;
        r = Ext.decode(Decrypt(r));
        var items = [];
        items.push({ fieldLabel: res_labelFileName, xtype: 'textfield', name: 'FileName', width: 350, readOnly: true, value: r.FileName });
        items.push({ fieldLabel: res_labelFileDesc, id: 'textFileDesc', xtype: 'textarea', name: 'FileDesc', width: 350, height: 160, value: r.FileDesc, listeners: { 'change': function () { ValidByteLength(); } } });

        //创建附件信息面板
        var IsDescPanel = new Ext.form.FormPanel({
            labelAlign: 'left',
            hideLabel: false,
            top: 360,
            labelWidth: 80,
            layout: 'anchor',
            items: [{
                layout: 'form',
                frame: true,
                xtype: 'fieldset',
                title: '',
                items: items
            }]
        });

        //验证附件备注信息，不能超过255个字符。
        var ValidByteLength = function () {
            var isString = Ext.getCmp("textFileDesc").getValue()
            var cArr = isString.match(/[^\x00-\xff]/ig);
            var strLength = isString.length + (cArr == null ? 0 : cArr.length);
            if (strLength > 255) {
                alert(res_fileMaxLength);
                return false;
            }
            else
                return true;
        };

        //创建附件备注页面
        var CreateNoteWin = new Ext.Window({
            title: res_winNoteTitle,
            width: 480,
            height: 280,
            modal: true,            //重置大小   
            resizable: false,            //当关闭按钮被点击时执行的动作     
            buttonAlign: "center",
            items: [IsDescPanel],
            buttons:
            [{ text: res_btnOK, handler: function () { ModifyFileDesc(attachmentPanel); attachmentPanel.ImmediateSaveFile(); } },
             { text: res_btnClose, handler: function () { CreateNoteWin.close(); } }]
        });
        //打开文件信息页面
        CreateNoteWin.show();

        //获取附件行数据，修改备注信息 FileFlag：2 表示已上传到文件服务器附件的备注被修改；
        var ModifyFileDesc = function (attachmentPanel) {
            if (ValidByteLength()) {
                var tempStore = attachmentPanel.grid_panel.getSelectionModel().getSelections();
                var recordData = tempStore[0];
                recordData.set('FileDesc', Ext.getCmp("textFileDesc").getValue());
                recordData.set('FileFlag', "2");
                recordData.commit();
                attachmentPanel.isModify = true; //添加附件信息是否被修改过；
                CreateNoteWin.close();
            }
        };
    },
    //*******************************修改文件附件备注信息************************************//
    //---------------------------------------------------------------------------------------//
    //*******************************上传附件信息****************************************//
    //上传附件成功后更新附件信息Stroe
    UpDateStroe: function (recordData, fileItem) {
        recordData.set('FileName', fileItem.FileName);
        recordData.set('FileSize', fileItem.FileSize);
        recordData.set('FileFlag', 0);
        recordData.set('FileID', fileItem.FileID);
        recordData.set('fileDesc', fileItem.FileDesc);
        recordData.set('EditGUID', fileItem.EditGuid);
        recordData.set('ViewGUID', fileItem.ViewGuid);
        recordData.commit();
    },

    //附件信息成功提交服务器后，更新Stroe，更新grid_panel显示
    UpDateState: function (store, fileID) {
        var tempStore = store.query("FileID", fileID);
        var recordData = tempStore.items[0];
        recordData.set('state', 1);
        recordData.commit();
    },

    //修改附件标题信息（附件个数，大小）
    ModifyPanelTitle: function () {
        var GTPFileAttachmentPanel = this;
        var tempStore = GTPFileAttachmentPanel.grid_panel.getStore();
        if (tempStore.data.length > 0) {
            var fileCount = tempStore.data.length;
            var fileLength = 0;
            for (var i = 0; i < tempStore.data.length; i++) {
                var fileSize = tempStore.data.items[i].data.FileSize;
                fileLength += parseInt(fileSize);
            }
            GTPFileAttachmentPanel.setTitle(res_panelTitle + "（" + fileCount + res_fileCount + "  ,   " + Ext.util.Format.fileSize(fileLength) + "）");
        }
        else {
            GTPFileAttachmentPanel.setTitle(res_panelTitle);
        }
    },
    //生成临时 TableKey (由服务器端生成 Guid)
    GetFileAttachmentTableKey: function () {
        if (Ext.isEmpty(this.tableKey)) {
            var retTableKey = CreateFileAttachmentKey();
            if (!Ext.isEmpty(retTableKey)) {
                this.tableKey = retTableKey;
            }
        }
    },


    //是否是立即保存
    ImmediateSaveFile: function () {
        if (this.immediate) {
            this.SaveFile();
        }
    },

    //保存附件信息
    SaveFile: function () {
        var ret = true;
        var GTPFileAttachmentPanel = this;
        var store = GTPFileAttachmentPanel.grid_panel.getStore();
        var filePath = "";
        var filedesc = "";
        var result = "";
        //获取要保存到服务器的附件
        var tempStore = store.query("FileID", "-1");
        for (var i = 0; i < tempStore.items.length; i++) {
            if (tempStore.items[i].data.FileID == -1) {
                if (i > 0) {
                    filePath += "|";
                    filedesc += "|";
                }
                filePath += tempStore.items[i].data.FilePath;
                filedesc += tempStore.items[i].data.FileDesc;
            }
        }
        //上传到文件服务器
        try {
            if (tempStore.items.length > 0) {
                GTPFileClient.FileClientSetOptionSilent(false);
                result = GTPFileClient.FileClientUpload(filePath, null, null, null, GTPFileAttachmentPanel.appNamespace, filedesc, null, null);
                /**************保存上传成功的附件信息到数据库**************/
                for (var i = 0; i < result.Files.length; i++) {
                    GTPFileAttachmentPanel.UpDateStroe(tempStore.items[i], result.Files[i]);
                    //将上传成功的附件信息，保存到数据库服务器
                    var obj = AddFileAttachment(result.Files[i].FileID, result.Files[i].ViewGuid, result.Files[i].EditGuid, result.Files[i].FileName,
                result.Files[i].FileSize, result.Files[i].FileDesc, GTPFileAttachmentPanel.tableName, GTPFileAttachmentPanel.tableKey,
                GTPFileAttachmentPanel.appNamespace);
                    if (obj) {
                        GTPFileAttachmentPanel.UpDateState(store, result.Files[i].FileID);
                        GTPFileAttachmentPanel.ModifyPanelTitle();
                    }
                    else
                        ret = false;
                }
                /**************保存上传成功的附件信息到数据库**************/
                /*********************************************************/
                /*****************删除被取消的附件数据********************/
                var totalCount = result.TotalCount;
                var completedCount = result.CompletedCount;
                for (var z = completedCount; z < totalCount; z++) {
                    this.DeleteGTPFileStore(tempStore.items[z].data.Guid);
                }
                /*****************删除被取消的附件数据********************/

            }
            //更新附件备注信息
            ret = this.ModifyFileNote(store, GTPFileAttachmentPanel);
            //删除文件服务器附件信息（假删除），从T_FS_FILE_RELATION 删除附件记录
            ret = this.DeleteFile(GTPFileAttachmentPanel);
            //清空临时数据
            HistoryStore.removeAll();
        } catch (e) {
            GetClientConnect();
        }
        return ret;
    },

    //删除时间Store 记录
    DeleteGTPFileStore: function (guid) {
        var GTPFileAttachmentPanel = this;
        var store = GTPFileAttachmentPanel.grid_panel.getStore();
        store.each(function (rec) {
            if (rec.data.Guid == guid) {
                store.remove(rec);
            }
        });
    },

    //*******************************上传附件信息****************************************//
    //---------------------------------------------------------------------------------------//
    //*******************************更新附件备注信息****************************************//
    ModifyFileNote: function (store, Upload) {
        var ret = true;
        var tempStore = store.query("FileFlag", "2");
        for (var i = 0; i < tempStore.items.length; i++) {
            var obj = UpdateFileAttachmentNote(tempStore.items[i].data.FileID, tempStore.items[i].data.FileDesc, Upload.tableName, Upload.tableKey);
            if (obj) {
                Upload.ModifyPanelTitle();
            }
            else
                ret = false;
        }
        return ret;
    },
    //更新TableKey (tempTableKey --->  tableKey  )
    UpdateFileAttachmentKey: function (tableName, tempTableKey, tableKey) {
        var obj = UpdateFileAttachmentKey(tableName, tempTableKey, tableKey);
        return obj;
    },
    //执行附件删除操作
    DeleteFile: function (Upload) {
        var ret = true;
        var fileIdList = "";
        var fileNameList = "";
        var fileEditGuidList = "";
        var store = HistoryStore;
        for (var i = 0; i < store.data.items.length; i++) {
            if (i > 0) {
                fileIdList += "|";
                fileNameList += "|";
                fileEditGuidList += "|";
            }
            fileIdList += store.data.items[i].data.FileID;
            fileNameList += store.data.items[i].data.FileName;
            fileEditGuidList += store.data.items[i].data.EditGUID;
        }
        //删除附件信息（服务器端控制是否物理删除文件，现在为假删除 Deleted=1）
        var result = GTPFileClient.FileClientDelete(fileIdList, fileEditGuidList, fileNameList);
        for (var i = 0; i < result.Files.length; i++) {
            //删除用户附件关联记录（表：T_FS_ATTACHMENT）
            var obj = DeleteFileAttachment(result.Files[i].FileID, Upload.tableName, Upload.tableKey);
            if (obj) {
                //删除成功后刷新标题信息
                Upload.ModifyPanelTitle();
            }
            else
                ret = false;
        }
        return ret;
    },
    //*******************************更新附件备注信息****************************************//

    FireFileRemoveEvent: function (file_records) {
        for (var i = 0, len = file_records.length; i < len; i++) {
            this.fireEvent("fileremove", this, file_records[i].get("FileName"))
        }
    },
    FlushEventQueue: function () {
        this.fsa.FlushEventQueue()
    },
    OnWindowRender: function () {
        this.fsa.postEvent("window-render")
    },
    OnWindowBeforeHide: function () {
        return this.IsUploading() ? this.GetAllowCloseOnUpload() : true
    },
    OnWindowDestroy: function () {
        this.fsa.postEvent("destroy")
    },
    OnGridRender: function () {
        this.fsa.postEvent("grid-render")
    },
    OnGridSelectionChange: function () {
        this.fsa.postEvent("grid-selection-change")
    },
    OnAddButtonFileSelected: function (btn) {
        this.fsa.postEvent("file-selected", btn)
    },
    OnRemoveButtonClick: function () {
        var selections = this.grid_panel.getSelectionModel().getSelections();
        this.fsa.postEvent("remove-files", selections)
    },
    OnDownloadButtonClick: function () {
        var selections = this.grid_panel.getSelectionModel().getSelections();
        this.fsa.postEvent("download-files", selections)
    },
    OnViewButtonClick: function () {
        var selections = this.grid_panel.getSelectionModel().getSelections();
        this.fsa.postEvent("view-files", selections)
    },
    OnSaveButtonClick: function () {
        this.fsa.postEvent("save-files")
    },
    GetAllowCloseOnUpload: function () {
        return this.allow_close_on_upload
    },
    IsUploading: function () {
        return this.is_uploading
    }

});

//---------------------------------------------------------------------------------------//
//***************************** 创建删除文件临时表*********************************//
var HistoryRecord = Ext.data.Record.create([{
    name: "FileID"
}, {
    name: "FileName"
}, {
    name: "ViewGUID"
}, {
    name: "EditGUID"
}]);

var data = "";
var HistoryStore = new Ext.data.Store({
    proxy: new Ext.data.MemoryProxy(data),
    reader: new Ext.data.ArrayReader({}, HistoryRecord)
});
//***************************** 创建删除文件临时表*********************************//


////*******************************************************************************//
//****************Ext.ux.GTPFileAttachmentPanel组件******************************//
//*******************************************************************************//

//-------------------------------------------------------------------------------//

//*******************************************************************************//
//****************Ext.ux.GTPFileAttachment组件***********************************//
//*******************************************************************************//

Ext.namespace("Ext.ux.GTPFileAttachment");
Ext.ux.GTPFileAttachment.FileRecord = Ext.data.Record.create([{
    name: "FileID"      //附件记录ID
}, {
    name: "FileName"    //附件名称
}, {
    name: "State",      //附件状态
    type: "int"
}, {
    name: "FileFlag"    //附件标示
}, {
    name: "FileSize"    //附件大小
}, {
    name: "FilePath"    //附件路径
}, {
    name: "FileDesc"    //附件备注
}, {
    name: "ViewGUID"    //查看权限码
}, {
    name: "EditGUID"    //编辑权限码
}]);




//配置项
Ext.ux.GTPFileAttachment.Dialog = function (config) {
    var default_config = {
        collapsible: true, // 可折叠
        collapsed: true,
        autoWidth: true,
        height: 150,
        id: 'GTPFileAttachment' + Ext.id(), //Panel id上传控件的唯一ID，（请不要随便更改）
        //minWidth: 700,
        minHeight: 150,
        title: res_panelTitle,     //文件上传页名称
        closeAction: "hide",
        frame: true,
        tableName: "",     //相关业务的表名
        tableKey: "",      //相关业务的表Key
        appNamespace: "",    //相关业务的命名空间
        fileStatus: true,  // fileStatus true:编辑附件（添加，删除，下载，浏览）功能，false：查看状态（下载，浏览）功能
        saveBtnShow: true, //保存附件按钮 true：表示显示; false:表示隐藏保存按钮：默认为true
        immediate: true,   //附件保存方式 true：表示立即保存；false:为点击保存按钮才上传附件到服务器
        isModify: false,          //附件是否被编辑过；true:已编辑；false:未编辑；
        showTitle: true,    //是否显示附件标题；
        downBtnShow: true, //全部下载按钮是否显示 downBtnShow：true 表示显示；false 表示隐藏
        fileTitle: "",         //文件对话框中 初始的文件名
        DefaultExt: "",        //默认文件扩展名
        filters: "",           //设置附件选择类型；如：压缩(*.rar)|*.rar|图片(*.jpg:*.bmp:*.jpeg:*.png)|*.jpg;*.bmp;*.jpeg;*.png|所有文件(*.*)|*.*
        filterIndex: 0,        //"文件类型"组合框中当前选中的文件过滤器的索引, 第一个文件过滤器索引值是1.比如 FileDialog.Filter = "Text files(*.txt)|*.txt|One filter(*.hhh)|*.hhh|All Files(*.*)|*.*",那么如果你的FilterIndex=2,那么你的文件对话框"文件类型"组合框就是"One filter(*.hhh)" 
        initialDir: "",        //打开附件的磁盘目录； 如：C:\
        multiSelect: true,     //打开选择文件对话框时是否可以选择多个附件，true:多选；false:单选；默认true
        maxUploadSize: 2097152000,   //上传附件限制默认最大值；
        maxDownloadSize: 524288000,   //超500M文件不能直接打开 
        tbar: [{
            text: res_btnAllDownLoadtext,
            iconCls: "ext-ux-uploaddialog-downloadbtn",
            name: "btnDownAllFile",
            handler: function () { this.DownloadAllFile(); },
            scope: this
        }, {
            text: res_btnSavefile,
            iconCls: "ext-ux-uploaddialog-save",
            name: "btnFileSave",
            handler: function () {
                this.SaveFile();
                this.LoadFileData();
            },
            scope: this
        }]
    };
    config = Ext.applyIf(config || {}, default_config);
    config.layout = "absolute";
    Ext.ux.GTPFileAttachment.Dialog.superclass.constructor.call(this, config)
};

Ext.extend(Ext.ux.GTPFileAttachment.Dialog, Ext.Panel, {
    //初始化附件
    initComponent: function () {
        Ext.ux.GTPFileAttachment.Dialog.superclass.initComponent.call(this);
        this.maxUploadSize = GTPFileClient.GetFileLimitMaxSize("GTP.Services.FileService", "DefaultUploadMaxFileSize");
        this.maxDownloadSize = GTPFileClient.GetFileLimitMaxSize("GTP.Services.FileService", "DefaultDownloadMaxFileSize");
        this.GetFileAttachmentTableKey();
        this.GTPFileStore = new Ext.data.Store({ reader: new Ext.data.JsonReader({ totalProperty: 'total', root: 'root' }, Ext.ux.GTPFileAttachment.FileRecord) });
        //Div容器中显示附件表格信息,所有添加，删除附件信息以TR的方式显示
        this.html = "<div id=" + this.GetTagName("mapDiv", this) + "  style=\"overflow-x:auto;overflow-y:auto; height: 150px\" ><div><table><tbody id=" + this.GetTagName("tbFile", this) + ">" + this.LoadGtpAttachmentFileData(); +"</tbody></table></div></div>"
        this.SetToolbarHidden();
    },

    SetToolbarHidden: function () {
        if (this.saveBtnShow && this.downBtnShow) {
            this.toolbars[0].show();
        }
        else if (!this.saveBtnShow && !this.downBtnShow) {
            this.toolbars[0].hide();
        }

        else {
            this.SaveButtonShow();
            this.DownButtonShow();
        }
    },

    // 附件保存按钮是否显示 saveBtnShow：true 表示显示；false 表示隐藏
    SaveButtonShow: function () {
        if (this.toolbars[0].hidden)
            if (this.saveBtnShow) {
                this.toolbars[0].items.items[0].show();
            }
            else {
                this.toolbars[0].items.items[0].hide();
            }
    },

    //全部下载按钮是否显示 downBtnShow：true 表示显示；false 表示隐藏
    DownButtonShow: function () {
        if (this.downBtnShow) {
            this.toolbars[0].items.items[1].show();
        }
        else {
            this.toolbars[0].items.items[1].hide();
        }
    },
    GetTagName: function (element, gtpAttach) {
        var mapDiv = element + gtpAttach.id;
        return mapDiv;
    },

    //设置附件Div的高度
    SetHeight: function () {
        if (!Ext.isEmpty(this.height)) {
            Ext.getDom(this.GetTagName("mapDiv", this)).style.height = this.height;
        }
    },

    //生成临时 TableKey (由服务器端生成 Guid)
    GetFileAttachmentTableKey: function () {
        if (Ext.isEmpty(this.tableKey)) {
            var retTableKey = CreateFileAttachmentKey();
            if (!Ext.isEmpty(retTableKey)) {
                this.tableKey = retTableKey;
            }
        }
    },

    //更新TableKey (tempTableKey --->  tableKey  )
    UpdateFileAttachmentKey: function (tableName, tempTableKey, tableKey) {
        var obj = UpdateFileAttachmentKey(tableName, tempTableKey, tableKey);
        return obj;
    },


    //加载历史附件 
    LoadGtpAttachmentFileData: function () {
        var GTPFileAttachment = this;
        var TempAttachmentHtml = "";
        this.GTPFileStore.removeAll();
        var attachList = GTPFileClient.GetFileAttachmentList(this.tableName, this.tableKey);
        var fileLength = 0;
        for (var i = 0; i < attachList.Items.length; i++) {
            attach = attachList.Items[i];
            this.GTPFileStore.add(new Ext.ux.GTPFileAttachment.FileRecord({
                State: "0",
                FileName: attach.FileName,
                FileSize: attach.FileSize,
                FilePath: "",
                FileID: attach.FileID,
                FileDesc: attach.FileDesc,
                FileFlag: "",
                ViewGUID: attach.ViewGUID,
                EditGUID: attach.EditGUID
            }));
            fileLength += parseInt(attach.FileSize);
            var r = Encrypt(Ext.encode(attach));
            TempAttachmentHtml += GTPFileAttachment.CreateHistoryFile(r);
        }
        if (GTPFileAttachment.showTitle) {
            var fileCount = this.GTPFileStore.data.length;
            if (fileCount > 0)
                GTPFileAttachment.setTitle(res_panelTitle + "（" + fileCount + res_fileCount + "  ," + Ext.util.Format.fileSize(fileLength) + "）");
            else
                GTPFileAttachment.setTitle(res_panelTitle);
        }
        return TempAttachmentHtml;
    },
    LoadFileData: function () {
        //删除Html页面表格记录（tr）
        var tbody = Ext.getDom(this.GetTagName("tbFile", this));
        var trObj = "";
        if (!Ext.isEmpty(tbody)) {
            for (var i = 0; i <= tbody.children.length; i++) {
                i = 0;
                trObj = tbody.children[i];
                if (trObj != undefined) {
                    tbody.removeChild(trObj);
                }
            }
        }
        var TempAttachmentHtml = this.LoadGtpAttachmentFileData();
        if (!Ext.isEmpty(TempAttachmentHtml))
            Ext.DomHelper.append(tbody, TempAttachmentHtml);
    },


    //画附件Table  TR
    CreateHistoryFile: function (r) {
        var file = Ext.decode(Decrypt(r));
        var GtpObj = this.id;
        var isAppend = "";
        var isNbsp = "&nbsp;&nbsp;&nbsp;&nbsp;";
        var lableStyle = "style='text-decoration: underline;cursor:pointer; color: #15428b;'";
        var spanStyle = "&nbsp;<span style=\"color: #a0a0a0;font-weight: normal; font-size: 12px; font-family: 'lucida Grande',Verdana\">(" + Ext.util.Format.fileSize(file.FileSize) + ")";
        var isImgFile = "<img  src='/../Services/FileService/images/check.gif' />&nbsp;&nbsp;&nbsp;" + file.FileName + spanStyle + isNbsp + "";
        var isView = "  <label " + lableStyle + "  onclick=Ext.getCmp('" + this.id + "').ViewFile(\"" + r + "\") >" + res_btnOpen + "</label>";
        var isDownload = "  <label " + lableStyle + " onclick=Ext.getCmp('" + this.id + "').DownloadFile(\"" + r + "\") >" + res_btnDownLoad + "</label>" + isNbsp + "";
        var isDelete = "  <label  " + lableStyle + " onclick=Ext.getCmp('" + this.id + "').DeleteFile(\"" + GtpObj + "\"," + file.FileID + ")  >" + res_btnDelete + "</label>" + isNbsp + "";
        if (this.fileStatus)
            isAppend = isImgFile + isDelete + isDownload + isView;
        else
            isAppend = isImgFile + isDownload + isView;
        var htmText = "<tr id=" + file.FileID + "><td> " + isAppend + "</td><td></td></tr>";
        return htmText;
    },


    //画附件Table  TR
    LoadHistoryFile: function (r) {
        var htmText = this.CreateHistoryFile(r);
        var tbodyFile = Ext.getDom(this.GetTagName("tbFile", this));
        if (!Ext.isEmpty(htmText))
            Ext.DomHelper.append(tbodyFile, htmText);
        this.expand();
    },

    //从 Panel 删除附件
    DeleteFile: function (obj, td) {
        var GtpAtt = Ext.getCmp(obj);
        var tbody = Ext.getDom(this.GetTagName("tbFile", GtpAtt));
        var tr = Ext.getDom(td.toString());
        tbody.removeChild(tr);
        GtpAtt.GTPFileStore.each(function (rec) {
            var tt = rec;
            if (rec.data.State == tr.id || rec.data.FileID == tr.id) {
                if (rec.data.FileID != -1) {
                    //将历史附件记录添加到，临时附件删除表中（准备删除历史附件记录）
                    DeleteStore.add(new DeleteDataRecord({
                        FileID: rec.data.FileID,
                        FileName: rec.data.FileName,
                        ViewGUID: rec.data.ViewGUID,
                        EditGUID: rec.data.EditGUID
                    }));
                }
                //从临时表中删除附件记录
                GtpAtt.GTPFileStore.remove(rec);
                //是否立即保存附件信息
                GtpAtt.ImmediateSaveFile();
                GtpAtt.isModify = true;
            }
        });
        if (tbody.rows.length == 0)
            this.CollapsePanel();
    },

    //将附件信息转载到Table中
    AddFileToPanel: function (fileName, id, size) {
        var GtpObj = this.id;
        var isNbsp = "&nbsp;&nbsp;&nbsp;&nbsp;";
        var spanStyle = "&nbsp;<span style=\"color: #a0a0a0;font-weight: normal; font-size: 12px; font-family: 'lucida Grande',Verdana\">(" + Ext.util.Format.fileSize(size) + ")</span>";
        var isImgFile = "<img  src='/../Services/FileService/images/uncheck.png' />&nbsp;&nbsp;&nbsp;<font style='text-decoration: underline; font-style: oblique;'>" + fileName + "</font>" + spanStyle + isNbsp + "";
        var isDelete = "    <label style='text-decoration: underline;color: #15428b;cursor:pointer; font-size: 12px' onclick=Ext.getCmp('" + GtpObj + "').DeleteFile(\"" + GtpObj + "\"," + id + ")>" + res_btnDelete + "</label>" + isNbsp + "";
        var htmText = "<tr id=" + id + "><td>" + isImgFile + isDelete + "</td></tr>";
        var tbodyFile = Ext.getDom(this.GetTagName("tbFile", this));
        Ext.DomHelper.append(tbodyFile, htmText);
    },

    //展开面板
    ExpandPanel: function () {
        this.expand();

    },

    //收缩面板
    CollapsePanel: function () {
        this.collapse();
    },


    // 返回true:文件信息被编辑，false:未被编辑
    GetModifyFileFlag: function () {
        var hStore = DeleteStore.getModifiedRecords();
        if (!Ext.isEmpty(hStore))
            this.isModify = true;
        return this.isModify;
    },

    //选择客户端文件，加载到内存中View
    AddFile: function () {
        //选择附件（支持多选）
        var files = GTPFileClient.ShellDialogSelectFiles(this.fileTitle, this.DefaultExt, this.filters, this.filterIndex, this.initialDir, this.multiSelect);
        if (files) {
            if (files.Result) {
                for (var i = 0; i < files.Files.length; i++) {
                    var name = GetFileExtension(files.Files[i]);
                    var size = GetFileSize(files.Files[i]);
                    if (size < this.maxUploadSize) {
                        var state = Math.random();
                        //添加到附件临时表中
                        this.GTPFileStore.add(new Ext.ux.GTPFileAttachment.FileRecord({
                            State: state,
                            FileName: name,
                            FileSize: size,
                            FilePath: files.Files[i],
                            FileID: -1,
                            FileDesc: "",
                            FileFlag: "",
                            ViewGUID: "",
                            EditGUID: ""
                        }));
                        //组成Html标记块，添加到面板中
                        this.AddFileToPanel(name, state, size);
                    }
                    else {
                        Ext.Msg.alert("系统提示", "上传附件大小不能超过:" + Ext.util.Format.fileSize(this.maxUploadSize) + "");
                        //   return false;
                    }
                }
                //是否立即保存附件信息
                this.ImmediateSaveFile();
                this.isModify = true;
                //展开面板
                this.ExpandPanel();
            }
        }
    },

    //下载附件
    DownloadFile: function (r) {
        try {
            var file = Ext.decode(Decrypt(r));
            var folderPath = GTPFileClient.ShellDialogSelectFolder(res_messageDownLoad, folder);
            if (folderPath != "") {
                var fileSaveToList = "";
                var folder = folderPath + "\\";
                fileSaveToList += folder + file.FileName;
                GTPFileClient.FileClientSetOptionSilent(false);
                var result = GTPFileClient.FileClientDownload(file.FileID, file.ViewGUID, fileSaveToList);
            }
        } catch (e) {
            GetClientConnect();
        }
    },

    DownloadAllFile: function () {
        try {
            var folderPath = GTPFileClient.ShellDialogSelectFolder(res_messageDownLoad, folder);
            if (folderPath != "") {
                var fileFlag = false;
                var fileIdList = "";
                var fileViewGuidList = "";
                var fileSaveToList = "";
                var tempStroe = this.GTPFileStore.query("State", 0);
                for (var i = 0; i < tempStroe.items.length; i++) {
                    if (i > 0) {
                        fileIdList += "|";
                        fileViewGuidList += "|";
                        fileSaveToList += "|";
                    }
                    fileIdList += tempStroe.items[i].data.FileID;
                    fileViewGuidList += tempStroe.items[i].data.ViewGUID;
                    var folder = folderPath + "\\";
                    fileSaveToList += folder + tempStroe.items[i].data.FileName;
                }
                if (!fileFlag) {
                    GTPFileClient.FileClientSetOptionSilent(false);
                    var result = GTPFileClient.FileClientDownload(fileIdList, fileViewGuidList, fileSaveToList);
                }
            }
        }
        catch (e) {
            GetClientConnect();
        }
    },

    //打开附件
    ViewFile: function (r) {
        try {
            var file = Ext.decode(Decrypt(r));
            if (file.FileSize < this.maxDownloadSize) {
                var LocalTempDir = GTPFileClient.ShellGetLocalTempDir();
                LocalTempDir = LocalTempDir + "\\" + file.FileName;
                GTPFileClient.FileClientSetOptionSilent(false);
                var result = GTPFileClient.FileClientDownload(file.FileID, file.ViewGUID, LocalTempDir);
                GTPFileClient.ShellExecute(LocalTempDir);
            }
            else {
                Ext.Msg.alert("系统提示", "打开附件大小不能大于" + Ext.util.Format.fileSize(this.maxDownloadSize) + "，请下载后打开。");
            }
        }
        catch (e) {
            GetClientConnect();
        }
    },

    //上传附件时突然停止上传，将没有完成上传的附件从临时表中删除Store 记录
    DeleteGTPFileStore: function (guid) {
        //删除临时表中的记录
        this.GTPFileStore.each(function (rec) {
            if (rec.data.State == guid) {
                if (this.store)
                    this.store.remove(rec);
            }
        });
        //删除Html页面表格记录（tr）
        var tbFile = "tbFile" + this.id;
        var tbody = Ext.getDom(tbFile);
        var trObj = "";
        if (!Ext.isEmpty(tbody)) {
            for (var i = 0; i <= tbody.children.length; i++) {
                trObj = tbody.children[i];
                if (trObj != undefined) {
                    if (trObj.id == guid) {
                        tbody.removeChild(trObj);
                    }
                }
            }
        }
    },

    //是否是立即保存
    ImmediateSaveFile: function () {
        if (this.immediate) {
            this.SaveFile();
        }
    },

    //将文件上传到文件服务器，上传成功后将数据保存到服务器端（删除附件 + 上传附件）
    SaveFile: function () {

        /********************获取将要上传到文件服务器的附件数据*********************/
        var ret = true;
        var filePath = "";
        var filedesc = "";
        var result = "";
        var tempStroe = this.GTPFileStore.query("FileID", "-1");
        for (var i = 0; i < tempStroe.items.length; i++) {
            if (tempStroe.items[i].data.FileID == -1) {
                if (i > 0) {
                    filePath += "|";
                    filedesc += "|";
                }
                filePath += tempStroe.items[i].data.FilePath;
                filedesc += tempStroe.items[i].data.FileDesc;
            }
        }
        /********************获取将要上传到文件服务器的附件数据*********************/
        try {
            var GTPFileAttachment = this;
            if (tempStroe.items.length > 0) {
                GTPFileClient.FileClientSetOptionSilent(false);
                result = GTPFileClient.FileClientUpload(filePath, null, null, null, filedesc, GTPFileAttachment.appNamespace, null, true);
                /**************保存上传成功的附件信息到数据库**************/
                for (var i = 0; i < result.Files.length; i++) {
                    var obj = AddFileAttachment(result.Files[i].FileID, result.Files[i].ViewGuid, result.Files[i].EditGuid, result.Files[i].FileName,
                    result.Files[i].FileSize, result.Files[i].FileDesc, GTPFileAttachment.tableName, GTPFileAttachment.tableKey,
                    GTPFileAttachment.appNamespace);
                    if (!obj)
                        ret = false;
                }
                //附件数据保存成功后刷新页面
                GTPFileAttachment.LoadFileData();
                /**************保存上传成功的附件信息到数据库**************/
                //---------------------------------------------------------/
                /*****************删除被取消的附件数据********************/
                var totalCount = result.TotalCount;
                var completedCount = result.CompletedCount;
                for (var z = completedCount; z < totalCount; z++) {
                    this.DeleteGTPFileStore(tempStroe.items[z].data.State);
                }
                /*****************删除被取消的附件数据********************/

            }
            ret = FileDelete(this);
        }
        catch (e) {
            ret = GetClientConnect();
        }
        return ret;
    }
});
//var p = Ext.ux.GTPFileAttachment.Dialog.prototype;

//***************************** 创建删除文件临时表*********************************//
var DeleteDataRecord = Ext.data.Record.create([{
    name: "FileID"
}, {
    name: "FileName"
}, {
    name: "ViewGUID"
}, {
    name: "EditGUID"
}]);

var data = "";
var DeleteStore = new Ext.data.Store({
    proxy: new Ext.data.MemoryProxy(data),
    reader: new Ext.data.ArrayReader({}, DeleteDataRecord)
});

//执行附件删除操作
var FileDelete = function (GTPFileAttachment) {
    var ret = true;
    var fileIdList = "";
    var fileNameList = "";
    var fileEditGuidList = "";
    var store = this.DeleteStore;
    for (var i = 0; i < store.data.items.length; i++) {
        if (i > 0) {
            fileIdList += "|";
            fileNameList += "|";
            fileEditGuidList += "|";
        }
        fileIdList += store.data.items[i].data.FileID;
        fileNameList += store.data.items[i].data.FileName;
        fileEditGuidList += store.data.items[i].data.EditGUID;
    }
    //删除附件信息（服务器端控制是否物理删除文件，现在为假删除 Deleted=1）
    var result = GTPFileClient.FileClientDelete(fileIdList, fileEditGuidList, fileNameList);
    for (var i = 0; i < result.Files.length; i++) {
        //删除用户附件关联记录（表：T_FS_ATTACHMENT）
        var obj = DeleteFileAttachment(result.Files[i].FileID, GTPFileAttachment.tableName, GTPFileAttachment.tableKey);
        if (!obj) {
            //刷新附件列表
            ret = false;
        }
    }
    GTPFileAttachment.LoadFileData();
    //清空附件临时表
    this.DeleteStore.removeAll();
    return ret;
}

//***************************** 创建删除文件临时表*********************************//
//*******************************************************************************//
//****************Ext.ux.GTPFileAttachment组件***********************************//
//*******************************************************************************//

//-------------------------------------------------------------------------------//

//*************************************************************************************//
//**************************附件公用方法***********************************************//
//*************************************************************************************//

var fsAjaxServerUrl = "Services/FileService/FsAjax.ashx";

//获取客户端附件大小
GetFileSize = function (file) {
    var result = GTPFileClient.ShellGetLocalFilesInfo(file);
    var iFilesize = result.Files[0].FileSize;
    return iFilesize;
};

//获取文件附件扩展名
GetFileExtension = function (filename) {
    var result = null;
    var parts = filename.split("\\");
    if (parts.length > 1) {
        filelength = parts.length - 1;
        result = parts[filelength];
    }
    return result
};

//保存附件信息
AddFileAttachment = function (fileID, viewGuid, editGuid, fileName, fileSize, fileDesc, tableName, tableKey, appNamespace) {
    var params = {};
    params.fileID = fileID;
    params.viewGuid = viewGuid;
    params.editGuid = editGuid;
    params.fileName = fileName;
    params.fileSize = fileSize;
    params.fileDesc = fileDesc;
    params.tableName = tableName;
    params.tableKey = tableKey;
    params.appNamespace = appNamespace;
    params.type = 1;
    var obj = AjaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    if (obj.success)
        return true
    else
        return false;
};

//删除附件
DeleteFileAttachment = function (fileID, tableName, tableKey) {
    var params = {};
    params.fileID = fileID;
    params.tableName = tableName;
    params.tableKey = tableKey;
    params.type = 3;
    var obj = AjaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    if (obj.success)
        return true
    else
        return false;
};

//更新附件备注信息
UpdateFileAttachmentNote = function (fileID, fileDesc, tableName, tableKey) {
    var params = {};
    params.fileID = fileID;
    params.fileDesc = fileDesc;
    params.tableName = tableName;
    params.tableKey = tableKey;
    params.type = 4;
    var obj = AjaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    if (obj.success)
        return true
    else
        return false;
};

//更新TableKey (tempTableKey --->  tableKey  )
UpdateFileAttachmentKey = function (tableName, tempTableKey, tableKey) {
    var params = {};
    params.tableName = tableName;
    params.tempTableKey = tempTableKey;
    params.tableKey = tableKey;
    params.type = 6;
    var obj = AjaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    if (obj.success)
        return true
    else
        return false;
};

//根据TableName,TableKey,获取相关业务附件信息
GetFileAttachmentList = function (tableName, tableKey) {
    var params = {};
    params.tableName = tableName;
    params.tableKey = tableKey;
    params.type = 2;
    var retObj = AjaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    //   Ext.util.JSON.encode(retObj);
    return retObj;
};

//创建临时TableKey
CreateFileAttachmentKey = function () {
    var params = {};
    params.type = 5;
    var NewTableKey = AjaxSyncCall(GTPFileClient.FsAjaxFullUrl, params);
    if (NewTableKey.success)
        return NewTableKey.Guid;
    else
        return "";
};

AjaxSyncCall = function (urlStr, paramsStr) {
    var obj;
    var value;
    var result;
    if (window.ActiveXObject) {
        obj = new ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    }
    try {
        obj.open('POST', urlStr, false);
        obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var p = Ext.urlEncode(paramsStr);
        obj.send(p);
        result = Ext.util.JSON.decode(obj.responseText);
    }
    catch (e) {
        GetClientConnect();
    }
    return result;
};

GetClientConnect = function () {
    var ret = GTPFileClient.FileClientConnect(GTPFileClient._fileServerGuid, GTPFileClient._fileServerUrl, "");
    if (!ret)
        alert("网络连接中断。");
    return ret;
};

//***************************** begin 字符串加密,解密*********************************//
//字符串加密
Encrypt = function (str, pwd) {
    if (str == "") return "";
    str = escape(str);
    if (!pwd || pwd == "") { var pwd = "1234"; }
    pwd = escape(pwd);
    if (pwd == null || pwd.length <= 0) {
        alert("Please enter a password with which to encrypt the message.");
        return null;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));

    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
        alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
        return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I++) {
        enc_chr = parseInt(str.charCodeAt(I) ^ Math.floor((prand / modu) * 255));
        if (enc_chr < 16) {
            enc_str += "0" + enc_chr.toString(16);
        } else
            enc_str += enc_chr.toString(16);
        prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) salt = "0" + salt;
    enc_str += salt;
    return enc_str;
};
//字符串解密
Decrypt = function (str, pwd) {
    if (str == "") return "";
    if (!pwd || pwd == "") { var pwd = "1234"; }
    pwd = escape(pwd);
    if (str == null || str.length < 8) {
        alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
        return;
    }
    if (pwd == null || pwd.length <= 0) {
        alert("Please enter a password with which to decrypt the message.");
        return;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I += 2) {
        enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
        enc_str += String.fromCharCode(enc_chr);
        prand = (mult * prand + incr) % modu;
    }
    return unescape(enc_str);
};
//***************************** end 字符串加密,解密*********************************//
//*************************************************************************************//
//**************************附件公用方法***********************************************//
//*************************************************************************************//
