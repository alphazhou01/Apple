//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.DynaBizComp");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    _initDataContext: function () {
	        if (!$G.Page._dataListSource)
	            $G.Page._dataListSource = $G.DataContext.getDataSource("DynaBizQuery");
	        if (!$G.Page._dataEditSource)
	            $G.Page._dataEditSource = $G.DataContext.getDataSource("DynaBizInfo");
	        if (!$G.Page._bizEditSource)
	            $G.Page._bizEditSource = $G.DataContext.getDataSource("DynaBizInfoEdit");
	        if (!$G.Page._entitySource)
	            $G.Page._entitySource = $G.DataContext.getDataSource("DynaEntityPoco");
	        if (!$G.Page._propertyListSource)
	            $G.Page._propertyListSource = $G.DataContext.getDataSource("DynaPropertyList");
	        if (!$G.Page._propertyEditSource) {
	            $G.Page._propertyEditSource = $G.DataContext.getDataSource("DynaPropertyEdit");

	            $G.Page._propertyEditSource.on("update", function (sender, store, record, operation) {
	                if (record.lastModifiedFieldName == "MoneySymbolic" || record.lastModifiedFieldName == "Scale") {
	                    var newValue = record.get("MoneySymbolic");
	                    var isEmpty = Ext.isEmpty(newValue), cmp = $G.getCmp("Efd_DisplayDecimalPrecision"), cmpScale = $G.getCmp("Efd_Scale");
	                    cmp.setReadOnly(isEmpty);
	                    if (isEmpty) {
	                        record.set(cmp.dataIndex, record.get(cmpScale.dataIndex));
	                    }
	                }
	            });

	            $G.Page._propertyEditSource.on("load", function (ds, data) {
	                if (data.length == 0) return;
	                var isEmpty = Ext.isEmpty(data[0].MoneySymbolic), cmp = $G.getCmp("Efd_DisplayDecimalPrecision");
	                cmp.setReadOnly(isEmpty);
	            });
	        }

	        //参照设置数据源
	        if (!$G.Page._refSource)
	            $G.Page._refSource = $G.DataContext.getDataSource("DynamicReferenceObject");
	    },
	    //[End]

	    //[Start]
	    _initSetting: function () {
	        //设置实体列表单选
	        Ext.AppFrame.Util.InitPYControl({ sourceControlName: "Efd_PropertyAlias", descControlName: "Efd_PropertyName" });
	        //根据插件来判断是否需要升级
	        var cmp = $G.getCmp("btnUpgrade");
	        if (cmp) {
	            if (!Ext.isEmpty(_this.getUpgradeConfig) && Ext.isFunction(_this.getUpgradeConfig)) {
	                cmp.setVisible(true);
	            }
	        }
	        //加载QueryBox
	        var grid = $G.getCmp("bizInfoListView");
	        _this.__bindQueryBox(grid);

	        var entityGrid = $G.getCmp("entityListView");
	        entityGrid.getSelectionModel().singleSelect = true;

	        //绑定实体数据行变更事件
	        entityGrid.on('selectionchange', function () {
	            var entityRecord = _this._getSelectRecord(entityGrid, false);
	            if (!entityRecord)
	                return;
	            if (!$G.Page._systemProperty[entityRecord.data.EntityFullName]) {
	                $G.dispatcher({
	                    async: false,
	                    controller: "GTP.AppFrame.PropertyTreeLookupPage",
	                    action: "GetChildrenLeafNodes",
	                    args: [entityRecord.data.EntityFullName, " "],
	                    success: function (data) {
	                        var checkIds = ",";
	                        for (var i = 0; i < data.length; i++) {
	                            checkIds += data[i].ID + ","
	                        }
	                        $G.Page._systemProperty[entityRecord.data.EntityFullName] = checkIds;
	                    }
	                });
	            }
	            if (!$G.Page._currentEntity) {
	                $G.Page._currentEntity = entityRecord.data.EntityFullName;
	                return;
	            }

	            if ($G.Page._currentEntity != entityRecord.data.EntityFullName) {
	                _this._updateCurrentEntityProperty();
	                _this._updateProperties(entityRecord.data.EntityFullName);
	            }

	            $G.Page._currentEntity = entityRecord.data.EntityFullName;
	        });

	        //初始化属性列表集合
	        if (!$G.Page._propertyList)
	            $G.Page._propertyList = new Array();

	        //控制参照功能隐藏
	        if ($G.Params.SetRef) {
	            btnSetReferenceInfo.show();
	            btnRemoveReference.show();
	        }

	    },
	    //[End]

	    //[Start]
	    _updateCurrentEntityProperty: function () {
	        var propertyList = [];
	        $G.getCmp("propertyListView").store.getRange().forEach(function (property) {
	            propertyList.push(property.data);
	        });
	        if (propertyList.length > 0)
	            $G.Page._propertyList[$G.Page._currentEntity] = propertyList;
	    },
	    //[End]

	    //[Start]
	    _updateProperties: function (entityFullName) {
	        var dataSource = $G.Page._propertyListSource;
	        dataSource.removeAll();
	        if ($G.Page._propertyList[entityFullName] && $G.Page._propertyList[entityFullName].length > 0)
	            dataSource.loadData($G.Page._propertyList[entityFullName]);
	        dataSource.commitChanges();
	    },
	    //[End]

	    //[Start]
	    __bindQueryBox: function (grid) {
	        ///////////////////////////////////////////////////////////////////////////////
	        var config = { hasSchemeManagement: false };
	        config.getCriteira = function (queryBoxParam) {
	            var qp = grid.apf_queryPlan;
	            if (qp) {
	                qp.currentPage = 1;
	                if (queryBoxParam.size > 0) qp.pageSize = queryBoxParam.size;
	            }
	            _this._loadListData({
	                resetpage: true,
	                pageSize: qp.pageSize,
	                noCacheParam: true
	            });
	        };
	        Ext.AppFrame.Util.createQueryBox(grid, config);
	        Ext.ux.query.showQueryBox("bizInfoListView_toolbar", 0);
	        /////////////////////////////////////////////////////////////////////////////
	    },
	    //[End]

	    //[Start]    
	    _createModuleTree: function () {
	        var nodeClickFunc = function (node, e) {
	            var grid = $G.getCmp("bizInfoListView");
	            grid.apf_queryPlan.setFilterValue("filter_MT_FullCode_LLK", node.attributes.fullcode + "/");
	            grid.apf_queryPlan.setFilterValue("filter_MT_FullCode_Eq", node.attributes.fullcode);
	            _this._loadListData({ resetpage: true });
	        };
	        _this.moduleTree = GTP.AppFrameV2.DynaBizComp.createModuleTree(nodeClickFunc, "layoutPanel1", { action: "GetLeafTreeData" });
	    },
	    //[End]

	    //[Start]
	    _init: function () {
	        //初始化上下文
	        _this._initDataContext();
	        //初始化界面设置
	        _this._initSetting();
	        //初始化界面数据
	        _this._createModuleTree();
	        _this._loadListData({});
	        Ext.AppFrame.Util.InitPYControl({ sourceControlName: "Efd_BizAlias", descControlName: "Efd_BizName" });
	    },
	    //[End]

	    //[Start]
	    _loadListData: function (config) {
	        config = config || {};
	        config.action = "QueryList";
	        var grid = $G.getCmp("bizInfoListView");
	        grid.AP_loadData(config);

	        //	        var dataSource = $G.Page._dataListSource;
	        //	        if (dataSource) {
	        //	            var queryPlan = _this._getQueryPlanParam();
	        //	            $G.dispatcher({
	        //	                action: "GetInfoList",
	        //	                args: [queryPlan],
	        //	                success: function (result) {
	        //	                    dataSource.loadData(result);
	        //	                }
	        //	            });
	        //	        }
	    },
	    //[End]

	    //[Start]
	    _loadEditData: function () {
	        var dataSource = $G.Page._dataEditSource;
	        dataSource.removeAll();
	        dataSource.commitChanges();

	        var entitySource = $G.Page._entitySource;
	        entitySource.removeAll();
	        entitySource.commitChanges();

	        var propertySource = $G.Page._propertyListSource;
	        propertySource.removeAll();
	        propertySource.commitChanges();

	        $G.Page._systemProperty = [];

	        _this._showEditWindow(true);
	        _this._changeGuideStep(1);
	        dataSource.addRecord();
	    },
	    //[End]

	    //[Start]
	    _releasePropertyList: function () { },
	    //[End]

	    //[Start]
	    _loadProperty: function (propertyInfo) {
	        var dataSource = $G.Page._propertyEditSource;
	        if (dataSource) {
	            dataSource.removeAll();
	            dataSource.commitChanges();

	            var isEdit = !Ext.isEmpty(propertyInfo);
	            btnOk.setVisible(isEdit);
	            btnSaveProperty.setVisible(!isEdit);
	            btnSavePropertys.setVisible(!isEdit);

	            _this._showPropertyWindow(true);
	            if (propertyInfo) {
	                dataSource.loadData(propertyInfo);
	                $G.Page._systemProperty[$G.Page._currentEntity] =
                        $G.Page._systemProperty[$G.Page._currentEntity].replace(',' + propertyInfo.PropertyName + ',', ",");
	                _this._resetPropertyState(propertyInfo.DataType, false, propertyInfo);
	            }
	            else {
	                dataSource.addRecord();
	                _this._resetPropertyState('string', true);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _loadBizInfoData: function () {
	        var record = _this._getSelectRecord("bizInfoListView", true);
	        if (!record)
	            return;
	        $G.dispatcher({
	            action: "GetBizInfo",
	            args: [record.data.Id],
	            success: function (data) {
	                $G.Page._bizInfoEdit = $G.clone(data);
	                var dataSource = $G.Page._bizEditSource;
	                dataSource.loadData(data);
	                _this._showBizInfoEditWindow(true);
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    _getSelectRecord: function (grid, needTip, tips) {
	        if (!grid)
	            return null;
	        if (typeof (grid) != "object")
	            grid = $G.getCmp(grid);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length) {
	            return records[0];
	        }
	        else if (needTip) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, Ext.isEmpty(tips) ? "当前没有选中记录" : tips);
	        }
	    },
	    //[End]

	    //[Start]
	    _removeGridRecord: function (gridId, callback) {
	        var grid = $G.getCmp(gridId);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length > 0) {
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, String.format(GTP.AppFrame.WebResource.OptSelectedRecord, GTP.AppFrame.WebResource.Delete), function (e) {
	                if (e == "yes") {
	                    for (var i = 0; i < records.length; i++) {
	                        grid.getStore().remove(records[i]);
	                        if (callback)
	                            callback(records[i]);
	                    }
	                }
	            });
	        }
	        else {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前没有选中记录");
	        }
	    },
	    //[End]

	    //[Start]
	    _showEditWindow: function (isShow) {
	        var windowView = $G.getCmp('editWindow');
	        if (isShow) {
	            windowView.show();
	        }
	        else {
	            windowView.hide();
	        }
	    },
	    //[End]

	    //[Start]
	    _showPropertyWindow: function (isShow) {
	        var windowView = $G.getCmp('propertyWindow');
	        if (isShow) {
	            windowView.show();
	            if (!$G.Page._limitNumberEvent) {
	                $G.Page._limitNumberEvent = true;
	                $G.getCmp("Efd_MinLong").getEl().on("keyup", _this._limitNumberCheck);
	                $G.getCmp("Efd_MaxLong").getEl().on("keyup", _this._limitNumberCheck);
	                $G.getCmp("Efd_MinDecimal").getEl().on("keyup", _this._limitNumberCheck);
	                $G.getCmp("Efd_MaxDecimal").getEl().on("keyup", _this._limitNumberCheck);

	                $G.getCmp("Efd_MinLong").getEl().on("blur", _this._formatNumber);
	                $G.getCmp("Efd_MaxLong").getEl().on("blur", _this._formatNumber);
	                $G.getCmp("Efd_MinDecimal").getEl().on("blur", _this._formatNumber);
	                $G.getCmp("Efd_MaxDecimal").getEl().on("blur", _this._formatNumber);

	                //设置窗口样式
	                var fieldSet = new Ext.form.FieldSet({
	                    id: "propertyFieldSet",
	                    height: 15,
	                    width: 388,
	                    title: "属性设置",
	                    style: "margin-left:20px;margin-right:20px;margin-top:5px;"
	                });

	                layoutPanel10.setHeight(138);
	                layoutPanel10.addClass("x-panel-fieldSet");
	                layoutPanel9.add(fieldSet);
	                layoutPanel9.layout.container.doLayout(true);
	            }
	            //设置布局宽度
	            layoutPanel10.setWidth(388);
	        }
	        else {
	            windowView.hide();
	        }
	    },
	    //[End]

	    //[Start]
	    _showBizInfoEditWindow: function (isShow) {
	        var windowView = $G.getCmp('bizEditWindow');
	        if (isShow) {
	            windowView.show();
	        }
	        else {
	            windowView.hide();
	        }
	    },
	    //[End]

	    //[Start]
	    _limitNumberCheck: function (k, item) {
	        var key = k.getKey();
	        if (key == 37 || key == 39 || key == 8 || key == 35 || key == 36 || key == 46) {
	            return;
	        }
	        var value = item.value.replace(/[^0123456789.-]/gi, "");
	        item.value = value;
	    },
	    //[End]

	    //[Start]
	    _formatNumber: function (k, item) {
	        var value = parseFloat(item.value).toString();
	        if (value != "NaN")
	            item.value = value;
	        else
	            item.value = "";
	    },
	    //[End]

	    //[Start]
	    _resetPropertyState: function (name, resetInfo, data) {
	        //不同类别属性编辑面板切换
	        var record;
	        if ($G.Page._dataType == name && resetInfo)
	            return;
	        if (resetInfo) {
	            var dataSource = $G.Page._propertyEditSource;
	            var record = dataSource.getDataRecord();
	            record.set("Length", 0);
	            record.set("Scale", 0);
	            record.set("IsUicode", false);
	            record.set("IsMulti", false);
	            record.set("DefaultValue", null);
	            record.set("FormulaValue", null);
	        }
	        switch (name) {
	            case 'string':
	                index = 0;
	                height = 55;
	                if (resetInfo) {
	                    record.set("IsUicode", true);
	                    record.set("IsMulti", false);
	                    record.set("Length", 255);
	                    record.set("FullTypeName", null);
	                    record.set("TypeAlias", null);
	                    record.set("MoneySymbolic", null);
	                    record.set("UseThousands", true);
	                    record.set("AllowNegative", true);
	                }
	                record
	                break;
	            case 'long':
	                index = 1;
	                height = 55;
	                if (resetInfo) {
	                    record.set("Length", 19);
	                }
	                break;
	            case 'decimal':
	                index = 2;
	                height = 85;
	                if (resetInfo) {
	                    record.set("Length", 20);
	                    record.set("Scale", 2);
	                }
	                break;
	            case 'boolean':
	                index = 3;
	                height = 0;
	                if (resetInfo) {
	                    record.set("Length", 1);
	                }
	                break;
	            case 'datetime':
	                index = 4;
	                height = 30;
	                break;
	            case 'datadict':
	                index = 5;
	                height = 55;
	                if (resetInfo) {
	                    //	                    record.set("IsUicode", false);
	                    record.set("IsMulti", false);
	                    record.set("Length", 255);
	                }
	                break;
	        }
	        layoutPanel10.layout.setActiveItem(index);
	        layoutPanel10.propertyType = name;
	        //	        layoutPanel9.setHeight(height);
	        //	        layoutPanel7.doLayout();
	        $G.Page._dataType = name;

	        //TP-30509 修复字典参照框样式问题
	        if (name == "datadict")
	            Efd_TypeAlias.updateTrigger1();

	        _this._resetExpressionCobom(name, data);
	        //	        layoutPanel5.setHeight(315 - height);
	    },
	    //[End]

	    //[Start]
	    _changeGuideStep: function (step) {
	        //	        layoutPanel4
	        if (step == 1) {
	            _this._showEditWindow(false);
	            layoutPanel4.setVisible(false);
	            first_toolbar.setVisible(true);
	            second_toolbar.setVisible(false);
	            layoutPanel5.layout.setActiveItem(0);

	            _this._showEditWindow(true);
	        }
	        else if (step == 2) {
	            _this._showEditWindow(false);
	            layoutPanel4.setVisible(true);
	            first_toolbar.setVisible(false);
	            second_toolbar.setVisible(true);
	            layoutPanel5.layout.setActiveItem(1);
	            _this._showEditWindow(true);
	        }
	    },
	    //[End]

	    //[Start]
	    actAddBizInfo_Handler: function (sender) {
	        ///<summary>新建:actAddBizInfo</summary>
	        _this._loadEditData();
	    },
	    //[End]

	    //[Start]
	    actEditBizInfo_Handler: function (sender) {
	        ///<summary>编辑:actEditBizInfo</summary>

	    },
	    //[End]

	    //[Start]
	    actDeleteBizInfo_Handler: function (sender) {
	        ///<summary>删除:actDeleteBizInfo</summary>
	        var record = _this._getSelectRecord("bizInfoListView", true);
	        if (record) {
	            var msg = "是否删除当前模块？";
	            //判断是否有数据
	            Gtp.net.Global.dispatcher({
	                controller: Gtp.net.Global.getPageController(),
	                async: false,
	                action: "CheckData",
	                args: [record.data.NameSpace + '.' + record.data.BizName],
	                success: function (result) {
	                    if (result == 1) msg = "当前模块已有数据，是否强制删除？";
	                },
	                failure: function () {

	                }
	            });

	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, msg, function (e) {
	                if (e == "yes") {
	                    $G.dispatcher({
	                        action: "DeleteDynaBiz",
	                        args: [record.data],
	                        success: function () {
	                            $G.dispatcher({
	                                action: "ClearDynamicModuleNode",
	                                controller: "GTP.FormFrame.FormPageManage",
	                                args: [record.data.NameSpace + '.' + record.data.BizName],
	                                success: function () { }
	                            });
	                            bizInfoListView.getStore().remove(record);
	                            $G.Page._dataListSource.commitChanges();
	                            Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "删除成功");
	                        }
	                    });
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    actPublish_Handler: function (sender) {
	        ///<summary>发布:actPublish</summary>
	        winExp.show();
	    },
	    //[End]

	    //[Start]
	    actSetProperty_Handler: function (sender) {
	        ///<summary>下一步:actSetProperty</summary>
	        var data = $G.Page._dataEditSource.getDataRecord().data;
	        if (!data.BizName || !data.BizAlias || !data.Path || !data.OriginalBizName) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, '请完整填写相关信息');
	            return;
	        }

	        var bizName = data.BizName;
	        var reg = new RegExp("^[A-Za-z0-9]+$", "gi");
	        if (!reg.test(bizName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, '请不要在编码中使用中文或特殊字符');
	            return;
	        }
	        var fullName = data.NameSpace + '.' + data.BizName;
	        //	        var templateFullName = data.OriginalBizName;
	        $G.dispatcher({
	            action: 'CheckModuleIsExist',
	            args: [fullName],
	            success: function (result) {
	                if (result) {
	                    _this._changeGuideStep(2);
	                    $G.dispatcher({
	                        controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	                        action: "GetEntityList",
	                        args: [data.OriginalBizName],
	                        success: function (result) {
	                            $G.Page._entitySource.loadData(result);
	                            $G.Page._propertyListSource.removeAll();
	                            $G.Page._propertyListSource.commitChanges();
	                            var entity = $G.Page._entitySource.getDataStore().getAt(0);
	                            _this._updateProperties(entity.data.EntityFullName);
	                        }
	                    });
	                }
	                else
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前模块路径下已存在相同编码的模块");
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actSetModule_Handler: function (sender) {
	        ///<summary>上一步:actSetModule</summary>
	        _this._updateCurrentEntityProperty();
	        _this._changeGuideStep(1);
	    },
	    //[End]

	    //[Start]
	    actSaveInfo_Handler: function (sender) {
	        ///<summary>完成:actSaveInfo</summary>
	        var dataSource = $G.Page._dataEditSource;
	        var editRecord = dataSource.getChangeSummary()[0];
	        //	        $G.Page._propertyList;
	        var propertyList = $G.Page._propertyList;
	        var entityList = $G.Page._entitySource.getDataStore().getRange();
	        var entityArgs = [];
	        var propertyArgs = [];
	        _this._updateCurrentEntityProperty();
	        entityList.forEach(function (entity) {
	            if (propertyList[entity.data.EntityFullName] && propertyList[entity.data.EntityFullName].length > 0) {
	                entityArgs.push([entity.data.EntityFullName, entity.data.EntityAlias]);
	                propertyArgs.push(propertyList[entity.data.EntityFullName]);
	            }
	        });
	        $G.dispatcher({
	            action: "CreateDynaBiz",
	            args: [editRecord, entityArgs, propertyArgs],
	            success: function (result) {
	                var listSource = $G.Page._dataListSource;
	                listSource.addRecord();
	                var listRecord = listSource.getDataRecord();
	                listRecord.data.Id = result.Id;
	                listRecord.data.BizAlias = result.BizAlias;
	                listRecord.data.BizName = result.BizName;
	                listRecord.data.NameSpace = result.NameSpace;
	                listRecord.data.CreatedTime = result.CreatedTime;
	                listRecord.data.ModifiedTime = result.ModifiedTime;
	                listRecord.data.Path = result.Path;
	                listRecord.data.Remark = result.Remark;
	                //	                listRecord.id = result.Id;
	                listSource.commitChanges();
	                _this._showEditWindow(false);
	                _this.moduleTree.reloadData();
	                Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "模块添加成功");
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actAddProperty_Handler: function (sender) {
	        ///<summary>新增:actAddProperty</summary>
	        _this._loadProperty();
	    },
	    //[End]

	    //[Start]
	    actEditProperty_Handler: function (sender) {
	        ///<summary>编辑:actEditProperty</summary>
	        var record = _this._getSelectRecord(propertyListView, true);
	        if (record)
	            _this._loadProperty($G.clone(record.data));
	    },
	    //[End]

	    //[Start]
	    actRemoveProperty_Handler: function (sender) {
	        ///<summary>移除:actRemoveProperty</summary>
	        _this._removeGridRecord("propertyListView", function (record) {
	            $G.Page._systemProperty[$G.Page._currentEntity] =
                        $G.Page._systemProperty[$G.Page._currentEntity].replace(',' + record.data.PropertyName + ',', ",");
	        });
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        _this._showEditWindow(false);
	    },
	    //[End]

	    //[Start]
	    _checkPropertyInfo: function () {
	        //保存校验
	        var record = $G.Page._propertyEditSource.getDataRecord();
	        if (Ext.isEmpty(record.data.PropertyName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写属性编码");
	            return false;
	        }
	        var propertyName = record.data.PropertyName;
	        var reg = new RegExp("^[A-Za-z0-9]+$", "gi");
	        if (!reg.test(propertyName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, '请不要在属性编码中使用中文或特殊字符');
	            return;
	        }
	        //	        if (record.data.PropertyName.indexOf('EP_'))
	        if ($G.Page._systemProperty[$G.Page._currentEntity].indexOf(',' + propertyName + ',') != -1) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "属性编码不能与系统字段相同,请调整属性编码");
	            return false;
	        }
	        if (Ext.isEmpty(record.data.PropertyAlias)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写显示名称");
	            return false;
	        }

	        switch (record.data.DataType) {
	            case 'string':
	                if (Ext.isEmpty(record.data.Length) || record.data.Length < 10 || record.data.Length > 4000) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写文本长度,该数值应大于10小于4000");
	                    return false;
	                }
	                break;
	            case 'datadict':
	                if (Ext.isEmpty(record.data.TypeAlias)) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请选择对应字典");
	                    return false;
	                }
	                break;
	            case 'decimal':
	                if (Ext.isEmpty(record.data.Scale) || record.data.Scale < 1 || record.data.Scale > 8) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写小数位数,该数值应大于1小于8");
	                    return false;
	                }
	                record.data.Length = 18 + record.data.Scale;
	            case 'long':
	                var maxNumber = Ext.isEmpty(record.data.MaxNumber) ? 10000000000000000 : record.data.MaxNumber;
	                var minNumber = Ext.isEmpty(record.data.MinNumber) ? -10000000000000000 : record.data.MinNumber;
	                if (maxNumber * 1 < minNumber * 1) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前最小值或最大值数值不合理,请做出适当调整");
	                    return false;
	                }
	                break;
	            default:
	                break;
	        }
	        if (Ext.isEmpty(record.data.GridColWidth)) {
	            record.data.GridColWidth = 100;
	        }
	        else if (record.data.GridColWidth > 1000 || record.data.GridColWidth < 40) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "列表列宽应大于40小于1000");
	            return false;
	        }
	        return true;
	    },
	    //[End]

	    //[Start]
	    _propertyView: function (name) {
	        var viewName;
	        if (name == "boolean")
	            viewName = "boolEntityView";
	        else if (name == "datetime")
	            viewName = "dateEntityView"
	        else if (name == "datadict")
	            viewName = "dictEntityView";
	        else
	            viewName = name + "EntityView";
	        $G.getCmp("baseEntityView").stopEditing();
	        $G.getCmp(viewName).stopEditing();
	        $G.getCmp("styleEntityView").stopEditing();
	    },
	    //[End]

	    //[Start]
	    _saveData: function (isEnd, isNew) {
	        _this._propertyView(layoutPanel10.propertyType);

	        if (!_this._checkPropertyInfo())
	            return;
	        var dataSource = $G.Page._propertyEditSource;
	        var record = dataSource.getDataRecord();
	        var changeSummary = dataSource.getChangeSummary();
	        if (changeSummary) {
	            _this._updatePropertyList(changeSummary[0], isNew);
	        }
	        if (isEnd)
	            _this._showPropertyWindow(false)
	        else
	            _this._loadProperty();
	    },
	    //[End]

	    //[Start]
	    _updatePropertyList: function (entity, isNew) {
	        var dataSource = $G.Page._propertyListSource;
	        if (isNew)
	            dataSource.addRecord();
	        var record = dataSource.getDataRecord();
	        for (var i in entity) {
	            if (i == "__type" || i == "__state" || i == "__changeSummary" || i == "__modified" || i == "__hash")
	                continue;
	            if (entity[i] != undefined)
	                record.set(i, entity[i]);
	        }
	        $G.Page._systemProperty[$G.Page._currentEntity] += entity["PropertyName"] + ',';
	    },
	    //[End]

	    //[Start]
	    actSaveProperty_Handler: function (sender) {
	        ///<summary>保存:actSaveProperty</summary>
	        _this._saveData(true, true);
	    },
	    //[End]

	    //[Start]
	    actSavePropertys_Handler: function (sender) {
	        ///<summary>保存并继续:actSavePropertys</summary>
	        _this._saveData(false, true);
	    },
	    //[End]

	    //[Start]
	    actCancelProperty_Handler: function (sender) {
	        ///<summary>取消:actCancelProperty</summary>
	        _this._showPropertyWindow(false)
	    },
	    //[End]

	    //[Start]
	    propertyListView_RowDblClick: function (item, rowIndex, e) {
	        ///<summary>RowDblClick</summary>

	    },
	    //[End]

	    //[Start]
	    Efd_Path_TriggerClick: function (index) {
	        ///<summary>TriggerClick</summary>
	        if (index == 2) {
	            var config = {
	                url: $G.getPageURLByFullName("GTP.AppFrameV2.DynaBizComp.ModuleTreeNLLookupPage"), //GTP.Services.Coding.ModuleTreeNLLookupPage
	                title: "请选择属性",
	                target: "_extwin",
	                features: {
	                    dialogWidth: 420,
	                    dialogHeight: 560
	                },
	                callback: function (ret) {
	                    if (ret.state) {
	                        var data = ret.returnEntity;
	                        var dataSource = $G.Page._dataEditSource;
	                        var record = dataSource.getDataRecord();
	                        record.set('Path', data.ModuleTreeFullName);
	                        record.set('NameSpace', data.ModuleTreeName);
	                    }
	                }
	            };
	            $G.open(config);
	        }
	        else {
	            var record = $G.Page._dataEditSource.getDataRecord();
	            record.set("Path", null);
	            record.set("NameSpace", null);
	        }
	    },
	    //[End]

	    //[Start]
	    Efd_DataType_Select: function (item, record, index) {
	        ///<summary>Select</summary>
	        _this._resetPropertyState(record.data.value, true);
	    },
	    //[End]

	    //[Start]
	    Efd_OriginalBizAlias_AfterLookup: function (data) {
	        ///<summary>AfterLookup</summary>
	        var record = $G.Page._dataEditSource.getDataRecord();
	        if (record.data.OriginalBizName != data.OutEntity.ModuleFullName)
	            $G.Page._propertyList = new Array();
	    },
	    //[End]

	    //[Start]
	    col_DataType_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        switch (record.data.DataType) {
	            case 'string':
	                return '文本'
	            case 'long':
	                return '整数'
	            case 'decimal':
	                return '小数'
	            case 'boolean':
	                return '布尔'
	            case 'datetime':
	                return '日期'
	            case 'datadict':
	                return '字典'
	            default:
	                return '文本';
	        }
	    },
	    //[End]

	    //[Start]
	    actOk_Handler: function (sender) {
	        ///<summary>确定:actOk</summary>
	        _this._saveData(true, false);
	    },
	    //[End]

	    //[Start]
	    _showReferObjectWindow: function (isShow) {
	        var refObjectWindow = $G.getCmp("windowView");
	        if (isShow) {
	            $G.getCmp("tabView").activate(0);
	            refObjectWindow.show();
	        }
	        else
	            refObjectWindow.hide();
	    },
	    //[End]

	    //[Start]
	    _showPropertySelectWindow: function (isShow) {
	        var w = $G.getCmp("windowView1");
	        if (isShow) {
	            w.show();
	        }
	        else {
	            w.hide();
	        }
	    },
	    //[End]

	    //[Start]
	    _loadRefObject: function (data) {
	        var dataSource = $G.Page._refSource;
	        var pageParams = Ext.util.JSON.decode(data.RefPageParams);
	        data.PropertyMapping = pageParams.RefInputMappings;
	        data.PageParam = pageParams.RefOutputMappings;
	        dataSource.loadData(data);
	        _this._showReferObjectWindow(true);
	    },
	    //[End]

	    //[Start]
	    _checkRefObject: function (record) {
	        if (!record.data.RefPageName) {
	            Gtp.net.MessageBox.info("提示", "请先选择参照页面");
	            return false;
	        }
	        if (!record.data.PropertyMapping || record.data.PropertyMapping.length == 0) {
	            Gtp.net.MessageBox.info("提示", "请添加属性映射");
	            return false;
	        }

	        var mappings = record.data.PropertyMapping;
	        for (var i = 0; i < mappings.length; i++) {
	            if (!mappings[i].SourceId) {
	                Gtp.net.MessageBox.info("提示", "请为第" + (i + 1) + "项属性设置配置回填参照属性");
	                return false;
	            }
	        }

	        return true;
	    },
	    //[End]

	    //[Start]
	    _saveRefObject: function () {
	        var dataSource = $G.Page._refSource;
	        var record = dataSource.getDataRecord();
	        if (!_this._checkRefObject(record))
	            return;

	        var changeSummary = dataSource.getChangeSummary();
	        var RefOutputMappings = null;
	        if (changeSummary[0].PropertyMapping)
	            RefOutputMappings = record.data.PropertyMapping;
	        var RefInputMappings = null;
	        if (changeSummary[0].PageParam)
	            RefInputMappings = record.data.PageParam;
	        if (RefInputMappings || RefOutputMappings) {
	            var RefPageParams = { RefOutputMappings: RefInputMappings, RefInputMappings: RefOutputMappings };
	            record.data.RefPageParams = Ext.util.JSON.encode(RefPageParams);
	        }
	        //	        changeSummary[0].ExtensionId = $G.Params.ExtensionId;


	        var dataListSource = $G.Page._propertyListSource;
	        var listRecord = dataListSource.getDataRecord();
	        listRecord.set("RefPageName", record.data.RefPageName);
	        listRecord.set("RefPageAlias", record.data.RefPageAlias);
	        listRecord.set("RefRemark", record.data.RefRemark);
	        listRecord.set("RefPageParams", record.data.RefPageParams);
	        _this._showReferObjectWindow(false);

	    },
	    //[End]

	    //[Start]
	    _checkRefPage: function () {
	        var record = $G.Page._refSource.getDataRecord();
	        if (!record.data.RefPageName) {
	            Gtp.net.MessageBox.info("提示", "请先选择参照页面");
	            return true;
	        }
	    },
	    //[End]

	    //[Start]
	    _loadInputParam: function () {
	        windowView.dataState = "DynamicReferenceObject.PageParam";
	        var dataSource = $G.DataContext.getDataSource("PropertyList");
	        _this._showPropertySelectWindow(true);
	        //TP-31766修复removeAll会清空$G.Page.ParamList数据的问题
	        var paramList = $G.clone($G.Page.ParamList);
	        dataSource.removeAll();
	        dataSource.loadData(paramList);

	        PropertySelectView.getView().focusRow(0);
	    },
	    //[End]

	    //[Start]
	    _loadPropertySelectList: function () {
	        var dataSource = $G.DataContext.getDataSource("PropertyList");
	        _this._showPropertySelectWindow(true);
	        var listDataSource = $G.Page._propertyListSource;
	        var data = [];
	        listDataSource.getDataStore().getRange().forEach(function (record) {
	            data.push({ PropertyName: "EP_" + record.data.PropertyName, PropertyAlias: record.data.PropertyAlias });
	        });
	        dataSource.removeAll();
	        dataSource.loadData(data);
	        PropertySelectView.getView().focusRow(0);
	        windowView.dataState = "DynamicReferenceObject.PropertyMapping";
	    },
	    //[End]

	    //[Start]
	    _resetParamList: function (pageName) {
	        $G.dispatcher({
	            controller: "GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage",
	            action: "GetParams",
	            args: [pageName],
	            success: function (data) {
	                var combo = $G.getCmp("refPropertyMapingView").getColumnModel().getColumnById("col_SourceName").editor.field;
	                combo.store.removeAll();

	                var inputParam = [];
	                data.forEach(function (r) {
	                    if (r[0] == "input") {
	                        inputParam.push({
	                            PropertyName: r[1],
	                            PropertyAlias: r[2],
	                            Type: r[3]
	                        });
	                    }
	                    else {
	                        combo.addItem(r[2], r[1]);
	                    }
	                });

	                $G.Page.ParamList = inputParam;
	                //	                        groupCombo.addItem(result[i].GroupAlias, result[i].Id);
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actSetReferenceInfo_Handler: function (sender) {
	        ///<summary>设置参照:actSetReferenceInfo</summary>
	        var record = _this._getSelectRecord(propertyListView, true);
	        if (record)
	            _this._loadRefObject($G.clone(record.data));
	    },
	    //[End]

	    //[Start]
	    actRemoveReference_Handler: function (sender) {
	        ///<summary>取消参照:actRemoveReference</summary>
	        var record = _this._getSelectRecord(propertyListView, true);
	        if (record) {
	            record.set("RefPageName", null);
	            record.set("RefPageAlias", null);
	            record.set("RefRemark", null);
	            record.set("RefPageParams", null);
	        }

	    },
	    //[End]

	    //[Start]
	    actSaveReferenceInfo_Handler: function (sender) {
	        ///<summary>确定:actSaveReferenceInfo</summary>
	        _this._saveRefObject();
	    },
	    //[End]

	    //[Start]
	    actCancelReference_Handler: function (sender) {
	        ///<summary>取消:actCancelReference</summary>
	        _this._showReferObjectWindow(false);
	    },
	    //[End]

	    //[Start]
	    actAddProMaping_Handler: function (sender) {
	        ///<summary>添加映射:actAddProMaping</summary>
	        if (_this._checkRefPage())
	            return;
	        _this._loadPropertySelectList();
	    },
	    //[End]

	    //[Start]
	    actRemoveProMapping_Handler: function (sender) {
	        ///<summary>移除映射:actRemoveProMapping</summary>
	        _this._removeGridRecord("refPropertyMapingView");
	    },
	    //[End]

	    //[Start]
	    actAddPageParam_Handler: function (sender) {
	        ///<summary>添加参数:actAddPageParam</summary>
	        if (_this._checkRefPage())
	            return;
	        _this._loadInputParam();
	    },
	    //[End]

	    //[Start]
	    actRemovePageParam_Handler: function (sender) {
	        ///<summary>移除参数:actRemovePageParam</summary>
	        _this._removeGridRecord("refPageParamView");
	    },
	    //[End]

	    //[Start]
	    actSelectProperties_Handler: function (sender) {
	        ///<summary>确定:actSelectProperties</summary>
	        var records = PropertySelectView.getSelectionModel().getSelections();
	        var dataSource = $G.DataContext.getDataSource(windowView.dataState);
	        //	        var p = (windowView.dataState == DynamicReferenceObject.PropertyMapping) ? "EP_" : "";
	        records.forEach(function (record) {
	            dataSource.addRecord();
	            dataSource.setFieldValue("Name", record.data.PropertyName);
	            dataSource.setFieldValue("Alias", record.data.PropertyAlias);
	            dataSource.setFieldValue("Type", record.data.Type || "Entity");
	        });
	        _this._showPropertySelectWindow(false);
	    },
	    //[End]

	    //[Start]
	    actCancelSelect_Handler: function (sender) {
	        ///<summary>取消:actCancelSelect</summary>
	        _this._showPropertySelectWindow(false);
	    },
	    //[End]

	    //[Start]
	    actMoveUp_Handler: function (sender) {
	        ///<summary>上移:actMoveUp</summary>
	        var record = _this._getSelectRecord("propertyListView", true);
	        if (!record)
	            return;
	        var grid = $G.getCmp("propertyListView");
	        var index = grid.store.indexOf(record);
	        if (index > 0) {
	            if (sender.text == "置于顶层")
	                index = 1;
	            var upRecord = grid.store.getAt(index - 1);

	            upRecord.fields.items.forEach(function (field) {
	                var fname = field.name;
	                if (fname == "NameAlias")
	                    return;
	                var fieldData = record.get(fname);
	                record.set(field.name, upRecord.get(fname));
	                upRecord.set(fname, fieldData);
	            }, this);

	            grid.getSelectionModel().selectRow(index - 1);
	            grid.getView().focusRow(index - 1);


	        }
	    },
	    //[End]

	    //[Start]
	    actMoveDown_Handler: function (sender) {
	        ///<summary>下移:actMoveDown</summary>
	        var record = _this._getSelectRecord("propertyListView", true);
	        if (!record)
	            return;
	        var grid = $G.getCmp("propertyListView");
	        var index = grid.store.indexOf(record);
	        var recordCount = grid.store.getCount();

	        if (index < recordCount - 1) {
	            if (sender.text == "置于底层")
	                index = recordCount - 2;
	            var downRecord = grid.store.getAt(index + 1);

	            downRecord.fields.items.forEach(function (field) {
	                var fname = field.name;
	                if (fname == "NameAlias")
	                    return;
	                var fieldData = record.get(fname);
	                record.set(field.name, downRecord.get(fname));
	                downRecord.set(fname, fieldData);
	            }, this);

	            grid.getSelectionModel().selectRow(index + 1);
	            grid.getView().focusRow(index + 1);

	        }
	    },
	    //[End]

	    //[Start]
	    Efd_RefPageAlias_Change: function (item, newValue, oldValue) {
	        ///<summary>Change</summary>
	        if (newValue) {
	            if (oldValue) {
	                $G.DataContext.getDataSource("DynamicReferenceObject.PageParam").removeAll();
	                $G.DataContext.getDataSource("DynamicReferenceObject.PropertyMapping").removeAll();
	            }
	            var record = $G.Page._refSource.getDataRecord();
	            if (record.data.RefPageName) {
	                _this._resetParamList(record.data.RefPageName);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _resetExpressionCobom: function (dataType, recordData) {
	        var datas = null;
	        switch (dataType) {
	            case "boolean":
	                datas = [["真值", "true"], ["假值", "false"]];
	                break;
	            case "datetime":
	                datas = [["即时时间函数", "Now()"]]
	                break;
	            case "datadict":
	                if (recordData) {
	                    _this._resetDictExpressionCobom(recordData.FullTypeName)
	                    return;
	                }
	        }
	        _this._resetRestExpressionCobom(datas);

	    },
	    //[End]

	    //[Start]
	    _resetRestExpressionCobom: function (datas) {
	        var cobom1 = $G.getCmp("Efd_DefaultValue");
	        var cobom2 = $G.getCmp("Efd_FormulaValue");
	        cobom1.store.removeAll();
	        cobom2.store.removeAll();
	        if (datas) {
	            datas.forEach(function (data) {
	                cobom1.addItem(data[0], data[1]);
	                cobom2.addItem(data[0], data[1]);
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    _resetDictExpressionCobom: function (fullCode) {
	        var cobom1 = $G.getCmp("Efd_DefaultValue");
	        var cobom2 = $G.getCmp("Efd_FormulaValue");
	        cobom1.store.removeAll();
	        cobom2.store.removeAll();

	        $G.dispatcher({
	            controller: "GTP.Services.Coding.CodingRuleEditPage",
	            async: false,
	            action: "getDataDict",
	            args: [fullCode],
	            success: function (result) {
	                if (result && result != "]") {
	                    items = Ext.util.JSON.decode(result);
	                    var s = eval(result);
	                    for (var i = 0; i < s.length; i++) {
	                        // 字典数据格式: {key:"Item1",value:"1"}
	                        itemValue = "{ key:\"" + s[i].Value + "\", value:\"" + s[i].Name + "\"}";
	                        cobom1.addItem(s[i].Name, itemValue);
	                        cobom2.addItem(s[i].Name, itemValue);
	                    }
	                    //	                        cstore.loadData();
	                }
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actSetFormulaValue_Handler: function (sender) {
	        ///<summary>actSetFormulaValue</summary>
	        var expressionField = $G.getCmp("Efd_FormulaValue");
	        _this._showExpressionEditWindow(expressionField.value, expressionField);
	    },
	    //[End]

	    //[Start]
	    actSetDefaultValue_Handler: function (sender) {
	        ///<summary>actSetDefaultValue</summary>
	        var expressionField = $G.getCmp("Efd_DefaultValue");
	        _this._showExpressionEditWindow(expressionField.value, expressionField);
	    },
	    //[End]

	    //[Start]
	    _showExpressionEditWindow: function (expressionText, comp) {
	        var record = $G.Page._dataEditSource.getDataRecord();
	        var entityName = _this._getSelectRecord("entityListView").data.EntityFullName;
	        var propertyInfos = "";
	        var properties = $G.Page._propertyListSource.getDataStore().getRange();
	        var propertySource = $G.Page._propertyEditSource;
	        properties.forEach(function (property) {
	            propertyInfos += "EP_" + property.data.PropertyName + ',' + property.data.PropertyAlias + ',' + property.data.DataType + ';';
	        });
	        var config = {
	            url: $G.getPageURLByFullName("GTP.AppFrameV2.DynaBizComp.DynaExpressionPage"),
	            title: "表达式编辑器",
	            target: "_extwin",
	            features: {
	                dialogWidth: 700,
	                dialogHeight: 380
	            },
	            parameters: {
	                EntityName: entityName,
	                ModuleCode: record.data.NameSpace + '.' + record.data.BizName,
	                ExtensionId: null,
	                PropertyInfos: propertyInfos,
	                ExpressionText: expressionText
	            },
	            callback: function (ret) {
	                if (ret.state) {
	                    comp.setValue(ret.OutExpressionText);
	                    propertySource.getDataRecord().set(comp.dataIndex, ret.OutExpressionText)
	                }
	            }
	        };
	        $G.open(config);
	    },
	    //[End]

	    //[Start]
	    Efd_TypeAlias_AfterLookup: function (data) {
	        ///<summary>AfterLookup</summary>
	        if (data.state) {
	            if (data.OutEntity.DictFullCode != $G.getCmp("Efd_TypeAlias").value) {
	                _this._resetDictExpressionCobom(data.OutEntity.DictFullCode);
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actUpgrade_Handler: function (sender) {
	        ///<summary>升级:actUpgrade</summary>
	        var record = _this._getSelectRecord("bizInfoListView", true);
	        if (record) {
	            var list = _this.getUpgradeConfig(record);
	            $G.dispatcher({
	                action: "RePublish",
	                args: [record.data, list],
	                success: function () {
	                    Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "升级成功");
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    actUpdateBizInfo_Handler: function (sender) {
	        ///<summary>保存:actUpdateBizInfo</summary>
	        var dataSource = $G.Page._bizEditSource;
	        var changeSummary = dataSource.getChangeSummary();
	        if (changeSummary) {
	            if (Ext.isEmpty(Efd_E_BizAlias.getValue())) {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写业务名称");
	                return;
	            }
	            $G.dispatcher({
	                action: "UpdateBizInfo",
	                args: [$G.Page._bizInfoEdit, changeSummary[0]],
	                success: function () {
	                    var record = _this._getSelectRecord("bizInfoListView");

	                    record.set("BizAlias", Efd_E_BizAlias.getValue());

	                    record.set("Remark", Efd_E_Remark.getValue());
	                    record.commit()
	                    _this._showBizInfoEditWindow(false);
	                }
	            });
	        }
	        else {
	            _this._showBizInfoEditWindow(false);
	        }
	    },
	    //[End]

	    //[Start]
	    actCancelUpdate_Handler: function (sender) {
	        ///<summary>取消:actCancelUpdate</summary>
	        _this._showBizInfoEditWindow(false);
	    },
	    //[End]

	    //[Start]
	    actSetBizInfo_Handler: function (sender) {
	        ///<summary>编辑:actSetBizInfo</summary>
	        _this._loadBizInfoData();
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.DynaBizInfoManagePage = _class;
})();
//</Bottom>