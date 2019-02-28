//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.DictLookupPage,
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
	    _initCategoryTree: function () {
	        ///<summary></summary>
	        var treeView = $G.getCmp("treeView");
	        if (treeView) {
	            treeView.windowViewName = "windowView";
	            treeView.entityViewName = "entityView";

	            //treeView.el.set({ cls: "x-panel x-grid-panel ux-maximgb-tg-panel blank-row-line" });
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
	                if (textSelectedCategory) textSelectedCategory.setVisible(false);
	                //	                for (var i = 0; i < item.grid.colModel.getColumnCount(); i++) {
	                //	                    if (item.grid.colModel.columns[i].dataIndex == "Name") {
	                //	                        var cell = item.grid.view.getCell(index, i);
	                //	                        if (cell && cell.textContent) {
	                //	                            var text = cell.textContent;
	                //	                            text = text.trim()
	                //	                            textSelectedCategory.setText(text);
	                //	                            break;
	                //	                        }
	                //	                    }
	                //	                }
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

	    _loadData: function (config) {
	        ///<summary>增加虚方法以便派生类能重写</summary>
	        if (Ext.isEmpty(config)) config = {};
	        config.notSelectFirstRow = true;
	        if (config.pageReady) {
	            //第一次不需要加载数据了，除非是
	            if ($G.PageExtend.APE_IndependentQuery == "true") {
	                config.firstLoad = true;
	                return _super._loadData(config);
	            }
	        }
	        else {
	            if ($G.PageExtend.APE_IndependentQuery == "true") { //是否独立的查询
	                if (config.treeclick) {             //说明是点击树触发
	                    Ext.ux.query.CurrentSelection.queryBox.setCurrentContent("", true);
	                    Ext.ux.query.CurrentSelection.queryBox.setCurrentScheme({}, true); //解决 TTGEP-1327
	                    Ext.ux.query.CurrentSelection.queryPlan = null;
	                    config.noCacheParam = true;
	                    config.pageIndex = 1; //定位到第一页


	                }
	                else if (config.noCacheParam) {     //说明是查询方案触发
	                    var Source = $G.getCmp("Source"), qp = Source.apf_queryPlan;
	                    qp.setFilterValue("filter_C_FullCode_Equel", "");
	                    qp.setFilterValue("filter_C_FullCode_Like", "");
	                    var treeView = $G.getCmp("treeView");
	                    treeView.getSelectionModel().clearSelections();
	                }
	            }
	            return _super._loadData(config);
	        }
	    },

	    //[End]

	    //[Start]
	    _init: function () {
	        //判断是否有新增功能，字典有次功能，单据没有
	        var hasNewRecordAuth = false;
	        //TP-30894 addButtonDisplayMode为0则一直隐藏，2则一直显示,
	        var editPageModuleCode = _this._getEditPageModuleCode(); //在调用基类之前

	        _super._init();

	        var authItemName = $G.PageExtend["AddAuthItemName"];
	        var addButtonDisplayMode = $G.PageExtend["AddButtonDisplayMode"];

	        if (editPageModuleCode && authItemName) {
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
	            var action = $G.Actions.getAction("actNew");
	            if (action) action.setHidden(false);
	        }
	        else {
	            var action = $G.Actions.getAction("actNew");
	            if (action) action.setHidden(true);
	        }

	        _this._initCategoryTree();
	        var ds = $G.DataContext.getDataSource("Dict");
	        ds.on("afteradd", function (result) {
	            var treeView = $G.getCmp("treeView");
	            var records = treeView.getSelectionModel().getSelections();
	            if (records.length == 0) {
	                return;
	            }
	            result.set("Category.ID", records[0].data[treeView.keyField]);
	        });

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
	    treeView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>

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
	    actNew_Handler: function (sender) {
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

	        var dictLookupAddMode = $G.PageExtend["DictLookupAddMode"];
	        if (dictLookupAddMode == "true") {
	            var editPage = $G.PageExtend["EditPage"];
	            if (editPage) {
	                var editUrl = $G.getPageURLByFullName(editPage);
	                if (editUrl) {
	                    $G.open({
	                        url: editUrl,
	                        target: "_modal",
	                        callback: function (r) {
	                            $G.Page.actQueryTree(2);
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
	        }
	        else {
	            var treeView = $G.getCmp("treeView");
	            var records = treeView.getSelectionModel().getSelections();
	            if (records.length == 0 || records.length > 1) {
	                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectCat);
	                return;
	            }
	            else {
	                sender.params = { CatId: records[0].data.ID };
	                _super.actNew_Handler(sender);
	            }
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
	        var config = {};
	        if ($G.PageExtend.APE_IndependentQuery == "true") {
	            config.notSelectFirstRow = true;
	        }
	        treeView.AP_loadData(config);
	    },
	    //[End]

	    //[Start]
	    treeSearch_KeyUp: function (item, e) {
	        ///<summary>:KeyUp</summary>
	        if (e.keyCode == "13") $G.Page.actQueryTree(2);
	        if (this.getRawValue()) this.triggers[0].show();
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
    GTP.AppFrameV2.BaseDict.CategoryDictLookupPage = _class;
})();
//</Bottom>