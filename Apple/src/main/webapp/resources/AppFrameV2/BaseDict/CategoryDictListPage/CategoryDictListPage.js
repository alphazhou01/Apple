//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
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
	        return "btnCollapseAll;btnExpandTo;includeChild;";
	    },
	    //[End]

	    //[Start]
	    _initQueryBox: function (grid, config, toolbarName, index) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>
	        if (!config) {
	            config = {};
	            config.hasSchemeManagement = false;
	        }

	        //自己构建函数.
	        config.getCriteira = function (queryBoxParam) {
	            var qp = grid.apf_queryPlan;
	            if (qp) {
	                qp.currentPage = 1;
	                if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
	            }
	            $G.Page.actQueryDict({ resetpage: true, pageSize: qp.pageSize, noCacheParam: true });
	        }

	        Ext.AppFrame.Util.createQueryBox(grid, config);
	        if (!toolbarName) {
	            toolbarName = "dictView_toolbar_topTitle";
	        }
	        if (Ext.isEmpty(index) || (Ext.isNumber(index) && index < 0)) {
	            index = $G.getCmp(toolbarName).items.indexOf($G.getCmp("Separator_Search"))
	            index = index + 1;
	        }
	        Ext.ux.query.showQueryBox(toolbarName, index);
	    },
	    //[End]

	    //[Start]
	    _initCategoryTree: function () {
	        ///<summary>初始化分类树</summary>
	        //左侧树事件
	        var treeView = $G.getCmp("treeView");
	        if (treeView) {
	            treeView.on("rowselect", function (item, index, node) {
	                var dictView = $G.getCmp("dictView");
	                var _queryplan = dictView.apf_queryPlan;
	                var fullCode = node.get("FullCode");
	                _queryplan.setFilterValue("filter_C_FullCode_Equel", fullCode);
	                if ($G.getCmp("includeChild").getValue()) {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", fullCode + ".");
	                }
	                else {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", "");
	                }
	                $G.Page.actQueryDict({ resetpage: true, noCacheParam: true });

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

	            treeView.on("remove", function (item, index, node) {
	                if (item.getXType() == "gtptreegridpanel") {
	                    var count = item.getStore().getCount();
	                    if (count == 0) {
	                        var textSelectedCategory = $G.getCmp("textSelectedCategory");
	                        if (textSelectedCategory) textSelectedCategory.setText("");
	                    }
	                }
	            });
	            //设置左侧树的工具栏
	            var searchToolbar = $G.getCmp("treeView_search");
	            if (searchToolbar) {
	                searchToolbar.enableOverflow = false; //参照框不折叠

	                $G.getCmp('treeSearch').setWidth(searchToolbar.getWidth() - 10);

	                treeView.getTopToolbar().on('resize', function (_this, w) {
	                    $G.getCmp('treeSearch').setWidth(w - 12);
	                })

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
	            //设置是否包含下级
	            var includeChild = $G.getCmp("includeChild");
	            if (includeChild) {
	                includeChild.el.setStyle("margin-top", "0px");
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
	    },
	    //[End]

	    //[Start]
	    _initDictGrid: function () {
	        //右侧表事件
	        var grid = $G.getCmp("dictView");
	        if (grid) {
	            //初始化查询方案
	            $G.Page._initQueryBox(grid);

	            //去掉查询方案工具栏边框与背景色
	            var dictView_toolbar_topTitle = $G.getCmp("dictView_toolbar_topTitle");
	            if (dictView_toolbar_topTitle) {
	                dictView_toolbar_topTitle.addClass("x-grid-toolbar-blank-bg");
	                dictView_toolbar_topTitle.addClass("x-grid-toolbar-noborder");
	            }
	            //去掉操作工具栏边框
	            var dictView_toolbar = $G.getCmp("dictView_toolbar");
	            if (dictView_toolbar) {
	                dictView_toolbar.addClass("x-grid-toolbar-noborder");
	                if (dictView_toolbar.ownerCt) {
	                    dictView_toolbar.ownerCt.addClass("x-grid-toolbar-noborder");
	                }
	                //有两组工具栏，会产生2px的内间距，去掉内间距
	                dictView_toolbar.ownerCt.addClass("x-panel-padding0");
	                dictView_toolbar.ownerCt.setWidth(dictView_toolbar.ownerCt.getWidth() + 7);
	                dictView_toolbar.ownerCt.doLayout();
	                dictView_toolbar.ownerCt.setWidth(dictView_toolbar.ownerCt.getWidth() - 1);
	                dictView_toolbar.ownerCt.doLayout();
	            }
	            //去掉分组工具栏边框
	            var dictView_pagingbar = $G.getCmp("dictView_pagingbar");
	            if (dictView_pagingbar)
	                dictView_pagingbar.addClass("x-grid-toolbar-noborder");
	        }
	    },
	    //[End]

	    //[Start]   
	    _initSortEvent: function () {
	        var grid = $G.getCmp("dictView");
	        if (grid) {
	            //增加全局排序
	            grid.on("headerclick", function (item, columnIndex, e) {
	                var bcanQuery = true, btnSave = $G.getCmp("btnSave");
	                if (!Ext.isEmpty(btnSave)) {
	                    bcanQuery = btnSave.disabled;
	                }
	                if (bcanQuery) {
	                    if (grid.apf_ds.AP_SortDataOnHeaderClick(item, columnIndex, e)) {
	                        _this.actQueryDict({});
	                    }
	                }
	            }, grid);
	        }
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init();
	        _this._initCategoryTree();
	        _this._initDictGrid();
	        _this._initDeptFilter();
	        _this._initSortEvent();
	        _this._initDeptFilterByManageLevel($G.getCmp("dictView"));
	    },
	    //[End]

	    //[Start]
	    _initDeptFilter: function () {
	        ///<summary>初始化部门过滤条件</summary>
	        var ds = $G.DataContext.getDataSource("TreeQuery");
	        if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", ds.type) == "true") {
	            //var frameDeptFullId = Ext.AppFrame.Common.getDeptFullId();
	            var deptId = Ext.AppFrame.Common.getDeptId();
	            if (deptId) {
	                var qb = $G.QueryPlans.getQueryPlan("treeQueryPlan");
	                //本上级
	                //var parentDeptIds = frameDeptFullId.replace(new RegExp('/', 'g'), ',');
	                qb.setFilterValue("filter_D_DeptId", deptId);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        _super.Page_DocumentReady();
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

	        var config = { resetpage: true };
	        treeView.AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    _setFilterValue: function (grid, filterName, newValue) {
	        var filter = grid.apf_queryPlan.getFilterAll(filterName);
	        if (filter) filter.setValue(newValue);
	    },
	    //[End]

	    //[Start]
	    _initDeptFilterByManageLevel: function (grid, level) {
	        if (!grid) return;
	        if (Ext.isEmpty(level)) level = Ext.AppFrame.Common.getModuleApfExtend("APE_ManageLevel");
	        if (Ext.isEmpty(level)) level = "all";
	        level = level.toLowerCase().trim();
	        if (level == "all" || level == "0") {
	            level = "";
	        }
	        else if (level == "1") {
	            level = "b";
	        }
	        else if (level == "2") {
	            level = "bs";
	        }

	        if (level != "") {
	            var fullDeptId = Ext.AppFrame.Common.getDeptFullId();
	            var isSJ = level.indexOf("s") != -1, isBJ = level.indexOf("b") != -1, isXJ = level.indexOf("x") != -1;

	            if (isBJ) {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_Eq", fullDeptId);
	            } else {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_Eq", null);
	            }

	            if (isSJ) {
	                var arr = fullDeptId.split('/');
	                _this._setFilterValue(grid, "filter_D_DeptId_in", arr.join(','));
	            }
	            else {
	                _this._setFilterValue(grid, "filter_D_DeptId_in", null);
	            }


	            if (isXJ) {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_Like", fullDeptId + "/");
	            }
	            else {
	                _this._setFilterValue(grid, "filter_D_FullDeptId_Like", null);
	            }

	        }
	    },
	    //[End]

	    //[Start]
	    actQueryDict: function (config) {
	        ///<summary>查询:actQueryDict</summary>
	        var dictView = $G.getCmp("dictView");
	        dictView.AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    //[End]



	    //[Start]
	    actRefresh_Handler: function (sender) {
	        ///<summary>刷新:actRefresh</summary>
	        $G.Page.actQueryDict();
	    },
	    //[End]

	    //[Start]
	    _setTemplateParamsFun: function () {
	        var entityFullName = $G.DataContext.getDataSource("DictQuery").type;
	        var menuText = "导出Excel";
	        return menuText + ":1," + entityFullName + ";";
	    },
	    //[End]

	    //[Start]
	    treeView_BeforeRender: function (item) {
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
    GTP.AppFrameV2.BaseDict.CategoryDictListPage = _class;
})();
//</Bottom>