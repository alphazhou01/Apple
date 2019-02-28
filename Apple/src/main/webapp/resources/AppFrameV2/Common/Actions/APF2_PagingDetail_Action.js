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
        __pagerDetail_SetUpdateRule: function (state) {
            ///<summary>设置状态</summary>
            if (state) {
                var rule1 = Ext.getCmp("viewRule_Detail_NoUpdate");
                if (rule1) rule1.disable();
                var rule2 = Ext.getCmp("viewRule_Detail_Update");
                if (rule2) rule2.enable();
            }
            else {
                var rule1 = Ext.getCmp("viewRule_Detail_NoUpdate");
                if (rule1) rule1.enable();
                var rule2 = Ext.getCmp("viewRule_Detail_Update");
                if (rule2) rule2.disable();
            }
        },
        //[End]

        //[Start]
        __pagerDetail_ValidateChange: function (grid, callback, args) {
            ///<summary>验证数据是否有更新</summary>
            var ds = _this.__detail_DataSource(grid);
            var dataChange = ds.getChangeSummary();
            if (dataChange) {
                var _billId = _this.__detail_GetBillId(ds); //获取单据ID，如果新增单据（id<0），数据清除
                if (_billId > 0) {
                    Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.DataChanged, function (e) {
                        if (e == "yes") {
                            $G.Page.pagingDetail_actSave(grid);
                        } else {
                            callback.call(grid, args);
                        }
                    });
                }
                else {
                    Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "新建单据时，刷新细表将清空记录，是否刷新？", function (e) {
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
        __pagerDetail_InitQueryBox: function (grid, config, injectToolBarName, injectIndex) {
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
                    _this.__pagerDetail_ValidateChange(grid, grid.AP_loadData,
                            {
                                resetpage: true,
                                isExpandAll: true,
                                pageSize: qp.pageSize,
                                noCacheParam: true
                            });
                }
            }

            Ext.AppFrame.Util.createQueryBox(grid, config);

            Ext.ux.query.showQueryBox(injectToolBarName, injectIndex);
        },
        //[End]

        //[Start]
        pagingDetail_actInit: function (grid) {
            ///<summary>页面加载</summary>
            //设置查询方案
            if (grid.initialConfig["s_InsertQueryBox"] == "true") {
                var toolBar = grid.getTopToolbar();
                if (!!toolBar && toolBar.xtype == "gtptoolbar") {
                    _this.__pagerDetail_InitQueryBox(grid, null, toolBar.id, 0);
                }
            }
            var ds = _this.__detail_DataSource(grid);

            ds.on("beforeloaddata", function (data) {
                _this.__pagerDetail_SetUpdateRule(false);
            });
            ds.on("beforedelete", function (ds, result) {
                _this.__pagerDetail_SetUpdateRule(true);
            });
            ds.on("beforeadd", function (ds, result) {
                _this.__pagerDetail_SetUpdateRule(true);
            });
            ds.on("beforeupdate", function (sender, store, record, operation) {
                if (operation == Ext.data.Record.EDIT) {
                    _this.__pagerDetail_SetUpdateRule(true);
                }
            });

            //重写分页工具栏事件
            var paging = grid.getBottomToolbar();

            var doLoad = paging.doLoad;
            var todoLoad = function (start) {
                if (this.getXType() == "gtptoolbar") {
                    doLoad.call(this, start);
                }
                else {
                    var toolbar = this.AP_getPagingToolbar();
                    doLoad.call(toolbar, start);
                }
            }

            paging.doLoad = function (start) {
                _this.__pagerDetail_ValidateChange(grid, todoLoad, start)
            };
        },
        //[End]

        //[Start]
        pagingDetail_actSave: function (grid) {
            ///<summary>保存:actSave</summary>
            var result = false;

            var ds = _this.__detail_DataSource(grid);

            if (grid.validate() == false) {
                //Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoValid);
                return false;
            }
            else {
                var billId;
                var _filters = grid.apf_queryPlan.getQueryParam().filters;
                for (var j = 0; j < _filters.length; j++) {
                    if (_filters[j].propertyName == "Bill_ID") {
                        billId = _filters[j].value;
                        break;
                    }
                }

                var deleteKeys = new Array();
                var changeSummary = ds.getChangeSummary();
                if (!!changeSummary) {
                    for (var i = 0; i < changeSummary.length; i++) {
                        if (changeSummary[i].__state == "deleted" && changeSummary[i][ds.primaryKey[0]] > 0)
                            deleteKeys.push(changeSummary[i][ds.primaryKey[0]]);
                        else if (changeSummary[i].__state == "created") {
                            if (billId && (!changeSummary[i].Bill_ID || changeSummary[i].Bill_ID <= 0))
                                changeSummary[i].Bill_ID = billId;
                        }
                    }
                    var config = {
                        async: false,
                        action: "SaveChangesQuery",
                        args: [changeSummary, deleteKeys],
                        success: function (ret) {
                            result = ret;
                        }
                    };
                    ds.AP_saveChangeList(ds.type, config);
                }
                else {
                    result = true;
                }
            }

            return result;
        },
        //[End]

        //[Start]
        pagingDetail_actCancel: function (sender) {
            ///<summary>取消:actCancel</summary>

            $G.Page.actPagingDetailQuery();
        },
        //[End]

        //[Start]
        pagingDetail_actAdd: function (sender) {
            ///<summary>添加:actAdd</summary>
            var grid = _this.__detail_ViewObject(sender);
            var ds = _this.__detail_DataSource(grid);
            ds.addRecord();
        },
        //[End]

        //[Start]
        pagingDetail_actRemove: function (sender) {
            ///<summary>删除:actRemove</summary>
            var grid = _this.__detail_ViewObject(sender);

            var records = grid.AP_selectRows();
            if (records.length == 0) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
            }
            else {
                _this.__pagerDetail_SetUpdateRule(true);

                var ds = _this.__detail_DataSource(grid);

                grid.apf_ds.removeRecord(records);
            }
        },
        //[End]

        //[Start]
        pagingDetail_GridView_BeforeEdit: function (e) {
            ///<summary>BeforeEdit事件，验权</summary>
            if (!_this._isAuthAction("pagingDetail_actSave")) return false;
        },
        //[End]

        //[Start]
        actPagingDetailQuery: function (sender, config, forceFresh) {
            var grid;
            if (sender && sender.xtype == "button") {
                grid = _this.__detail_ViewObject(sender);
            }
            else {
                grid = sender;
            }
            if (grid) {
                var _billId; //单据id
                if (grid.apf_queryPlan) {
                    queryPlanParam = grid.apf_queryPlan.getQueryParam();
                    for (var i = 0; i < queryPlanParam.filters.length; i++) {
                        if (queryPlanParam.filters[i].propertyName == "Bill_ID") {
                            if (Ext.isNumber(queryPlanParam.filters[i].value))
                                _billId = queryPlanParam.filters[i].value;
                        }
                    }
                }
                if (Ext.isNumber(_billId)) {
                    if (forceFresh) {
                        grid.AP_loadData(config);
                    }
                    else {
                        _this.__pagerDetail_ValidateChange(grid, grid.AP_loadData, config);
                    }
                }
            }
        },
        //[End]

        //[Start]
        pagingDetail_actRefresh: function (sender) {
            ///<summary>重写action库引入的刷新事件</summary>
            $G.Page.actPagingDetailQuery(sender, sender.config, sender.forceFresh);
            delete sender.forceFresh;
        }
        //[End]

    });
})();