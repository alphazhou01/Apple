//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseLookup.LookupPage,
	{
	    //</Top>

	    //[Start]
	    _initLayout: function () {
	        ///<summary>初始化布局</summary>

	        var singleTreeFunc = function () {
	            var viewPort = $G.getCmp("viewport");
	            //设置查询方案居左
	            //	            var Source_toolbar = $G.getCmp("Source_toolbar");
	            //	            if (Source_toolbar) {
	            //	                Source_toolbar.addClass("x-panel-width0");
	            //	                Source_toolbar.addClass("x-grid-toolbar-blank-bg");
	            //	                Source_toolbar.addClass("x-grid-toolbar-noborder");
	            //	            }
	            $G.getCmp("textSource").setVisible(false);
	            var sourcePanel = $G.getCmp("Source").ownerCt;
	            var selectedPanel = $G.getCmp("Selected").ownerCt;
	            var centerButton = $G.getCmp("centerButton").ownerCt;
	            if (viewPort && selectedPanel && sourcePanel && centerButton) {
	                selectedPanel.ownerCt.initialConfig.layout = "border";
	                centerButton.ownerCt.remove(centerButton, false);
	                selectedPanel.ownerCt.remove(selectedPanel, false);
	                sourcePanel.ownerCt.doLayout();
	                viewPort.doLayout();
	            }
	        }

	        if ($G.Params.MultiSelect == true) {
	            //视图模式，0单树，1左右树多选视图
	            if ($G.Params.MultiSelectView == 0) {
	                singleTreeFunc();
	            }
	        }
	        else {
	            singleTreeFunc();
	        }
	    },
	    //[End]

	    //[Start]
	    _getSelectedRecord: function () {
	        ///<summary>源数据控件名：Source；已选数据源名称：Selected</summary>
	        var getdata = function (records) {
	            if (!Ext.isArray(records)) records = [records];
	            var recordArray = [];
	            for (var i = 0; i < records.length; i++) {
	                recordArray.push(records[i].data);
	            }
	            return recordArray;
	        };

	        if ($G.Params.MultiSelect == false || ($G.Params.MultiSelect && $G.Params.MultiSelectView == 0)) {
	            var Source = $G.getCmp("Source");
	            var _sm = Source.getSelectionModel();
	            var records = ($G.Params.MultiSelect) ? _sm.getCheckedRecords() : _sm.getSelections();
	            if (records.length == 0) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
	                return;
	            }
	            return ($G.Params.MultiSelect == false) ? records[0].data : getdata(records);
	        }
	        else {
	            var records = $G.DataContext.getDataSource("Selected").getDataStore().getRange();
	            if (Ext.isEmpty(records)) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoSelectedRecord);
	                return;
	            }
	            return getdata(records);
	        }
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary></summary>
	        //判断是否有新增功能，字典有次功能，单据没有
	        var hasNewRecordAuth = false;
	        //TP-30894 addButtonDisplayMode为0则一直隐藏，2则一直显示,
	        var editPageModuleCode = _this._getEditPageModuleCode(); //在调用基类之前

	        _super._init();

	        var authItemName = $G.PageExtend["AddAuthItemName"];
	        var addButtonDisplayMode = $G.PageExtend["AddButtonDisplayMode"];
	        var dictLookupAddMode = $G.PageExtend["DictLookupAddMode"];

	        if (editPageModuleCode && authItemName && addButtonDisplayMode) {
	            if (addButtonDisplayMode == "0") {
	                hasNewRecordAuth = false;
	            } else if (addButtonDisplayMode == "2") {
	                hasNewRecordAuth = true;
	            }
	            else {
	                hasNewRecordAuth = _this._AuthItemDemand(editPageModuleCode, authItemName, 0);
	            }
	        }
	        if (hasNewRecordAuth) {
	            var newPeer = $G.Actions.getAction("actNewPeer");
	            if (newPeer) {
	                var addButton = $G.getCmp("SplitButton");
	                if (addButton) {
	                    addButton.setVisible(true);
	                    addButton.on("click", _this.actNewPeer_Handler);
	                }
	                newPeer.setHidden(false);
	            }
	            var newChild = $G.Actions.getAction("actNewChild");
	            if (newChild) newChild.setHidden(true);
	        }
	        else {
	            var addButton = $G.getCmp("SplitButton");
	            if (addButton) addButton.setVisible(false);

	            var newPeer = $G.Actions.getAction("actNewPeer");
	            if (newPeer) newPeer.setHidden(true);
	            var newChild = $G.Actions.getAction("actNewChild");
	            if (newChild) newChild.setHidden(true);
	        }

	        var Efd_add = $G.getCmp("Efd_add");
	        var Efd_addall = $G.getCmp("Efd_addall");
	        var Efd_del = $G.getCmp("Efd_del");
	        var Efd_delall = $G.getCmp("Efd_delall");
	        Efd_add.setWidth(40);
	        Efd_addall.setWidth(40);
	        Efd_del.setWidth(40);
	        Efd_delall.setWidth(40);

	        var Selected_toolbar = $G.getCmp("Selected_toolbar");
	        if (Selected_toolbar) Selected_toolbar.addClass("x-toolbar-title-height");

	        var Source_toolbar = $G.getCmp("Source_toolbar");
	        if (Source_toolbar) Source_toolbar.addClass("x-toolbar-title-height");

	        //上面工具条设置高度，如果gridview不dolayout，grid下边框不可见
	        var Selected = $G.getCmp("Selected");
	        if (Selected) Selected.doLayout();

	        var grid = $G.getCmp("Source");
	        if (grid) {
	            if ($G.Params.SelectMode == 0) {
	                delete grid.checkboxMode;
	            }
	            else if ($G.Params.SelectMode == 1) {
	                grid.checkboxMode = "notcascade";
	            }
	            else if ($G.Params.SelectMode == 2) {
	                grid.checkboxMode = "notcascade";
	                grid.view.on("refresh", function () {
	                    var list = Ext.select('.ux-maximgb-tg-nl-minus,.ux-maximgb-tg-elbow-end-plus')
	                    list.each(function (item, index) {
	                        var p = item.parent();
	                        p.next().setStyle('display', 'none')
	                    })
	                });
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _loadData: function (config) {
	        ///<summary>增加虚方法以便派生类能重写</summary>
	        $G.getCmp("Source").AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
	        _this._loadData();
	    },
	    //[End]

	    //[Start] 
	    _getEditPageModuleCode: function () {
	        var ret = $G.PageExtend["EditPageModuleCode"];
	        if (ret == "$BizCmpFullName$") {
	            ret = $G.PageExtend["ModuleCode"];
	        }
	        if (Ext.isEmpty($G.PageExtend.BizComponent)) {
	            $G.PageExtend.BizComponent = $G.PageExtend["EditPageModuleCode"]; //查询方案要用到
	        }
	        return ret;
	    },
	    //[End]

	    //[Start]
	    actNewPeer_Handler: function (sender) {
	        ///<summary>新增分类:actNewPeer</summary>
	        var editPageModuleCode = _this._getEditPageModuleCode();
	        var authItemName = $G.PageExtend["AddAuthItemName"];
	        var addButtonDisplayMode = $G.PageExtend["AddButtonDisplayMode"];
	        //一直显示的话，需要先验证权限
	        if (addButtonDisplayMode == "2") {
	            if (_this._AuthItemDemand(editPageModuleCode, authItemName, 0) != true) {
	                $G.alert(GTP.AppFrameV2.Res.Hint, "当前用户没有新建权限");
	                return;
	            }
	        }

	        var addWindowHight = this.initialConfig.dialogHeight;
	        var addWindowWidth = this.initialConfig.dialogWidth;

	        var editPage = $G.PageExtend["EditPage"];
	        if (editPage) {
	            var editUrl = $G.getPageURLByFullName(editPage);
	            if (editUrl) {
	                $G.open({
	                    url: editUrl,
	                    target: "_modal",
	                    callback: function (r) {
	                        _this._loadData();
	                    },
	                    scope: _this,
	                    features: { dialogWidth: addWindowWidth || "700px", dialogHeight: addWindowHight || "450px" }
	                });
	            }
	            else {
	                $G.alert(GTP.AppFrameV2.Res.Hint, "维护页面配置错误");
	            }
	        }
	        else {
	            $G.alert(GTP.AppFrameV2.Res.Hint, "没有配置维护页");
	        }
	    },
	    //[End]

	    //[Start]
	    actNewChild_Handler: function (sender) {
	        ///<summary>新增子分类:actNewChild</summary>
	        if ($G.PageExtend.EditPage) {
	            var Source = $G.getCmp("Source");
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
	                var filter = _this._getQueryPlanFilterDept();
	                if (Ext.isArray(filter)) {
	                    filter = Ext.util.JSON.encode(filter);
	                } else if (filter == null) {
	                    filter = "";
	                }
	                //设置PID
	                var pid = records[0].id;
	                var params = { pid: pid, state: "STATE_EDIT", filter: filter };
	                _this.__redirectEditPage(sender, params);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _getQueryPlanFilterDept: function () {
	        ///<summary>获取Source数据源中查询方案中部门的过滤项，Group_Or</summary>
	        var qp = $G.QueryPlans.getQueryPlan("queryPlan"); //基类确定为queryPlan
	        var queryParam = qp.getQueryParam();
	        var group_pos = -1;
	        var eq_pos = -1;
	        var like_pos = -1;
	        var end_pos = -1;
	        for (var i = 0; i < queryParam.filters.length; i++) {
	            if (queryParam.filters[i].type == "BraceStart" && (queryParam.filters[i].value == "or" || queryParam.filters[i].value == "and")) {
	                if (eq_pos < 0 || like_pos < 0)
	                    group_pos = i;
	            }
	            else if (queryParam.filters[i].valueRefrenceId == "filter_D_FullDeptId_Eq" && !!queryParam.filters[i].value) {
	                eq_pos = i;
	            }
	            else if (queryParam.filters[i].valueRefrenceId == "filter_D_FullDeptId_Like" && !!queryParam.filters[i].value) {
	                like_pos = i;
	            }
	            else if (queryParam.filters[i].type == "BraceEnd") {
	                if (eq_pos > 0 && like_pos > 0) {
	                    end_pos = i;
	                    break;
	                }
	            }
	        }
	        var filter;
	        if (eq_pos > 0 && like_pos > 0) {
	            filter = new Array();
	            filter.push(queryParam.filters[group_pos]);
	            filter.push(queryParam.filters[eq_pos]);
	            filter.push(queryParam.filters[like_pos]);
	            filter.push(queryParam.filters[end_pos]);
	        }
	        return filter;
	    },
	    //[End]

	    //[Start]
	    __redirectEditPage: function (sender, params) {
	        ///<summary>重定向到编辑页</summary>
	        var absoluteUrl = $G.getPageURLByFullName($G.PageExtend.EditPage);
	        var id = $G.open({
	            url: absoluteUrl,
	            target: "_modal",
	            features: { dialogWidth: sender.dialogWidth, dialogHeight: sender.dialogHeight },
	            parameters: params,
	            callback: function (ret) {
	                if (ret.state) {
	                    var Source = $G.getCmp("Source");
	                    Source.AP_loadData();
	                }
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actClearSelectedItem_Handler: function (sender) {
	        ///<summary>清空:actClearSelectedItem</summary>
	        var action = $G.Actions.getAction("actRemoveAll");
	        action.execute()
	    },
	    //[End]

	    //[Start]
	    Source_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        if ($G.Params.MultiSelect == true) {
	            //	            //视图模式，0单树，1左右树多选视图
	            //	            if ($G.Params.MultiSelectView == 0) {
	            var sourceGrid = $G.getCmp("Source");
	            sourceGrid.selectMode = "checkbox";
	            //              }
	        }
	    },
	    //[End]

	    //[Start]
	    actSelect_Handler: function (sender) {
	        ///<summary>选择:actSelect</summary>
	        var Source = Ext.getCmp('Source');

	        var gvSelected = Ext.getCmp('Selected');
	        //如果已选数据可编辑，那么不能使用store.add(record)，否则会有错误
	        var bCanEdit = _this._isGrideditable(gvSelected);
	        var gvSelectStore = gvSelected.getStore();
	        var gvSourceStore = Source.getStore();

	        var selectedCount = gvSelectStore.getCount();
	        var selectedRecords = Ext.getCmp('Source').getSelectionModel().getCheckedRecords();
	        var addRecords = [];
	        for (var i = 0; i < selectedRecords.length; i++) {
	            var record = selectedRecords[i];
	            var flag = false;
	            for (var j = 0; j < selectedCount; j++) {
	                var rec = gvSelectStore.getAt(j);
	                if (rec.id == record.id) {
	                    flag = true;
	                    break;
	                }
	            }
	            if (!flag) addRecords.push(record);
	        }
	        //03-31 ghy update 如果是树形控件，那么不能使用store.add(record)，否则展开节点时，报错
	        var bTreeGrid = false;
	        var sourceGrid = Ext.getCmp('Source');
	        if (sourceGrid.getXType() == "gtptreegridpanel") {
	            bTreeGrid = true;
	        }

	        if (addRecords.length > 0) {
	            if (!bCanEdit && !bTreeGrid) gvSelectStore.add(addRecords);
	            else {
	                var ds = $G.DataContext.getDataSource("Selected");
	                for (var i = 0; i < addRecords.length; i++) {
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
	            if (_this._isCanSelect(record)) {
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
	            }
	            else {
	                flag = true;
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
	    _isCanSelect: function (sourceRecord) {
	        var isLeaf = sourceRecord.get("IsLeaf");
	        if ($G.Params.SelectMode == 2) {
	            if (!isLeaf) {
	                return false;
	            }
	        }
	        return true;
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.TreeDictLookupPage = _class;
})();
//</Bottom>