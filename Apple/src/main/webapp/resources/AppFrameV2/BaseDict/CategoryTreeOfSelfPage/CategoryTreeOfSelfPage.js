//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.CategoryTreeListPage,
	{
	    //</Top>

	    //[Start]
	    _bizLockTimeout: function () {
	        ///<summary>默认锁有效期15分钟，派生类扩展</summary>
	        return 15;
	    },
	    //[End]

	    //[Start]
	    _addBizLock: function (record, throwOnError) {
	        ///<summary>申请业务锁，锁定当前记录的RootId，</summary>
	        if (!$G.Page.__bizLockName) {
	            return true;
	        }
	        var result = false; //是否申请锁成功。如果弹出异常，返回默认false
	        if (!$G.Page.__bizLock) {
	            $G.Page.__bizLock = new Array();
	        }
	        if (!$G.Page.__bizLockDictID) { //记录申请锁的记录ID，__bizLock只记录根ID，不够用
	            $G.Page.__bizLockDictID = new Array();
	        }
	        var rootRow; //锁定记录的根节点
	        while (record) {
	            rootRow = record;
	            record = record.store.getNodeParent(record);
	        }
	        if (rootRow && rootRow.id > 0) {
	            if (rootRow.data.Level == 1) {
	                var Name = $G.getModuleCode() + "_" + rootRow.id; //锁标识
	                if (!$G.Page.__bizLock.include(Name)) {
	                    $G.dispatcher({
	                        async: false,
	                        action: "AcquireCustomLock",
	                        args: ["锁定树根节点", Name, $G.Page._bizLockTimeout(), throwOnError],
	                        success: function (data) {
	                            if (!$G.Page.__bizLock.include(Name)) {
	                                $G.Page.__bizLock.push(Name);
	                            }
	                            result = true;
	                        },
	                        failuer: function () {
	                            result = false;
	                        }
	                    });
	                }
	                else {
	                    result = true;
	                }
	            }
	            else {
	                if (!$G.Page.__bizLockDictID.include(rootRow.id)) {
	                    $G.dispatcher({
	                        async: false,
	                        action: "AcquireNodeRootLock",
	                        args: ["锁定树根节点", rootRow.data.PID, $G.getModuleCode(), rootRow.data.__type, $G.Page._bizLockTimeout(), throwOnError],
	                        success: function (identity) {
	                            if (identity) {
	                                if (!$G.Page.__bizLock.include(identity)) {
	                                    $G.Page.__bizLock.push(identity);
	                                }
	                                $G.Page.__bizLockDictID.push(rootRow.id)
	                                result = true;
	                            }
	                            else
	                                result = false;
	                        },
	                        failuer: function () {
	                            result = false;
	                        }
	                    });
	                }
	                else {
	                    result = true;
	                }
	            }
	        }
	        else {
	            result = true;
	        }
	        return result;
	    },
	    //[End]

	    //[Start]
	    _clearBizLock: function (throwOnError, forceRelease) {
	        ///<summary>添加业务锁</summary>
	        if (!$G.Page.__bizLockName) {
	            return true;
	        }
	        var result = true;
	        if ($G.Page.__bizLock && Ext.isArray($G.Page.__bizLock) && $G.Page.__bizLock.length > 0) {
	            var errorMessage = "";
	            for (var i = 0; i < $G.Page.__bizLock.length; i++) {
	                $G.dispatcher({
	                    async: false,
	                    action: "ReleaseCustomLock",
	                    args: [$G.Page.__bizLock[i], throwOnError],
	                    success: function () {
	                        $G.Page.__bizLock.remove($G.Page.__bizLock[i]);
	                        i--;
	                    },
	                    failure: function (re, type, message) {
	                        if (message && message.indexOf("[Custom]") > 0 && message.indexOf("的锁不存在") > 0) {
	                            if (forceRelease) {
	                                $G.Page.__bizLock.remove($G.Page.__bizLock[i]);
	                                i--;
	                            }
	                            else
	                                errorMessage = GTP.AppFrameV2.Res.NoSaveBecauseUpdated;
	                        }
	                    }
	                });
	            }
	            if (!forceRelease) {
	                if (errorMessage == GTP.AppFrameV2.Res.NoSaveBecauseUpdated) {
	                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, errorMessage);
	                }

	                if ($G.Page.__bizLock.length > 0) {
	                    result = false;
	                }
	            }
	        }
	        return result;
	    },
	    //[End]

	    //[Start]
	    _addChild: function (record, parent, brother) {
	        ///<summary>添加之后事件</summary>
	        var tree = $G.getCmp("rightTreeGrid")
	        record.set("IsLeaf", true);

	        if (!parent) {
	            if (brother) {
	                record.set("PID", brother.get("PID"));
	                record.set("Level", brother.get("Level"));
	                tree.appendRowSibling(brother, record.data);
	            }
	            else {
	                record.set("PID", 0);
	                record.set("Level", 1);
	                tree.store.add(record);
	                tree.getSelectionModel().selectFirstRow();
	            }

	            if (tree.store.getTotalCount() == 0) {
	                //*********用下面的代替上面设置规则*********
	                var Ap_TreeGrid_actMoveUp = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actMoveUp");
	                var Ap_TreeGrid_actMoveDown = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actMoveDown");
	                var Ap_TreeGrid_actUpGrade = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actUpGrade");
	                var Ap_TreeGrid_actDeGrade = Gtp.net.Global.Actions.getAction("Ap_TreeGrid_actDeGrade");
	                var actSave = Gtp.net.Global.Actions.getAction("actSave");
	                var actCancel = Gtp.net.Global.Actions.getAction("actCancel");
	                Ap_TreeGrid_actMoveUp.setDisabled(true);
	                Ap_TreeGrid_actMoveDown.setDisabled(true);
	                Ap_TreeGrid_actUpGrade.setDisabled(true);
	                Ap_TreeGrid_actDeGrade.setDisabled(true);
	                actSave.setDisabled(false);
	                actCancel.setDisabled(false);
	                //*********用上面的代替上面设置规则*********
	            }

	        }
	        else {
	            record.set("PID", parent.id);
	            record.set("Level", parent.get("Level") + 1);
	            tree.appendRowChild(parent, record.data);
	            var store = tree.getStore();
	            store.expandNode(parent);
	        }

	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>页面加载</summary>
	        _super._init();

	        var isBizLock = Ext.AppFrame.Common.getModuleApfExtend("APE_BizLock");
	        if (isBizLock == false || isBizLock == "false") {
	            $G.Page.__bizLockName = false;
	        }
	        else {
	            $G.Page.__bizLockName = true;
	        }

	        var ds = $G.DataContext.getDataSource("RightTreeQuery");
	        //数据加载前触发
	        ds.on("beforeloaddata", function (data) {
	            _this._setUpdateState(false);
	        });
	        ds.on("aftersave", function (sender, result) {
	            $G.Page.actQueryRightTree(null, true); //强制刷新，因为此时保存按钮依然可用，不强制刷新会弹出提示信息
	        });

	        ds.on("afteradd", function (result) {
	            _this._setUpdateState(true);

	            var treeView = $G.getCmp("leftTreeGrid");
	            var records = treeView.getSelectionModel().getSelections();
	            if (records.length == 0) {
	                return;
	            }
	            result.set("C_ID", records[0].data[treeView.keyField]);
	        }, this);

	        var leftTreeGrid = $G.getCmp("leftTreeGrid");
	        leftTreeGrid.getSelectionModel().on("beforerowselect", function (item, index, keepExisting, node) {

	            var selectRow = function (config) {

	                var item = config[0], index = config[1], keepExisting = config[2], node = config[3];

	                var selectModel = $G.getCmp("leftTreeGrid").getSelectionModel();
	                var r = selectModel.grid.store.getAt(index);
	                if (r) {
	                    if (!keepExisting || selectModel.singleSelect) {
	                        selectModel.clearSelections();
	                    }
	                    selectModel.selections.add(r);
	                    selectModel.last = selectModel.lastActive = index;

	                    selectModel.grid.getView().onRowSelect(index);

	                    if (!selectModel.silent) {
	                        selectModel.fireEvent('rowselect', selectModel, index, r);
	                        selectModel.fireEvent('selectionchange', selectModel);
	                    }
	                }

	            };
	            _this._saveRightDictChange(selectRow, [item, index, keepExisting, node]);

	            return false;
	        });

	        var tree = $G.getCmp("rightTreeGrid");
	        tree.on("rowclick", function (item, rowindex, e) {
	            //执行这个主要是为了触发规则..
	            if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", tree.apf_ds.type) == "true") {
	                var records = item.AP_selectRows();
	                if (records.length > 0) {
	                    if (records[0].data.D_DeptId != Ext.AppFrame.Common.getDeptId()) {
	                        var actRemove = Gtp.net.Global.Actions.getAction("actRemove");
	                        actRemove.setDisabled(true);
	                    }
	                    else {
	                        var actRemove = Gtp.net.Global.Actions.getAction("actRemove");
	                        actRemove.setDisabled(false);
	                    }
	                }
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actSave_Handler: function (sender) {
	        ///<summary>保存:actSave</summary>
	        var ds = $G.DataContext.getDataSource("RightTreeQuery");
	        var grid = $G.getCmp("rightTreeGrid")
	        /////////////////01、TreeGid无法校验数据，暂时去掉
	        if (grid.validate() == false) {
	            //Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoValid);
	            return false;
	        }
	        else {
	            var clearResult = $G.Page._clearBizLock(true, false);

	            if (clearResult) {
	                var gridChange = grid.getChangeSummary(); //得到修改记录
	                var dataChange = ds.getChangeSummary();   //得到添加和删除记录
	                if (!gridChange && !dataChange) {
	                    _this._setUpdateState(false);
	                    return;
	                }
	                gridChange = gridChange ? gridChange : new Array();
	                dataChange = dataChange ? dataChange : new Array();

	                var deleteKeys = new Array();
	                var changeSummary = new Array();
	                for (var i = 0; i < gridChange.length; i++) {
	                    if (gridChange[i].__state == "deleted") {
	                        if (gridChange[i][ds.primaryKey[0]] > 0) {
	                            deleteKeys.push(gridChange[i][ds.primaryKey[0]]);
	                            changeSummary.push(gridChange[i]);
	                        }
	                    }
	                    else if (gridChange[i].__state == "created") {
	                        //0802版本新增记录的__type值为undefined，8月22日主干已更改
	                        if (gridChange[i].__type == undefined) {
	                            gridChange[i].__type = ds.type;
	                        }
	                        changeSummary.push(gridChange[i]);
	                    }
	                    else if (gridChange[i].__state == "modified") {
	                        //0802版本新增记录的__type值为undefined，8月22日主干已更改
	                        if (gridChange[i].ID < 0) {
	                            for (var j = 0; j < dataChange.length; j++) {
	                                if (dataChange[j].__state == "created" && gridChange[i].ID == dataChange[j].ID) {
	                                    changeSummary.push(dataChange[j]);
	                                    break;
	                                }
	                            }
	                        }
	                        else {
	                            changeSummary.push(gridChange[i]);
	                        }
	                    }
	                    else {
	                        changeSummary.push(gridChange[i]);
	                    }
	                }

	                var config = { action: "SaveChangesTreeQuery", changeSummary: changeSummary, args: [changeSummary, deleteKeys, grid.AP_getTreeFilter()] };
	                ds.AP_saveChangeList(ds.type, config);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>

	        $G.Page.actQueryRightTree(null, true);
	    },
	    //[End]

	    //[Start]
	    actAddRoot_Handler: function (sender) {
	        ///<summary>新建根:actAddRoot</summary>
	        var tree = $G.getCmp("rightTreeGrid");
	        var ds = tree.getDataSource();
	        if (tree.getStore().getCount() > 0) {
	            var lastNode = tree.getStore().getAt(tree.getStore().getCount() - 1);
	            var newrecord = ds.addRecord();
	            _this._addChild(newrecord, null, lastNode);
	        }
	        else {
	            var newrecord = ds.addRecord();
	            _this._addChild(newrecord, null, null);
	        }
	    },
	    //[End]

	    //[Start]
	    actAdd_Handler: function (sender) {
	        ///<summary>添加:actAdd</summary>
	        var tree = $G.getCmp("rightTreeGrid");

	        var ds = tree.getDataSource();

	        var selectedRow = tree.getSelectionRow();
	        if (selectedRow) {
	            var parent = selectedRow.store.getNodeParent(selectedRow);
	            if (parent) {
	                var result = $G.Page._addBizLock(parent, true); //为父亲节点加锁
	                if (result) {
	                    var newrecord = ds.addRecord();
	                    _this._addChild(newrecord, parent, null);
	                }
	            }
	            else {
	                var newrecord = ds.addRecord();
	                _this._addChild(newrecord, null, selectedRow);
	            }
	        }
	        else {
	            var newrecord = ds.addRecord();
	            _this._addChild(newrecord, null, null);
	        }
	    },
	    //[End]

	    //[Start]
	    actAddChild_Handler: function (sender) {
	        ///<summary>添加下级分类:actAddChild</summary>
	        var tree = $G.getCmp("rightTreeGrid");
	        var selectedRow = tree.getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectNode);
	        }
	        else {
	            var result = $G.Page._addBizLock(selectedRow, true);
	            if (result) {
	                var ds = tree.getDataSource();
	                var newrecord = ds.addRecord();
	                _this._addChild(newrecord, selectedRow, null);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actRemove_Handler: function (sender) {
	        ///<summary>删除:actRemove</summary>
	        var selectedRow = $G.getCmp("rightTreeGrid").getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectNode);
	        }
	        else {
	            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
	                if (e == "yes") {
	                    var result = $G.Page._addBizLock(selectedRow, true);
	                    if (result) {
	                        //TODO:不好用，在控件的移除行事件和数据源的移除行事件都不好用，需要钢子处理
	                        _this._setUpdateState(true);
	                        //TODO:上面设置规则不好用
	                        $G.getCmp("rightTreeGrid").removeRow(selectedRow);
	                        $G.getCmp("rightTreeGrid").getSelectionModel().selectFirstRow();
	                    }
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    _setUpdateState: function (state) {
	        ///<summary>设置状态，处理锁</summary>
	        if (state) {
	            $G.States.setCurrentState("STATE_UPDATE");
	        }
	        else {
	            $G.States.setCurrentState("STATE_NOUPDATE");
	        }
	    },
	    //[End]

	    //[Start]
	    rightTreeGrid_BeforeEdit: function (e) {
	        ///<summary>BeforeEdit</summary>
	        if (!_this._isAuthAction("actSave")) return false;
	        //当前组织才能维护
	        var ds = $G.DataContext.getDataSource("RightTreeQuery");
	        if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", ds.type) == "true") {
	            if (e.record.data.D_DeptId != Ext.AppFrame.Common.getDeptId()) return false;
	        }
	        //树形控件不能使用ds.on("beforeupdate", function());方式,这种方式只有编辑后换行才出发，换单元个不出发规则
	        //08-19_this._setUpdateState(true);
	    },
	    //[End]

	    //[Start]
	    rightTreeGrid_AfterEdit: function (e) {
	        ///<summary>AfterEdit</summary>
	        if (e.value != e.originalValue && (e.value != "" && e.originalValue != null)) {
	            var result = $G.Page._addBizLock(e.record, true);
	            if (result) {
	                _this._setUpdateState(true);

	                e.record.set(e.field, e.value);
	            }
	            else {
	                //设置为不可编辑状态
	                e.record.set(e.field, e.originalValue);
	                e.record.commit(true);
	                return false;
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _saveRightDictChange: function (callback, args) {
	        ///<summary>左侧数据有更新，返回true表示没有更改内容；返回false表示异步处理，返回值时还没有保存数据，根据弹出框的返回值处理</summary>
	        var actSave = $G.getCmp("btnSave");
	        if (actSave.disabled == false) {
	            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.DataChanged, function (e) {//数据有更新,是否继续?
	                if (e == "yes") {
	                    var state = _this.actSave_Handler();
	                    if (state == false) {
	                        return;
	                    }
	                } else {
	                    $G.getCmp("btnSave").setDisabled(true);
	                }
	                callback(args);
	            });
	        }
	        else {
	            callback(args);
	        }
	    },
	    //[End]

	    //[Start]
	    actQueryLeftTree: function (sender) {
	        ///<summary>查询:actQueryLeftTree</summary>
	        _this._saveRightDictChange(_super.actQueryLeftTree, sender);
	    },
	    //[End]

	    //[Start]
	    actQueryRightTree: function (config, forceFresh) {

	        var loadData = function (config) {
	            $G.getCmp("rightTreeGrid").AP_loadData(config);
	        };
	        if (forceFresh) {
	            //清空业务锁
	            $G.Page._clearBizLock(false, true);
	            loadData(config);
	        }
	        else {
	            _this._saveRightDictChange(loadData, config);
	        }
	    },
	    //[End]

	    //[Start]
	    Ap_TreeGrid_actRefresh_Handler: function (sender) {
	        ///<summary>重写action库引入的刷新事件</summary>
	        $G.Page.actQueryRightTree();
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.CategoryTreeOfSelfPage = _class;
})();
//</Bottom>