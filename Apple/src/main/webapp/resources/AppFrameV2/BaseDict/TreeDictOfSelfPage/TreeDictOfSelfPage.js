//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.TreeDictListPage,
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
	        var tree = $G.getCmp("dictView")
	        record.set("IsLeaf", true);

	        if (parent) {
	            record.set("PID", parent.id);
	            record.set("Level", parent.data.Level + 1);

	            var store = tree.getStore();
	            if (!store.isExpandedNode(parent)) {
	                if (!store.isLoadedNode(parent)) {
	                    tree.fireEvent("beforeexpand", tree, parent);
	                }
	                store.expandNode(parent);
	            }

	            var index = store.indexOf(record.data);
	            if (index >= 0) {
	                tree.getSelectionModel().selectRow(record.data);
	            }
	            else {
	                tree.appendRowChild(parent, record.data); //全部加载
	                store.expandNode(parent);
	            }
	        }
	        else if (brother) {
	            record.set("PID", brother.data.PID);
	            record.set("Level", brother.data.Level);

	            tree.appendRowSibling(brother, record.data);
	        }
	        else {
	            record.set("PID", 0);
	            record.set("Level", 1);
	            tree.store.add(record);
	            tree.getSelectionModel().selectFirstRow();
	        }
	        var icol = -1, cols = tree.colModel.columns;
	        for (var i = 0; i < cols.length; i++) {
	            if (cols[i].editable && cols[i].editor != null) {
	                icol = i;
	                break;
	            }
	        }
	        if (icol > -1) {
	            var row = tree.getSelectionRow(), irow = row.store.indexOf(row);
	            tree.startEditing(irow, icol);
	        }
	        //record.beginEdit(); //TGEP-10315...直接保存不验证

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

	        var ds = $G.DataContext.getDataSource("TreeDictQuery");
	        //数据加载前触发
	        ds.on("beforeloaddata", function (data) {
	            _this._setUpdateState(false);
	        });
	        ds.on("aftersave", function (sender, result) {
	            $G.Page.actQuery(null, true); //强制刷新，因为此时保存按钮依然可用，不强制刷新会弹出提示信息
	        });
	        var tree = $G.getCmp("dictView");
	        tree.apf_ds.on("afteradd", function () {
	            _this._setUpdateState(true);
	        }, this);
	        //	        tree.store.on("beforeadd", function (sender, result) {
	        //	            if ((Ext.isArray(result) && result[0].id < 0) || (!Ext.isArray(result) && result.id < 0)) {
	        //	                //第一次添加时不起作用，按钮状态都是页面状态设置的
	        //	                _this._setUpdateState(true);
	        //	            }
	        //	        });



	        tree.on("rowclick", function (item, rowindex, e) {
	            //执行这个主要是为了触发规则..
	            if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", tree.apf_ds.type) == "true") {
	                var records = item.getSelectionModel().getSelections();
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
	        var ds = $G.DataContext.getDataSource("TreeDictQuery");
	        var grid = $G.getCmp("dictView")
	        grid.stopEditing();
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

	                var config = { action: "SaveChangesTreeQuery", changeSummary: changeSummary, args: [changeSummary, deleteKeys, grid.AP_getTreeFilter()], success: function (result) {
	                    if (Ext.isArray(result) && result.length > 0) {
	                        var grid = $G.getCmp("dictView")
	                        if (Ext.isNumber(result[result.length - 1])) {
	                            grid.selectedId = result[result.length - 1];
	                        }
	                    }
	                    else if (Ext.isNumber(result)) {
	                        var grid = $G.getCmp("dictView")
	                        if (grid.getStore().indexOfId(result) >= 0) {
	                            grid.selectedId = result;
	                        }
	                    }
	                }
	                };
	                ds.AP_saveChangeList(ds.type, config);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AbortSave), function (e) {
	            if (e == "yes") {
	                $G.Page.actQuery(null, true);
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actAddRoot_Handler: function (sender) {
	        ///<summary>新建根:actAddRoot</summary>
	        var ds = $G.DataContext.getDataSource("TreeDictQuery");
	        var newrecord = ds.addRecord();
	        _this._addChild(newrecord, null);
	    },
	    //[End]

	    //[Start]
	    actAdd_Handler: function (sender) {
	        ///<summary>添加:actAdd</summary>
	        var selectedRow = $G.getCmp("dictView").getSelectionRow();
	        var result = true;
	        var parent = null;

	        if (selectedRow) {
	            result = $G.Page._addBizLock(selectedRow, true);
	            if (result) var parent = selectedRow.store.getNodeParent(selectedRow);
	        }

	        if (result) {
	            var ds = $G.DataContext.getDataSource("TreeDictQuery");
	            var newrecord = ds.addRecord();
	            _this._addChild(newrecord, parent, selectedRow);
	        }
	    },
	    //[End]

	    //[Start]
	    actAddChild_Handler: function (sender) {
	        ///<summary>添加下级分类:actAddChild</summary>
	        var selectedRow = $G.getCmp("dictView").getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	        else {
	            var result = $G.Page._addBizLock(selectedRow, true);
	            if (result) {
	                var ds = $G.DataContext.getDataSource("TreeDictQuery");
	                var newrecord = ds.addRecord();
	                _this._addChild(newrecord, selectedRow);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actRemove_Handler: function (sender) {
	        ///<summary>删除:actRemove</summary>
	        var selectedRow = $G.getCmp("dictView").getSelectionRow();
	        if (!selectedRow) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	        else {
	            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
	                if (e == "yes") {
	                    var result = $G.Page._addBizLock(selectedRow, true);
	                    if (result) {
	                        //TODO:不好用，在控件的移除行事件和数据源的移除行事件都不好用，需要钢子处理
	                        _this._setUpdateState(true);
	                        //TODO:上面设置规则不好用
	                        var dictView = $G.getCmp("dictView");
	                        dictView.removeRow(selectedRow);

	                        var ds = $G.DataContext.getDataSource(dictView.dataSource);
	                        //从数据源中移除
	                        var index = ds.getDataStore().indexOfId(selectedRow.id);
	                        if (index >= 0) {
	                            ds.removeRecord(index);
	                        }
	                        dictView.getSelectionModel().selectFirstRow();
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
	            $G.States.setCurrentState("STATE_UPDATE", true);
	        }
	        else {
	            $G.States.setCurrentState("STATE_NOUPDATE", true);
	        }
	    },
	    //[End]

	    //[Start]
	    dictView_BeforeEdit: function (e) {
	        ///<summary>BeforeEdit</summary>
	        if (!_this._isAuthAction("actSave")) return false;
	        //当前组织才能维护
	        var ds = $G.DataContext.getDataSource("TreeDictQuery");
	        if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", ds.type) == "true") {
	            if (e.record.data.D_DeptId != Ext.AppFrame.Common.getDeptId()) return false;
	        }
	        //树形控件不能使用ds.on("beforeupdate", function());方式,这种方式只有编辑后换行才出发，换单元个不出发规则
	        //08-19_this._setUpdateState(true);
	    },
	    //[End]

	    //[Start]
	    dictView_AfterEdit: function (e) {
	        ///<summary>AfterEdit</summary>
	        if (e.value != e.originalValue && (!Ext.isEmpty(e.value) || !Ext.isEmpty(e.originalValue))) {
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
	    _loadData: function (config) {
	        //增加虚方法，便于扩展
	        $G.getCmp("dictView").AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    actQuery: function (config, forceFresh) {
	        if (forceFresh) {
	            //清空业务锁
	            $G.Page._clearBizLock(false, true);

	            _this._loadData(config);
	        }
	        else {
	            //保存按钮不可用，读取的相应action依然可用，两者状态不一致
	            var actSave = $G.getCmp("btnSave");
	            if (actSave.disabled == false) {
	                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.DataChanged, function (e) {//数据有更新,是否继续?
	                    if (e == "yes") {
	                        _this.actSave_Handler();
	                    }
	                    else {
	                        _this._loadData(config);
	                    }
	                });
	            }
	            else {
	                _this._loadData(config);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    Ap_TreeGrid_actRefresh_Handler: function (sender) {
	        ///<summary>重写action库引入的刷新事件</summary>
	        $G.Page.actQuery();
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.TreeDictOfSelfPage = _class;
})();
//</Bottom>