/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />

(function () {
    Ext.ns("GB.LK.ODM.GWYY");
    var _class = Ext.extend(Gtp.net.BasePage,
	{

	    //[Start]
	    actSave_Handler: function (sender) {
	        ///<summary>保存:actSave</summary>
	        IWebOffice.WebSaveLocalFile(_this.LocalTempDictory + "\\" + $G.Params.fileName);
	    },
	    //[End]

	    //[Start]
	    actSaveClose_Handler: function (sender) {
	        ///<summary>保存:actSave</summary>
	        IWebOffice.WebSaveLocalFile(_this.LocalTempDictory + "\\" + $G.Params.fileName);
	        GTPWebOffice.Close();
	        $G.close(true);
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary
	        $G.close(true);
	    },
	    //[End]


	    //[Start]
	    actXSHJ_Handler: function () {
	        ///<summary>显示痕迹</summary>
	        GTPWebOffice.ShowRevisions();
	    },
	    //[End]

	    //[Start]
	    actYCHJ_Handler: function () {
	        ///<summary>隐藏痕迹</summary>
	        GTPWebOffice.HideRevisions();
	    },
	    //[End]

	    //[Start]
	    actWJLC_Handler: function () {
	        ///<summary>文件另存</summary>
	        GTPWebOffice.SaveToLocal();
	    },
	    //[End]

	    //[Start]
	    finishLoad: function () {
	        this.fileID = parseInt($G.Params.fileID);
	        this.historyId = parseInt($G.Params.historyId);
	        this.LocalTempDictory = GTPFileClient.ShellGetLocalTempDir();
	        IWebOffice.FileName = $G.Params.fileName;
	        IWebOffice.UserName = $G.Params.userName;
	        if ($G.Params.isHistory === "true") {
	            var LocalTempDir = this.LocalTempDictory + "\\" + this.fileID + "-" + $G.Params.fileName;
	            var result = GTPFileClient.FileClientDownload(this.fileID, $G.Params.ViewGUID, LocalTempDir);
	            if (result.Result != -2) {
	                GTPWebOffice.OpenLocalFileByName(LocalTempDir);
	            }
	            top.document.title = "查看历史-" + ($G.Params.redirect ? ("[" + $G.Params.operationUserName + "-" + $G.Params.operation + "]") : "") + $G.Params.fileName;
	            GTPWebOffice.SetEditType("-1,0,1,1,0,0,1,1");
	        } else {
	            GTPWebOffice.OpenLocalFileByName(this.LocalTempDictory + "\\" + $G.Params.fileName);
	            if ($G.Params.readOnly === "true") {
	                document.title = "查看-" + $G.Params.fileName;
	                GTPWebOffice.SetEditType("-1,2,0,0,0,0,0,0");
	            }
	            else if ($G.Params.isEdit === "true") {
	                document.title = "编辑-" + $G.Params.fileName;
	                GTPWebOffice.SetEditType("-1,0,0,1,0,0,1,1");
	            } else {
	                document.title = "查看-" + $G.Params.fileName;
	                GTPWebOffice.SetEditType("-1,0,1,1,0,0,1,1");
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _getFileHistory: function (attchmentId) {
	        var historyList = GTPFileClient.getFileHistory(attchmentId);
	        if (historyList.success) {
	            if (!this.historyListWindow) {
	                this.historyListWindow = new Ext.Window({
	                    closeAction: "hide",
	                    width: 600,
	                    height: 400,
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
	                this.cmp_content.on('rowclick', function (grid, rowIndex, e) {
	                    var rec = grid.store.getAt(rowIndex);
	                    if (rec.get("FileID") != this.fileID) { // 重命名没有更改FileID，所有视图上看起来不会重新打开文件
	                        //	                        this.fileID = rec.get("FileID");
	                        //	                        var LocalTempDir = this.LocalTempDictory + "\\" + this.fileID + "-" + rec.get("FileName");
	                        //	                        if (rec._isDownLoad === true) { // 已下载
	                        //	                            if (GTPWebOffice.OpenLocalFileByName(LocalTempDir) === false) {
	                        //	                                var result = GTPFileClient.FileClientDownload(rec.data.FileID, rec.data.ViewGUID, LocalTempDir);
	                        //	                                if (result.Result != -2) {
	                        //	                                    if (GTPWebOffice.OpenLocalFileByName(LocalTempDir) == true) {
	                        //	                                        rec._isDownLoad = true;
	                        //	                                    }
	                        //	                                }
	                        //	                            }
	                        //	                        } else { // 下载后打开
	                        //	                            var result = GTPFileClient.FileClientDownload(rec.data.FileID, rec.data.ViewGUID, LocalTempDir);
	                        //	                            if (result.Result != -2) {
	                        //	                                if (GTPWebOffice.OpenLocalFileByName(LocalTempDir) == true) {
	                        //	                                    rec._isDownLoad = true;
	                        //	                                }
	                        //	                            }
	                        //	                        }
	                        //var location = document.location;
	                        //self.location.href = Ext.urlAppend(location.protocol + "//" + location.host + location.pathname, Ext.urlEncode({
	                        window.location.search = Ext.urlAppend("", Ext.urlEncode({
	                            fileName: $G.Params.fileName,
	                            userName: $G.Params.userName,
	                            isHistory: true,
	                            fileID: rec.get("FileID"),
	                            id: $G.Params.id,
	                            historyId: rec.get("HistoryID"),
	                            ViewGUID: rec.get("ViewGUID"),
	                            _dc: new Date().getTime(),
	                            redirect: true,
	                            operationUserName: rec.get("UserName"),
	                            operation: ['上传', '删除', '修改', '重命名', '更改备注'][rec.get("Operation")] || ""
	                        }));
	                    }
	                    var operation = ['上传', '删除', '修改', '重命名', '更改备注'][rec.get("Operation")] || "";
	                    top.document.title = "查看历史-[" + rec.get("UserName") + "-" + operation + "]" + $G.Params.fileName;
	                    this.historyId = rec.get("HistoryID");
	                }, this);
	                this.historyListWindow.beforeShow = this.historyListWindow.beforeShow.createSequence(function () { // 不添加遮罩iframe
	                    if (maskIFramePluginControl)
	                        maskIFramePluginControl(false);
	                });
	                this.cmp_content.getView().on("refresh", function (view) {
	                    var recIndex = this.cmp_content.store.indexOfId(this.historyId);
	                    this.cmp_content.selModel.selectRow(recIndex);
	                    this.cmp_content.store.getAt(recIndex)._isDownLoad = true;
	                }, this);
	                this.cmp_content.on("viewready", function (grid) {
	                    var recIndex = grid.store.indexOfId(this.historyId);
	                    grid.selModel.selectRow(recIndex);
	                    grid.store.getAt(recIndex)._isDownLoad = true;
	                }, this);
	            }
	            this.historyListWindow.setTitle("附件修改历史-" + (historyList.Items[0] ? historyList.Items[0].FileName : ""));
	            this.cmp_content.store.loadData(historyList.Items);
	            this.historyListWindow.show();
	        }
	    },
	    //[End]

	    //[Start]
	    getContent: function () {
	        var recordType = Ext.data.Record.create(['HistoryID', 'FileID', 'ViewGUID', 'FileName', 'FileSize', 'UserName', 'Operation', { name: 'OperationTime', type: 'date'}]),
            store = new Ext.data.Store({
                reader: new Ext.data.JsonReader({ idProperty: 'HistoryID' }, recordType)
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
	    //[End]

	    //[Start]
	    initData: function (IsSuccess, IWebOffice) {
	        if (IsSuccess) {
	            $G.Page.IsSuccess = true;

	            $G.Page.finishLoad();
	        }
	    },
	    //[End]

	    //[Start]
	    GWZWPage_DocumentReady: function () {
	        ///<summary>DocumentReady</summary>
	        Ext.useShims = true;
	        GTPFileClient._processPageOnload();
	        if ($G.Params.isEdit !== "true") {
	            $G.getCmp("btn_actSave").hide();
	            $G.getCmp("btn_actSaveClose").hide();
	        }

	        if ($G.Params.readOnly === "true") {
	            $G.getCmp("btn_actSave").hide();
	            $G.getCmp("btn_actSaveClose").hide();
	            $G.getCmp("btn_actWJLC").hide();
	        }


	        if ($G.Params.isHistory === "true") {
	            $G.getCmp("SetToolbar_Default").add({
	                xtype: 'button',
	                id: 'btn_getHistory',
	                text: '查看历史',
	                handler: _this._getFileHistory.createDelegate(_this, [parseInt($G.Params.id)])
	            });
	            $G.getCmp("SetToolbar_Default").doLayout();
	        }
	        GTPWebOffice.CreateObject.defer(600, GTPWebOffice, ["divoffice", $G.Page.initData]);
	    }
	    //[End]



	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GB.LK.ODM.GWYY.GWZWPage = _class;
})();
