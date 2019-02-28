//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.TreeDictLookupPage,
	{
	    //</Top>

	    //[Start]
	    _treeFuzzySearchFields: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        return "Code;Name;Pinyin;JianPin";
	    },
	    //[End]

	    //[Start]
	    _getModuleCode: function () {
	        ///<summary></summary>
	        return $G.PageExtend.BizComponent;
	    },
	    //[End]

	    //[Start]
	    _initLayout: function () {
	        ///<summary>初始化布局</summary>
	        if ($G.Params.MultiSelect != true) {
	            var viewPort = $G.getCmp("viewport");

	            var sourcePanel = $G.getCmp("Source").ownerCt;
	            var selectedPanel = $G.getCmp("Selected").ownerCt;
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
	        ///<summary></summary>
	        _super.superclass()._init();

	        var action = $G.Actions.getAction("actNew");
	        if (action) action.setHidden(true);

	        //设置右侧工具条
	        //设置右表主工具栏为白色底色
	        var Source_toolbar = $G.getCmp("Source_toolbar");
	        if (Source_toolbar) {
	            Source_toolbar.addClass("x-grid-toolbar-blank-bg");
	            Source_toolbar.addClass("x-grid-toolbar-noborder");
	            Source_toolbar.ownerCt.addClass("x-grid-toolbar-noborder");
	            Source_toolbar.addClass("x-panel-padding3");
	        }

	        var Source_paging = $G.getCmp("Source_paging");
	        if (Source_paging) Source_paging.addClass("x-grid-toolbar-noborder");

	        //设置右侧工具条
	        //设置右表主工具栏为白色底色
	        var Selected_toolbar = $G.getCmp("Selected_toolbar");
	        if (Selected_toolbar) {
	            Selected_toolbar.addClass("x-grid-toolbar-blank-bg");
	            Selected_toolbar.addClass("x-grid-toolbar-noborder");
	            Selected_toolbar.addClass("x-panel-padding3");
	        }

	        var layoutPanel1 = $G.getCmp("layoutPanel1");
	        if (layoutPanel1) {
	            layoutPanel1.addClass("x-panel-padding10");
	            layoutPanel1.setWidth(layoutPanel1.getWidth() - 20);
	            layoutPanel1.setHeight(layoutPanel1.getHeight() - 20);
	            layoutPanel1.doLayout();
	        }
	        var viewPort = $G.getCmp("viewport");
	        viewPort.doLayout();
	    },
	    //[End]

	    //[Start]
	    _initCategoryTree: function () {
	        ///<summary></summary>
	        var treeView = $G.getCmp("treeView");
	        if (treeView) {
	            treeView.addClass("blank-row-line");

	            treeView.on("rowselect", function (item, index, node) {
	                var Source = $G.getCmp("Source");
	                var _queryplan = Source.apf_queryPlan;
	                var fullCode = node.get("FullCode");
	                _queryplan.setFilterValue("filter_C_FullCode_Equel", fullCode);
	                if ($G.getCmp("includeChild").getValue()) {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", fullCode + ".");
	                }
	                else {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", "");
	                }
	                _this._loadData({ resetpage: true, treeclick: true, noCacheParam: true });

	                //右侧标题栏上，显示所选分类名称
	                var textSelectedCategory = $G.getCmp("textSelectedCategory");
	                for (var i = 0; i < item.grid.colModel.getColumnCount(); i++) {
	                    if (item.grid.colModel.columns[i].dataIndex == "Name") {
	                        var cell = item.grid.view.getCell(index, i);
	                        if (cell && cell.textContent) {
	                            var text = cell.textContent;
	                            text = text.trim()
	                            textSelectedCategory.setText(text);
	                            break;
	                        }
	                    }
	                }
	            });

	            //设置左侧树的工具栏
	            var searchToolbar = $G.getCmp("treeView_search");
	            searchToolbar.enableOverflow = false; //参照框不折叠
	            var newwidth = 350;
	            if (searchToolbar.getWidth() == 0) {
	                newwidth = treeView.getTopToolbar().lastSize.width - 22;
	            }
	            else newwidth = searchToolbar.getWidth() - 8;

	            $G.getCmp('treeSearch').setWidth(newwidth);

	            treeView.getTopToolbar().on('resize', function (_this, w) {
	                $G.getCmp('treeSearch').setWidth(w - 8);
	            });

	            //设置包含下级事件
	            var includeChild = $G.getCmp("includeChild");
	            includeChild.on("check", function (value) {
	                var treeView = $G.getCmp("treeView");
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
	                    treeView.fireEvent("rowselect", treeView.getSelectionModel(), treeView.getSelectionModel().lastActive, records[0]);
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.superclass().Page_DocumentReady();

	        _this._initCategoryTree();

	        //设置左侧工具条
	        //设置右表主工具栏为白色底色，取掉边框
	        var CategoryTreeGrid_search = $G.getCmp("treeView_search");
	        if (CategoryTreeGrid_search) {
	            CategoryTreeGrid_search.addClass("x-grid-toolbar-noborder");
	            CategoryTreeGrid_search.addClass("x-grid-toolbar-blank-bg");

	            //有两组工具栏，会产生2px的内间距，去掉内间距
	            CategoryTreeGrid_search.ownerCt.addClass("x-panel-padding0");
	            CategoryTreeGrid_search.ownerCt.setWidth(CategoryTreeGrid_search.ownerCt.getWidth() + 5);
	            CategoryTreeGrid_search.ownerCt.doLayout();
	            CategoryTreeGrid_search.ownerCt.setWidth(CategoryTreeGrid_search.ownerCt.getWidth() - 1);
	            CategoryTreeGrid_search.ownerCt.doLayout();
	        }
	        $G.Page.actQueryTree(2);
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
	        var selectedRecords = new Array();

	        var multiSelectView = $G.Params.MultiSelectView;

	        //选择节点，这个树形的复选框是Render里设置的，使用Source.getSelectionModel().getSelections();不起作用
	        for (var rowIndex = 0; rowIndex < Source.view.getRows().length; rowIndex++) {
	            var row = Source.view.getRow(rowIndex);
	            if (Ext.DomQuery.select('img', row)[0].className == Source.view.row_checked_class) {
	                var record = Source.store.getAt(rowIndex);
	                if (multiSelectView == 0 && record.data.IsLeaf) {
	                    selectedRecords.push(record);
	                }
	                else if (multiSelectView == 1) {
	                    selectedRecords.push(record);
	                }
	            }
	            else if (Ext.DomQuery.select('img', row)[0].className == Source.view.row_partlyChecked_class) {
	                var record = Source.store.getAt(rowIndex);
	                if (multiSelectView == 0 && record.data.IsLeaf) {
	                    selectedRecords.push(record);
	                }
	                else if (multiSelectView == 1) {
	                    selectedRecords.push(record);
	                }
	            }
	        }

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
	    Source_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        // grid多选模式
	        if ($G.Params.MultiSelect == true) {
	            this.selectMode = "checkbox";
	        }
	    },
	    //[End]


	    //[Start]
	    actQueryTree: function (sender) {
	        ///<summary>查询:actQueryTree</summary>
	        var treeView = $G.getCmp("treeView");

	        var treeSearch = $G.getCmp("treeSearch");
	        if (treeSearch) {
	            if (sender == 1) {//点击清空
	                treeSearch.setValue("");
	            }
	            var searchValue = treeSearch.getValue();
	            var searchFields = $G.Page._treeFuzzySearchFields();
	            if (searchFields) {
	                var fuzzySearchFields = ";" + searchFields + ";";
	                var queryPlan = treeView.apf_queryPlan.getQueryParam();
	                queryPlan.filters
	                for (var i = 0; i < queryPlan.filters.length; i++) {
	                    var filter = queryPlan.filters[i];
	                    if (filter.propertyName != "" && fuzzySearchFields.indexOf(";" + filter.propertyName + ";") >= 0) {
	                        treeView.apf_queryPlan.setFilterValue(filter.valueRefrenceId, searchValue);
	                    }
	                }
	            }
	        }

	        treeView.AP_loadData();
	    },
	    //[End]

	    //[Start]
	    treeSearch_KeyUp: function (item, e) {
	        ///<summary>:KeyUp</summary>
	        if (e.keyCode == "13") $G.Page.actQueryTree(2);
	    },
	    //[End]

	    //[Start]
	    treeSearch_TriggerClick: function (index) {
	        ///<summary>:TriggerClick</summary>
	        if (index == 2) {//点查询
	            $G.Page.actQueryTree(2);
	        }
	        else if (index == 1) {//点清空
	            $G.Page.actQueryTree(1);
	        }
	    },
	    //[End]

	    //[Start]
	    treeView_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        var _treeView = item;
	        //显示成树形
	        var displayTreeView = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeDisplayTreeView", _this._getModuleCode());
	        if ($G.PageExtend["APE_LeftTreeDisplayTreeView"] == "true" || ($G.PageExtend["APE_LeftTreeDisplayTreeView"] == "" && displayTreeView == "true")) { //不修改左侧树，或者以TreeView显示左侧树
	            //树节点显示风格
	            var treeDisplayFormat = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeDisplayFormat", _this._getModuleCode());
	            if (treeDisplayFormat == "(null)") {
	                treeDisplayFormat = undefined;
	            }
	            //隐藏列头
	            _treeView.hideHeaders = true;
	            //隐藏列竖线
	            _treeView.columnLines = false;

	            var columnMap = new Array();
	            for (var i = 0; i < _treeView.colModel.getColumnCount(); i++) {
	                if (_treeView.colModel.columns[i].dataIndex != "Name") {
	                    _treeView.colModel.setHidden(i, false);
	                    _treeView.colModel.columns[i].hidden = true;

	                    columnMap.push(_treeView.id + "." + _treeView.colModel.columns[i].id);
	                }
	                else if (_treeView.colModel.columns[i].dataIndex == "Name") {
	                    _treeView.masterColumnID = _treeView.colModel.columns[i].id;
	                    if (_treeView.colModel.columns[i].width < 195) {
	                        _treeView.colModel.columns[i].width = 195;
	                    }
	                    var col = _treeView.colModel.columns[i];
	                    col.addRenderer(col.id + "_renderer", function (value, metadata, record, rowIndex, colIndex, store) {
	                        var firstColumnName;
	                        var secondColumnName;
	                        if (treeDisplayFormat) {
	                            treeDisplayFormat = treeDisplayFormat.replace(")", "");
	                            var fields = treeDisplayFormat.split("(");
	                            for (var i = 0; i < fields.length; i++) {
	                                if (!Ext.isEmpty(fields[i])) {
	                                    if (!firstColumnName)
	                                        firstColumnName = fields[i];
	                                    else {
	                                        secondColumnName = fields[i];
	                                        break;
	                                    }
	                                }
	                            }
	                        }

	                        if (!firstColumnName) firstColumnName = "Name"; //默认第一个显示属性为Name

	                        if (!secondColumnName || !record.get(secondColumnName)) {
	                            return record.get(firstColumnName);
	                        }
	                        else {
	                            if (secondColumnName == "FullCode")
	                                return record.get(firstColumnName) + '(' + record.get(secondColumnName).replace(".", "") + ')';
	                            else {
	                                return record.get(firstColumnName) + '(' + record.get(secondColumnName) + ')';
	                            }
	                        }
	                    }, this);
	                }
	            }

	            var _length = $G.States.items.getCount();
	            for (var i = 0; i < _length; i++) {
	                var stateItem = $G.States.items.itemAt(i);
	                if (stateItem.name == "STATE_ORIGINAL") {
	                    for (var j = 0; j < stateItem.items.getCount(); j++) {
	                        if (columnMap.include(stateItem.items.itemAt(j).referenceName)) {
	                            stateItem.items.removeKey(stateItem.items.itemAt(j).id);
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	    }
	    //[End]

	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.CategoryTreeLookupPage = _class;
})();
//</Bottom>