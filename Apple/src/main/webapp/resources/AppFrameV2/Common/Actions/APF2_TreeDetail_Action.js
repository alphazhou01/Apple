(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {

        //[Start]
        __detail_ViewObject: function (sender) {
            if (sender) {
                return $G.getViewObject(sender);
            }
            else {
                return;
            }
        },
        //[End]

        //[Start]
        __detail_DataSource: function (sender) {
            var dataSource;
            if (sender.isXType && sender.isXType("datasource")) {
                dataSource = sender;
            } else if (sender.isXType("button")) {
                var grid = $G.getViewObject(sender);
                var ds = $G.DataContext.getDataSource(grid.dataSource);
                return ds;
            }
            else if (sender.isXType("gtpgridpanel") || sender.isXType("gtptreegridpanel")) {
                var ds = $G.DataContext.getDataSource(sender.dataSource);
                return ds;
            }
            else return;
        },
        //[End]

        //[Start]
        __detail_QueryPlan: function (dataSource) {
            ///<summary>获取主表的查询方案</summary>
            var queryPlan;
            if ($G.QueryPlans && $G.QueryPlans.items) {
                for (var i = 0; i < $G.QueryPlans.items.items.length; i++) {
                    var dsName = Ext.isString(dataSource) ? dataSource : dataSource.name;
                    if ($G.QueryPlans.items.items[i].dataSource == dsName) {
                        queryPlan = $G.QueryPlans.items.items[i];
                        break;
                    }
                }
            }
            return queryPlan;
        },
        //[End]

        //[Start]
        __detail_GetBillId: function (dataSource) {
            ///<summary>通过细表的查询方案获取单据的id，细表查询方案中Bill_ID设置了表达式，值为单据ID</summary>
            var queryPlan = _this.__detail_QueryPlan(dataSource);
            if (queryPlan) {
                var queryParam = queryPlan.getQueryParam();
                for (var i = 0; i < queryParam.filters.length; i++) {
                    if (queryParam.filters[i].type == "Filter" && queryParam.filters[i].propertyName == "Bill_ID" && queryParam.filters[i].value != "") {
                        return queryParam.filters[i].value;
                    }
                }
            }
        },
        //[End]

        //[Start]
        __treeDetail_ValidateChange: function (grid, callback, args) {
            ///<summary>验证数据是否有更新</summary>
            var ds = _this.__detail_DataSource(grid);

            var gridChange = grid.getChangeSummary(); //得到修改记录
            var dataChange = ds.getChangeSummary();   //得到添加和删除记录

            if (gridChange || dataChange) {
                var _billId = _this.__detail_GetBillId(ds); //获取单据ID，如果新增单据（id<0），数据清除
                if (_billId > 0) {
                    Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.DataChanged, function (e) {
                        if (e == "yes") {
                            $G.Page.treeDetail_actSave(grid);
                        } else {
                            callback.call(grid, args);
                        }
                    });
                }
                else {
                    Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "新增单据时，刷新细表将清空记录，是否刷新？", function (e) {
                        if (e == "yes") {
                            callback.call(grid, args);
                        }
                    });
                }
            }
            else {
                callback.call(grid, args);
            }
        },
        //[End]

        //[Start]
        __treeDetail_SetUpdateState: function (state) {
            ///<summary>设置状态，处理锁</summary>
            if (state) {
                //$G.States.setCurrentState("STATE_UPDATE");
            }
            else {
                //$G.States.setCurrentState("STATE_NOUPDATE");
            }
        },
        //[End]

        //[Start]
        __treeDetail_AddNode: function (tree, record, parent) {
            ///<summary>添加之后事件</summary>
            record.set("IsLeaf", true);

            if (!parent) {
                record.set("PID", 0);
                record.set("Level", 1);
                tree.store.add(record);

                //tree.getSelectionModel().selectFirstRow();
                if (Ext.isNumber(record.id)) {
                    tree.getSelectionModel().selectById(record.id)
                }
            }
            else {
                record.set("PID", parent.id);
                record.set("Level", parent.data.Level + 1);
                if (tree.queryLevel && tree.queryLevel != "0") {
                    tree.appendRowChild(parent, record.data);
                }
                else {
                    tree.appendRowChild(parent, record.data);
                }
                var store = tree.getStore();
                store.expandNode(parent);
            }
        },
        //[End]

        //[Start]
        __treeDetail_InitQueryBox: function (grid, config, injectToolBarName, injectIndex) {
            ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
            if (!config) {
                config = {};
            }
            config.hasSchemeManagement = false;
            config.getCriteira = function (queryBoxParam) {
                var qp = grid.apf_queryPlan;
                if (qp) {
                    qp.currentPage = 1;
                    if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
                }
                if (grid.AP_loadData && Ext.isFunction(grid.AP_loadData)) {
                    _this.__treeDetail_ValidateChange(grid, grid.AP_loadData,
                            {
                                resetpage: true,
                                isExpandAll: true,
                                pageSize: qp.pageSize,
                                noCacheParam: true
                            });
                }
            }

            Ext.AppFrame.Util.createQueryBox(grid, config);

            Ext.ux.query.showQueryBox(injectToolBarName, injectIndex); //("billView_QueryBoxToolbar", 1);
        },
        //[End]

        //[Start]
        treeDetail_actInit: function (tree) {
            ///<summary>页面加载</summary>
            //设置查询方案
            if (tree.initialConfig["s_InsertQueryBox"] == "true") {
                var toolBar = tree.getTopToolbar();
                if (!!toolBar && toolBar.xtype == "gtptoolbar") {
                    _this.__treeDetail_InitQueryBox(tree, null, toolBar.id, 0);
                }
            }
            tree.AP_getTreeFilter = function () {
                var Filters = new Array();
                var billId = _this.__detail_GetBillId(this.dataSource);
                if (billId) {
                    var fn = Ext.AppFrame.Common.addFilter;
                    Filters.push(fn("BraceStart", null, "eq", "And", null));
                    Filters.push(fn("Filter", "Bill_ID", "eq", billId, "zh_CN"));
                    Filters.push(fn("BraceEnd", null, "eq", "", null));
                }
                return Filters;
            };

            var ds = _this.__detail_DataSource(tree);

            //数据加载前触发
            ds.on("beforeloaddata", function (data) {
                _this.__treeDetail_SetUpdateState(false);
            });

            ds.on("aftersave", function (sender, result) {
                $G.Page.actTreeDetailQuery(tree, null, true); //强制刷新，因为此时保存按钮依然可用，不强制刷新会弹出提示信息
            });

            ds.on("afteradd", function () {
                _this.__treeDetail_SetUpdateState(true);
            }, this);
        },
        //[End]

        //[Start]
        treeDetail_actSave: function (tree) {
            ///<summary>保存:actSave</summary>
            var result = false;

            var ds = _this.__detail_DataSource(tree);
            /////////////////01、TreeGid无法校验数据，暂时去掉
            if (tree.validate() == false) {
                //Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoValid);
                return false;
            }
            else {
                var billId;
                var _filters = tree.AP_getTreeFilter();
                for (var j = 0; j < _filters.length; j++) {
                    if (_filters[j].propertyName == "Bill_ID") {
                        billId = _filters[j].value;
                    }
                }

                var gridChange = tree.getChangeSummary(); //得到修改记录
                var dataChange = ds.getChangeSummary();   //得到添加和删除记录
                if (!gridChange && !dataChange) {
                    _this.__treeDetail_SetUpdateState(false);
                    return true;
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
                        if (billId)
                            gridChange[i].Bill_ID = billId;
                        changeSummary.push(gridChange[i]);
                    }
                    else if (gridChange[i].__state == "modified") {
                        //0802版本新增记录的__type值为undefined，8月22日主干已更改
                        if (gridChange[i][ds.primaryKey[0]] < 0) {
                            for (var j = 0; j < dataChange.length; j++) {
                                if (dataChange[j].__state == "created" && gridChange[i][ds.primaryKey[0]] == dataChange[j][ds.primaryKey[0]]) {
                                    if (billId && (!dataChange[j].Bill_ID || dataChange[j].Bill_ID <= 0))
                                        dataChange[j].Bill_ID = billId;
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
                //如果是在tree.on("load")事件中代码加的记录，那么需要特殊处理
                for (var i = 0; i < dataChange.length; i++) {
                    if (dataChange[i].__state == "created") {
                        var j = 0;
                        for (j = 0; j < changeSummary.length; j++) {
                            if (dataChange[i][ds.primaryKey[0]] == changeSummary[j][ds.primaryKey[0]]) {
                                break;
                            }
                        }
                        if (j == changeSummary.length) {
                            if (billId) dataChange[i].Bill_ID = billId;
                            changeSummary.push(dataChange[i]);
                        }
                    }
                }
                if (deleteKeys.length == 0 && changeSummary.length == 0) {
                    return true;
                }

                var config = { action: "SaveChangesTreeQuery",
                    async: false,
                    changeSummary: changeSummary,
                    args: [changeSummary, deleteKeys, _filters],
                    success: function (ret) {
                        result = ret;
                    }
                };
                ds.AP_saveChangeList(ds.type, config);
            }
            return result;
        },
        //[End]

        //[Start]
        treeDetail_actCancel: function (sender) {
            ///<summary>取消:actCancel</summary>
            var grid = _this.__detail_ViewObject(sender);
            var ds = _this.__detail_DataSource(grid);

            var gridChange = grid.getChangeSummary(); //得到修改记录
            var dataChange = ds.getChangeSummary();   //得到添加和删除记录
            if (gridChange || dataChange) {
                $G.Page.actTreeDetailQuery(grid);
            }
            else {
                $G.Page.actTreeDetailQuery(grid, null, true);
            }
        },
        //[End]

        //[Start]
        treeDetail_actAddRoot: function (sender) {
            ///<summary>新建根:actAddRoot</summary>
            var grid = _this.__detail_ViewObject(sender);
            var ds = _this.__detail_DataSource(grid);

            var newrecord = ds.addRecord();
            _this.__treeDetail_AddNode(grid, newrecord, null);
        },
        //[End]

        //[Start]
        treeDetail_actAdd: function (sender) {
            ///<summary>添加:actAdd</summary>
            var grid = _this.__detail_ViewObject(sender);
            var ds = _this.__detail_DataSource(grid);

            var selectedRow = grid.getSelectionRow();
            if (selectedRow) {
                var parent = selectedRow.store.getNodeParent(selectedRow);
                var newrecord = ds.addRecord();
                _this.__treeDetail_AddNode(grid, newrecord, parent);
            }
            else {
                var newrecord = ds.addRecord();
                _this.__treeDetail_AddNode(grid, newrecord, null);
            }
        },
        //[End]

        //[Start]
        treeDetail_actAddChild: function (sender) {
            ///<summary>添加下级分类:actAddChild</summary>
            var grid = _this.__detail_ViewObject(sender);
            var ds = _this.__detail_DataSource(grid);

            var selectedRow = grid.getSelectionRow();
            if (!selectedRow) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
            }
            else {
                var newrecord = ds.addRecord();
                _this.__treeDetail_AddNode(grid, newrecord, selectedRow);
            }
        },
        //[End]

        //[Start]
        treeDetail_actRemove: function (sender) {
            ///<summary>删除:actRemove</summary>
            var grid = _this.__detail_ViewObject(sender);
            var ds = _this.__detail_DataSource(grid);

            var selectedRows = grid.AP_selectRows();
            if (selectedRows && selectedRows.length == 0) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
            }
            else {
                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
                    if (e == "yes") {
                        _this.__treeDetail_SetUpdateState(true);

                        for (var i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i].store) {
                                grid.removeRow(selectedRows[i]);
                            }
                            //需要删除数据源记录，否则与上面“如果是在tree.on("load")事件中代码加的记录，那么需要特殊处理”有错误
                            var recordId = selectedRows[i].get(ds.primaryKey[0]);

                            var index = ds.getDataStore().indexOfId(recordId);
                            if (index >= 0) ds.removeRecord(index);
                        }
                        grid.getSelectionModel().selectFirstRow();
                    }
                });
            }
        },
        //[End]

        //[Start]
        treeDetail_TreeGrid_BeforeEdit: function (e) {
            ///<summary>Before Edit</summary>
            if (!_this._isAuthAction("treeDetail_actSave")) return false;
        },
        //[End]

        //[Start]
        treeDetail_TreeGrid_AfterEdit: function (e) {
            ///<summary>AfterEdit</summary>
            if (e.value != e.originalValue && (e.value != "" && e.originalValue != null)) {
                _this.__treeDetail_SetUpdateState(true);

                e.record.set(e.field, e.value);
            }
        },
        //[End]

        //[Start]
        actTreeDetailQuery: function (sender, config, forceFresh) {
            var tree;
            if (sender && sender.xtype == "button") {
                tree = _this.__detail_ViewObject(sender);
            }
            else {
                tree = sender;
            }
            if (tree) {
                if (forceFresh) {
                    tree.AP_loadData(config);
                }
                else {
                    _this.__treeDetail_ValidateChange(tree, tree.AP_loadData, config);

                }
            }
        },
        //[End]

        //[Start]
        treeDetail_actRefresh: function (sender) {
            ///<summary>重写action库引入的刷新事件</summary>
            $G.Page.actTreeDetailQuery(sender, sender.config, sender.forceFresh);
            delete sender.forceFresh;
        },
        //[End]

        //[Start]
        __checkRow: function (tree, rows) {
            ///<summary>重新选中移动后的记录</summary>
            var record = tree.getSelectionRow();

            var indexList = [];
            var store = tree.getStore()
            for (var i = rows.length - 1; i >= 0; i--) {
                var recordId = rows[i].get(tree.keyField);
                var index = store.indexOfId(recordId);
                // if (index >= 0)
                //     Ext.DomQuery.select('img', tree.view.getRow(index))[0].className = tree.view.row_checked_class;
            }
            tree.getSelectionModel().clearSelections();

            if (record) {
                var recordId = record.get(tree.keyField);
                var index = store.indexOfId(recordId);
                tree.getSelectionModel().selectRow(index, false);
            }
        },
        //[End]


        __treeDetail_doMove_Handler: function (sender, msg) {
            var tree = _this.__detail_ViewObject(sender);
            if (tree) {
                tree.stopEditing();
                var rows = tree.AP_selectRows();
                if (rows && rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        if (msg == GTP.AppFrameV2.Res.MoveUp)
                            tree.moveUp2(rows[i]);
                        else if (msg == GTP.AppFrameV2.Res.MoveDown)
                            tree.moveDown2(rows[i]);
                        else if (msg == GTP.AppFrameV2.Res.UpGrade)
                            tree.UpGrade2(rows[i]);
                        else if (msg == GTP.AppFrameV2.Res.DownGrade)
                            tree.DownGrade2(rows[i]);

                    }
                    _this.__checkRow(tree, rows);
                }
                else Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.PleaseSelectNode, msg));
            }
        },


        treeDetail_actMoveUp: function (sender) {
            ///<summary>上移</summary>
            _this.__treeDetail_doMove_Handler(sender, GTP.AppFrameV2.Res.MoveUp);
        },
        treeDetail_actMoveDown: function (sender) {
            ///<summary>下移</summary>
            _this.__treeDetail_doMove_Handler(sender, GTP.AppFrameV2.Res.MoveDown);
        },
        treeDetail_actUpGrade: function (sender) {
            ///<summary>升级</summary>
            _this.__treeDetail_doMove_Handler(sender, GTP.AppFrameV2.Res.UpGrade);
        },

        treeDetail_actDeGrade: function (sender) {
            ///<summary>降级</summary>
            _this.__treeDetail_doMove_Handler(sender, GTP.AppFrameV2.Res.DownGrade);
        }
    });
})();