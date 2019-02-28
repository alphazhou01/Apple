////////////////////////////////////////////////////////////////  
// 功能名称：数据集的相关操作
// 功能说明：过滤，加载，保存，提交等
//[注意]：使用当前Action库时，必须在页面中添加JavaScript引用 ~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {

        __getWindowViewOwner: function (entityView) {
            var owner = entityView.ownerCt;
            while (!!owner) {
                if (!!owner.getXType && owner.getXType() == "window") {
                    break;
                }
                owner = !!owner.ownerCt ? owner.ownerCt : undefined;
            }
            return owner;
        },

        __Ap_TreeGrid_getTree: function (sender) {

            if (sender) {
                var tree = sender;
                if (tree.getXType() != "gtptreegridpanel") tree = $G.getViewObject(sender);

                if (tree && tree.getXType() == "gtptreegridpanel") return tree;
                else {
                    //if (initialConfig && initialConfig.treeId) tree = $G.getCmp(initialConfig.treeId);
                    if (sender.treeId) tree = $G.getCmp(sender.treeId);
                    if (tree) return tree;
                }
            }
            return undefined;
        },
        //[Start]
        __Ap_TreeGrid_showEditorWindow: function (addMode, windowViewName, tree, row) {
            var w = $G.getCmp(windowViewName);
            if (!w) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "windowViewName"));
                return false;
            }

            if (addMode != "close") {
                var id = 0;
                var pid = 0;
                if (addMode == "add" || addMode == "addchild" || addMode == "addroot") {
                    if (row) {
                        if (addMode == "addroot") pid = 0;
                        else if (addMode == "add") pid = row.data.PID;
                        else pid = row.id;
                    }
                } else {
                    if (row) id = row.id;
                    else {
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectNode); //没有选择节点
                        return;
                    }
                }

                if (!w.apf_ds) {
                    //如果有entityViewName，则以entityView为优先进行判断..
                    if (tree.entityViewName) {
                        var entityView = $G.getCmp(tree.entityViewName);
                        if (entityView.getXType() == "gtpformpanel") {
                            w.apf_ds = $G.DataContext.getDataSource(entityView.dataSource);
                            entityView._grid = tree;
                            w.apf_entityview = entityView;
                        }
                    } else {
                        if (w.items && w.items.items) {
                            for (var i = 0; i < w.items.items.length; i++) {
                                var entityView = w.items.items[i];
                                if (entityView.getXType() == "gtpformpanel") {
                                    w.apf_ds = $G.DataContext.getDataSource(entityView.dataSource);
                                    w.apf_entityview = entityView;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!w.apf_ds) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "DataSource"));
                    return;
                }

                //windowView显示
                w.show();

                if (addMode == "addroot" || addMode == "add" || addMode == "addchild") {
                    if (!w.apf_ds.fireEvent("beforeadd", w.apf_ds)) return; //判断是否可添加..
                    w.setTitle(GTP.AppFrameV2.Res.AppFrame_New);
                    w.apf_entityview.AP_setAllControlReadOnly(false);

                } else if (addMode == "edit") {
                    w.setTitle(GTP.AppFrameV2.Res.Edit);
                    w.apf_entityview.AP_setAllControlReadOnly(false);
                }
                else {
                    w.setTitle(GTP.AppFrameV2.Res.View);
                    w.apf_entityview.AP_setAllControlReadOnly(true);
                }

                w.apf_ds.apf_tree = tree;
                w.apf_ds.apf_treeRow = row;

                if (w.apf_ds.getDataStore().rawData.length > 0) {
                    w.apf_ds.removeAll();
                    w.apf_ds.commitChanges(true);
                }
                if (id > 0) {
                    w.apf_ds.AP_loadDataById(id);
                }
                else {
                    w.apf_ds.apf_nodepid = pid; // 便于连续新增
                    w.apf_ds.addRecord();
                    w.apf_ds.setFieldValue("PID", w.apf_ds.apf_nodepid);

                }
                //修改按钮名称，如果是查看时，【保存】按钮文本应该是【编辑】
                Ext.ComponentMgr.all.each(function (cmp) {
                    var xtype = cmp.getXType();
                    if (xtype == "button") {
                        if (cmp.action == "Ap_TreeGrid_actSaveAndAdd") cmp.setVisible(addMode == "addroot" || addMode == "add" || addMode == "addchild");
                        else if (cmp.action == "Ap_TreeGrid_actSaveAndClose") {
                            if (!cmp.first) {
                                cmp._defaultActionText = cmp.getText();
                                cmp.first = true;
                            }

                            if (addMode == "view") cmp.setText("编辑");
                            else if (addMode == "onlyview") cmp.setVisible(false);
                            else cmp.setText(cmp._defaultActionText);
                        }
                    }
                });

                if (w.apf_ds.apf_addMode != addMode) {
                    w.apf_ds.apf_addMode = addMode;
                    if (w.AP_changeMode && Ext.isFunction(w.AP_changeMode)) w.AP_changeMode(addMode);
                }

            } else w.hide();

            return true;
        },
        __Ap_TreeGrid_AddEditNode: function (sender, addMode) {
            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                var windowViewName = tree.windowViewName;
                if (!windowViewName) windowViewName = sender.windowViewName;
                if (windowViewName) _this.__Ap_TreeGrid_showEditorWindow(addMode, windowViewName, tree, tree.getSelectionRow());
            }
        },
        //[End]
        __Ap_TreeGrid_DoSave: function (entityView, isContinueAdd) {
            var ds = $G.DataContext.getDataSource(entityView.dataSource);
            //编码不允许为空,不允许带点
            var code = ds.getFieldValue("Code");
            //20131212 去掉编码不允许为空的判断
            //            if (Ext.isEmpty(code)) {
            //                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.AppFrame_NoAllowCodeBlank);
            //                return false;
            //            }

            if (code && code.indexOf('.') != -1) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoAllowPoint);
                return false;
            }
            entityView.stopEditing();
            if (entityView.AP_isValid()) {

                var tree = ds.apf_tree;
                var changesumary = ds.getChangeSummary();
                if (changesumary) {
                    var config = {};
                    if (changesumary[0].__state == "created") //新增..
                        config.action = "InsertNodeByFilter";
                    else
                        config.action = "SaveNodeByFilter";

                    var filter = tree.AP_getTreeFilter();

                    config.async = true;
                    config.controller = Gtp.net.Global.getPageController();
                    config.args = [changesumary[0], filter];
                    config.success = function (returnId) {
                        //先增加一个节点
                        Gtp.net.Global.dispatcher({
                            controller: Gtp.net.Global.getPageController(),
                            async: true,
                            action: "GetEntitiesByPid",
                            args: [tree.apf_ds.type, "ID", returnId],
                            success: function (returnNode) {
                                if (returnNode.length > 0) {
                                    var ds = $G.DataContext.getDataSource(entityView.dataSource);
                                    var selNode = ds.apf_treeRow; //只能用原来的row
                                    if (!selNode) tree.AP_loadData(); //没有选中节点就重新加载数据
                                    else {
                                        if (ds.apf_addMode == "edit") { //编辑状态
                                            var returnData = returnNode[0];
                                            Ext.apply(selNode.data, returnData);
                                            tree.getView().refreshRow(selNode);

                                            tree.AP_getChildList(returnData[tree.keyField], true, function (children) {
                                                for (var i = 0; i < children.Entities.length; i++) {
                                                    var child = tree.store.getById(children.Entities[i][tree.keyField]);
                                                    if (child) {
                                                        Ext.apply(child.data, children.Entities[i]);
                                                        tree.getView().refreshRow(child);
                                                    }
                                                }
                                            });
                                        }
                                        else {                   //新增状态..
                                            if (selNode.data.PID == returnNode[0].PID) {
                                                tree.appendRowSibling(selNode, returnNode[0]); //同级新增
                                            }
                                            else { //下级新增
                                                var store = tree.getStore();
                                                if (!store.isExpandedNode(selNode)) {
                                                    if (!store.isLoadedNode(selNode)) {
                                                        tree.fireEvent("beforeexpand", tree, selNode);
                                                    }
                                                    store.expandNode(selNode);
                                                }
                                                //定位新增节点
                                                var index = store.indexOfId(returnNode[0].ID)
                                                if (index >= 0) {
                                                    tree.getSelectionModel().selectRow(index);
                                                }
                                                else {
                                                    tree.appendRowChild(selNode, returnNode[0]); //全部加载
                                                    var store = tree.getStore();
                                                    store.expandNode(selNode);
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            failure: function (arguments) {
                                return true;
                            }
                        });

                        var ds = $G.DataContext.getDataSource(entityView.dataSource);
                        ds.removeAll();
                        ds.commitChanges(true);

                        if (isContinueAdd) {
                            ds.addRecord();
                            ds.setFieldValue("PID", ds.apf_nodepid);  //其他数值通过afteradd事件添加
                        } else _this.Ap_TreeGrid_actClose_Handler(entityView);
                    }
                    config.failure = function (arguments) {
                        return true;
                    }
                    ds.AP_saveChanges(config);
                }
                else {
                    if (!isContinueAdd) _this.Ap_TreeGrid_actClose_Handler(entityView);
                }
            } else return false;
        },
        Ap_TreeGrid_actSaveAndAdd_Handler: function (sender) {
            //保存并继续
            var entityView = $G.getViewObject(sender);
            if (!!entityView && entityView.xtype == "gtpformpanel") {
                _this.__Ap_TreeGrid_DoSave(entityView, true);
            } else
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "Action"));
        },

        Ap_TreeGrid_actSaveAndClose_Handler: function (sender) {
            //保存并关闭
            var entityView = $G.getViewObject(sender);
            if (!!entityView && entityView.xtype == "gtpformpanel") {
                if (sender.getText() == "编辑") {
                    sender.setText(sender._defaultActionText);
                    var ds = $G.DataContext.getDataSource(entityView.dataSource);
                    ds.apf_addMode = "edit";
                    entityView.AP_setAllControlReadOnly(false);
                } else
                    _this.__Ap_TreeGrid_DoSave(entityView, false);
            } else
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "Action"));
        },

        Ap_TreeGrid_actClose_Handler: function (sender) {
            if (sender.xtype == "gtpformpanel") {
                entityView = sender;
            }
            else if (sender.xtype == "button") {
                entityView = $G.getViewObject(sender);
            }
            if (!!entityView) {
                var windowView = _this.__getWindowViewOwner(entityView);
                !!windowView ? windowView.hide() : Gtp.net.Global.close(true);
            }
        },

        //刷新
        Ap_TreeGrid_actRefresh_Handler: function (sender) {

            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                tree.AP_loadData();
            }
        },

        Ap_TreeGrid_actRootAppend_Handler: function (sender) {
            //同级新增
            _this.__Ap_TreeGrid_AddEditNode(sender, "addroot");
        },

        Ap_TreeGrid_actPeerAppend_Handler: function (sender) {
            //同级新增
            _this.__Ap_TreeGrid_AddEditNode(sender, "add");
        },

        Ap_TreeGrid_actChildAppend_Handler: function (sender) {
            //下级新增
            _this.__Ap_TreeGrid_AddEditNode(sender, "addchild");
        },

        Ap_TreeGrid_actNodeEdit_Handler: function (sender) {
            _this.__Ap_TreeGrid_AddEditNode(sender, "edit");
        },

        Ap_TreeGrid_actNodeView_Handler: function (sender) {
            _this.__Ap_TreeGrid_AddEditNode(sender, "view");
        },

        Ap_TreeGrid_actNodeOnlyView_Handler: function (sender) {
            _this.__Ap_TreeGrid_AddEditNode(sender, "onlyview");
        },
        ///删除:actNodeRemove
        Ap_TreeGrid_actNodeRemove_Handler: function (sender) {

            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                var rows = tree.AP_selectRows();
                if (rows) tree.AP_deleteRecords(rows);
                else Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.PleaseSelectNode, GTP.AppFrameV2.Res.Delete));
            }
        },

        //[Start]
        __Ap_TreeGrid_checkRow: function (tree, rows) {
            ///<summary>重新选中移动后的记录</summary>
            if (tree.selectMode == "checkbox") {
                var record = tree.getSelectionRow();

                var indexList = [];
                var store = tree.getStore()
                for (var i = rows.length - 1; i >= 0; i--) {
                    var recordId = rows[i].get(tree.keyField);
                    var index = store.indexOfId(recordId);
                    // if (index >= 0)
                    //     Ext.DomQuery.select('img', tree.view.getRow(index))[0].className = tree.view.row_checked_class;
                }
                tree.getSelectionModel().clearSelections();

                if (record) {
                    var recordId = record.get(tree.keyField);
                    var index = store.indexOfId(recordId);
                    tree.getSelectionModel().selectRow(index, false);
                }
            }
            if (tree.ape_BillDetailTree != "true" || tree.ape_moveInServer == "true") {
                tree.store.commitChanges(true);
            }
        },
        //[End]


        //[Start]
        __Ap_TreeGrid_doMove_Handler: function (sender, msg) {
            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                tree.stopEditing();
                var rows = tree.AP_selectRows();
                if (rows && rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        if (msg == GTP.AppFrameV2.Res.MoveUp)
                            tree.moveUp2(rows[i]);
                        else if (msg == GTP.AppFrameV2.Res.MoveDown)
                            tree.moveDown2(rows[i]);
                        else if (msg == GTP.AppFrameV2.Res.UpGrade)
                            tree.UpGrade2(rows[i]);
                        else if (msg == GTP.AppFrameV2.Res.DownGrade)
                            tree.DownGrade2(rows[i]);

                    }
                    _this.__Ap_TreeGrid_checkRow(tree, rows);
                }
                else Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.PleaseSelectNode, msg));
            }
        },

        //[End]

        Ap_TreeGrid_actMoveUp_Handler: function (sender) {
            ///<summary>上移</summary>
            _this.__Ap_TreeGrid_doMove_Handler(sender, GTP.AppFrameV2.Res.MoveUp);
        },
        Ap_TreeGrid_actMoveDown_Handler: function (sender) {
            ///<summary>下移</summary>
            _this.__Ap_TreeGrid_doMove_Handler(sender, GTP.AppFrameV2.Res.MoveDown);
        },
        Ap_TreeGrid_actUpGrade_Handler: function (sender) {
            ///<summary>升级</summary>
            _this.__Ap_TreeGrid_doMove_Handler(sender, GTP.AppFrameV2.Res.UpGrade);
        },
        Ap_TreeGrid_actDeGrade_Handler: function (sender) {
            ///<summary>降级</summary>
            _this.__Ap_TreeGrid_doMove_Handler(sender, GTP.AppFrameV2.Res.DownGrade);
        },

        Ap_TreeGrid_actExpandAll_Handler: function (sender) {
            ///<summary>展开</summary>
            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                var id = arguments[0].id;
                var level = -1;
                switch (id) {
                    case "MenuItem2":
                        level = 1;
                        break;
                    case "MenuItem3":
                        level = 2;
                        break;
                    case "MenuItem4":
                        level = 3;
                        break;
                    case "MenuItem5":
                        level = 4;
                        break;
                    case "MenuItem6":
                        level = 5;
                        break;
                    case "MenuItem7":
                        level = 6;
                        break;
                    default:
                        if (id.indexOf("2") == id.length - 1) {
                            level = 1;
                        }
                        else if (id.indexOf("3") == id.length - 1) {
                            level = 2;
                        }
                        else if (id.indexOf("4") == id.length - 1) {
                            level = 3;
                        }
                        else if (id.indexOf("5") == id.length - 1) {
                            level = 4;
                        }
                        else if (id.indexOf("6") == id.length - 1) {
                            level = 5;
                        }
                        else if (id.indexOf("7") == id.length - 1) {
                            level = 6;
                        }
                        break;
                }

                if (!tree.apf_maxlevel) tree.apf_maxlevel = 0;

                var expandFunc = function (tree, level) {
                    if (level == -1) {
                        if (tree.queryLevel == 0) tree.apf_maxlevel = 0;
                        else tree.apf_maxlevel = -1;

                        tree.queryLevel = 0; //此时就全部加载吧

                    } else if (tree.queryLevel > 0 && tree.queryLevel < level + 1) tree.queryLevel = level + 1;

                    if (tree.queryLevel > tree.apf_maxlevel) {
                        tree.apf_maxlevel = tree.queryLevel;
                        if (tree.AP_loadData && Ext.isFunction(tree.AP_loadData)) {
                            //解决选中后，懒加载，选中记录消失bug
                            if (Ext.isFunction(tree.getSelectionModel().getRowsChecked) && tree.selectMode== "checkbox") {
                                var selectedRow = tree.getSelectionModel().getRowsChecked();
                                tree.AP_loadData({ async: false });
                                tree.getSelectionModel().setRowsChecked(selectedRow);
                            }
                            else {
                                tree.AP_loadData({ async: false });
                            }

                        }
                    }

                    if (level == -1) {
                        tree.expandAll(true);
                    } else {
                        tree.collapseAll(true);

                        tree.expandLevel(level, true);
                    }
                }

                if (tree.notCheckDataUpdate != true) {
                    if (tree.queryLevel && tree.queryLevel != 0 && (level == -1 || tree.queryLevel < level + 1)) {
                        var gridChange = tree.getChangeSummary(); //得到修改记录
                        var ds = $G.DataContext.getDataSource(tree.dataSource);
                        var dataChange = ds.getChangeSummary();   //得到添加和删除记录
                        if (gridChange || dataChange) {
                            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "数据有更新，展开将放弃更新，是否展开？", function (e) {
                                if (e == "yes") {
                                    expandFunc(tree, level);
                                }
                            });
                            return;
                        }
                    }
                }

                expandFunc(tree, level);
            }
        },
        Ap_TreeGrid_actCollapseAll_Handler: function (sender) {
            ///<summary>合并全部</summary>
            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) tree.collapseAll(true);
        },

        //***以下为单据树形细表相关操作


        __Ap_BillDetail_DoAppend: function (sender, addMode) {
            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                var row = tree.getSelectionRow();
                if (!row && addMode == "addchild") {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "请选择一条记录");
                    return;
                }
                var ds = $G.DataContext.getDataSource(tree.dataSource);
                var GUID = Ext.AppFrame.Common.createGuid();
                var pGUID = "";
                var level = 1;
                if (row) {
                    if (addMode == "add") {
                        pGUID = row.data.PGUID,
                        level = row.data.Level;
                    }
                    else {
                        pGUID = row.data.GUID;
                        level = row.data.Level ? row.data.Level : 0;
                        level += 1;
                    }
                }
                var rec = ds.addRecord();
                rec.set("GUID", GUID);
                rec.set("PGUID", pGUID);
                rec.set("Level", level);
                rec.set("IsLeaf", true);



                var store = tree.currentStore;

                var parent = row;
                if (addMode == "add" && !Ext.isEmpty(row)) parent = store.getNodeParent(row);

                if (Ext.isEmpty(parent)) {
                    var ilen = store.data.length;
                    Gtp.util.DataSource.setFieldValue(ds, "OrderNo", ilen);
                    rec.id = rec.data.GUID;
                    store.insert(ilen, [rec]);
                    tree.getSelectionModel().selectRow(store.indexOf(rec), false);
                }
                else {
                    var children = store.getNodeChildren(parent);
                    Gtp.util.DataSource.setFieldValue(ds, "OrderNo", children.length);

                    ds.setCurrentIndex(ds.indexOf(parent.data.ID));
                    Gtp.util.DataSource.setFieldValue(ds, "IsLeaf", false);

                    tree.appendRowChild(parent, rec.data);
                    store.expandNode(parent);
                }
            }
        },

        Ap_BillDetail_actPeerAppend_Handler: function (sender) {
            //同级新增
            _this.__Ap_BillDetail_DoAppend(sender, "add");

        },

        Ap_BillDetail_actChildAppend_Handler: function (sender) {
            _this.__Ap_BillDetail_DoAppend(sender, "addchild");
        },

        Ap_BillDetail_actNodeRemove_Handler: function (sender) {
            var tree = _this.__Ap_TreeGrid_getTree(sender);
            if (tree) {
                var row = tree.getSelectionRow();
                if (row) {
                    Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
                        if (e == "yes") {
                            var store = row.store, ds = tree.apf_ds, index = -1, dataStore = ds.getDataStore();
                            var iChildCount = 0, parent = store.getNodeParent(row);
                            if (!Ext.isEmpty(store.leaf_field_name)) {
                                if (parent != null) iChildCount = store.getNodeChildrenCount(parent);
                            }

                            var removeNodeDescendants = function (rc) {
                                var i, len, children = store.getNodeChildren(rc);
                                for (i = 0, len = children.length; i < len; i++) {
                                    removeNodeDescendants(children[i]);
                                }
                                ds.removeRecord(dataStore.indexOfId(rc.data.ID));
                            };

                            removeNodeDescendants(row);
                            //                            var children = store.getNodeChildren(row);
                            //                            for (var i = 0; i < children.length; i++) {
                            //                                index = dataStore.indexOfId(children[i].data.ID);
                            //                                ds.removeRecord(index);
                            //                            }
                            //index = dataStore.indexOfId(row.data.ID);
                            //ds.removeRecord(index);
                            store.remove(row);
                            //更新父节点的IsLeaf属性
                            if (iChildCount == 1) {
                                ds.setCurrentIndex(ds.indexOf(parent.data.ID));
                                Gtp.util.DataSource.setFieldValue(ds, store.leaf_field_name, true);
                                parent.set(store.leaf_field_name, 1);
                            }
                            //定位到父节点
                            if (parent) {
                                tree.getSelectionModel().selectRow(store.indexOf(parent), false);
                            }

                        }
                    });
                } else {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.PleaseSelectNode, GTP.AppFrameV2.Res.Delete));
                }
            }
        }


    });
})();