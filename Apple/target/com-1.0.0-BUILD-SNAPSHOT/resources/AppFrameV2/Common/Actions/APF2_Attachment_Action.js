(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {

        //添加一行附件数据
        actAddAttach_Handler: function (sender) {
            ///<summary>添加一行附件数据:actAddAttach</summary>
            var cmp = sender && sender.findParentByType ? sender.findParentByType('gtpgridpanel') : null;
            var dataSource = cmp.dataSource;
            var fileInfo = Ext.AppFrame.Attachment.SelectFiles();
            if (!fileInfo)
                return;
            var uploadInfo = Ext.AppFrame.Attachment.FileClientUpload(fileInfo.Files.join('|'));
            if (!uploadInfo)
                return;
            var ds = $G.DataContext.getDataSource(dataSource);
            Ext.AppFrame.Attachment.SetFileValues(uploadInfo, ds, false, true);
        },

        //更新附件，选中一行添加文件
        actAddFile_Handler: function (sender) {
            ///<summary>更新附件，选中一行添加文件:actAddFile</summary>
            var cmp = $G.getViewObject(sender);
            var dataSource = cmp.dataSource;
            var ds = $G.DataContext.getDataSource(dataSource);
            var record = ds.getDataRecord();
            if (!record)
                return;
            else {
                if (record.data && record.data.FileExist) {
                    Gtp.net.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "是否替换附件?", function (e) {
                        if (e == "yes") {
                            var fileInfo = Ext.AppFrame.Attachment.SelectFiles(false);
                            if (!fileInfo)
                                return;
                            var uploadInfo = Ext.AppFrame.Attachment.FileClientUpload(fileInfo.Files[0]);
                            if (!uploadInfo) {
                                return;
                            }
                            Ext.AppFrame.Attachment.SetFileValues(uploadInfo, ds, false);
                        }
                    });
                }
                else {
                    var fileInfo = Ext.AppFrame.Attachment.SelectFiles();
                    if (!fileInfo)
                        return;
                    var uploadInfo = Ext.AppFrame.Attachment.FileClientUpload(fileInfo.Files[0]);
                    if (!uploadInfo) {
                        return;
                    }
                    Ext.AppFrame.Attachment.SetFileValues(uploadInfo, ds, false);
                }
            }
        },

        //上传附件成后增加一行
        actAddAfterUploadFile_Handler: function (sender) {
            ///<summary>上传附件成后增加一行:actDeleteAttach</summary>
            _this.actAddAttach_Handler(sender);
        },

        //删除一行附件数据
        actDeleteAttach_Handler: function (sender) {
            ///<summary>删除一行附件数据:actDeleteAttach</summary>
            var grid = $G.getViewObject(sender);
            if (_this.__validateSelectRecord(grid, true)) {
                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint,
                    String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
                        if (e == "yes") {
                            var ds = $G.DataContext.getDataSource(grid.dataSource);
                            var rows = grid.AP_selectRows();
                            //删除附件放在服务器端，如果添加附件，后再删除，使用客户端处理
                            for (var i = 0; i < rows.length; i++) {
                                var record = rows[i];
                                if (record.id < 0) {
                                    var fileID = record.get("FileID");
                                    var EditGuid = record.get("EditGuid");
                                    var FileName = record.get("Name");
                                    Ext.AppFrame.Attachment.DeleteFile(fileID, EditGuid, FileName);
                                }
                                ds.getDataStore().remove(record);
                            }
                        }
                    });
            }
        },

        //删除附件
        actRemoveFile_Handler: function (sender) {
            ///<summary>选择一行清除附件:actRemoveFile</summary>
            var grid = $G.getViewObject(sender);
            if (grid.selectMode == "row" || (grid.selectMode == "checkbox" && grid.AP_selectRows().length == 1)) {
                var dataSource = grid.dataSource;
                var ds = $G.DataContext.getDataSource(dataSource);
                var record = ds.getDataRecord();
                if (!record)
                    return;
                var fileID = record.get("FileID");
                if (!fileID) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件已经不存在");
                    return;
                }
            }
            if (_this.__validateSelectRecord(grid, true)) {
                Gtp.net.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "是否移除附件文件?", function (e) {
                    if (e == "yes") {
                        var rows = grid.AP_selectRows();
                        for (var i = 0; i < rows.length; i++) {
                            var record = rows[i];
                            record.set("FileID", "");
                            record.set("ViewGuid", "");
                            record.set("EditGuid", "");
                            record.set("FileSize", "");
                            record.set("FileExist", false);
                            record.set("ShareCount", 0);
                            record.set("Name", "");
                        }
                    }
                });
            }
        },

        //下载附件
        actDownLoadFile_Handler: function (sender) {
            ///<summary>下载附件:actDownLoadFile</summary>
            var grid = $G.getViewObject(sender);
            if (_this.__validateSelectRecord(grid, true)) {
                var rows = grid.AP_selectRows();
                if (rows.length == 1) {
                    var record = rows[0];
                    var fileID = record.get("FileID");
                    var ViewGuid = record.get("ViewGuid");
                    var FileName = record.get("Name");
                    var exist = Ext.AppFrame.Attachment.CheckFileExsit(fileID, ViewGuid, record.get("EditGuid"));
                    if (!exist) {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件不存在");
                        return;
                    }
                    Ext.AppFrame.Attachment.DownloadFile(fileID, FileName, ViewGuid);
                }
                else {
                    Ext.AppFrame.Attachment.DownloadFiles(rows);
                }
            }
        },

        //打开附件，单据附件图标也使用此函数
        Ap_Attach_OpenFile: function (dataSourceName) {
            var ds = $G.DataContext.getDataSource(dataSourceName);
            if (ds) {
                var record = ds.getDataRecord();
                if (!record) return;
                var fileID = record.get("FileID");
                var ViewGuid = record.get("ViewGuid");
                var FileName = record.get("Name");
                var exist = Ext.AppFrame.Attachment.CheckFileExsit(fileID, ViewGuid, record.get("EditGuid"));
                if (!exist) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "附件不存在");
                    return;
                }
                return Ext.AppFrame.Attachment.ViewFile(fileID, FileName, ViewGuid);
            }
        },

        //打开选中附件
        actOpenFile_Handler: function (sender) {
            ///<summary>打开附件:actOpenFile</summary>
            //var cmp = $G.getViewObject(sender);
            var grid = $G.getViewObject(sender);
            if (_this.__validateSelectRecord(grid, false)) {
                var dataSource = grid.dataSource;
                return _this.Ap_Attach_OpenFile(dataSource);
            }
        },

        //验证选择记录数
        __validateSelectRecord: function (grid, isMultiSelect) {
            ///<summary></summary>
            if (!!grid && Ext.isFunction(grid.AP_selectRows)) {
                var rows = grid.AP_selectRows();
                if (!rows || rows.length <= 0) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
                    return false;
                }
                else if (rows.length > 1 && !isMultiSelect) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord); //只能选择单一节点
                    return false;
                }
                return true;
            }
            return false;
        },

        /****************************************************文档比较Action start****************************************************/
        /***********************************ActiveX创建、获取 start***********************************/
        _getPluginActiveX: function () {

            /*var activexObj = null;
            var activexInstalled = null;

            _getPluginInstalled:function() {
            activexInstalled = false;
            if(activexObj) {
            try {
            if(activexObj.ShellGetLocalTempDir()) activexInstalled = true;
            } catch(e) {
            //alert(e);
            }
            }
            return activexInstalled;
            },
            */
            var objId = document.getElementById("div_GTPBrowserPluginObject");
            if (!objId) {
                var html;
                if (window.ActiveXObject || ('ActiveXObject' in window)) {
                    //IE 浏览器 ActiveX
                    html = '<object classid=clsid:CDE819EE-EAAC-4076-8CC5-83BED02FEB17 ' + 'style="display:none;height:0px;width:0px" id="GTPBrowserPluginObject" />';
                } else {
                    //mozilla 系列浏览器支持的插件
                    html = '<embed width="0px" height="0px" type="application/x-glodon-gtp-client-plugin" ' + 'data="data:application/x-glodon-gtp-client-plugin" id="GTPBrowserPluginObject" />';
                }

                //创建DIV 并 附加到document
                var o = document.body;
                var div = document.createElement("div");
                //不能设置 div 对象隐藏，否则 getElementById 得不到对象 
                div.setAttribute('style', 'position:absolute;left:0;top:0;width:0;height:0;z-index:100000000');
                div.setAttribute('id', 'div_GTPBrowserPluginObject');
                div.innerHTML = html;
                o.appendChild(div);
            }

            activexObj = document.getElementById("GTPBrowserPluginObject");
            // setTimeout(_getPluginInstalled, 100);
            //如果没有获取到浏览器插件则警告，并退出            
            if (!activexObj) {
                alert("浏览器插件未安装！");
                return;
            }
            return activexObj;
        },
        /***********************************ActiveX创建、获取 end***********************************/

        /***********************************获取 _getDocument Path start***********************************/
        _getSingleDocumentPath: function (selected) {
            var isWord = false;
            var fileName = selected.get("Name");
            var fileID;
            var viewGuid;
            var msg;
            if (typeof (fileName) == "string") {
                var wordArray = ["DOC", "DOCX"];
                var docType = fileName.split(".").pop().toUpperCase();
                if (wordArray.indexOf(docType) != -1) {
                    isWord = true;
                }
                var fileID = selected.get("FileID");
                var viewGuid = selected.get("ViewGuid");
            }
            // 获取文当前校验
            if (typeof (fileName) != "string" || !isWord) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择word文档！");
                return;
            }
            var path = Ext.AppFrame.Attachment.GetTempPath(fileID, fileName, viewGuid);
            // 获取文后前校验
            if (typeof (path) != "string") {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "未能正确获取文件");
                return;
            }
            return path;
        },
        /***********************************获取 _getDocument Path end***********************************/

        /**********************附件文档和本地文档比较 start**********************/
        actCompare_Handler: function (sender) {
            ///<summary>文档比较</summary>
            // 选择两个附件文档比较
            /*var cmp = $G.getViewObject(sender);
            var dataSource = $G.DataContext.getDataSource(cmp.dataSource);
            var selecteds = cmp.getSelectionModel().getSelections();            
            if(selecteds.length !=2){
            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择2个word文档！");
            return;
            }
            var activexObj = _this._getPluginActiveX();            
            var firstPath = _this._getSingleDocumentPath(selecteds[0]);
            var secondPath =_this._getSingleDocumentPath(selecteds[1]);
            var ret = activexObj.ShellCompareWordDoc(firstPath, secondPath);*/
            // 选择两个附件文档比较

            var grid = $G.getViewObject(sender);
            if (_this.__validateSelectRecord(grid, false)) {
                var rows = grid.AP_selectRows();
                var activexObj = _this._getPluginActiveX();

                var firstPath = _this._getSingleDocumentPath(rows[0]);
                if (Ext.isEmpty(firstPath)) {
                    return;
                }
                var fileInfo = Ext.AppFrame.Attachment.SelectFiles();
                //不选择文档直接关闭选择框
                if (!fileInfo) {
                    return;
                }
                var secondPath = fileInfo.Files[0];
                //校验选择弹出的类型只能是word
                var wordArray = ["DOC", "DOCX"];
                var docType = secondPath.split(".").pop().toUpperCase();
                if (wordArray.indexOf(docType) == -1) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择1个word文档！");
                    return;
                }
                var ret = activexObj.ShellCompareWordDoc(secondPath, firstPath);
            }
        },
        /**********************附件文档和本地文档比较 end**********************/
        /*****************************************************文档比较Action end***********************************/

        /****************************************************文档在线编辑 start****************************************************/
        actDocumentEditOnline_Handler: function (sender) {
            ///<summary>actEditOnLine:actEditOnLine</summary>
            var grid = $G.getViewObject(sender);
            if (_this.__validateSelectRecord(grid, false)) {
                var record = grid.AP_selectRows()[0];
                var fileName = record.get("Name");
                var fileID = record.get("FileID");
                var fullname = _this.actOpenFile_Handler.call(this, sender); //下载到本地的文档全路径
                if (!$G.Page.OnlineEditAttach) {
                    $G.Page.OnlineEditAttach = new Array();
                }
                $G.Page.OnlineEditAttach.push({ GridView: grid, FileID: fileID, FileName: fileName, EditFileFullName: fullname });
                //                var me = this;
                //                $G.showConfirm("在线编辑", '编辑文件后选"是"则提交修改文件，选"否"则放弃修改', function (ret1, ret2, ret3) {
                //                    _this._continueEdit.call(me, sender, fullname);
                //                }, this);
            }
        },

        actDocumentEditOnlineSave: function () {
            if ($G.Page.OnlineEditAttach && Ext.isArray($G.Page.OnlineEditAttach)) {
                var message = "";
                for (var i = 0; i < $G.Page.OnlineEditAttach.length; i++) {
                    var result = _this._continueEdit($G.Page.OnlineEditAttach[i].GridView, $G.Page.OnlineEditAttach[i].FileID, $G.Page.OnlineEditAttach[i].FileName, $G.Page.OnlineEditAttach[i].EditFileFullName)
                    if (result && Ext.isString(result)) {
                        message += result + ",";
                    }
                }
                if (message && message != "") {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "文件[" + message + "]保存失败！");
                }
            }
        },

        _continueEdit: function (grid, fileID, fileName, editFileFullname) {
            //检验下载的本地文件
            if (Ext.isEmpty(editFileFullname)) {
                return fileName;
            }

            var ds = $G.DataContext.getDataSource(grid.dataSource);
            var records = ds.getDataStore().getRaw();
            for (var i = 0; i < records.length; i++) {
                if (records[i].FileID == fileID) {
                    var uploadInfo = Ext.AppFrame.Attachment.FileClientUpload(editFileFullname);
                    //重新上传失败
                    if (!uploadInfo) {
                        return fileName;
                    }
                    var model = grid.getSelectionModel();
                    model.selectRow(i);
                    Ext.AppFrame.Attachment.SetFileValues(uploadInfo, ds, false);
                    break;
                }
            }
        },
        /****************************************************文档在线编辑 end****************************************************/

        /**********************附件归档**********************/
        actStoreAttach_Handler: function (sender) {
            var loadjsFiles = [];
            //需要加载流程的这个js,因为DocArchive里有LoadJs动态加载js
            loadjsFiles.push($G.getAppName() + "/Workflow/js/GTPLibrary.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Secret/js/Secret.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Document/js/FlagMsg.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Document/js/Document.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Document/js/Document.ux.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Document/js/Control_ComDocType.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Document/js/Control_PreperProperty.js");
            loadjsFiles.push($G.getAppName() + "/GB/LK/Document/js/DocArchive.js");

            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);

            Ext.AppFrame.Util.LoadJS(jsFileList);
            //Ext.Loader.load(jsFileList, undefined, window, true);

            var grid = $G.getViewObject(sender);
            if (_this.__validateSelectRecord(grid, true)) {
                var selectedRows = grid.AP_selectRows();
                var hasNotHaveFJ = false;
                for (var i = 0; i < selectedRows.length; i++) {
                    var seleR = selectedRows[i];
                    if (!seleR.get("FileID")) {
                        hasNotHaveFJ = true;
                    }
                }

                if (hasNotHaveFJ == false) {
                    var dialog = new Ext.Window({
                        id: "ID_GB_LK_Document_Dialog_Archive",
                        closeAction: "close",
                        title: "选择归档的文件夹",
                        width: 350,
                        height: 500,
                        modal: true,
                        bodyStyle: "padding:16px",
                        layout: "fit",
                        //加载归档控件
                        items: [new GB.LK.Document.Dialog.Archive({
                            id: "ID_GB_LK_Document_Archive",
                            showPerson: false
                        })],
                        buttons: [{
                            id: "GB_LK_Document_Archive_OtherDocSystem",
                            xtype: "checkbox",
                            boxLabel: "归档到",
                            hidden: true
                        }, {
                            text: "确定",
                            handler: function () {
                                Ext.getCmp("ID_GB_LK_Document_Archive").getArchiveData(function (archiveData, folderIDList) {
                                    var dataResult;
                                    var iCount = selectedRows.length;
                                    for (var iDemoCount = 0; iDemoCount < iCount; iDemoCount++) {
                                        //设置其它属性
                                        var row = selectedRows[iDemoCount];
                                        var data = iDemoCount == 0 ? archiveData : {};
                                        data.Name = row.get("DisplayName");
                                        data.DocCode = row.get("FJCode");
                                        data.UploadID = row.get("BZR.UserId");
                                        data.UploadName = row.get("BZR.Name");
                                        data.Author = row.get("BZR.Name");
                                        data.FileID = row.get("FileID");
                                        data.FileName = row.get("Name");
                                        data.FileSize = parseInt(row.get("FileSize"));
                                        data.ViewGUID = row.get("ViewGuid");
                                        data.EditGUID = row.get("EditGuid");

                                        if ((iCount > 1) && !dataResult)
                                            dataResult = [data];
                                        else if (iCount > 1)
                                            dataResult.push(data);
                                        else
                                            dataResult = data;
                                    }
                                    //返回路径
                                    var selectedPath = {
                                        folderIDList: "",
                                        folderFullName: ""
                                    };
                                    var docTree = Ext.getCmp("ID_LK_Document_Archive_DocFolderTree");
                                    var targetNodes = docTree.getSelectNodes();
                                    for (var i = 0; i < targetNodes.length; i++) {
                                        selectedPath.folderIDList += (selectedPath.folderIDList == "" ? "" : ",") + targetNodes[i].attributes.Id;
                                        var sFullName = "";
                                        var node = targetNodes[i];
                                        while (node != docTree.root) {
                                            sFullName = node.attributes.Name[$G.getCultureKey()] + (sFullName == "" ? "" : "\\") + sFullName;
                                            node = node.parentNode;
                                        }
                                        selectedPath.folderFullName += (selectedPath.folderFullName == "" ? "" : "$G$") + sFullName;
                                    }
                                    var result = archiveToDocument(dataResult, folderIDList);
                                    if (result)
                                        Ext.Msg.alert("错误", "归档失败。错误原因为：" + result);
                                    else {
                                        Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "归档成功。");
                                        Ext.getCmp("ID_GB_LK_Document_Dialog_Archive").close();
                                    }
                                });
                            }
                        }, {
                            text: "取消",
                            scope: this,
                            handler: function () {
                                Ext.getCmp("ID_GB_LK_Document_Dialog_Archive").close();
                            }
                        }]
                    });
                    if (Ext.getCmp("ID_GB_LK_Document_Archive").OtherDocSystem && (Ext.getCmp("ID_GB_LK_Document_Archive").OtherArchiveCheck != "0")) {
                        var slOtherDocSystem = Ext.getCmp("ID_GB_LK_Document_Archive").OtherDocSystem.split("|");
                        Ext.getCmp("GB_LK_Document_Archive_OtherDocSystem").setVisible(true);
                        Ext.getCmp("GB_LK_Document_Archive_OtherDocSystem").boxLabel = "归档到" + slOtherDocSystem[0];
                        Ext.getCmp("GB_LK_Document_Archive_OtherDocSystem").OtherDocSystem = slOtherDocSystem[0];
                        Ext.getCmp("GB_LK_Document_Archive_OtherDocSystem").OtherArchiveParams = slOtherDocSystem[1];
                        if (Ext.getCmp("ID_GB_LK_Document_Archive").OtherArchiveCheck == "1") {
                            Ext.getCmp("GB_LK_Document_Archive_OtherDocSystem").setValue(true);
                            Ext.getCmp("GB_LK_Document_Archive_OtherDocSystem").setDisabled(true);
                        }
                    }
                    dialog.show();
                }
                else {
                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "没有附件记录，不能归档");
                    return;
                }
            }
        },
        /**********************附件归档**********************/

        /**********************从文档中心导入**********************/
        actImportFromDocCenter_Handler: function (sender) {
            var pageUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/GB/LK/Document/DocCenter.aspx";
            $G.open({
                url: pageUrl,
                title: "从文档中心引入",
                target: "_modal",
                scope: _this,
                features: { dialogWidth: "796px", dialogHeight: "508px" },
                parameters: {
                    showPerson: true, //显示个人文档节点 
                    showPublic: true, //显示文档中心节点 
                    //queryRight: 0x000040000, //控制权限 默认为有下载权限 
                    pageSize: 10, //列表显示条数 
                    //rootFolderIdList: "100301", //显示某个文件下的文档 
                    isEncode: true
                },
                callback: function (ret) {
                    if (ret == null) return;
                    else {
                        var selected = eval(ret);
                        if (selected && Ext.isArray(selected) && selected.length > 0) {
                            var files = new Array();
                            for (var i = 0; i < selected.length; i++) {
                                var cmp = $G.getViewObject(sender);
                                var dataSource = cmp.dataSource;
                                var ds = $G.DataContext.getDataSource(dataSource);
                                files.push({ FileName: selected[i].FileName, FileID: selected[i].FileID, ViewGuid: selected[i].ViewGUID, EditGuid: selected[i].EditGUID, FileSize: selected[i].FileSize });
                            }
                            Ext.AppFrame.Attachment.SetFileValues({ Files: files, TotalCount: files.length, Result: "0" }, ds, true, true);
                        }
                    }
                }
            });



        },
        /**********************从文档中心导入**********************/

        /**********************从附件模板选择附件并添加**********************/
        actAddAttachFromDocTemplate_Handler: function (sender) {
            var grid = $G.getViewObject(sender);
            if (!grid) {
                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "配置不正确，无法获取数据控件！");
                return;
            }
            else {
                var ds = $G.DataContext.getDataSource(grid.dataSource);

                if (!ds.folderId || ds.folderId <= 0) {
                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请选择文档目录再添加");
                    return;
                }
                else {
                    var _dialogArguments = {
                        DTFolderId: ds.folderId, //目录id
                        CanViewFile: ds.folderCanViewDFile
                    };

                    var pageUrl = $G.getPageURLByFullName("GTP.AppFrameV2.DocTemplate.DocTemplateLookUpPage");
                    callbackFunc = function (ret) {
                        if (!ret || !ret.OutEntity) return;
                        else {
                            var files = new Array();
                            var selected = ret.OutEntity;
                            if (Ext.isArray(ret.OutEntity) && ret.OutEntity.length > 0) {
                                for (var i = 0; i < selected.length; i++) {
                                    var cloneFile = _this.__FileClone(selected[i].FileID, selected[i].Name, selected[i].ViewGuid);
                                    files.push({
                                        TemplateID: selected[i].ID,
                                        FolderId: selected[i].DTFolder_ID,
                                        TemplateInfo: selected[i].FileID + "," + selected[i].Name + ";" + selected[i].ViewGuid,
                                        FileName: cloneFile.FileName,
                                        FileID: cloneFile.FileID,
                                        ViewGuid: cloneFile.ViewGuid,
                                        EditGuid: cloneFile.EditGuid,
                                        FileSize: cloneFile.FileSize
                                    });
                                }
                            }
                            else if (Ext.isObject(ret.OutEntity)) {
                                selected = ret.OutEntity;
                                var cloneFile = _this.__FileClone(selected.FileID, selected.Name, selected.ViewGuid);
                                files.push({
                                    TemplateID: selected.ID,
                                    FolderId: selected.DTFolder_ID,
                                    TemplateInfo: selected.FileID + "," + selected.Name + ";" + selected.ViewGuid,
                                    FileName: cloneFile.FileName,
                                    FileID: cloneFile.FileID,
                                    ViewGuid: cloneFile.ViewGuid,
                                    EditGuid: cloneFile.EditGuid,
                                    FileSize: cloneFile.FileSize
                                });
                            }
                            Ext.AppFrame.Attachment.SetFileValues({ Files: files, TotalCount: files.length, Result: "0" }, ds, true, true);
                        }
                    }
                    $G.open({
                        url: pageUrl,
                        title: "从附件模板引入",
                        target: "_modal",
                        scope: _this,
                        features: { dialogWidth: "796px", dialogHeight: "508px" },
                        parameters: _dialogArguments,
                        callback: callbackFunc
                    });


                }
            }
        },

        __FileClone: function (fileId, fileName, viewGuid) {
            ///<summary>克隆文件服务器中文件，硬拷贝</summary>
            if (fileId && viewGuid) {
                var result = GTPFileClient.FileClientPhysicalCopy(fileId, viewGuid);
                if (result.CompletedCount > 0) {
                    return result.Files[0];
                } else
                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "选中记录附件信息丢失，请检查文件服务器是否存在该文件");
            }
            else {
                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "选择记录无附件信息");
            }
        },
        /**********************从附件模板选择附件并添加**********************/


        /**********************以下Action都是废弃的，是AppFrameV1里拷贝的，V2中不使用***************************************/
        /********选择文档 begin *******/
        actAddDocument_Handler: function (sender) {
            ///<summary>选择文档:actAddDocument</summary>

            var url;
            var title;
            var feature;
            var returnValue;
            var moduleCode;                                              //模块编码
            var dataSource = sender.dataSourceName;          //页面数据源
            var originLevelID = 0;                                       //来源层级ID 0：集团 3：项目 其他：公司 

            title = "选择文档";
            moduleCode = Gtp.net.Global.getBizComp();
            feature = { dialogWidth: "820", dialogHeight: "570" };
            url = $G.getPageURLByFullName("GTP.AppFrame.DT.DocumentTemplateLookupPage");

            $G.open({
                url: url,
                title: title,
                target: "_extwin",
                features: feature,
                parameters: { ModuleCode: moduleCode, OriginLevelID: originLevelID },
                callback: function (data) {
                    if (data.state) {
                        var records = data.OutEntity;
                        _this._bindReturnRecord(dataSource, records);
                    }
                }
            });
        },
        _bindReturnRecord: function (dataSourceName, recordList) {
            ///<summary>绑定返回的文档数据记录</summary>
            ///orgFileID 原模版文件 ID
            var dataSource = $G.DataContext.getDataSource(dataSourceName);
            if (recordList != "undefined" || recordList != null) {
                dataSource.addRecord();
                //dataSource.setFieldValue("Remark", recordList.data.Remark);
                dataSource.setFieldValue("Name", recordList.data.Name);
                dataSource.setFieldValue("FileID", recordList.data.FileID);
                dataSource.setFieldValue("ViewGuid", recordList.data.ViewGuid);
                dataSource.setFieldValue("EditGuid", recordList.data.EditGuid);
                dataSource.setFieldValue("FileSize", recordList.data.FileSize);
                dataSource.setFieldValue("FileExist", recordList.data.FileExist);
                dataSource.setFieldValue("ShareCount", recordList.data.ShareCount);
                dataSource.setFieldValue("DisplayName", recordList.data.DisplayName);
                dataSource.setFieldValue("TemplateID", recordList.data.TemplateID);
                dataSource.setFieldValue("TemplateInfo", recordList.data.TemplateInfo);

                /*
                //保存修改以后的数据源
                var config = {
                success: function () {
                //Gtp.net.MessageBox.success(GTP.AppFrameV2.Res.OptSucceed, "添加成功!");
                }
                };
                Ext.ux.AppFrame.DataSource.SaveChanges(dataSource, config);
                */
            }
        },
        /********选择文档 End *******/

        /********选择合同范本 begin****/
        actAddHTFB_Handler: function (sender) {
            var url = $G.getPageURLByFullName("GPM.Contract.BasicData.HTFBLookupPage")
            var dataSource = sender.dataSourceName;  //页面数据源

            var config = {
                url: url,
                title: "选择范本",
                target: "_extwin",
                features: { dialogWidth: "820", dialogHeight: "570" },
                callback: function (data) {
                    if (data.state) {
                        var records = data.OutEntity;
                        _this._bindReturnRecord(dataSource, records);
                    }
                }
            };
            var configFunc = eval("$G.Page." + sender.initConfigFunc);
            if (configFunc && Ext.isFunction(configFunc)) {
                var newconfig = configFunc.call();
                if (newconfig == false) {
                    return;
                }
                config = Ext.applyIf(newconfig || {}, config);
            }

            $G.open(config);
        },
        /********选择合同范本 end****/

        /**********************附件文档和文档模版比较 start**********************/
        actCompareWithTemplate_Handler: function (sender) {

            //            var cmp = $G.getViewObject(sender);
            var cmp = sender && sender.findParentByType ? sender.findParentByType('gtpgridpanel') : null;
            var dataSource = $G.DataContext.getDataSource(cmp.dataSource);
            var selecteds = cmp.getSelectionModel().getSelections();

            if (selecteds.length != 1) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择1个word文档！");
                return;
            }
            var templateInfo = selecteds[0].get("TemplateInfo");
            if (Ext.isEmpty(templateInfo)) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "该文档无模版！");
                return;
            }
            var templateInfoArr = templateInfo.split(',');
            var firstPath = _this._getSingleDocumentPath(selecteds[0]);
            if (Ext.isEmpty(firstPath)) {
                return;
            }
            //templateInfo 是以逗号分隔的fileID,fileName,viewGuid串            
            var secondPath = Ext.AppFrame.Attachment.GetTempPath(templateInfoArr[0], "template_" + templateInfoArr[1], templateInfoArr[2]);
            var activexObj = _this._getPluginActiveX();
            var ret = activexObj.ShellCompareWordDoc(secondPath, firstPath);
            // 附件文档和文档模版比较

        },
        /**********************附件文档和文档模版比较 end**********************/

        /****************************************************附件水印打印 start****************************************************/
        actDocumentPrint_Handler: function (sender) {

            //水印图片
            var initcfg = sender;
            var paramsObj;
            var inputFunc = eval("$G.Page." + initcfg.initDocumentPrintParamFunc);
            if (inputFunc && Ext.isFunction(inputFunc)) {
                paramsObj = inputFunc.call();
            }

            if (Ext.isEmpty(paramsObj) || Ext.isEmpty(paramsObj.fileID) || Ext.isEmpty(paramsObj.fileName) || Ext.isEmpty(paramsObj.viewGuid)) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "未能获取水印信息");
                return;
            }
            if (Ext.isEmpty(paramsObj.watermarkEnabled) && paramsObj.watermarkEnabled == true) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "水印未启动");
                return;
            }
            var watermarkPath = Ext.AppFrame.Attachment.GetTempPath(paramsObj.fileID, paramsObj.fileName, paramsObj.viewGuid);

            if (Ext.isEmpty(watermarkPath)) {
                return;
            }
            //文档
            var cmp = sender && sender.findParentByType ? sender.findParentByType('gtpgridpanel') : null;
            var dataSource = $G.DataContext.getDataSource(cmp.dataSource);
            var selecteds = cmp.getSelectionModel().getSelections();

            if (selecteds.length != 1) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择1个word文档！");
                return;
            }
            var docPath = _this._getSingleDocumentPath(selecteds[0]);

            if (Ext.isEmpty(docPath)) {
                return;
            }

            var activexObj = _this._getPluginActiveX();
            var result = activexObj.ShellWaterMarkPrintDoc(docPath, watermarkPath); //watermarkPath为空则返回-3            
        }
        /****************************************************附件水印打印 end****************************************************/
        /**********************以上Action都是废弃的，是AppFrameV1里拷贝的，V2中不使用***************************************/
    });
})();