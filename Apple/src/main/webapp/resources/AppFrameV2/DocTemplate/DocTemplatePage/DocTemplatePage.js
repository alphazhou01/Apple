//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.DocTemplate");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.CategoryTreeOfSelfPage,
	{
	    //</Top>

	    //[Start]
	    _initLeftTree: function () {
	        //左侧树事件
	        var leftTreeGrid = $G.getCmp("leftTreeGrid");
	        if (leftTreeGrid) {
	            leftTreeGrid.addClass("blank-row-line");
	            leftTreeGrid.notCheckDataUpdate = true;
	            leftTreeGrid.on("rowselect", function (item, index, node) {
	                var treeView = $G.getCmp("leftTreeGrid");
	                var records = treeView.getSelectionModel().getSelections();
	                if (records.length == 0) {
	                    return;
	                }
	                else if (records.length > 1) {
	                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                    treeView.getSelectionModel().clearSelections();
	                    return;
	                }
	                else {

	                    var categoryRow = records[0];

	                    if (categoryRow.get("IsLeaf")) {
	                        var dictView = $G.getCmp("rightTreeGrid");
	                        var _queryplan = dictView.apf_queryPlan;
	                        //	                        var fullCode = categoryRow.get("FullCode");
	                        //	                        $G.fullCode = fullCode;
	                        //模块树修改，使用的字段从fullcode 变为 code
	                        var Code = categoryRow.get("Code");
	                        $G.Code = Code;
	                        _queryplan.setFilterValue("filter_C_FullCode_Equel", Code);
	                        //_queryplan.setFilterValue("filter_C_FullCode_Like", fullCode + ".");
	                        //增加两个参数，强制刷新，TODO:需要判断是否有更新，应该去掉参数
	                        $G.Page.actQueryRightTree();
	                    } else {
	                        var dtfolder = _this._getDTFolderQuery();
	                        var dtfiles = _this._getDTQuery();
	                        if ($G.getCmp("rightTreeGrid").store.data.length > 0) {
	                            $G.getCmp("rightTreeGrid").store.removeAll();
	                            //dtfolder.removeAll();
	                            //dtfolder.commitChanges(true);
	                        }
	                        _this._activeAllRule(dtfolder);
	                        if (dtfiles) {
	                            dtfiles.removeAll();
	                            dtfiles.commitChanges(true);
	                        }
	                        $G.Code = null;
	                    }

	                };

	            })
	        }

	        //设置左侧树的工具栏
	        var searchToolbar = $G.getCmp("leftTreeGrid_search");
	        if (searchToolbar) {
	            searchToolbar.enableOverflow = false; //参照框不折叠

	            $G.getCmp('leftTreeSearch').setWidth(searchToolbar.getWidth() - 10);

	            leftTreeGrid.getTopToolbar().on('resize', function (_this, w) {
	                $G.getCmp('leftTreeSearch').setWidth(w - 12);
	            });

	            //去掉查询框工具栏边框与背景色
	            searchToolbar.addClass("x-grid-toolbar-noborder");
	            searchToolbar.addClass("x-grid-toolbar-blank-bg");
	            //有两组工具栏，会产生2px的内间距，去掉内间距
	            searchToolbar.ownerCt.addClass("x-panel-padding0");
	            searchToolbar.ownerCt.setWidth(searchToolbar.ownerCt.getWidth() + 5);
	            searchToolbar.ownerCt.doLayout();
	            searchToolbar.ownerCt.setWidth(searchToolbar.ownerCt.getWidth() - 1);
	            searchToolbar.ownerCt.doLayout();
	        }
	    },
	    //[End]

	    //[Start]
	    _initQueryBox: function (grid, config, toolbarName, index) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>

	        toolbarName = 'rightTreeGrid_toolbar';
	        index = 0;

	        if (!config) {
	            config = {};
	        }
	        config.hasSchemeManagement = false;
	        //自己构建函数.
	        config.getCriteira = function (queryBoxParam) {
	            if (!$G.Code) return;
	            $G.Page.actQueryRightTree({ lazyLoad: false, noCacheParam: true });
	        }
	        Ext.AppFrame.Util.createQueryBox(grid, config);

	        if (!toolbarName) {
	            toolbarName = "rightTreeGrid_toolbar_topTitle";
	        }
	        if (Ext.isEmpty(index) || (Ext.isNumber(index) && index < 0)) {
	            index = $G.getCmp(toolbarName).items.indexOf($G.getCmp("Separator_Search"))
	            index = index + 1;
	        }

	        Ext.ux.query.showQueryBox(toolbarName, index);
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
	        if ($G.getCmp("leftTreeGrid_bottombar"))
	            $G.getCmp("leftTreeGrid_bottombar").setVisible(false);

	        if ($G.getCmp("rightTreeGrid_toolbar_topTitle")) {
	            $G.getCmp("rightTreeGrid_toolbar_topTitle").hideParent = false;
	            $G.getCmp("rightTreeGrid_toolbar_topTitle").setVisible(false);
	        }


	    },
	    //[End]

	    //[Start]
	    _getDTFolder: function () {
	        return $G.DataContext.getDataSource('DTFolder');
	    },
	    //[End]

	    //[Start]
	    _getDTFolderQuery: function () {
	        return $G.DataContext.getDataSource('RightTreeQuery');
	    },
	    //[End]

	    //[Start]
	    _getDT: function () {
	        return $G.DataContext.getDataSource('DTFile');
	    },
	    //[End]

	    //[Start]
	    _getDTQuery: function () {
	        return $G.DataContext.getDataSource('DTQuery');
	    },
	    //[End]

	    //[Start]
	    _DTGUID: function () {
	        var S4 = function () {
	            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	        }
	        //return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	        return (S4() + S4() + "-" + S4());
	    },
	    //[End]

	    //[Start]
	    actAddRoot_Handler: function (sender) {
	        ///<summary>新建根目录:actAddRoot</summary>
	        if (!_this._IsBizComp()) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择具体业务单据!");
	            return;
	        }
	        _this._showDTFWindow();
	        var ds = _this._getDTFolder();
	        var newrecord = ds.addRecord();
	        _this._addChild(newrecord, null);
	    },
	    //[End]

	    //[Start]
	    actAdd_Handler: function (sender) {
	        ///<summary>新增同级目录:actAdd</summary>
	        //	        if (!_this._IsBizComp()) {
	        //	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择具体业务单据!");
	        //	            return;
	        //	        }
	        var tree = $G.getCmp("rightTreeGrid");
	        var selectedRow = tree.getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择一个文档目录!");
	        } else {
	            var parent = selectedRow.store.getNodeParent(selectedRow);
	            _this._showDTFWindow();
	            var ds = _this._getDTFolder();
	            var newrecord = ds.addRecord();

	            if (parent) {
	                //var result = true; // $G.Page._addBizLock(selectedRow, true);
	                //if (result) {
	                _this._addChild(newrecord, parent, null);
	                //}
	            }
	            else {
	                _this._addChild(newrecord, null, selectedRow);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actAddChild_Handler: function (sender) {
	        ///<summary>添加下级目录:actAddChild</summary>
	        //	        if (!_this._IsBizComp()) {
	        //	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择具体业务单据!");
	        //	            return;
	        //	        }
	        var selectedRow = $G.getCmp("rightTreeGrid").getSelectionRow();
	        if (!selectedRow) {
	            //Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择一个文档目录!");
	        }
	        else {
	            //	            if (selectedRow.data.Name == '默认目录') {
	            //	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "默认目录无法操作!");
	            //	                return;
	            //	            }
	            var result = true; // $G.Page._addBizLock(selectedRow, true);
	            if (result) {
	                if ($G.PageContext.deptId == selectedRow.data.CreateDept_DeptId || selectedRow.data.CanViewDFile) {

	                    _this._showDTFWindow();
	                    var ds = _this._getDTFolder();
	                    var newrecord = ds.addRecord();

	                    _this._addChild(newrecord, selectedRow);
	                } else {
	                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录只能由创建部门维护!');
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _addChild: function (record, parent, brother) {

	        ///<summary>添加之后事件</summary>
	        record.set('Code', _this._DTGUID());
	        record.set('ModuleCode', $G.Code);
	        record.set("IsLeaf", true);
	        if (!parent) {
	            if (brother) {
	                record.set("PID", brother.get("PID"));
	                record.set("Level", brother.get("Level"));
	            }
	            else {
	                record.set("PID", 0);
	                record.set("Level", 1);
	            }
	        }
	        else {
	            record.set("ApplyDept.DeptId", parent.get("ApplyDept_DeptId"));
	            record.set("ApplyDept.Name", parent.get("ApplyDept_DeptName"));

	            record.set("PID", parent.id);
	            record.set("Level", parent.data.Level + 1);
	        }

	    },
	    //[End]

	    //[Start]
	    _showDTFWindow: function () {
	        $G.getCmp("windowDTF").show();
	        $G.getCmp("windowDTF").tools.close.hide();
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>页面加载</summary>
	        _super._init();

	        //增加Filter，js构造，是否考虑转到Queryplan里
	        var rightTreeGrid = $G.getCmp("rightTreeGrid");
	        rightTreeGrid.AP_getTreeFilter = function () {
	            var Filters = new Array();
	            var fn = Ext.AppFrame.Common.addFilter;
	            Filters.push(fn("BraceStart", null, "eq", "And", null));

	            var leftTreeGrid = $G.getCmp("leftTreeGrid");
	            var selectedRecords = leftTreeGrid.getSelectionModel().getSelections();
	            if (selectedRecords.length == 0) {
	                return;
	            }
	            else if (selectedRecords.length > 1) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                treeView.getSelectionModel().clearSelections();
	                return;
	            }
	            else {
	                var cID = selectedRecords[0].get("FullCode");
	                Filters.push(fn("Filter", "ModuleCode", "eq", cID, null)); //本级、上级不能重复
	            }

	            var rightTreeGrid = $G.getCmp("rightTreeGrid");
	            if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", rightTreeGrid.apf_ds.type) == "true") {
	                var deptId = Ext.AppFrame.Common.getDeptId();
	                Filters.push(fn("Filter", "Dept", "eq", deptId, "zh_CN")); //本级、上级不能重复
	            }

	            Filters.push(fn("BraceEnd", null, "eq", "", null));
	            return Filters;
	        };

	        rightTreeGrid.notCheckDataUpdate = true;


	        var leftTreeGrid = $G.getCmp("leftTreeGrid");
	        leftTreeGrid.store.on("load", function () {
	            var leftTreeGrid = $G.getCmp("leftTreeGrid");
	            leftTreeGrid.expandLevel(1);
	        });

	    },
	    //[End]

	    //[Start]
	    //加载文档模板GRID
	    DTFileGridQuery: function () {
	        var DTFileQueryPlan = $G.QueryPlans.getQueryPlan("DTqueryPlan" || 0);

	        var selectedRow = $G.getCmp("rightTreeGrid").getSelectionRow();
	        if (!!selectedRow) {
	            if (selectedRow.data.CanViewDFile) {
	                DTFileQueryPlan.setFilterValue("filter_DTFolder_ID", selectedRow.data.ID);
	                if ($G.PageContext.userId != "0") {
	                    if ($G.PageContext.frameDeptFullId) {
	                        var deptFullId = $G.PageContext.frameDeptFullId;
	                        while (deptFullId.indexOf("/") > 0) {
	                            var deptFullId = deptFullId.replace('/', ',');
	                        }
	                        DTFileQueryPlan.setFilterValue("filter_CREATE_DeptId", deptFullId);
	                    }
	                    else {
	                        DTFileQueryPlan.setFilterValue("filter_CREATE_DeptId", $G.PageContext.deptId);
	                    }
	                }
	                _this._doAction("QueryByCriteria", [DTFileQueryPlan.getQueryParam()], function (data) {
	                    $G.DataContext.getDataSource('DTQuery').loadData(data);
	                    if ($G.getCmp('gridView').getSelectionModel().getSelections()[0])
	                        _this.DTGridIsValidButtonState($G.getCmp('gridView').getSelectionModel().getSelections()[0].data.IsValid);
	                });
	            } else {
	                //Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "您没有查看此目录下文档模板的权限");
	                $G.DataContext.getDataSource('DTQuery').removeAll();
	                $G.DataContext.getDataSource('DTQuery').commitChanges(true);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _treeFuzzySearchFields: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        return "Code;Name;FullCode";
	    },
	    //[End]

	    //[Start]
	    actQueryRightTree: function (config) {
	        config = config || {};
	        config.isExpandAll = true;

	        _super.actQueryRightTree(config);
	    },
	    //[End]

	    //[Start]
	    act_SaveDTFolder_Handler: function (sender) {
	        ///<summary>保存:文档目录</summary>
	        var ds = _this._getDTFolder();
	        var grid = $G.getCmp("rightTreeGrid");
	        var entityFolder = $G.getCmp("entityDTF");
	        /////////////////
	        //	        if (ds.getFieldValue('Name') == '默认目录') {
	        //	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '默认目录为系统保留');
	        //	            return false;
	        //	        }
	        //	        else 
	        if (entityFolder.validate() == false) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoValid);
	            return false;
	        }
	        else {
	            var changeSummary = ds.getChangeSummary();
	            var config = { action: "SaveChangesTreeQuery", changeSummary: changeSummary, args: [changeSummary, [], grid.AP_getTreeFilter()] };
	            ds.AP_saveChangeList(ds.type, config);
	            $G.Page.actQueryRightTree();
	            $G.getCmp("windowDTF").hide();
	            ds.removeAll();
	            ds.commitChanges(true);
	        }
	    },
	    //[End]

	    //[Start]
	    //给文档模板赋值
	    _SetFileValues: function (UploadInfo, DataSource, IsShare, isMultiSelect) {
	        var len = UploadInfo.Files.length;
	        var file;
	        for (var i = 0; i < len; i++) {
	            if (isMultiSelect) {
	                DataSource.addRecord();
	            }
	            file = UploadInfo.Files[i];
	            Gtp.util.DataSource.setFieldValue(DataSource, "Name", file.FileName);
	            Gtp.util.DataSource.setFieldValue(DataSource, "FileID", file.FileID);
	            Gtp.util.DataSource.setFieldValue(DataSource, "ViewGuid", file.ViewGuid);
	            Gtp.util.DataSource.setFieldValue(DataSource, "EditGuid", file.EditGuid);
	            Gtp.util.DataSource.setFieldValue(DataSource, "CreateTime", (new Date()).format("Y-m-d H:i:s"));
	            Gtp.util.DataSource.setFieldValue(DataSource, "FileSize", Ext.AppFrame.Attachment.GetFileSize(file.FileSize));
	            Gtp.util.DataSource.setFieldValue(DataSource, "DisplayName", file.FileName);
	            if (IsShare) {
	                Gtp.util.DataSource.setFieldValue(DataSource, "ShareCount", 1);
	            }
	            else {
	                Gtp.util.DataSource.setFieldValue(DataSource, "ShareCount", 0);
	            }
	            if (UploadInfo.Result == "0") {
	                Gtp.util.DataSource.setFieldValue(DataSource, "FileExist", true);
	            }
	            else {
	                Gtp.util.DataSource.setFieldValue(DataSource, "FileExist", false);
	            }
	        }

	    },
	    //[End]

	    //[Start]
	    //添加一行附件数据
	    _AddAttach: function (dsName) {
	        ///<summary>添加一行附件数据:actAddAttach</summary>
	        var fileInfo = Ext.AppFrame.Attachment.SelectFiles();
	        if (!fileInfo)
	            return;
	        var uploadInfo = Ext.AppFrame.Attachment.FileClientUpload(fileInfo.Files.join('|'));
	        if (!uploadInfo)
	            return;
	        var ds = $G.DataContext.getDataSource(dsName);
	        _this._SetFileValues(uploadInfo, ds, false, false);
	    },
	    //[End]

	    //[Start]
	    act_SaveDT_Handler: function (sender) {
	        ///<summary>保存:文档模板</summary>
	        var ds = _this._getDT();
	        var grid = $G.getCmp("rightTreeGrid");
	        var entityFolder = $G.getCmp("entityDT");
	        /////////////////01、TreeGid无法校验数据，暂时去掉
	        if (entityFolder.validate() == false) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoValid);
	            return false;
	        }
	        else {
	            if (Ext.isEmpty(_this._getDT().getFieldValue('FileID'))) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请点击模板名称,上传文档模板附件!');
	                return false;
	            }

	            var changeSummary = ds.getChangeSummary();
	            if (changeSummary) {
	                _this._doAction('SaveChangesDoc', [changeSummary], function (result) {
	                    //todo 提示
	                    _this.DTFileGridQuery();
	                });
	            }
	            $G.getCmp("windowDT").hide();
	            ds.removeAll();
	            ds.commitChanges(true);
	        }
	    },
	    //[End]

	    //[Start]
	    actRemove_Handler: function (sender) {////////////删除的节点是否有子节点，节点下面是否有关联的文档模板
	        ///<summary>删除:actRemove</summary>
	        var selectedRow = $G.getCmp("rightTreeGrid").getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择一个文档目录!");
	        }
	        else {
	            //	            if (selectedRow.data.JianPin == 'MRML' && selectedRow.data.FullCode.indexOf(selectedRow.data.ModuleCode) >= 0) {
	            //	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '默认目录不允许删除!');
	            //	                return;
	            //	            }
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == selectedRow.data.CreateDept_DeptId) {
	                Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "确认要删除选中目录么", function (e) {
	                    if (e == "yes") {
	                        var fullCode = selectedRow.data['FullCode'];
	                        var entityName = $G.DataContext.getDataSource('DTFolder').type;
	                        //	                        if (!selectedRow.data.IsLeaf) {
	                        //	                            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录包含子目录,请先删除子目录!');
	                        //	                        } else {
	                        $G.dispatcher({
	                            action: "CheckFolder",
	                            args: [selectedRow.data],
	                            success: function (result) {
	                                _this._SetDeleDTF(selectedRow.data['ID']);
	                            }
	                        });
	                        //	                        }
	                    }
	                });

	            } else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录下只能由创建部门进行删除操作!');
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    //真删除，已过期
	    _DeleDTF: function (entityName, fullCode, filter) {
	        _this._doAction('DeleteTreeNode', [entityName, fullCode, filter], function () {
	            $G.Page.actQueryRightTree();
	        })
	    },
	    //[End]

	    //[Start]  
	    //假删除，使用中    
	    _SetDeleDTF: function (entityid) {
	        _this._doAction('DelDTFolder', [entityid], function () {
	            $G.Page.actQueryRightTree();
	        })
	    },
	    //[End]

	    //[Start]
	    act_CloseWDTF_Handler: function (sender) {
	        ///<summary>取消:文档目录的窗体</summary>
	        var ds = _this._getDTFolder();
	        ds.removeAll();
	        ds.commitChanges(true);
	        $G.getCmp("windowDTF").hide();
	    },
	    //[End]

	    //[Start]
	    act_CloseWDT_Handler: function (sender) {
	        ///<summary>取消:文档模板的窗体</summary>
	        var ds = _this._getDT();
	        ds.removeAll();
	        ds.commitChanges(true);
	        $G.getCmp("windowDT").hide();
	    },
	    //[End]

	    //[Start]
	    _doAction: function (action, args, callback, callbackArg, showMask) {
	        if (showMask == null)
	            showMask = true;
	        var disp = new Gtp.net.GtpDispatcher({
	            async: false,
	            showMask: showMask,
	            dispatchArgs: {
	                controller: Gtp.net.Global.getPageController(),
	                action: action,
	                args: args
	            },
	            listeners: {
	                scope: this,
	                "success": function (result) {
	                    if (callback)
	                        callback(result, callbackArg);
	                },
	                "error": function () {
	                    Gtp.net.GtpDispatcher.prototype.onError.apply(this, arguments);
	                    if (callback)
	                        callback(null, callbackArg, arguments);
	                },
	                "failure": function () {
	                    Gtp.net.GtpDispatcher.prototype.onFailure.apply(this, arguments);
	                    if (callback)
	                        callback(null, callbackArg, arguments);
	                }
	            }
	        })
	        disp.dispatch();
	    },
	    //[End]

	    //[Start]
	    act_UpdateDTF_Handler: function (sender) {
	        ///<summary>修改:文档目录</summary>

	        var selectedRow = $G.getCmp("rightTreeGrid").getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择一个文档目录!");
	        }
	        else {
	            var result = true;
	            if (result) {
	                //	                if (selectedRow.data.JianPin == 'MRML') {
	                //	                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '默认目录不允许修改!');
	                //	                    return;
	                //	                }
	                if ($G.PageContext.userId == "0" || $G.PageContext.deptId == selectedRow.data.CreateDept_DeptId) {
	                    var ds = _this._getDTFolder();
	                    _this._doAction('FindByKey', [selectedRow.data.ID, ds.type], function (result) {
	                        $G.getCmp("windowDTF").show();
	                        ds.loadData(result);
	                        $G.getCmp("windowDTF").tools.close.hide();
	                    });
	                } else {
	                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录只能由创建部门维护!');
	                }

	            }
	        }
	    },
	    //[End]

	    //[Start]
	    Efd_Name_TriggerClick: function (index) {
	        ///<summary>TriggerClick</summary>
	        _this._AddAttach('DTFile');
	    },
	    //[End]

	    //[Start]
	    actNewAddAttach_Handler: function (sender) {
	        ///<summary>添加模板:actNewAddAttach</summary>
	        var ds = _this._getDT();
	        var selectedRow = $G.getCmp("rightTreeGrid").getSelectionRow();
	        if (selectedRow) {
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == selectedRow.data.CreateDept_DeptId || selectedRow.data.CanViewDFile) {
	                $G.getCmp("windowDT").show();
	                $G.getCmp("windowDT").tools.close.hide();
	                var newrecord = ds.addRecord();
	                newrecord.set('DTFolder.ID', selectedRow.data.ID);
	                newrecord.set('DTFolderFullCode', selectedRow.data.FullCode);

	            } else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '您没有该文档目录下添加模板的权限!');
	            }
	        } else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请选择一个文档目录!');
	        }


	    },
	    //[End]

	    //[Start]
	    gridView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        //只能维护本部门文档模板，上级部门创建的模板，只能看
	        if (item.AP_selectRows().length > 0) {
	            var record = item.AP_selectRows()[0];
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == record.get("CREATE_DeptId")) {
	                _this.DTGridIsEditButtonState(true);
	                _this.DTGridIsValidButtonState(record.get("IsValid"));
	            }
	            else _this.DTGridIsEditButtonState(false);
	        }
	    },
	    //[End]

	    //[Start]
	    rightTreeGrid_RowClick: function (item, rowIndex, e) {
	        ///<summary>点击rightTreeGrid,联动查询出该目录下的文档模板</summary>
	        _this.DTFileGridQuery();
	    },
	    //[End]

	    //[Start]
	    DTGridIsValidButtonState: function (isValid) {
	        ///<summary>RowClick</summary>
	        $G.getCmp('btnIsValid').setDisabled(isValid);
	        $G.getCmp('btnNotValid').setDisabled(!isValid);
	    },
	    //[End]

	    //[Start]
	    DTGridIsEditButtonState: function (isEdit) {
	        ///<summary>RowClick</summary>
	        $G.getCmp('btn_NewUpdateAttach').setDisabled(!isEdit);
	        $G.getCmp('btnDel').setDisabled(!isEdit);
	        $G.getCmp('btnIsValid').setDisabled(!isEdit);
	        $G.getCmp('btnNotValid').setDisabled(!isEdit);
	    },
	    //[End]

	    //[Start]
	    //切换文档模板的启用状态
	    _IsValid: function (isValid) {
	        var selectedRow = $G.getCmp("gridView").getSelectionModel().getSelections()[0];
	        if (selectedRow) {
	            $G.dispatcher({
	                controller: Gtp.net.Global.getPageController(),
	                action: 'ChangesDocIsValid',
	                args: [selectedRow.data.ID, isValid],
	                success: function (result) {
	                    //selectedRow.data.IsValid = isValid;
	                    selectedRow.set("IsValid", isValid);
	                    $G.DataContext.getDataSource('DTQuery').commitChanges(true);
	                    _this.DTGridIsValidButtonState(isValid);
	                },
	                failure: function (a, b, c) {
	                }
	            });
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }

	    },
	    //[End]

	    //[Start]
	    //判断左边是否选择的是业务单据
	    _IsBizComp: function (isValid) {
	        var selectedRow = $G.getCmp("leftTreeGrid").getSelectionRow();
	        if (selectedRow && selectedRow.data.IsLeaf) {
	            return true;
	        }
	        else {
	            return false;
	        }
	    },
	    //[End]

	    //[Start]
	    actSetValid_Handler: function (sender) {
	        ///<summary>启用:actSetValid</summary>
	        var FolderRow = $G.getCmp("gridView").getSelectionModel().getSelections()[0];
	        if (!FolderRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请选择一个文档模板!');
	        } else {
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == FolderRow.data.CREATE_DeptId) {
	                _this._IsValid(true);

	            } else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录下只能由创建部门设置!');
	            }
	        }

	    },
	    //[End]

	    //[Start]
	    Ap_TreeGrid_actExpandAll_Handler: function (sender) {
	        ///<summary>展开:展开</summary>
	        if (sender.id.indexOf('btnExpandAll') > -1) {
	            if (!_this._IsBizComp()) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择具体业务单据!");
	                return;
	            }
	        }
	        _super.Ap_TreeGrid_actExpandAll_Handler.apply(this, arguments);

	    },
	    //[End]

	    //[Start]
	    Ap_TreeGrid_actCollapseAll_Handler: function (sender) {
	        ///<summary>收缩:收缩</summary>
	        if (sender.id.indexOf('btn_RightTree') > -1) {
	            if (!_this._IsBizComp()) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择具体业务单据!");
	                return;
	            }
	        }
	        _super.Ap_TreeGrid_actCollapseAll_Handler(sender);

	    },
	    //[End]

	    //[Start]
	    actRefreshRightTree_Handler: function (sender) {
	        ///<summary>收缩:收缩</summary>
	        if (!_this._IsBizComp()) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择具体业务单据!");
	            return;
	        }
	        _super.actRefreshRightTree_Handler(sender);

	    },
	    //[End]

	    //[Start]
	    actDeleteAttach_Handler: function (sender) {
	        ///<summary>启用:actSetValid</summary>
	        var FolderRow = $G.getCmp("gridView").getSelectionModel().getSelections()[0];
	        if (!FolderRow) {
	            // Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请选择目录!');
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择一个文档模板!");
	        } else {
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == FolderRow.data.CREATE_DeptId) {
	                //	                _super.actDeleteAttach_Handler(sender);

	                var cmp = $G.getViewObject(sender);
	                var dataSource = cmp.dataSource;
	                var ds = $G.DataContext.getDataSource(dataSource);
	                var record = ds.getDataRecord();
	                if (!record)
	                    return;
	                var fileID = record.get("FileID");
	                var EditGuid = record.get("EditGuid");
	                var FileName = record.get("Name");
	                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, "删除"), function (e) {
	                    if (e == "yes") {
	                        //删除附件放在服务器端，如果添加附件，后再删除，使用客户端处理
	                        if (record.id < 0) {
	                            Ext.AppFrame.Attachment.DeleteFile(fileID, EditGuid, FileName);
	                        }
	                        ds.removeRecord();

	                        _this._doAction('DeleteDTFile', [FolderRow.data.ID], function (result) {
	                            //_this.DTFileGridQuery();
	                        });
	                    }
	                });

	            } else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录下只能由创建部门删除文档模板!');
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actNotValid_Handler: function (sender) {
	        ///<summary>停用:actNotValid</summary>
	        var FolderRow = $G.getCmp("gridView").getSelectionModel().getSelections()[0];
	        if (!FolderRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请选择一个文档模板!');
	        } else {
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == FolderRow.data.CREATE_DeptId) {
	                _this._IsValid(false);

	            } else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录下只能由创建部门设置!');
	            }
	        }

	    },
	    //[End]

	    //[Start]
	    actNewUpdateAttach_Handler: function (sender) {
	        ///<summary>编辑模板:actNewUpdateAttach</summary>
	        var selectedRow = $G.getCmp("gridView").getSelectionModel().getSelections()[0];
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '请选择一个文档模板!');
	        }
	        else {
	            if ($G.PageContext.userId == "0" || $G.PageContext.deptId == selectedRow.data.CREATE_DeptId) {
	                var ds = _this._getDT();
	                _this._doAction('FindByKey', [selectedRow.data.ID, ds.type], function (result) {
	                    $G.getCmp("windowDT").show();
	                    $G.getCmp("windowDT").tools.close.hide();
	                    ds.loadData(result);
	                });
	            }
	            else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, '该目录下只能由创建部门修改文档模板!');
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    col_Name_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        if (record.data.IsLeaf)
	            return "<div class='icon-area ci-auth-GTP_bizform-png' style='float:left'></div>" + val;
	        else
	            return "<div class='icon-area ci-tree-GTP_folder-png' style='float:left'></div>" + val;
	    },
	    //[End]

	    //[Start]
	    Efd_ApplyDept_Name_BeforeLookup: function (dialogOpt) {
	        ///<summary>BeforeLookup</summary>

	        var record = $G.DataContext.getDataSource('DTFolder').getDataRecord();
	        if (record.get("PID") > 0) {
	            var rightTree = $G.getCmp("rightTreeGrid");
	            var parent = rightTree.getStore().getById(record.get("PID"))
	            dialogOpt.dialogArgs.deployDeptId = parent.get("ApplyDept_DeptId");
	            return dialogOpt;
	        }
	        else {
	            if ($G.PageContext.userId == "0") {
	                delete dialogOpt.dialogArgs.deployDeptId;
	                return dialogOpt;
	            }
	            else {
	                dialogOpt.dialogArgs.deployDeptId = $G.PageContext.deptId;
	            }
	        }
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DocTemplate.DocTemplatePage = _class;
})();
//</Bottom>