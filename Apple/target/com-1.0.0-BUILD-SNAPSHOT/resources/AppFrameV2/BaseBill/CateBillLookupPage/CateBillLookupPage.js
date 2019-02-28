//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseBill");
    var _class = Ext.extend(GTP.AppFrameV2.BaseLookup.BillLookupPage,
	{
	    //</Top>

	    //[Start]
	    _treeFuzzySearchFields: function () {
	        ///<summary>左侧分类树过滤字段</summary>
	        return "Code;Name;PinYin;JianPin;FullCode";
	    },
	    //[End]

	    //[Start]
	    __hideDeptTreeSplit: function (renderToPanel) {
	        //该方法用于隐藏组织机构树上控制展开折叠的split小箭头
	        if (renderToPanel) {
	            if (Ext.isString(renderToPanel)) { renderToPanel = $G.getCmp(renderToPanel); }
	            if (Ext.isObject(renderToPanel)) {
	                renderToPanel.setWidth(0);
	                renderToPanel.setVisible(false);
	                renderToPanel.doLayout();
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    __createDeptTree: function (config, renderToPanel) {
	        //构造组织机构树
	        if (!config) config = {};
	        ($G.PageExtend.LeftDeptBizType ? $G.PageExtend.LeftDeptBizType : null);
	        if (!config.bizTypeCode) config.bizTypeCode = ($G.PageExtend.LeftDeptBizType ? $G.PageExtend.LeftDeptBizType.replace(";", ",") : null);
	        if (!config.levelTypeCode) config.levelTypeCode = ($G.PageExtend.LeftDeptLevelType ? $G.PageExtend.LeftDeptLevelType.replace(";", ",") : null);

	        var nodeClick = function (node) {
	            var DName = node.attributes ? node.attributes.Name : node.data.Name;
	            var DCode = node.attributes ? node.attributes.Code : node.data.Code;
	            var DFullId = node.attributes ? node.attributes.FullId : node.data.FullId;
	            var DSubType = node.attributes ? node.attributes.SubType : node.data.SubType;

	            if (DFullId) {
	                _this.__setDeptFilter(DFullId);
	                if (DSubType == "0") {
	                    _this._selectedFullDeptId = DFullId;
	                    _this._selectedDeptName = DName;
	                    _this._selectedDeptCode = DCode;
	                }
	                var defaultConfig = {
	                    resetpage: true,
	                    isExpandAll: true
	                };

	                var Source = $G.getCmp("Source");
	                Source.AP_loadData(defaultConfig);
	            }
	        };
	        if (!renderToPanel) {
	            renderToPanel = "layoutPanel1";
	        }
	        return Ext.AppFrame.DeptCommon.createDeptTree(nodeClick, renderToPanel, config);
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
	            else {
	                //生成一个Tab
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
	            var ape_showDeptTree = Ext.AppFrame.Common.getModuleApfExtend("APE_ShowDeptTree", _this._getModuleCode());
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

	                    panel.add(categoryTreeGrid);
	                    panel.doLayout();
	                    panel.remove(tabView);

	                    categoryTreeGrid.ownerCt.addClass("x-panel-body-treeborder1");

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

	            var btnExpandTo = $G.getCmp("btnExpandTo");
	            var btnCollapseAll = $G.getCmp("btnCollapseAll");
	            var btnRefreshLeftTree = $G.getCmp("btnRefreshLeftTree");


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
	    _initCategoryTree: function () {
	        ///<summary></summary>
	        var CategoryTreeGrid = $G.getCmp("CategoryTreeGrid");
	        if (CategoryTreeGrid) {
	            CategoryTreeGrid.windowViewName = "treeWindowView";
	            CategoryTreeGrid.entityViewName = "treeEntityView";

	            //CategoryTreeGrid.el.set({ cls: "x-panel x-grid-panel ux-maximgb-tg-panel blank-row-line" });
	            CategoryTreeGrid.addClass("blank-row-line");

	            CategoryTreeGrid.on("rowselect", function (item, index, node) {
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
	                Source.AP_loadData({ resetpage: true });

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
	            var searchToolbar = $G.getCmp("CategoryTreeGrid_search");
	            if (searchToolbar) {
	                searchToolbar.enableOverflow = false; //参照框不折叠
	                var newwidth = 350;
	                if (searchToolbar.getWidth() == 0) {
	                    newwidth = CategoryTreeGrid.getTopToolbar().lastSize.width - 22;
	                }
	                else newwidth = searchToolbar.getWidth() - 6;

	                $G.getCmp('treeSearch').setWidth(newwidth);

	                CategoryTreeGrid.getTopToolbar().on('resize', function (_this, w) {
	                    $G.getCmp('treeSearch').setWidth(w - 6);
	                });

	                //有两组工具栏，会产生2px的内间距，去掉内间距
	                searchToolbar.ownerCt.addClass("x-panel-padding0");
	                searchToolbar.ownerCt.setWidth(searchToolbar.ownerCt.getWidth() + 5);
	                searchToolbar.ownerCt.doLayout();
	                searchToolbar.ownerCt.setWidth(searchToolbar.ownerCt.getWidth() - 1);
	                searchToolbar.ownerCt.doLayout();
	            }

	            //设置包含下级事件
	            var includeChild = $G.getCmp("includeChild");
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
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary></summary>
	        _super._init();

	        _this._initDeptTree();          //初始化左侧组织机构树分类

	        _this._initCategoryTree();

	        //设置左侧工具条
	        //设置右表主工具栏为白色底色，取掉边框
	        var CategoryTreeGrid_search = $G.getCmp("CategoryTreeGrid_search");
	        if (CategoryTreeGrid_search) {
	            CategoryTreeGrid_search.addClass("x-grid-toolbar-noborder");
	            CategoryTreeGrid_search.addClass("x-grid-toolbar-blank-bg");
	        }
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>页面加载</summary>
	        GTP.AppFrameV2.BaseLookup.LookupPage.prototype.Page_DocumentReady()

	        $G.getCmp("CategoryTreeGrid").AP_loadData();
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
	        ///<summary>actRefreshLeftTree</summary>
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
	    CategoryTreeGrid_BeforeRender: function (item) {
	        ///<summary>BeforeRender</summary>
	        var _treeView = item;
	        //显示成树形
	        //	        var displayTreeView = Ext.AppFrame.Common.getModuleApfExtend("APE_LeftTreeDisplayTreeView", _this._getModuleCode());
	        //	        if (displayTreeView == "true") { //不修改左侧树，或者以TreeView显示左侧树
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
	                    }
	                }
	                break;
	            }
	        }
	        //	        }
	    }
	    //[End]


	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseBill.CateBillLookupPage = _class;
})();
//</Bottom>