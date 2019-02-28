//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseLookup");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    _getSourceGrid: function () {
	        return $G.getCmp("Source");
	    },
	    //[End]

	    //[Start]
	    _getSelectedGrid: function () {
	        return $G.getCmp("Selected");
	    },
	    //[End]

	    //[Start]
	    _initLayout: function () {
	        ///<summary>初始化布局</summary>
	        if ($G.Params.MultiSelect != true) {
	            var viewPort = $G.getCmp("viewport");

	            var sourcePanel;
	            if (_this._getSourceGrid()) sourcePanel = _this._getSourceGrid().ownerCt;
	            var selectedPanel = _this._getSelectedGrid().ownerCt;
	            if (viewPort && selectedPanel && sourcePanel) {
	                var height = sourcePanel.getHeight() + selectedPanel.getHeight();
	                selectedPanel.setHeight(0);
	                selectedPanel.setVisible(false);
	                selectedPanel.hidden = true;
	                selectedPanel.doLayout();

	                sourcePanel.setHeight(height);
	                sourcePanel.region = "center";
	                sourcePanel.doLayout();
	                //sourcePanel.autoHeight = true;

	                viewPort.doLayout();
	            }
	        }
	    },
	    //[End]


	    //[Start]
	    _init: function () {
	        ///<summary>初始化函数</summary>

	        Ext.net.ResourceMgr.registerCssClass("removeDirtyImage", ".x-grid3-dirty-cell{background-image:none;}", false); //不需要三角

	        //输出参数OutEntity设置默认值
	        for (var i = 0; i < $G.PageParam.outputParams.length; i++) {
	            if ($G.PageParam.outputParams[i].name == "OutEntity" && $G.PageParam.outputParams[i].type == "entity") {
	                if ($G.Params.MultiSelect == true) {
	                    $G.PageParam.outputParams[i].value = "Selected";
	                }
	                else {
	                    $G.PageParam.outputParams[i].value = "Source";
	                }
	                break;
	            }
	        }
	        //设置布局，单选隐藏已选布局
	        _this._initLayout();


	        var grid = _this._getSourceGrid();
	        if (grid) {
	            $G.Page._initQueryBox(grid);
	            grid.on("rowdblclick", function (e) {
	                if ($G.Params.MultiSelect != true) _this.actSubmit_Handler(null);
	                else _this.actSelect_Handler(null);
	            }, this);
	        }

	        grid = _this._getSelectedGrid();
	        if (grid) {
	            grid.on("rowdblclick", function (e) {
	                _this.actRemove_Handler(null);
	            }, this);
	        }

	        var toolbarView = $G.getCmp("toolbarView");
	        toolbarView.addClass("x-plain-bbar");
	    },
	    //[End]

	    //[Start]
	    _loadData: function (config) {
	        ///<summary>增加虚方法以便派生类能重写</summary>
	        var grid = _this._getSourceGrid();
	        if (grid) grid.AP_loadData(config);
	    },
	    //[End]

	    //[Start]  
	    _setQueryPlanOnQueryBox: function (queryPlan) {
	        ///<summary>扩展查询方案</summary>

	    },
	    //[End]

	    //[Start]
	    _initQueryBox: function (grid, config, toolbarName, index) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
	        if ($G.PageExtend["APE_NoQueryBox"] == "true") return; //不创建QueryBox
	        if ($G.Params["noQueryBox"] == "true") return; //不创建QueryBox
	        if (!config) {
	            config = {};
	            config.hasSchemeManagement = $G.PageExtend["APE_HasSchemeManagement"] == "true"; //false默认还是不需要吧
	        }

	        //自己构建函数.
	        config.getCriteira = function (queryBoxParam) {
	            var qp = grid.apf_queryPlan;
	            _this._setQueryPlanOnQueryBox(qp);
	            if (qp) {
	                qp.currentPage = 1;
	                if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
	            }
	            _this._loadData({ resetpage: true, pageSize: qp.pageSize, noCacheParam: true });

	        }

	        var qvName = "queryView", cmp = $G.getCmp(qvName);
	        if (cmp && cmp.getForm().items.length > 0) {
	            config = Ext.apply(config || {}, { queryViewControlName: qvName });
	        }

	        Ext.AppFrame.Util.createQueryBox(grid, config);

	        if (!toolbarName) {
	            toolbarName = "Source_toolbar";
	        }
	        if (Ext.isEmpty(index) || (Ext.isNumber(index) && index < 0)) {
	            var toolbar = $G.getCmp(toolbarName);
	            if (toolbar && toolbar.items) {
	                index = $G.getCmp(toolbarName).items.length;
	            }
	        }
	        if (Ext.isEmpty(index) || index < 0) index = 0;
	        if (toolbarName) {
	            Ext.ux.query.showQueryBox(toolbarName, index);
	            _this._getSourceGrid().doLayout();
	        }
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        //振华提供，解决IE11下调整参照框大小，页面内容没有调整的bug
	        if (Ext.isIE11) {
	            window.onresize = function () {
	                console.log(window.innerWidth);
	                Ext.getBody().dom.style.width = window.innerWidth + 'px';
	                Ext.getBody().dom.style.height = window.innerHeight + 'px'
	            };
	        }
	        //TODO:钢子已更改,$G.getBizComp()先得到bizComp，再得到ModuleCode值
	        Ext.net.ResourceMgr['bizComp'] = "";
	        _super.Page_DocumentReady();
	    },
	    //[End]

	    //[Start]
	    _isGrideditable: function (grid) {
	        var canedit = false;
	        if (grid) {
	            if (!Ext.isEmpty(grid.ape_canedit)) return grid.ape_canedit;
	            var cols = grid.getColumnModel().columns;
	            if (cols) {
	                for (var i = 0; i < cols.length; i++) {
	                    if (cols[i].editable == true && !Ext.isEmpty(cols[i].editor)) {
	                        grid.ape_canedit = true;
	                        return true;
	                    }
	                }
	            }
	            grid.ape_canedit = false;
	        }
	        return false;
	    },
	    //[End]


	    //[Start]
	    _isSameRecord: function (sourceRecord, targetRecord) {
	        //判断是否为同一条记录，派生类可重写
	        return sourceRecord.id == targetRecord.id;

	    },

	    //[End]

	    //[Start]
	    _canSelectSameRecord: function () {
	        return $G.Params.CanSelectSameRec == true || $G.Params.CanSelectSameRec == "true";
	    },
	    //[End]

	    //[Start]
	    actSelect_Handler: function (sender) {
	        ///<summary>选择:actSelect</summary>
	        var Source = _this._getSourceGrid(), gvSelected = _this._getSelectedGrid();

	        //如果已选数据可编辑，那么不能使用store.add(record)，否则会有错误
	        var bCanEdit = _this._isGrideditable(gvSelected);
	        var gvSelectStore = gvSelected.getStore(), gvSourceStore = Source.getStore();


	        var selectedCount = gvSelectStore.getCount();
	        var selectedRecords = Source.getSelectionModel().getSelections();
	        var addRecords = [], bCanSelectSame = _this._canSelectSameRecord();

	        for (var i = 0; i < selectedRecords.length; i++) {
	            var record = selectedRecords[i];
	            var flag = false;
	            if (bCanSelectSame) flag = false;
	            else {
	                for (var j = 0; j < selectedCount; j++) {
	                    var rec = gvSelectStore.getAt(j);
	                    if (_this._isSameRecord(rec, record)) {
	                        flag = true;
	                        break;
	                    }
	                }
	            }
	            if (!flag) addRecords.push(record);
	        }
	        //03-31 ghy update 如果是树形控件，那么不能使用store.add(record)，否则展开节点时，报错
	        var bTreeGrid = false;
	        var sourceGrid = _this._getSourceGrid();
	        if (sourceGrid.getXType() == "gtptreegridpanel") {
	            bTreeGrid = true;
	        }

	        if (addRecords.length > 0) {
	            if (!bCanEdit && !bTreeGrid && !bCanSelectSame) gvSelectStore.add(addRecords);
	            else {
	                var ds = $G.DataContext.getDataSource("Selected");
	                for (var i = 0; i < addRecords.length; i++) {
	                    if (bCanSelectSame) ds.addRecord();
	                    else
	                        ds.addRecord(addRecords[i].id);
	                    ds.fields.each(function (f) {
	                        Gtp.util.DataSource.setFieldValue(ds, f.name, addRecords[i].data[f.name]);
	                    }, this);
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actRemove_Handler: function (sender) {
	        ///<summary>取消选择:actRemove</summary>
	        var Selected = _this._getSelectedGrid();
	        var records = Selected.getSelectionModel().getSelections();

	        //2013-12-16 删除时，页面呈现规则不起作用，钢子提供方法
	        //	    for (var i = 0; i < records.length; i++) {
	        //	        Selected.getStore().remove(records[i]);
	        //	    }
	        Selected.apf_ds.removeRecord(records);
	    },
	    //[End]

	    //[Start]
	    actSelectAll_Handler: function (sender) {
	        ///<summary>全选:actSelectAll</summary>
	        var Source = _this._getSourceGrid();
	        var gvSelected = _this._getSelectedGrid();
	        //如果已选数据可编辑，那么不能使用store.add(record)，否则会有错误
	        var bCanEdit = _this._isGrideditable(gvSelected);
	        var gvSelectStore = gvSelected.getStore();
	        var gvSourceStore = Source.getStore();

	        var selectedCount = gvSelectStore.getCount();
	        var recordsCount = gvSourceStore.getCount();
	        var addRecords = [], bCanSelectSame = _this._canSelectSameRecord();

	        for (var i = 0; i < recordsCount; i++) {
	            var record = gvSourceStore.getAt(i);
	            var flag = false;
	            if (bCanSelectSame) flag = false;
	            else {
	                for (var j = 0; j < selectedCount; j++) {
	                    var rec = gvSelectStore.getAt(j);
	                    if (_this._isSameRecord(rec, record)) {
	                        flag = true;
	                        break;
	                    }
	                }
	            }
	            if (!flag) addRecords.push(record);
	        }
	        //03-31 ghy update 如果是树形控件，那么不能使用store.add(record)，否则展开节点时，报错
	        var bTreeGrid = false;
	        var sourceGrid = _this._getSourceGrid();
	        if (sourceGrid && sourceGrid.getXType() == "gtptreegridpanel") {
	            bTreeGrid = true;
	        }

	        if (addRecords.length > 0) {
	            if (!bCanEdit && !bTreeGrid && !bCanSelectSame) gvSelectStore.add(addRecords);
	            else {
	                var ds = $G.DataContext.getDataSource("Selected");
	                for (var i = 0; i < addRecords.length; i++) {

	                    if (bCanSelectSame) ds.addRecord();
	                    else
	                        ds.addRecord(addRecords[i].id);

	                    ds.fields.each(function (f) {
	                        Gtp.util.DataSource.setFieldValue(ds, f.name, addRecords[i].data[f.name]);
	                    }, this);
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actRemoveAll_Handler: function (sender) {
	        ///<summary>全不选:actRemoveAll</summary>
	        var Selected = _this._getSelectedGrid();
	        Selected.getStore().removeAll();
	    },
	    //[End]

	    //[Start]
	    _getSelectedRecord: function () {
	        ///<summary>源数据控件名：Source；已选数据源名称：Selected</summary>
	        if ($G.Params.MultiSelect == false) {
	            var Source = _this._getSourceGrid();
	            var records = Source.getSelectionModel().getSelections();

	            if (records.length == 0) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
	                return;
	            }
	            else if (records.length > 1) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	                Source.getSelectionModel().clearSelections();
	                return;
	            }
	            else {
	                return records[0].data;
	            }
	        }
	        else {

	            var selectedStore = $G.DataContext.getDataSource("Selected").getDataStore();
	            //有时会忘记选择就以上面选的为准算了
	            // if (selectedStore.getCount() == 0) _this.actSelect_Handler();

	            var records = selectedStore.getRange();
	            if (!Ext.isArray(records)) records = [records];
	            var recordArray = [];
	            for (var i = 0; i < records.length; i++) {
	                recordArray.push(records[i].data);
	            }

	            if (recordArray.length > 0) {
	                return recordArray;
	            }
	            else {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actSubmit_Handler: function (sender) {
	        ///<summary>确定:actSubmit</summary>
	        var selectedRow = $G.Page._getSelectedRecord();
	        if (selectedRow) {
	            $G.setReturnValue("OutEntity", selectedRow);
	            $G.close(true);
	        }
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        $G.close(false);
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseLookup.LookupPage = _class;
})();
//</Bottom>