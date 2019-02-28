//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DynaBizComp");
	var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	//[Start]
	    _init: function () {
	        //初始化数据上下文
	        _this._initDataContext();
	        //初始化页面设置
	        _this._initSetting();
	        _this._initData();
	    },
	//[End]

	//[Start]
	    _initDataContext: function () {
	        //属性数据源
	        if (!$G.Page._propertyListSource)
	            $G.Page._propertyListSource = $G.DataContext.getDataSource("DynaPropertyList");
	        if (!$G.Page._propertyEditSource) {
	            $G.Page._propertyEditSource = $G.DataContext.getDataSource("DynaPropertyEdit");
	            $G.Page._propertyEditSource.on("update", function (sender, store, record, operation) {
	                var state = $G.CurrentState;
	                if (state != "STATE_NORMAL") return;
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
	                if ($G.CurrentState != "STATE_NORMAL") return;
	                if (data.length == 0) return;
	                var isEmpty = Ext.isEmpty(data[0].MoneySymbolic), cmp = $G.getCmp("Efd_DisplayDecimalPrecision");
	                cmp.setReadOnly(isEmpty);
	            });
	        }

	        //分组数据源
	        if (!$G.Page._groupListSource)
	            $G.Page._groupListSource = $G.DataContext.getDataSource("DynaGroupList");
	        if (!$G.Page._groupEditSource)
	            $G.Page._groupEditSource = $G.DataContext.getDataSource("DynaGroupEdit");

	        //实体列表数据源
	        if (!$G.Page._entityListSource)
	            $G.Page._entityListSource = $G.DataContext.getDataSource("DynaEntityPoco");

	        //方案数据源
	        if (!$G.Page._projectListSource)
	            $G.Page._projectListSource = $G.DataContext.getDataSource("DynaProjectPoco");
	        if (!$G.Page._projectEditSource)
	            $G.Page._projectEditSource = $G.DataContext.getDataSource("DynamicExtensionDefinition");

	        //参照设置数据源
	        if (!$G.Page._refSource)
	            $G.Page._refSource = $G.DataContext.getDataSource("DynamicReferenceObject");
	    },
	//[End]

	//[Start]
	    _initSetting: function () {
	        //初始页面状态
	        //	        if ($G.Params.State == "View")
	        //	            $G.States.setCurrentState("STATE_READONLY");

	        Ext.AppFrame.Util.InitPYControl({
	            sourceControlName: "Efd_PropertyAlias",
	            descControlName: "Efd_PropertyName",
	            canValidFunc: function () {
	                var w = $G.getCmp("windowView");
	                return w && w.isVisible();
	            }
	        });
	        //添加单选控制
	        var groupGrid = $G.getCmp("groupGridView");
	        groupGrid.getSelectionModel().singleSelect = true;

	        var propertyGrid = $G.getCmp("gridView");
	        propertyGrid.getSelectionModel().singleSelect = true;

	        var entityGrid = $G.getCmp("entityListView");
	        entityGrid.getSelectionModel().singleSelect = true;

	        var projectGrid = $G.getCmp("treeGrid");
	        projectGrid.getSelectionModel().singleSelect = true;

	        //加载实体已有属性
	        //	        _this._loadProperts();

	        $G.Page._staticExtension = $G.Params.StaticExtension;

	        if ($G.Params.SetRef) {
	            btnSetReferenceInfo.show();
	            btnRemoveReference.show();
	        }

	        //	        if (!!$G.Params.State) {
	        //	            $G.States.setCurrentState("STATE_READONLY");
	        //	        }
	        //	        else {
	        //	            $G.States.setCurrentState("STATE_NORMAL");
	        //	        }
	        _this._checkProjectState();

	        //设置页签更新事件
	        Portal.Tab.SetFocusTabEvent(function (tab, iframe) {
	            //判断是否为只读状态
	            _this._checkProjectState();
	            _this.groupGridView_RowClick();
	        }, Portal.Tab.CurrentTabID());

	    },
	//[End]

	//[Start]
	    _loadGroupListData: function () {
	        //加载分组列表信息
	        var dataSource = $G.Page._groupListSource;

	        $G.dispatcher({
	            action: "GetDynaGroupList",
	            args: [$G.Params.ExtensionId || 0],
	            success: function (result) {
	                dataSource.loadData(result);
	                //todo初始化分组下拉框
	                var groupCombo = $G.getCmp("Efd_GroupId");
	                for (var i = 0; i < result.length; i++) {
	                    groupCombo.addItem(result[i].GroupAlias, result[i].Id);
	                    var list = new Array();
	                    list[result[i].Id] = result[i].GroupAlias;
	                    $G.Page._groupList = list;
	                }
	                _this.groupGridView_RowClick();
	            }
	        });

	        //加载实体已有属性
	        _this._loadProperts();
	    },
	//[End]

	//[Start]
	    _loadGroupEditData: function (id) {
	        //加载分组编辑信息
	        var dataSource = $G.Page._groupEditSource;
	        dataSource.removeAll();
	        dataSource.commitChanges();
	        if (id) {
	            $G.dispatcher({
	                action: "GetDynaGroup",
	                args: [id],
	                success: function (data) {
	                    _this._showGroupWindow(true);
	                    dataSource.loadData(data);
	                }
	            });
	        }
	        else {
	            var extensionId;
	            if ($G.Page._pageModel != "normal") {
	                var projectRecord = _this._getSelectRecord("treeGrid", true);
	                if (projectRecord) {
	                    if (projectRecord.data.Level == 1)
	                        extensionId = -projectRecord.data.ID;
	                    else
	                        extensionId = -projectRecord.data.PID;
	                }
	                else
	                    return;
	            }
	            else
	                extensionId = $G.Params.ExtensionId;
	            _this._showGroupWindow(true);
	            dataSource.addRecord();
	            var record = dataSource.getDataRecord();
	            record.set("DynamicExtensionDefinition.Id", extensionId);
	        }
	    },
	//[End]

	//[Start]
	    _loadListData: function (groupId, projectId, entity) {
	        //加载属性列表页面数据

	        var dataSource = $G.Page._propertyListSource;
	        var afterLoadList = function (data) {
	            //缺少TotalCount属性会导致列表中的参照属性无法正常显示
	            dataSource.loadData({
	                __hash: "-1",
	                TotalCount: data.length,
	                Entities: data
	            });
	            _this.gridView_RowClick();
	        };
	        if (groupId) {//分组数据加载
	            $G.dispatcher({
	                action: "GetPropertyList",
	                args: [groupId],
	                success: function (result) {
	                    afterLoadList(result);
	                }
	            });
	        }
	        else if (projectId) {//方案数据加载
	            $G.dispatcher({
	                action: "GetPropertyListByProjectId",
	                args: [projectId],
	                success: function (result) {
	                    afterLoadList(result);
	                }
	            });
	        }
	        else {//业务组件-实体信息数据加载
	            var propertySetting = [$G.Params.bizCompName, null, entity.Name, entity.Alias];
	            $G.dispatcher({
	                controller: "GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage",
	                action: "GetPropertyListByProjectSetting",
	                args: [propertySetting],
	                success: function (result) {
	                    if (result.length > 0) {
	                        //暂存默认分组信息,再次加载数据使用
	                        entity.Record.set("DefaultGroupId", result[0].DynamicGroupDefinition.Id)
	                        entity.Record.set("StaticProjectId", result[0].ExtensionId);
	                        //存储ExtensionId,新增字段时使用
	                        $G.Page._extensionId = result[0].ExtensionId
	                    }
	                    afterLoadList(result);
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    _loadEditData: function (id) {
	        //加载属性编辑页面数据
	        var dataSource = $G.Page._propertyEditSource;
	        dataSource.removeAll();
	        dataSource.commitChanges();
	        if (id) {
	            $G.dispatcher({
	                action: "GetDynaProperty",
	                args: [id],
	                success: function (data) {
	                    $G.Page._currentPF = { propertyName: data.PropertyName, fieldName: data.FieldName };

	                    data.PropertyName = data.PropertyName.replace(/EP_/, '');

	                    //初始化分组下拉框
	                    if ($G.Page._pageModel != "normal")
	                        _this._resetGroupCobo(data.ExtensionId);
	                    _this._showPropertyWindow(true, false);
	                    if (data.State != "created") {
	                        _this._setEditFieldState(true);
	                    }
	                    else {
	                        _this._setEditFieldState(false);
	                    }
	                    data.GroupId = data.DynamicGroupDefinition.Id;
	                    _this._resetPropertyState(data.DataType, false, data);
	                    //	                    _this._resetExpressionCobom(data.DataType, data);
	                    //	                    if (data.DataType == "datadict") {
	                    //	                        _this._resetDictExpressionCobom(data.FullTypeName);
	                    //	                    }
	                    dataSource.loadData(data);

	                }
	            });
	        }
	        else {
	            //	            _this._resetPropertyState("string")

	            _this._setEditFieldState(false);

	            //重置字段信息
	            $G.Page._currentPF = { propertyName: null, fieldName: null };

	            var groupId = null, groupAlias = null, extensionId = null;
	            //获取方案分组信息
	            if ($G.Page._pageModel == "normal") {
	                var groupRecord = $G.Page._groupListSource.getDataRecord();
	                groupId = groupRecord.data.Id;
	                groupAlias = groupRecord.data.GroupAlias;
	                extensionId = $G.Params.ExtensionId;
	            }
	            else if ($G.Page._pageModel == "entitySetting") {
	                var entityRecord = _this._getSelectRecord("entityListView", true, "请先选择一个业务实体");
	                if (!entityRecord)
	                    return;
	                groupId = entityRecord.data.DefaultGroupId || 0;
	                extensionId = entityRecord.data.StaticProjectId;
	            }
	            else {
	                var projectRecord = _this._getSelectRecord("treeGrid", true, "请先选择一个方案或分组");
	                if (!projectRecord)
	                    return;
	                if (projectRecord.data.Level == 1) {
	                    extensionId = -projectRecord.data.ID;
	                }
	                else {
	                    groupId = projectRecord.data.ID;
	                    groupAlias = projectRecord.data.Alias;
	                    extensionId = -projectRecord.data.PID;
	                }
	            }

	            //初始化分组下拉框
	            if ($G.Page._pageModel != "normal")
	                _this._resetGroupCobo(extensionId ? extensionId : "null");

	            //显示编辑窗口
	            _this._showPropertyWindow(true, true);

	            //初始化字段信息
	            dataSource.addRecord();
	            dataSource.setFieldValue("GroupId", groupId);
	            dataSource.setFieldValue("DynamicGroupDefinition.Id", groupId);
	            dataSource.setFieldValue("DynamicGroupDefinition.GroupAlias", groupAlias);
	            dataSource.setFieldValue("ExtensionId", extensionId);

	            //重置数据类型
	            _this._resetPropertyState('string', true);
	        }
	    },
	//[End]

	//[Start]
	    _checkProjectState: function () {
	        $G.dispatcher({
	            async: false,
	            controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	            action: "GetPropertyState",
	            args: [$G.Params.ExtensionId],
	            success: function (result) {
	                $G.Page._pageState = $G.Params.State || result;
	                if (result) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前方案正在运行中,暂时不能修改属性信息");
	                }
	                else {
	                    Gtp.net.MessageBox.hide();
	                }
	                if ($G.Page._pageState) {
	                    $G.States.setCurrentState("STATE_READONLY");
	                }
	                else {
	                    $G.States.setCurrentState("STATE_NORMAL");
	                }

	                //动态方案隐藏属性列
	                if (!$G.Page._staticExtension) {
	                    var propertyGrid = $G.getCmp("gridView");
	                    var propertyColumnModel = propertyGrid.getColumnModel();
	                    propertyColumnModel.lookup.col_IsQuery.hidden = true;
	                    propertyColumnModel.lookup.col_IsFilter.hidden = true;
	                    propertyColumnModel.lookup.col_IsOrder.hidden = true;
	                    propertyGrid.reconfigureColumns(propertyColumnModel)
	                }
	            },
	            failure: function () {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前方案已被删除,点击确定关闭当前页面", function () {
	                    $G.close(false);
	                });
	                return false;
	            }
	        });

	    },

	    //[Start]
	    _setEditFieldState: function (readOnly) {
	        var readOnly = readOnly || ($G.Page._pageState);
	        $G.getCmp("Efd_DataType").setReadOnly(readOnly);
	        $G.getCmp("Efd_PropertyName").setReadOnly(readOnly);
	        $G.getCmp("Efd_IsCollection").setReadOnly(readOnly);
	    },
	//[End]

	//[Start]
	    _setStaticFieldState: function () {
	        Efd_IsQuery.setVisible($G.Page._staticExtension);
	        Efd_FuzzyField.setVisible($G.Page._staticExtension);
	        Efd_IsFilter.setVisible($G.Page._staticExtension);
	        Efd_IsOrder.setVisible($G.Page._staticExtension);
	        Efd_IsReadOnly.setVisible($G.Page._staticExtension);
	        Efd_GridColWidth.setVisible($G.Page._staticExtension);
	        styleEntityView_category_R7C1_1.setVisible($G.Page._staticExtension);
	    },
	//[End]

	//[Start]
	    _loadProperts: function (entityFullName) {
	        //加载对应实体的系统字段
	        if (!entityFullName)
	            entityFullName = $G.Params.EntityFullName;

	        if (entityFullName) {
	            $G.dispatcher({
	                controller: "GTP.AppFrame.PropertyTreeLookupPage",
	                action: "GetChildrenLeafNodes",
	                args: [entityFullName, " "],
	                success: function (data) {
	                    $G.DataContext.getDataSource("Property").loadData(data);
	                    var checkIds = ",";
	                    for (var i = 0; i < data.length; i++) {
	                        checkIds += data[i].ID + ","
	                    }
	                    $G.Page._systemProperty = checkIds;
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    _loadEntityList: function () {
	        //加载实体列表
	        var bizCompName = $G.Params.bizCompName;
	        $G.dispatcher({
	            controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	            action: "GetEntityList",
	            args: [bizCompName],
	            success: function (result) {
	                $G.Page._MasterEntity = result[0];

	                //更新实体列表
	                $G.Page._entityListSource.loadData(result);
	                //更新系统属性字段列表
	                _this._loadProperts(result[0].EntityFullName);
	                //更新实体下拉框
	                var combo = $G.getCmp("cbEntityList");
	                result.forEach(function (entity) {
	                    combo.addItem(entity.EntityAlias, entity.EntityFullName);
	                });
	                combo.selectByIndex(0);

	                _this.entityListView_RowClick();
	            }
	        });
	    },
	//[End]

	//[Start]
	    _loadProjectList: function (entityFullName, entityAlias) {
	        //加载方案列表
	        if (!entityFullName) {
	            entityFullName = $G.Page._MasterEntity.EntityFullName;
	            entityAlias = $G.Page._MasterEntity.EntityAlias;
	        }
	        //	        if (entityFullName == $G.Page._currentEntity) {
	        //	            _this.treeGrid_RowClick();
	        //	            return;
	        //	        }
	        var bizCompName = $G.Params.bizCompName;
	        $G.dispatcher({
	            action: "GetProjectGroupInfos",
	            args: [bizCompName, entityFullName],
	            success: function (result) {
	                $G.Page._currentEntity = { name: entityFullName, alias: entityAlias };
	                $G.Page._projectListSource.loadData(result);
	                //	                var treeGrid = $G.getCmp("treeGrid");
	                treeGrid.loadData(result);
	                treeGrid.expandAll();
	                if (result.length > 0) {

	                    _this.treeGrid_RowClick();
	                }
	                else
	                    $G.Page._propertyListSource.removeAll();
	            }
	        });
	    },
	//[End]

	//[Start]
	    _loadEditProject: function (id, isStatic) {
	        var dataSource = $G.Page._projectEditSource;
	        dataSource.removeAll();
	        dataSource.commitChanges();
	        if (id) {
	            $G.dispatcher({
	                controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	                action: "GetDynaProject",
	                args: [id],
	                success: function (data) {
	                    _this._showProjectWindow(true, false, Ext.isEmpty(data.Conditions));
	                    dataSource.loadData(data);
	                }
	            });
	        }
	        else {
	            _this._showProjectWindow(true, true, isStatic);
	            dataSource.addRecord();
	            dataSource.setFieldValue("BizCompName", $G.Params.bizCompName);
	            dataSource.setFieldValue("BizCompAlias", $G.Params.bizCompAlias);
	            //	            dataSource.setFieldValue("BizCompAlias", $G.Page._module.text);
	            dataSource.setFieldValue("EntityName", cbEntityList.value);
	        }
	    },
	//[End]

	//[Start]
	    _initOperator: function () {
	        var column = $G.getCmp("conditionsView").getColumnModel().getColumnById("col_OperatorType");
	        var comboBox = column.editor.field;
	        //	        comboBox.addItem(result[i].Name.zh_CN, result[i].Id);
	        comboBox.addItem("等于", "Equal");
	        comboBox.addItem("不等于", "NotEqual");
	        comboBox.addItem("大于", "GreatThan");
	        comboBox.addItem("大于等于", "GreatEqual");
	        comboBox.addItem("小于", "LessThan");
	        comboBox.addItem("小于等于", "LessEqual");
	        comboBox.addItem("包含有", "Like");

	        comboBox.setEditable(false);
	        comboBox.allowBlank = false;
	    },
	//[End]

	//[Start]
	    _initData: function () {
	        //初始化数据信息
	        if (!Ext.isEmpty($G.Params.ExtensionId)) {
	            //弹性域属性管理模式
	            $G.Page._extensionId = $G.Params.ExtensionId;
	            $G.Page._pageModel = "normal";
	            //	            $G.Page._entityFullName = $G.Params.EntityFullName;
	            _this._loadGroupListData();
	        }
	        else if (!Ext.isEmpty($G.Params.bizCompName)) {
	            //属性配置模式
	            layoutPanel2.layout.setActiveItem(1);
	            //	            layoutPanel1.doLayout();
	            $G.Page._pageModel = "entitySetting";
	            $G.Page._staticExtension = true;
	            _this._loadEntityList();
	            _this._initOperator();
	        }
	        //	        else if (3 == 1)//属性配置(高级)模式
	        //	            _this._loadProjectList();
	    },
	//[End]

	//[Start]
	    _checkPageParam: function () {
	        return true;
	    },
	//[End]

	//[Start]
	    Page_DocumentReady: function () {
	        if (_this._checkPageParam())
	            _this._init();
	        //	        _this._initSetting();
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
	            //	            var cobom1 = $G.getCmp("Efd_DefaultValue");
	            //	            cobom1.store.removeAll();
	            //	            var cobom2 = $G.getCmp("Efd_FormulaValue");
	            //	            cobom2.store.removeAll();

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
	                    record.set("Length", 18);
	                    record.set("Scale", 0);
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
	        layoutPanel8.layout.setActiveItem(index);
	        layoutPanel8.propertyType = name;
	        //	        layoutPanel7.layout.activeItem.setWidth(330);
	        //	        layoutPanel7.layout.container.setWidth(330);
	        layoutPanel8.layout.container.doLayout(true);
	        layoutPanel8.doLayout();
	        //	        layoutPanel7.setHeight(height);
	        //	        layoutPanel6.doLayout();
	        $G.Page._dataType = name;

	        //TP-30509 修复字典参照框样式问题
	        if (name == "datadict")
	            Efd_TypeAlias.updateTrigger1();

	        _this._resetExpressionCobom(name, data);
	        //	        layoutPanel5.setHeight(315 - height);
	    },
	//[End]

	//[Start]
	    _resetGroupCobo: function (projectId, data) {
	        if (!$G.Page._groupDataList)
	            $G.Page._groupDataList = new Array();
	        var groupList = $G.Page._groupDataList;
	        if ($G.Page._currentProject == projectId && (groupList[projectId] && !groupList[projectId].modified))
	            return;
	        var groupData;
	        if (projectId == 'null') {
	            if (!groupList["null"])
	                groupList["null"] = { data: [{ ID: 0, Alias: "默认分组"}], modified: false };
	            groupData = groupList["null"].data;
	        }
	        //	        else if (groupList[projectId] && !groupList[projectId].modified) {
	        //	            //	            groupData = groupList[projectId].data;
	        //	            return;
	        //	        }
	        else {
	            if (data) {
	                groupData = data;
	            }
	            else {
	                $G.dispatcher({
	                    async: false,
	                    action: "GetGroupInfos",
	                    args: [projectId],
	                    success: function (result) {
	                        groupData = result;
	                    }
	                });
	            }
	            groupList[projectId] = { data: groupData, modified: false };
	        }

	        var coboBox = $G.getCmp("Efd_GroupId");
	        coboBox.store.removeAll();
	        groupData.forEach(function (info) {
	            if (info)
	                coboBox.addItem(info.Alias, info.ID);
	        });
	        $G.Page._currentProject = projectId;
	    },
	//[End]

	//[Start]
	    _showPropertyWindow: function (isShow, isNew) {
	        //显示扩展属性编辑窗口
	        var propertyWindow = $G.getCmp("windowView");

	        if (isShow) {
	            //	            Efd_GroupId.setVisible($G.Page._pageModel != "entitySetting");
	            if (isNew) {
	                propertyWindow.setTitle("新建");
	                btnSavePropertys.show();
	            } else {
	                propertyWindow.setTitle("编辑");
	                btnSavePropertys.hide();
	            }

	            _this._setStaticFieldState();

	            propertyWindow.show();

	            if (!$G.Page._limitNumberEvent) {
	                $G.Page._limitNumberEvent = true;
	                //添加控件控制
	                $G.getCmp("Efd_MinLong").getEl().on("keyup", _this._limitNumberCheck);
	                $G.getCmp("Efd_MaxLong").getEl().on("keyup", _this._limitNumberCheck);
	                $G.getCmp("Efd_MinDecimal").getEl().on("keyup", _this._limitNumberCheck);
	                $G.getCmp("Efd_MaxDecimal").getEl().on("keyup", _this._limitNumberCheck);

	                $G.getCmp("Efd_MinLong").getEl().on("blur", _this._formatNumber);
	                $G.getCmp("Efd_MaxLong").getEl().on("blur", _this._formatNumber);
	                $G.getCmp("Efd_MinDecimal").getEl().on("blur", _this._formatNumber);
	                $G.getCmp("Efd_MaxDecimal").getEl().on("blur", _this._formatNumber);

	                //	                layoutPanel8.setWidth(388);

	                //设置窗口样式
	                var fieldSet = new Ext.form.FieldSet({
	                    id: "propertyFieldSet",
	                    height: 15,
	                    width: 388,
	                    title: "属性设置",
	                    style: "margin-left:20px;margin-right:20px;margin-top:5px;"
	                });

	                layoutPanel8.setHeight(138);
	                layoutPanel8.addClass("x-panel-fieldSet");
	                layoutPanel7.add(fieldSet);
	                layoutPanel7.layout.container.doLayout(true);
	            }
	            //设置布局宽度
	            layoutPanel8.setWidth(388);

	        }
	        else {
	            propertyWindow.hide();
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
	    _showGroupWindow: function (isShow) {
	        //显示分组编辑窗口
	        var groupWindow = $G.getCmp("windowView1");
	        if (isShow) {
	            groupWindow.show();
	        }
	        else
	            groupWindow.hide();
	    },
	//[End]

	//[Start]
	    _showProjectWindow: function (isShow, isNew, isStatic) {
	        var projectWindow = $G.getCmp("windowView2");
	        if (isShow) {
	            var title = (isNew ? "新建" : "编辑") + '-' + (isStatic ? "静态方案" : "动态方案");
	            conditionsView.setVisible(!isStatic);
	            projectWindow.setHeight(isStatic ? 200 : 460);
	            projectWindow.setTitle(title);
	            projectWindow.show();
	        }
	        else
	            projectWindow.hide();
	    },
	//[End]

	//[Start]
	    _showReferObjectWindow: function (isShow) {
	        var refObjectWindow = $G.getCmp("windowView3");
	        if (isShow) {
	            $G.getCmp("tabView").activate(0);
	            refObjectWindow.show();
	        }
	        else
	            refObjectWindow.hide();
	    },
	//[End]

	//[Start]
	    actSaveProperty_Handler: function (sender) {
	        ///<summary>保存:actSaveProperty</summary>
	        //	        _this._showPropertyWindow(false)
	        _this._saveData(true);
	    },
	//[End]

	//[Start]
	    actSavePropertys_Handler: function (sender) {
	        ///<summary>保存并继续:actSavePropertys</summary>
	        _this._saveData(false);
	    },
	//[End]

	//[Start]
	    _checkGroupInfo: function () {
	        var record = $G.Page._groupEditSource.getDataRecord();
	        if (Ext.isEmpty(record.data.GroupAlias)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写分组名称");
	            return false;
	        }
	        return true;
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
	        if ($G.Page._systemProperty.indexOf(',' + propertyName + ',') != -1) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "属性编码不能与系统字段相同,请调整属性编码");
	            return false;
	        }
	        if (Ext.isEmpty(record.data.PropertyAlias)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写显示名称");
	            return false;
	        }
	        if (Ext.isEmpty(record.data.GroupId)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请选择分组");
	            return false;
	        }
	        if (Ext.isEmpty(record.data.GridColWidth))
	            record.set("GridColWidth", 100);
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
	            viewName = "dateEntityView";
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
	    _saveData: function (isEnd) {
	        //保存扩展字段
	        _this._propertyView(layoutPanel8.propertyType);

	        if (!_this._checkPropertyInfo())
	            return;
	        var dataSource = $G.Page._propertyEditSource;
	        var record = dataSource.getDataRecord();
	        var changeSummary = dataSource.getChangeSummary();
	        if (changeSummary) {
	            if (record.data.ExtensionId) {
	                $G.dispatcher({
	                    action: "SaveProperty",
	                    args: [changeSummary[0], record.data, record.data.ExtensionId, [$G.Page._currentPF.propertyName, $G.Page._currentPF.fieldName]],
	                    success: function (propertyId) {
	                        var op = "edit";
	                        if (changeSummary[0].Id < 0) {
	                            changeSummary[0].Id = propertyId;
	                            op = "add";
	                            changeSummary[0].State = "created";
	                        }
	                        if ($G.Page._pageModel == "entitySetting")
	                            changeSummary[0].DynamicGroupDefinition.GroupAlias = Efd_GroupId.getText();

	                        //更新列表信息
	                        _this._updateList(op, changeSummary[0], propertyId);

	                        //是否连续新增
	                        if (isEnd)
	                            _this._showPropertyWindow(false)
	                        else
	                            _this._loadEditData();

	                        //触发行点击事件
	                        _this.gridView_RowClick();
	                    }
	                });
	            }
	            else {
	                var entityRecord = _this._getSelectRecord("entityListView", true, "请先选择一个业务实体");
	                if (!entityRecord)
	                    return;
	                var entityFullName = entityRecord.data.EntityFullName;
	                var entityAlias = entityRecord.data.EntityAlias;
	                $G.dispatcher({
	                    action: "SavePropertyByProject",
	                    args: [changeSummary[0], [$G.Params.bizCompName, "", entityFullName, entityAlias]],
	                    success: function (result) {
	                        //返回属性id,分组id和方案id

	                        //更新实体静态方案信息和分组信息
	                        var entityRecord = _this._getSelectRecord("entityListView", false);
	                        entityRecord.set("StaticProjectId", result[2]);
	                        entityRecord.set("DefaultGroupId", result[1]);

	                        //回填实体数据
	                        changeSummary[0].ExtensionId = result[2];
	                        changeSummary[0].DynamicGroupDefinition = { Id: result[1], GroupAlias: "默认分组" };
	                        changeSummary[0].Id = result[0];

	                        //更新分组下拉框
	                        _this._resetGroupCobo(result[2], [{
	                            ID: result[1],
	                            Alias: "默认分组"
	                        }])
	                        //	                        var op = "edit";

	                        //	                        if (changeSummary[0].Id < 0) {
	                        //	                            changeSummary[0].Id = propertyId;
	                        //	                            op = "add";
	                        //	                            changeSummary[0].State = "created";
	                        //	                        }

	                        //更新列表信息
	                        changeSummary[0].State = "created";
	                        _this._updateList("add", changeSummary[0], result[0]);

	                        //是否连续新增
	                        if (isEnd)
	                            _this._showPropertyWindow(false)
	                        else
	                            _this._loadEditData();

	                        //触发行点击事件
	                        _this.gridView_RowClick();
	                    }
	                });
	            }
	        }
	        else
	            _this._showPropertyWindow(false);
	    },
	//[End]

	//[Start]
	    _updateList: function (op, entity, propertyId) {
	        //更新字段列表
	        var dataSource = $G.Page._propertyListSource;
	        if ($G.Page._pageModel == "normal") {
	            var groupId = $G.Page._groupListSource.getDataRecord().get("Id");
	            if (!Ext.isEmpty(entity.DynamicGroupDefinition) && groupId != entity.DynamicGroupDefinition.Id) {
	                var groupGrid = $G.getCmp("groupGridView");
	                //	                groupGrid.selModel.selectById(entity.DynamicGroupDefinition.Id, false);
	                var infos = groupGrid.store.getRange();
	                for (var i = 0; i < infos.length; i++) {
	                    if (infos[i].data.Id == entity.DynamicGroupDefinition.Id) {
	                        groupGrid.selModel.selectRow(i);
	                    }
	                }

	                _this.groupGridView_RowClick();
	                return;
	            }
	        }
	        if (op == "add") {
	            dataSource.addRecord();
	        }
	        var record = dataSource.getDataRecord();
	        for (var i in record.data) {
	            if (i == "__type" || i == "__state" || i == "__changeSummary" || i == "__modified" || i == "__hash")
	                continue;
	            if (entity[i] != undefined)
	                record.set(i, entity[i]);
	        }
	        //	        record.id = propertyId;
	        if (!Ext.isEmpty(entity.DynamicGroupDefinition)) {
	            record.set("DynamicGroupDefinition", entity.DynamicGroupDefinition);
	        }
	        record.commit();
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
	    actCancelProperty_Handler: function (sender) {
	        ///<summary>取消:actCancelProperty</summary>
	        _this._showPropertyWindow(false);
	    },
	//[End]

	//[Start]
	    actAddGroup_Handler: function (sender) {
	        ///<summary>分组:actAddGroup</summary>
	        _this._loadGroupEditData();
	    },
	//[End]

	//[Start]
	    actEditGroup_Handler: function (sender) {
	        ///<summary>编辑:actEditGroup</summary>
	        var record = _this._getSelectRecord("groupGridView", true);
	        if (record)
	            _this._loadGroupEditData(record.data.Id);
	    },
	//[End]

	//[Start]
	    actDeleteGroup_Handler: function (sender) {
	        ///<summary>删除:actDeleteGroup</summary>
	        var record = _this._getSelectRecord("groupGridView", true);
	        if (record)
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "删除分组将删除对应扩展属性,确定要删除么", function (e) {
	                if (e == "yes") {
	                    //	                    var record = $G.Page._groupListSource.getDataRecord();
	                    $G.dispatcher({
	                        action: "DeleteGroup",
	                        args: [record.data.Id, $G.Params.ExtensionId],
	                        success: function () {
	                            var combo = $G.getCmp("Efd_GroupId");
	                            combo.removeByValue(record.data.Id);
	                            var grid = $G.getCmp("groupGridView");
	                            grid.getStore().remove(record);
	                            grid.getSelectionModel().selectRow(0);
	                            _this.groupGridView_RowClick();
	                            Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "删除成功");
	                        }
	                    });
	                }
	            });
	    },
	//[End]

	//[Start]
	    actMoveUp_Handler: function (sender) {
	        ///<summary>上移:actMoveUp</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (!record)
	            return;
	        var grid = $G.getCmp("gridView");
	        var index = grid.store.indexOf(record);
	        if (index > 0) {
	            if (sender.text == "置于顶层")
	                index = 1;
	            var upRecord = grid.store.getAt(index - 1);
	            $G.dispatcher({
	                action: "ChangePropertyOrderNum",
	                args: [record.data, upRecord.data],
	                success: function () {
	                    upRecord.fields.items.forEach(function (field) {
	                        if (field.name == "OrderNum")
	                            return;
	                        var fieldData = record.get(field.name);
	                        record.set(field.name, upRecord.get(field.name));
	                        upRecord.set(field.name, fieldData);
	                    }, this);
	                    record.commit();
	                    upRecord.commit();
	                    grid.getSelectionModel().selectRow(index - 1);
	                    grid.getView().focusRow(index - 1);
	                }
	            });


	        }
	    },
	//[End]

	//[Start]
	    actMoveDown_Handler: function (sender) {
	        ///<summary>下移:actMoveDown</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (!record)
	            return;
	        var grid = $G.getCmp("gridView");
	        var index = grid.store.indexOf(record);
	        var recordCount = grid.store.getCount();

	        if (index < recordCount - 1) {
	            if (sender.text == "置于底层")
	                index = recordCount - 2;
	            var downRecord = grid.store.getAt(index + 1);
	            $G.dispatcher({
	                action: "ChangePropertyOrderNum",
	                args: [record.data, downRecord.data],
	                success: function () {
	                    downRecord.fields.items.forEach(function (field) {
	                        if (field.name == "OrderNum")
	                            return;
	                        var fieldData = record.get(field.name);
	                        record.set(field.name, downRecord.get(field.name));
	                        downRecord.set(field.name, fieldData);
	                    }, this);
	                    record.commit();
	                    downRecord.commit();
	                    grid.getSelectionModel().selectRow(index + 1);
	                    grid.getView().focusRow(index + 1);
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    actAddProperty_Handler: function (sender) {
	        ///<summary>添加字段:actAddProperty</summary>
	        _this._loadEditData();
	        cmp = $G.getCmp("Efd_DisplayDecimalPrecision");
	        cmp.setReadOnly(true);
	    },
	//[End]

	//[Start]
	    actEditProperty_Handler: function (sender) {
	        ///<summary>编辑字段:actEditProperty</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record)
	            _this._loadEditData(record.data.Id);
	    },
	//[End]

	//[Start]
	    actView_Handler: function (sender) {
	        ///<summary>查看:actView</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record)
	            _this._loadEditData(record.data.Id);
	    },
	//[End]

	//[Start]
	    actOk_Handler: function (sender) {
	        ///<summary>确定:actOk</summary>
	        _this._showPropertyWindow(false);
	    },
	//[End]

	//[Start]
	    actDeleteProperty_Handler: function (sender) {
	        ///<summary>删除字段:actDeleteProperty</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record)
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "确定要删除选择字段么", function (e) {
	                if (e == "yes") {
	                    var record = $G.Page._propertyListSource.getDataRecord();
	                    $G.dispatcher({
	                        action: "DeleteProperty",
	                        args: [record.data.ExtensionId, record.data.Id],
	                        success: function () {
	                            var grid = $G.getCmp("gridView");
	                            grid.getStore().remove(record);
	                        }
	                    });
	                }
	            });
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
	    Efd_DataType_Select: function (item, record, index) {
	        ///<summary>Select</summary>
	        _this._resetPropertyState(record.data.value, true);
	    },
	//[End]

	//[Start]
	    groupGridView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        var record = _this._getSelectRecord("groupGridView", false);
	        if (record)
	            _this._loadListData(record.data.Id);
	    },
	//[End]

	//[Start]
	    actSaveGroup_Handler: function (sender) {
	        ///<summary>确定:actSaveGroup</summary>
	        if (!_this._checkGroupInfo())
	            return;
	        var dataSource = $G.Page._groupEditSource;
	        var changeSummary = dataSource.getChangeSummary();
	        if (changeSummary) {
	            //	            if (changeSummary[0].Id < 0) {
	            //	                //todo改造分组保存方法
	            //	                changeSummary[0].DynamicExtensionDefinition = {
	            //	                    Id: ($G.Page._pageModel == "normal" ? $G.Params.ExtensionId : "")
	            //	                };
	            //	            }
	            $G.dispatcher({
	                action: "SaveGroup",
	                args: changeSummary,
	                success: function (id) {
	                    _this._showGroupWindow(false);
	                    var listSource = $G.Page._groupListSource;
	                    var editReord = dataSource.getDataRecord();
	                    var projectId = editReord.data.DynamicExtensionDefinition.Id;
	                    var combo = $G.getCmp("Efd_GroupId");
	                    if (changeSummary[0].__state == "created") {
	                        if ($G.Page._pageModel != "normal") {

	                            var pNode = treeGrid.store.getById(projectId);
	                            treeGrid.appendRowChild(pNode, {
	                                ID: id,
	                                PID: -projectId,
	                                //                                    Name:
	                                Alias: editReord.data.GroupAlias,
	                                Level: 2,
	                                IsLeaf: true,
	                                OrderNo: editReord.data.OrderNo,
	                                Conditions: ""
	                            });
	                            if ($G.Page._groupDataList && $G.Page._groupDataList[projectId]) {
	                                $G.Page._groupDataList[projectId].data.push({ ID: id, Alias: editReord.data.GroupAlias });
	                                $G.Page._groupDataList.modified = true;
	                            }
	                            return;
	                        }
	                        else
	                            listSource.addRecord();
	                        //同步分组下拉菜单
	                        combo.addItem(changeSummary[0].GroupAlias, id);
	                        $G.Page._propertyListSource.loadData({
	                            TotalCount: 0,
	                            Entities: []
	                        });
	                    }
	                    else {
	                        //同步分组下拉菜单
	                        //	                        var record = combo.store.getById(changeSummary[0].Id)
	                        if ($G.Page._pageModel != "normal") {
	                            var editReord = dataSource.getDataRecord();
	                            var node = treeGrid.store.getById(editReord.data.Id);
	                            node.set("Alias", editReord.data.GroupAlias);
	                            //	                            $G.Page._projectListSource
	                            treeGrid.commitChanges();
	                            _this._updatePropertyListAfterGroupChange(changeSummary[0].Id);
	                            if ($G.Page._groupDataList && $G.Page._groupDataList[projectId]) {
	                                $G.Page._groupDataList[projectId].data.forEach(function (group) {
	                                    if (group.ID == id)
	                                        group.Alias = editReord.data.GroupAlias;
	                                });
	                                $G.Page._groupDataList[projectId].modified = true;
	                            }
	                            return;
	                        }
	                        var records = combo.store.getRange();
	                        for (var i = 0; i < records.length; i++) {
	                            if (records[i].data.value == changeSummary[0].Id) {
	                                records[i].set("text", changeSummary[0].GroupAlias);
	                                break;
	                            }
	                        }
	                        _this._updatePropertyListAfterGroupChange(changeSummary[0].Id);

	                        //	                        combo.addItem(changeSummary[0].GroupAlias, id);
	                    }

	                    var listRecord = listSource.getDataRecord();
	                    listRecord.set("Id", id);
	                    listRecord.set("GroupAlias", changeSummary[0].GroupAlias);
	                    //	                    listRecord.id = id;

	                    listSource.commitChanges();
	                }
	            });
	        }
	        else
	            _this._showGroupWindow(false);
	    },
	//[End]

	//[Start]
	    _updatePropertyListAfterGroupChange: function (id) {
	        _this._loadListData(id);
	    },
	//[End]

	//[Start]
	    actCancelGroup_Handler: function (sender) {
	        ///<summary>取消:actCancelGroup</summary>
	        _this._showGroupWindow(false);
	    },
	//[End]

	//[Start]
	    Efd_GroupId_Select: function (item, record, index) {
	        ///<summary>Select</summary>
	        var dataSource = $G.Page._propertyEditSource;
	        var d = dataSource.getDataRecord();
	        d.set("DynamicGroupDefinition", { Id: record.data.value, GroupAlias: record.data.text });
	        //            record
	    },
	//[End]

	//[Start]
	    gridView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        //属性列控制
	        var record = _this._getSelectRecord("gridView", false);
	        if (record) {
	            if (!record.data.State || record.data.State == "created")
	                btnDeleteProperty.enable(true);
	            else
	                btnDeleteProperty.disable();
	        }
	    },
	//[End]

	//[Start]
	    col_OType_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        switch (record.data.OType) {
	            case 'String':
	                return "文本";
	            case 'Decimal':
	            case 'Double':
	                return "小数";
	            case 'Integer':
	            case 'Long':
	                return '整数';
	            case 'GTPEnum':
	                return '枚举';
	            case 'DataDict':
	                return '字典';
	            case 'Boolean':
	                return '是否';
	            case 'DateTime':
	                return '日期';
	            default:
	                return '其他';
	        }
	    },
	//[End]

	//[Start]
	    actBack_Handler: function (sender) {
	        ///<summary>返回:actBack</summary>
	        window.location.href = document.referrer;
	    },
	//[End]

	//[Start]
	    col_PropertyName_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        if (!Ext.isEmpty(record.data.PropertyName))
	            return record.data.PropertyName.replace(/EP_/, '');
	        return null;
	    },
	//[End]

	//[Start]
	    actSuperModel_Handler: function (sender) {
	        ///<summary>高级模式:actSuperModel</summary>
	        layoutPanel2.layout.setActiveItem(2);
	        $G.Page._pageModel = "projectGroup";
	        cbEntityList.selectByIndex(0);
	        _this._loadProjectList();
	    },
	//[End]

	//[Start]
	    actSimpleModel_Handler: function (sender) {
	        ///<summary>简单模式:actSimpleModel</summary>
	        layoutPanel2.layout.setActiveItem(1);
	        $G.Page._pageModel = "entitySetting";
	        $G.Page._staticExtension = true;
	        _this.entityListView_RowClick();
	    },
	//[End]

	//[Start]
	    treeGrid_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        var record = _this._getSelectRecord("treeGrid", false);
	        if (record) {
	            if (record.data.Level == 1) {
	                _this._loadListData(null, -record.data.ID, null);
	                $G.Page._staticExtension = Ext.isEmpty(record.data.Conditions);
	            }
	            else {
	                _this._loadListData(record.data.ID);
	                var pNode = treeGrid.store.getById(record.data.PID);
	                $G.Page._staticExtension = Ext.isEmpty(pNode.data.Conditions);
	            }
	        }
	        else {
	            $G.Page._propertyListSource.removeAll();
	        }
	    },
	//[End]

	//[Start]
	    entityListView_RowClick: function (item, rowIndex, e) {
	        ///<summary>RowClick</summary>
	        var record = _this._getSelectRecord("entityListView", false);
	        if (record) {
	            if (record.data.StaticProjectId)
	                _this._loadListData(null, record.data.StaticProjectId);
	            else {
	                _this._loadListData(null, null, {
	                    Name: record.data.EntityFullName,
	                    Alias: record.data.EntityAlias,
	                    Record: record
	                });
	            }
	        }
	    },
	//[End]

	//[Start]
	    cbEntityList_Select: function (item, record, index) {
	        ///<summary>:Select</summary>
	        if ($G.Page._currentEntity.name == record.data.value)
	            return;
	        _this._loadProjectList(record.data.value, record.data.text);
	    },
	//[End]

	//[Start]
	    _checkProjectData: function () {
	        var record = $G.Page._projectEditSource.getDataRecord();
	        if (Ext.isEmpty(record.data.ExtensionName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请填写方案名称");
	            return true;
	        }
	        if (Ext.isEmpty(record.data.EntityName)) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请选择业务实体");
	            return true;
	        }
	        var conditionGrid = $G.getCmp("conditionsView");
	        conditionGrid.stopEditing();
	        if (!conditionGrid.hidden) {
	            var constr = "";
	            var conditions = record.data.DynamicExtensionConditions;
	            for (var i = 0; i < conditions.length; i++) {
	                if (Ext.isEmpty(conditions[i].PropertyAlias) || Ext.isEmpty(conditions[i].OperatorType) || Ext.isEmpty(conditions[i].PropertyValue)) {
	                    Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前方案需要添加生效条件,请添加正确格式的生效条件");
	                    return true;
	                }
	                constr += (i != 0 ? "&" : "") + conditions[i].PropertyAlias + " " +
                    _this._getOperatorTypeAlias(conditions[i].OperatorType) + " " + conditions[i].PropertyValue;
	            }
	            if (Ext.isEmpty(constr)) {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前方案需要添加生效条件,请添加正确格式的生效条件");
	                return true;
	            }
	            record.set("Conditions", constr);
	        }
	        return false;
	    },
	//[End]

	//[Start]
	    actSaveProject_Handler: function (sender) {
	        ///<summary>保存:actSaveProject</summary>
	        if (_this._checkProjectData())
	            return;
	        var dataSource = $G.Page._projectEditSource;
	        var changeSummary = dataSource.getChangeSummary();
	        if (changeSummary) {
	            $G.dispatcher({
	                controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	                action: "SaveProject",
	                args: changeSummary,
	                success: function () {
	                    //todo成功提示
	                    _this._loadProjectList($G.Page._currentEntity.name);
	                    //	                    _this._loadListData();
	                    _this._showProjectWindow(false);
	                }
	            });
	        }
	        else
	            _this._showProjectWindow(false);
	    },
	//[End]

	//[Start]
	    actCancelProject_Handler: function (sender) {
	        ///<summary>取消:actCancelProject</summary>
	        _this._showProjectWindow(false);
	    },
	//[End]

	//[Start]
	    actAddCondition_Handler: function (sender) {
	        ///<summary>添加:actAddCondition</summary>
	        var dataSource = $G.DataContext.getDataSource('DynamicExtensionDefinition.DynamicExtensionConditions');
	        dataSource.addRecord();
	    },
	//[End]

	//[Start]
	    actRemoveCondition_Handler: function (sender) {
	        ///<summary>移除:actRemoveCondition</summary>
	        _this._removeGridRecord("conditionsView");
	    },
	//[End]

	//[Start]
	    _removeGridRecord: function (gridId) {
	        var grid = $G.getCmp(gridId);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length > 0) {
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, String.format(GTP.AppFrame.WebResource.OptSelectedRecord, GTP.AppFrame.WebResource.Delete), function (e) {
	                if (e == "yes") {
	                    for (var i = 0; i < records.length; i++) {
	                        grid.getStore().remove(records[i]);
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
	    actAddExtension_Handler: function (sender) {
	        ///<summary>新增:actAddExtension</summary>
	        _this._loadEditProject(null, false);
	    },
	//[End]

	//[Start]
	    actAddStaticExtension_Handler: function (sender) {
	        ///<summary>新增静态方案:actAddStaticExtension</summary>
	        _this._loadEditProject(null, true);
	    },
	//[End]

	//[Start]
	    actEditProjectGroup_Handler: function (sender) {
	        ///<summary>编辑:actEditProjectGroup</summary>
	        var record = _this._getSelectRecord("treeGrid", true);
	        if (record) {
	            if (record.data.Level == 1) {
	                _this._loadEditProject(-record.data.ID, Ext.isEmpty(record.data.Conditions));
	            }
	            else {
	                _this._loadGroupEditData(record.data.ID);
	            }
	        }
	    },
	//[End]

	//[Start]
	    _resetEntityInfo: function (entityFullName) {
	        //方案分组变更,重置实体信息
	        if (!entityFullName)
	            entityFullName = $G.Page._currentEntity.name;
	        var dataSource = $G.Page._entityListSource;
	        dataSource.getDataStore().getRange().forEach(function (record) {
	            if (record.data.EntityFullName == entityFullName) {
	                record.set("DefaultGroupId", null);
	                record.set("StaticProjectId", null);
	            }
	        });
	        //	        dataSource.commitChanges();
	    },
	//[End]

	//[Start]
	    actDeleteProjectGroup_Handler: function (sender) {
	        ///<summary>删除:actDeleteProjectGroup</summary>
	        var record = _this._getSelectRecord("treeGrid", true);
	        if (record) {
	            if (record.data.Level == 1) {
	                Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "删除方案会清除相关记录,确认要删除么", function (e) {
	                    if (e == "yes") {
	                        $G.dispatcher({
	                            controller: "GTP.AppFrameV2.DynaBizComp.DynaProjectManagePage",
	                            action: "DeleteExtension",
	                            args: [-record.data.ID],
	                            success: function () {
	                                _this._loadProjectList($G.Page._currentEntity.name);
	                                _this._resetEntityInfo();
	                                Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "删除成功");
	                            }
	                        });
	                    }
	                });
	            }
	            else {
	                Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "删除分组将删除对应扩展属性,确定要删除么", function (e) {
	                    if (e == "yes") {
	                        var projectId = -record.data.PID;
	                        var id = record.data.ID;
	                        $G.dispatcher({
	                            action: "DeleteGroup",
	                            args: [id, projectId],
	                            success: function () {
	                                var index = treeGrid.store.data.findIndexBy(function (item, key) {
	                                    if (item.get("ID") == record.data.PID) return true;
	                                })
	                                treeGrid.selModel.selectRow(index);
	                                _this._loadListData(null, projectId);
	                                if ($G.Page._groupDataList && $G.Page._groupDataList[projectId]) {
	                                    $G.Page._groupDataList[projectId].data.forEach(function (group) {
	                                        if (group.ID == id)
	                                            delete group;
	                                        //	                                            $G.Page._groupDataList[projectId].data.delete();
	                                    });
	                                    $G.Page._groupDataList.modified = true;
	                                }
	                                _this._resetEntityInfo();
	                                Gtp.net.MessageBox.success(GTP.AppFrame.WebResource.Hint, "删除成功");
	                            }
	                        });
	                    }
	                });
	            }
	        }
	    },
	//[End]

	//[Start]
	    gridView3_col_PropertyAlias_editor_TriggerClick: function (index) {
	        ///<summary>TriggerClick</summary>
	        if (index == 2) {
	            var record = $G.Page._projectEditSource.getDataRecord();
	            if (Ext.isEmpty(record.data.EntityName)) {
	                Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "请先选择业务实体");
	                return;
	            }
	            var conRecord = $G.DataContext.getDataSource("DynamicExtensionDefinition.DynamicExtensionConditions").getDataRecord();
	            var config = {
	                url: $G.getPageURLByFullName("GTP.AppFrame.PropertyTreeLookupPage"),
	                title: "请选择属性",
	                target: "_extwin",
	                features: {
	                    dialogWidth: 420,
	                    dialogHeight: 360
	                },

	                parameters: {
	                    entityName: record.data.EntityName,
	                    BizCompName: record.data.BizCompName,
	                    //	                    hasLeaf: hasLeaf,
	                    //	                    limitLevel: limitLevel,
	                    selectMode: 4
	                },
	                callback: function (ret) {
	                    if (ret.state) {
	                        var data = ret.returnValue;
	                        if (conRecord.data.PropertyName != data.propertyFullName) {
	                            conRecord.set("PropertyName", data.propertyFullName);
	                            conRecord.set("PropertyAlias", data.propertyName);
	                            $G.getCmp("gridView3_col_PropertyAlias_editor").setValue(data.propertyName);
	                            conRecord.set("DataType", data.propertyOType);
	                            conRecord.set("PropertyValue", null);
	                            conRecord.set("OperatorType", null);
	                        }
	                    }
	                }
	            };
	            $G.open(config);
	        }
	        else {
	            var record = $G.Page._projectEditSource.getDataRecord();
	            record.set("PropertyName", null);
	            record.set("PropertyAlias", null);
	        }
	    },
	//[End]

	//[Start]
	    _getOperatorTypeAlias: function (OperatorType) {
	        switch (OperatorType) {
	            case "Equal":
	                return "等于";
	            case "NotEqual":
	                return "不等于";
	            case "GreatThan":
	                return "大于";
	            case "GreatEqual":
	                return "大于等于";
	            case "LessThan":
	                return "小于";
	            case "LessEqual":
	                return "小于等于";
	            case "Like":
	                return "包含有";
	            default:
	                return null;
	        }
	    },
	//[End]

	//[Start]
	    col_OperatorType_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        return _this._getOperatorTypeAlias(record.data.OperatorType);
	    },
	//[End]

	//[Start]
	    actSetReferenceInfo_Handler: function (sender) {
	        ///<summary>设置参照:actSetReferencInfo</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            _this._showReferObjectWindow(true);
	            _this._loadRefObject(record.data.Id);
	        }
	    },
	//[End]

	//[Start]
	    _loadRefObject: function (id) {
	        var dataSource = $G.Page._refSource;
	        dataSource.removeAll();
	        $G.dispatcher({
	            action: "GetRefObject",
	            args: [id],
	            success: function (data) {
	                if (data) {
	                    var pageParams = Ext.util.JSON.decode(data.RefPageParams);
	                    data.PropertyMapping = pageParams.RefInputMappings;
	                    data.PageParam = pageParams.RefOutputMappings;
	                    dataSource.loadData(data);
	                }
	            }
	        });
	    },
	//[End]

	//[Start]
	    actRemoveReference_Handler: function (sender) {
	        ///<summary>取消参照:actRemoveReference</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record.data.RefPageName) {
	            Ext.MessageBox.confirm(GTP.AppFrame.WebResource.Hint, "取消参照将清除参照配置信息,确定要删除么", function (e) {
	                if (e == "yes") {
	                    $G.dispatcher({
	                        action: "RemoveRefObject",
	                        args: [record.data.Id],
	                        success: function () {
	                            record.set("RefPageName", null);
	                            record.commit();
	                        }
	                    });
	                }
	            });

	        }
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
	            changeSummary[0].RefPageParams = Ext.util.JSON.encode(RefPageParams);
	        }
	        changeSummary[0].ExtensionId = $G.Params.ExtensionId;

	        $G.dispatcher({
	            action: "SetRefObject",
	            args: changeSummary,
	            success: function () {
	                var dataListSource = $G.Page._propertyListSource;
	                var listRecord = dataListSource.getDataRecord();
	                listRecord.set("RefPageName", record.data.RefPageName);
	                //	                dataListSource.commitChanges();
	                listRecord.commit();
	                _this._showReferObjectWindow(false);
	            }
	        });
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
	    _checkRefPage: function () {
	        var record = $G.Page._refSource.getDataRecord();
	        if (!record.data.RefPageName) {
	            Gtp.net.MessageBox.info("提示", "请先选择参照页面");
	            return true;
	        }
	    },
	//[End]

	//[Start]
	    _showPropertySelectWindow: function (isShow) {
	        var w = $G.getCmp("windowView4");
	        if (isShow) {
	            w.show();
	        }
	        else {
	            w.hide();
	        }
	    },
	//[End]

	//[Start]
	    _loadInputParam: function () {
	        windowView4.dataState = "DynamicReferenceObject.PageParam";
	        var dataSource = $G.DataContext.getDataSource("PropertyList");
	        _this._showPropertySelectWindow(true);
	        dataSource.loadData($G.Page.ParamList);
	        PropertySelectView.getView().focusRow(0);
	    },
	//[End]

	//[Start]
	    _loadPropertySelectList: function () {
	        var dataSource = $G.DataContext.getDataSource("PropertyList");
	        $G.dispatcher({
	            action: "GetPropertyListByProjectId",
	            args: [$G.Params.ExtensionId],
	            success: function (data) {
	                _this._showPropertySelectWindow(true);
	                dataSource.loadData(data);
	                PropertySelectView.getView().focusRow(0);
	            }
	        });
	        windowView4.dataState = "DynamicReferenceObject.PropertyMapping";
	    },
	//[End]

	//[Start]
	    actSelectProperties_Handler: function (sender) {
	        ///<summary>确定:actSelectProperties</summary>
	        var records = PropertySelectView.getSelectionModel().getSelections();
	        var dataSource = $G.DataContext.getDataSource(windowView4.dataState);
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
	    _resetParamList: function (pageName) {
	        $G.dispatcher({
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
	    Efd_RefPageAlias_Change: function (sender, newValue, oldValue) {
	        ///<summary>TextChange</summary>
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
	    actEnable_Handler: function (sender) {
	        ///<summary>启用:actEnable</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            $G.dispatcher({
	                action: "SetEnable",
	                args: [record.data.Id],
	                success: function () {
	                    record.data.IsEnable = true;
	                    record.commit();
	                }
	            });
	        }
	    },
	//[End]

	//[Start]
	    actDisable_Handler: function (sender) {
	        ///<summary>停用:actDisable</summary>
	        var record = _this._getSelectRecord("gridView", true);
	        if (record) {
	            $G.dispatcher({
	                action: "SetDisable",
	                args: [record.data.Id],
	                success: function () {
	                    record.data.IsEnable = false;
	                    record.commit();
	                }
	            });
	        }
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
	        var dataSource = $G.Page._propertyEditSource;
	        var config = {
	            url: $G.getPageURLByFullName("GTP.AppFrameV2.DynaBizComp.DynaExpressionPage"),
	            title: "表达式编辑器",
	            target: "_extwin",
	            features: {
	                dialogWidth: 700,
	                dialogHeight: 380
	            },
	            parameters: {
	                EntityName: $G.Params.EntityFullName,
	                ModuleCode: $G.Params.bizCompName,
	                ExtensionId: $G.Params.ExtensionId,
	                ExpressionText: expressionText
	            },
	            callback: function (ret) {
	                if (ret.state) {
	                    comp.setValue(ret.OutExpressionText);
	                    dataSource.getDataRecord().set(comp.dataIndex, ret.OutExpressionText)
	                }
	            }
	        };
	        $G.open(config);
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
	    col_IsEnable_Renderer: function (val, metadata, record, rowIndex, colIndex, store) {
	        ///<summary>Grid列的渲染函数</summary>
	        var sImage;
	        var value;
	        if (record.data.IsEnable) {
	            sImage = "/Common/images/toolbar/GTP_enabled.png";
	            return String.format("<img style='margin-right:2px;vertical-align:middle' src='{0}'>", sImage);
	        }
	    },
	//[End]

	//[Start]
	    actMoveUpProperty_Handler: function (sender) {
	        ///<summary>上移:actMoveUpProperty</summary>

	    },
	//[End]

	//[Start]
	    actMoveDownProperty_Handler: function (sender) {
	        ///<summary>下移:actMoveDownProperty</summary>

	    }
	//[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage = _class;
})();
//</Bottom>