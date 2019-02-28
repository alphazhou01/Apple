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
	    _initQueryBox: function (grid, config, toolbarName, index) {
	        ///<summary>初始化查询方案，派生类扩展，可通过config扩展</summary>

	        if (!config) {
	            config = {};
	        }
	        config.hasSchemeManagement = false;
	        //自己构建函数.
	        config.getCriteira = function (queryBoxParam) {
	            $G.Page.actQueryRightTree({ lazyLoad: false, noCacheParam: true });
	        }
	        Ext.AppFrame.Util.createQueryBox(grid, config);

	        if (!toolbarName) {
	            toolbarName = "rightTreeGrid_toolbar_topTitle";
	        }
	        if (Ext.isEmpty(index) || (Ext.isNumber(index) && index < 0)) {
	            index = $G.getCmp(toolbarName).items.indexOf($G.getCmp("Separator_Search"))
	            index = index + 1;
	        }

	        Ext.ux.query.showQueryBox(toolbarName, index);
	    },
	    //[End]

	    //[Start]
	    _initLeftTree: function () {
	        //左侧树事件
	        var leftTreeGrid = $G.getCmp("leftTreeGrid");
	        if (leftTreeGrid) {
	            leftTreeGrid.on("rowselect", function (item, index, node) {
	                var dictView = $G.getCmp("rightTreeGrid");
	                var _queryplan = dictView.apf_queryPlan;
	                var fullCode = node.get("FullCode");
	                _queryplan.setFilterValue("filter_C_FullCode_Equel", fullCode);
	                if ($G.getCmp("includeChild").getValue()) {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", fullCode + ".");
	                }
	                else {
	                    _queryplan.setFilterValue("filter_C_FullCode_Like", "");
	                }
	                //增加两个参数，强制刷新，TODO:需要判断是否有更新，应该去掉参数
	                $G.Page.actQueryRightTree({ noCacheParam: true });

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

	            leftTreeGrid.on("remove", function (item, index, node) {
	                if (item.getXType() == "gtptreegridpanel") {
	                    var count = item.getStore().getCount();
	                    if (count == 0) {
	                        var textSelectedCategory = $G.getCmp("textSelectedCategory");
	                        if (textSelectedCategory) textSelectedCategory.setText("");
	                    }
	                }
	            });

	            //设置左侧树的工具栏
	            var searchToolbar = $G.getCmp("leftTreeGrid_search");
	            if (searchToolbar) {
	                searchToolbar.enableOverflow = false; //参照框不折叠

	                $G.getCmp('leftTreeSearch').setWidth(searchToolbar.getWidth() - 10);

	                leftTreeGrid.getTopToolbar().on('resize', function (_this, w) {
	                    $G.getCmp('leftTreeSearch').setWidth(w - 12);
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
	            //设置是否包含下级
	            var includeChild = $G.getCmp("includeChild");
	            if (includeChild) {
	                includeChild.el.setStyle("margin-top", "0px");
	                includeChild.on("check", function (value) {
	                    var leftTreeGrid = $G.getCmp("leftTreeGrid");
	                    var records = leftTreeGrid.getSelectionModel().getSelections();
	                    if (records.length == 0) {
	                        return;
	                    }
	                    else {
	                        if (records.length > 1) {
	                            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                            leftTreeGrid.getSelectionModel().clearSelections();
	                            return;
	                        }
	                        else {
	                            leftTreeGrid.fireEvent("rowselect", leftTreeGrid.getSelectionModel(), leftTreeGrid.getSelectionModel().lastActive, records[0]);
	                        }
	                    }
	                });
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _initRightTree: function () {
	        var rightTreeGrid = $G.getCmp("rightTreeGrid");
	        if (rightTreeGrid) {
	            //增加Filter，js构造，是否考虑转到Queryplan里
	            rightTreeGrid.AP_getTreeFilter = function (data) {
	                var Filters = new Array();
	                var fn = Ext.AppFrame.Common.addFilter;
	                Filters.push(fn("BraceStart", null, "eq", "And", null));

	                if (data && data["C_ID"]) {
	                    Filters.push(fn("Filter", "Category", "eq", data["C_ID"], "zh_CN")); //本级、上级不能重复
	                }
	                else {
	                    var leftTreeGrid = $G.getCmp("leftTreeGrid");
	                    var selectedRecords = leftTreeGrid.getSelectionModel().getSelections();
	                    if (selectedRecords.length == 0) {
	                        return;
	                    }
	                    else if (selectedRecords.length > 1) {
	                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                        treeView.getSelectionModel().clearSelections();
	                        return;
	                    }
	                    else {
	                        var cID = selectedRecords[0].get("ID");
	                        if ($G.getCmp("includeChild").getValue()) {
	                            leftTreeGrid.AP_getChildList(cID, true, function (result) {
	                                if (result.TotalCount > 0) {
	                                    var idList = "-1";
	                                    Ext.each(result.Entities, function (item) {
	                                        idList += "," + item.ID;
	                                    });
	                                    Filters.push(fn("Filter", "Category", "in", idList, "zh_CN")); //本级、上级不能重复
	                                }
	                            }
	                            );
	                        } else {

	                            Filters.push(fn("Filter", "Category", "eq", cID, "zh_CN")); //本级、上级不能重复
	                        }
	                    }
	                }

	                var rightTreeGrid = $G.getCmp("rightTreeGrid");
	                if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", rightTreeGrid.apf_ds.type) == "true") {
	                    //	                var frameDeptFullId = Ext.AppFrame.Common.getDeptFullId();
	                    //	                var parentDeptIds = frameDeptFullId.replace(new RegExp('/', 'g'), ',');
	                    var deptId = Ext.AppFrame.Common.getDeptId();
	                    Filters.push(fn("Filter", "Dept", "eq", deptId, "zh_CN")); //本级、上级不能重复
	                }

	                Filters.push(fn("BraceEnd", null, "eq", "", null));
	                return Filters;
	            };

	            $G.Page._initQueryBox(rightTreeGrid);

	            leftTreeGrid.on("rowselect", function (item, index, node) {
	                var includeChild = $G.getCmp("includeChild");
	                if (includeChild) {
	                    var moveActionList = ["Ap_TreeGrid_actMoveUp1", "Ap_TreeGrid_actMoveDown1", "Ap_TreeGrid_actUpGrade1", "Ap_TreeGrid_actDeGrade1"];
	                    for (var i = 0; i < moveActionList.length; i++) {
	                        var action = $G.Actions.getAction(moveActionList[i]);
	                        action.setDisabled(includeChild.checked);
	                    }
	                }
	            });

	            //去掉右侧查询方案工具栏边框与背景色
	            var rightTreeGrid_toolbar_topTitle = $G.getCmp("rightTreeGrid_toolbar_topTitle");
	            if (rightTreeGrid_toolbar_topTitle) {
	                rightTreeGrid_toolbar_topTitle.addClass("x-grid-toolbar-blank-bg");
	                rightTreeGrid_toolbar_topTitle.addClass("x-grid-toolbar-noborder");
	            }
	            var rightTreeGrid_toolbar = $G.getCmp("rightTreeGrid_toolbar");
	            if (rightTreeGrid_toolbar) {
	                rightTreeGrid_toolbar.addClass("x-grid-toolbar-noborder");
	                if (rightTreeGrid_toolbar.ownerCt) {
	                    rightTreeGrid_toolbar.ownerCt.addClass("x-grid-toolbar-noborder");
	                }
	                //有两组工具栏，会产生2px的内间距，去掉内间距
	                rightTreeGrid_toolbar.ownerCt.addClass("x-panel-padding0");
	                rightTreeGrid_toolbar.ownerCt.setWidth(rightTreeGrid_toolbar.ownerCt.getWidth() + 7);
	                rightTreeGrid_toolbar.ownerCt.doLayout();
	                rightTreeGrid_toolbar.ownerCt.setWidth(rightTreeGrid_toolbar.ownerCt.getWidth() - 1);
	                rightTreeGrid_toolbar.ownerCt.doLayout();
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);

	        _this._initLeftTree();

	        _this._initRightTree();

	        _this._initDeptFilter();

	    },
	    //[End]

	    //[Start]
	    _initDeptFilter: function () {
	        ///<summary>初始化部门过滤条件</summary>
	        var rightTreeGrid = $G.getCmp("rightTreeGrid");
	        if (Ext.AppFrame.Common.getModuleApfExtendByEntity("APE_IsDeptTreeDict", rightTreeGrid.apf_ds.type) == "true") {

	            var deptId = Ext.AppFrame.Common.getDeptId();
	            //var frameDeptFullId = Ext.AppFrame.Common.getDeptFullId();
	            if (deptId) {
	                var qb = $G.QueryPlans.getQueryPlan("queryPlan");
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
	        $G.Page.actQueryLeftTree();
	    },
	    //[End]

	    //[Start]
	    actQueryRightTree: function (config) {
	        ///<summary>查询:actQueryRightTree</summary>
	        var rightTreeGrid = $G.getCmp("rightTreeGrid");
	        rightTreeGrid.AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    actRefreshRightTree_Handler: function (sender) {
	        ///<summary>actRefreshRightTree</summary>
	        $G.Page.actQueryRightTree();
	    },
	    //[End]

	    //[Start]
	    leftTreeSearch_TriggerClick: function (index) {
	        ///<summary>:TriggerClick</summary>
	        if (index == 2) {//点查询
	            $G.Page.actQueryLeftTree(2);
	        }
	        else if (index == 1) {//点清空
	            $G.Page.actQueryLeftTree(1);
	        }
	    },
	    //[End]

	    //[Start]
	    leftTreeSearch_KeyUp: function (item, e) {
	        ///<summary>:KeyUp</summary>
	        if (e.keyCode == "13") $G.Page.actQueryLeftTree(2);
	    },
	    //[End]

	    //[Start]
	    actQueryLeftTree: function (sender) {
	        ///<summary>查询:actQueryLeftTree</summary>
	        var treeView = $G.getCmp("leftTreeGrid");

	        var treeSearch = $G.getCmp("leftTreeSearch");
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
	    actRefreshLeftTree_Handler: function (sender) {
	        ///<summary>actRefreshLeftTree</summary>
	        $G.Page.actQueryLeftTree(2);
	    },
	    //[End]

	    //[Start]
	    leftTreeGrid_BeforeRender: function (item) {
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
    GTP.AppFrameV2.BaseDict.CategoryTreeListPage = _class;
})();
//</Bottom>