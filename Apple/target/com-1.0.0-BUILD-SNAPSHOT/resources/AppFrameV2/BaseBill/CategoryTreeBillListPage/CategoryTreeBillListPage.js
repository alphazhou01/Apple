//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseBill");
    var _class = Ext.extend(GTP.AppFrameV2.BaseBill.TreeBillListPage,
	{
	    //</Top>

	    //[Start]
	    _treeFuzzySearchFields: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        return "Code;Name;PinYin;JianPin;FullCode";
	    },
	    //[End]

	    //[Start]
	    _categoryControlNames: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        return "btnCollapseAll;btnExpandTo;includeChild;btn_TreeGrid_Add_menu1;ToolbarSeparator;btnAp_TreeGrid_actMoveUp;btnAp_TreeGrid_actMoveDown;btnAp_TreeGrid_actUpGrade;btnAp_TreeGrid_actDeGrade;";
	    },
	    //[End]

	    //[Start]
	    _initQueryBox: function (grid, config, injectToolBarName, injectIndex) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
	        if (!config) {
	            config = {};
	        }
	        if (!config.getCriteira) {
	            //自己构建函数.
	            config.getCriteira = function (queryBoxParam) {
	                var _queryplan = grid.apf_queryPlan;
	                if (_queryplan) {
	                    var CategoryTreeGrid = $G.getCmp("CategoryTreeGrid");
	                    if (CategoryTreeGrid) {
	                        var records = CategoryTreeGrid.getSelectionModel().getSelections();
	                        if (records.length == 0) {
	                            return;
	                        }
	                        var fullCode = records[0].get("FullCode");
	                        _queryplan.setFilterValue("filter_C_FullCode_Equel", fullCode);
	                        if ($G.getCmp("includeChild").getValue()) {
	                            _queryplan.setFilterValue("filter_C_FullCode_Like", fullCode + ".");
	                        }
	                        else {
	                            _queryplan.setFilterValue("filter_C_FullCode_Like", "");
	                        }
	                    }
	                    _queryplan.currentPage = 1;
	                    if (queryBoxParam.size > 0) _queryplan.pageSize = queryBoxParam.size;
	                }

	                if (grid.AP_loadData && Ext.isFunction(grid.AP_loadData)) grid.AP_loadData(
                    {
                        resetpage: true,
                        isExpandAll: true,
                        pageSize: _queryplan.pageSize,
                        queryPlanParamProperties: _this._getQueryPlanParamProperties(),
                        noCacheParam: true
                    });
	            }
	        }


	        var index = $G.getCmp(injectToolBarName).items.indexOf($G.getCmp("ToolbarSearchFill"))
	        if (index > 0) {
	            _super._initQueryBox(grid, config, injectToolBarName, index + 1);
	        }
	        else {
	            _super._initQueryBox(grid, config, injectToolBarName, injectIndex);
	        }
	    },
	    //[End]

	    //[Start]
	    _initCategoryTree: function () {
	        var CategoryTreeGrid = $G.getCmp("CategoryTreeGrid");
	        if (CategoryTreeGrid) {
	            CategoryTreeGrid.windowViewName = "treeWindowView";
	            CategoryTreeGrid.entityViewName = "treeEntityView";

	            var madifyLeftTree = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeModify");
	            if (madifyLeftTree != "true") {
	                var CategoryTreeGrid_toolbar_Edit = $G.getCmp("CategoryTreeGrid_toolbar_Edit");
	                if (CategoryTreeGrid_toolbar_Edit)
	                    CategoryTreeGrid_toolbar_Edit.setVisible(false);

	                CategoryTreeGrid.addClass("blank-row-line");
	            }
	            else {//修改左侧树
	                var CategoryTreeGrid_search = $G.getCmp("CategoryTreeGrid_search");
	                if (CategoryTreeGrid_search)
	                    CategoryTreeGrid_search.setVisible(false);
	                var btnShowSearch = $G.getCmp("btnShowSearch");
	                if (btnShowSearch)
	                    btnShowSearch.setVisible(true);
	                //设置字典维护工具栏无边框
	                var CategoryTreeGrid_toolbar_Edit = $G.getCmp("CategoryTreeGrid_toolbar_Edit");
	                if (CategoryTreeGrid_toolbar_Edit)
	                    CategoryTreeGrid_toolbar_Edit.addClass("x-grid-toolbar-border2");

	                //标识是否显示左树查询框
	                _this.__isShowSearch = false;
	            }

	            CategoryTreeGrid.on("rowselect", function (item, index, node) {
	                var billView = $G.getCmp("billView");
	                var _queryplan = billView.apf_queryPlan;
	                var fullCode = node.get("FullCode");
	                _queryplan.setFilterValue("filter_C_FullCode_Equel", fullCode);
	                if ($G.getCmp("includeChild").getValue()) {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", fullCode + ".");
	                }
	                else {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", "");
	                }

	                billView.AP_loadData({ resetpage: true, firstLoad: $G.Page.__fistLoad });
	                //加载后删除此变量
	                delete $G.Page.__fistLoad;

	                //右侧标题栏上，显示所选分类名称
	                var textSelectedCategory = $G.getCmp("textSelectedCategory");
	                for (var i = 0; i < item.grid.colModel.getColumnCount(); i++) {
	                    if (item.grid.colModel.columns[i].dataIndex == "Name") {
	                        var cell = item.grid.view.getCell(index, i);
	                        if (cell && (cell.textContent || cell.innerText)) {
	                            var text = (cell.textContent ? cell.textContent : cell.innerText);
	                            text = text ? text.trim() : "";
	                            if (text.length > 20) {
	                                text = text.substr(0, 20) + "...";
	                            }
	                            textSelectedCategory.setText(text);
	                            break;
	                        }
	                    }
	                }
	            });

	            CategoryTreeGrid.on("remove", function (item, index, node) {
	                if (item.getXType() == "gtptreegridpanel") {
	                    var count = item.getStore().getCount();
	                    if (count == 0) {
	                        var textSelectedCategory = $G.getCmp("textSelectedCategory");
	                        if (textSelectedCategory) textSelectedCategory.setText("");
	                    }
	                }
	            });

	            //设置左侧树的工具栏
	            var searchToolbar = $G.getCmp("CategoryTreeGrid_search");
	            if (searchToolbar) {
	                searchToolbar.enableOverflow = false; //参照框不折叠
	                var newwidth = 350;
	                if (searchToolbar.getWidth() == 0) {
	                    newwidth = CategoryTreeGrid.getTopToolbar().lastSize.width - 30;
	                }
	                else newwidth = searchToolbar.getWidth() - 10;

	                $G.getCmp('treeSearch').setWidth(newwidth);

	                CategoryTreeGrid.getTopToolbar().on('resize', function (_this, w) {
	                    $G.getCmp('treeSearch').setWidth(w - 12);
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

	            //设置包含下级事件
	            var includeChild = $G.getCmp("includeChild");
	            if (includeChild) {
	                includeChild.el.setStyle("margin-top", "0px");
	                includeChild.on("check", function (value) {
	                    var CategoryTreeGrid = $G.getCmp("CategoryTreeGrid");
	                    var records = CategoryTreeGrid.getSelectionModel().getSelections();
	                    if (records.length == 0) {
	                        return;
	                    }
	                    else if (records.length > 1) {
	                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                        CategoryTreeGrid.getSelectionModel().clearSelections();
	                        return;
	                    }
	                    else {
	                        CategoryTreeGrid.fireEvent("rowselect", CategoryTreeGrid.getSelectionModel(), CategoryTreeGrid.getSelectionModel().lastActive, records[0]);
	                    }
	                });
	            }


	            //分类树相关操作控件名称数据
	            var categoryControlNameList = _this._categoryControlNames().split(";");

	            var categoryIsList = Ext.AppFrame.Common.getModuleApfExtend("APE_CategoryIsList");
	            if (categoryIsList == "true") {
	                var _length = $G.States.items.getCount();
	                for (var i = 0; i < _length; i++) {
	                    var stateItem = $G.States.items.itemAt(i);
	                    if (stateItem.name == "STATE_ORIGINAL") {
	                        for (var j = 0; j < stateItem.items.getCount(); j++) {
	                            if (categoryControlNameList.include(stateItem.items.itemAt(j).referenceName)) {
	                                stateItem.items.itemAt(j).hidden = true;
	                            }
	                        }
	                        for (var j = 0; j < categoryControlNameList.length; j++) {
	                            if (!Ext.isEmpty(categoryControlNameList[j])) {
	                                if ($G.getCmp(categoryControlNameList[j])) {
	                                    if (Ext.isFunction($G.getCmp(categoryControlNameList[j]).hide)) {
	                                        $G.getCmp(categoryControlNameList[j]).hide();
	                                    }
	                                    $G.getCmp(categoryControlNameList[j]).hidden = true;
	                                }
	                            }
	                        }
	                        break;
	                    }
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init();

	        _this._initCategoryTree();

	        //设置变量__fistLoad，表明单据第一次加载，在加载后，将此变量删除
	        $G.Page.__fistLoad = true;

	        //设置右表主工具栏为白色底色
	        var billView_QueryBoxToolbar = $G.getCmp("billView_QueryBoxToolbar");
	        if (billView_QueryBoxToolbar) {
	            billView_QueryBoxToolbar.addClass("x-grid-toolbar-blank-bg");
	            billView_QueryBoxToolbar.addClass("x-grid-toolbar-noborder");
	        }
	        //去掉操作工具栏边框
	        var billView_toolbar = $G.getCmp("billView_toolbar");
	        if (billView_toolbar) {
	            billView_toolbar.addClass("x-grid-toolbar-noborder");
	            if (billView_toolbar.ownerCt) {
	                billView_toolbar.ownerCt.addClass("x-grid-toolbar-noborder");
	            }
	            //有两组工具栏，会产生2px的内间距，去掉内间距
	            billView_toolbar.ownerCt.addClass("x-panel-padding0");
	            billView_toolbar.ownerCt.setWidth(billView_toolbar.ownerCt.getWidth() + 7);
	            billView_toolbar.ownerCt.doLayout();
	            billView_toolbar.ownerCt.setWidth(billView_toolbar.ownerCt.getWidth() - 1);
	            billView_toolbar.ownerCt.doLayout();
	        }
	        //去掉分组工具栏边框
	        var billView_pagingbar = $G.getCmp("billView_pagingbar");
	        if (billView_pagingbar)
	            billView_pagingbar.addClass("x-grid-toolbar-noborder");
	    },
	    //[End]

	    //[Start]
	    _initDeptTree: function (config, renderToPanel) {
	        var tabViewCategory_tabD = $G.getCmp("tabViewCategory_tabD");
	        if (!renderToPanel) {
	            //生成panel，放在Tab的一个新页签下
	            if (tabViewCategory_tabD) {
	                renderToPanel = "tabViewCategory_tabD";
	            }
	        }

	        var isShowDeptTree = false;
	        var showDeptTree = $G.Params.showDeptTree;
	        if (showDeptTree == true) //是否显示组织机构树判断依据：输入参数>业务表单扩展数据
	        {
	            isShowDeptTree = true;
	        }
	        else if (showDeptTree == false) {
	            isShowDeptTree = false;
	        }
	        else {
	            var ape_showDeptTree = Ext.AppFrame.Common.getModuleApfExtend("APE_ShowDeptTree");
	            var d = $G.PageExtend["APE_ShowDeptTree"];
	            if (ape_showDeptTree == "true") {
	                isShowDeptTree = true;
	            }
	        }
	        if (isShowDeptTree == false) {

	            _this.__hideDeptTreeSplit(renderToPanel);

	            if (tabViewCategory_tabD) {
	                var tabView = tabViewCategory_tabD.ownerCt;
	                if (tabView.items.length == 1) {
	                    tabView.setVisible(false);
	                }
	                else if (tabView.items.length == 2) {
	                    var panel = tabView.ownerCt;

	                    var categoryTreeGrid = $G.getCmp("CategoryTreeGrid");
	                    if (categoryTreeGrid) {
	                        categoryTreeGrid.ownerCt.addClass("x-panel-body-treeborder1");

	                        panel.add(categoryTreeGrid);
	                        panel.doLayout();
	                        panel.remove(tabView);
	                    }
	                    panel.doLayout();
	                }
	            }
	        }
	        else {
	            if (tabViewCategory_tabD) {
	                tabViewCategory_tabD.setVisible(true);
	                tabViewCategory_tabD.ownerCt.setVisible(true);
	            }
	            _this.__createDeptTree(config, renderToPanel);

	            //treeGrid的title去掉，展开折叠刷新按钮放在edit工具条上
	            var CategoryTreeGrid_toolbar_Edit = $G.getCmp("CategoryTreeGrid_toolbar_Edit");
	            if (CategoryTreeGrid_toolbar_Edit) {
	                var btnExpandTo = $G.getCmp("btnExpandTo");
	                var btnCollapseAll = $G.getCmp("btnCollapseAll");
	                var btnRefreshLeftTree = $G.getCmp("btnRefreshLeftTree");

	                if (btnExpandTo && btnCollapseAll && btnRefreshLeftTree)
	                    CategoryTreeGrid_toolbar_Edit.addItem([btnExpandTo, btnCollapseAll, btnRefreshLeftTree]);
	            }
	            var CategoryTreeGrid_topTitle = $G.getCmp("CategoryTreeGrid_topTitle");
	            if (CategoryTreeGrid_topTitle)
	                CategoryTreeGrid_topTitle.setVisible(false);

	            var tabViewCategory = $G.getCmp("tabViewCategory");
	            if (tabViewCategory) {
	                tabViewCategory.addClass("x-panel-tabtitle-bg");
	                tabViewCategory.ownerCt.addClass("x-panel-body-treeborder1");

	                tabViewCategory.doLayout();
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _redirectEditPage: function (id, state, params, target) {
	        ///<summary>重定向编辑页面，默认打开新Tab方式</summary>
	        var treeView = $G.getCmp("CategoryTreeGrid");
	        var records = treeView.getSelectionModel().getSelections();
	        if (records.length == 0) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.PleaseSelect, "一个分类"));
	            return;
	        }
	        else if (records.length > 1) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.PleaseSelect, "一个分类"));
	            treeView.getSelectionModel().clearSelections();
	            return;
	        }
	        else if (records.length == 1) {
	            var categoryRow = records[0];

	            var default_params = {
	                categoryId: categoryRow.get("ID"),
	                CategoryName: categoryRow.get("Name")
	            };
	            params = Ext.applyIf(params || {}, default_params);

	            _super._redirectEditPage(id, state, params, target);
	        }
	    },
	    //[End]

	    //[Start]
	    _loadData: function (config) {
	        ///<summary>加载页面数据，11.25新加函数</summary>
	        $G.Page.actQueryTree(2);
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
	    actQueryTree: function (sender) {
	        ///<summary>查询:actQueryTree</summary>
	        var treeView = $G.getCmp("CategoryTreeGrid");

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

	        var config = { resetpage: true };
	        treeView.AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    actShowSearch_Handler: function (sender) {
	        ///<summary>actShowSearch</summary>
	        var CategoryTreeGrid_search = $G.getCmp("CategoryTreeGrid_search");

	        CategoryTreeGrid_search.setVisible(!_this.__isShowSearch);

	        _this.__isShowSearch = !_this.__isShowSearch;

	        var CategoryTreeGrid = $G.getCmp("CategoryTreeGrid");

	        CategoryTreeGrid_search.enableOverflow = false; //参照框不折叠

	        var newwidth = CategoryTreeGrid_search.getWidth() - 11;

	        $G.getCmp('treeSearch').setWidth(newwidth);
	    },
	    //[End]

	    //[Start]
	    CategoryTreeGrid_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        var _treeView = item;
	        var madifyLeftTree = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeModify");
	        var displayTreeView = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeDisplayTreeView");
	        if (madifyLeftTree != "true" || displayTreeView == "true") { //不修改左侧树，或者以TreeView显示左侧树
	            //树节点显示风格
	            var treeDisplayFormat = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeDisplayFormat");
	            if (treeDisplayFormat == "(null)") {
	                treeDisplayFormat = undefined;
	            }
	            //隐藏列头
	            _treeView.hideHeaders = true;
	            //隐藏列竖线
	            _treeView.columnLines = false;
	            _treeView.addClass("blank-row-line");

	            var columnMap = new Array();
	            for (var i = 0; i < _treeView.colModel.getColumnCount(); i++) {
	                if (_treeView.colModel.columns[i].dataIndex != "Name") {
	                    _treeView.colModel.setHidden(i, false);
	                    _treeView.colModel.columns[i].hidden = true;

	                    columnMap.push(_treeView.id + "." + _treeView.colModel.columns[i].id);
	                }
	                else if (_treeView.colModel.columns[i].dataIndex == "Name") {
	                    //自动扩展列
	                    _treeView.autoExpandColumn = _treeView.colModel.columns[i].id;
	                    //树形字段
	                    _treeView.masterColumnID = _treeView.colModel.columns[i].id;

	                    _treeView.colModel.columns[i].renderer = function (value, metadata, record, rowIndex, colIndex, store) {
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
	                    };
	                }
	            }

	            var _length = $G.States.items.getCount();
	            for (var i = 0; i < _length; i++) {
	                var stateItem = $G.States.items.itemAt(i);
	                if (stateItem.name == "STATE_ORIGINAL") {
	                    for (var j = 0; j < stateItem.items.getCount(); j++) {
	                        if (columnMap.include(stateItem.items.itemAt(j).referenceName)) {
	                            stateItem.items.removeKey(stateItem.items.itemAt(j).id);
	                            j--;
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
    GTP.AppFrameV2.BaseBill.CategoryTreeBillListPage = _class;
})();
//</Bottom>