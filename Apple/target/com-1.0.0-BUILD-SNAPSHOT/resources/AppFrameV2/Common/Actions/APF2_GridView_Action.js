////////////////////////////////////////////////////////////////  
// 功能说明：处理GridView的加载，显示，分页等
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {

        // entityView toolbar action找到entityView
        __Ap_GridView_getEntityView: function (sender, initialConfig) {
            var entityView;
            var control = $G.getViewObject(sender);
            if (!!control && control.xtype == "gtpformpanel") {
                entityView = control;
            } else if (initialConfig && initialConfig.entityViewName) {
                control = $G.getCmp(initialConfig.entityViewName);
                entityView = control;
            }
            return entityView;
        },

        // 从gridView toolbar action找到gridView
        __Ap_GridView_getGridView: function (sender, initialConfig) {
            var gridView;
            var control = sender;
            if (control.xtype != "gtpgridpanel") control = $G.getViewObject(sender);

            if (!!control && control.xtype == "gtpgridpanel") {
                gridView = control;
            } else if (initialConfig && initialConfig.gridViewId) {
                control = $G.getCmp(initialConfig.gridViewId);
                gridView = control;
            }
            return gridView;
        },

        // girdView选择行验证
        __Ap_GridView_selectRowValidate: function (gridView, isCanBeMultiSelected) {
            var result = true;
            var selectRows = gridView.AP_selectRows();
            if (selectRows.length == 0) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord); //没有选择节点
                result = false;
            }
            if (selectRows.length > 1 && !isCanBeMultiSelected) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord); //只能选择单一节点
                result = false;
            }
            return result;
        },


        // windowView edit 
        __Ap_GridView_showWindowViewEditor: function (addMode, initialConfig, gridView) {

            var windowViewName = !!gridView.windowViewName ? gridView.windowViewName : this.initialConfig.windowViewName;

            var w = $G.getCmp(windowViewName);
            if (!w) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "windowViewName"));
                return false;
            }

            if (!w.apf_ds) {
                //如果有entityViewName，则以entityView为优先进行判断..
                if (gridView.entityViewName) {
                    var entityView = $G.getCmp(gridView.entityViewName);
                    if (entityView.getXType() == "gtpformpanel") {
                        w.apf_ds = $G.DataContext.getDataSource(entityView.dataSource);
                        entityView._grid = gridView;
                        w.apf_entityview = entityView;
                    }
                }
                else {
                    if (w.items && w.items.items) {
                        for (var i = 0; i < w.items.items.length; i++) {
                            var entityView = w.items.items[i];
                            if (entityView.getXType() == "gtpformpanel") {
                                w.apf_ds = $G.DataContext.getDataSource(entityView.dataSource);
                                entityView._grid = gridView;
                                w.apf_entityview = entityView;
                                break;
                            }
                        }
                    }
                }
            }

            if (!w.apf_ds) {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "DataSource"));
                return false;
            }

            if (w.apf_ds.getDataStore().rawData.length > 0) {
                w.apf_ds.removeAll();
                w.apf_ds.commitChanges(true);
            }

            if (!w.isVisible()) {
                w.show();
                //隐藏的控件不会自动触发规则，需要手动触发一下
                if (_this._activeAllRule && Ext.isFunction(_this._activeAllRule)) _this._activeAllRule(w.apf_ds);
            } else {
                w.hide();
            }

            if (addMode == "add") {
                if (!w.apf_ds.fireEvent("beforeadd", w.apf_ds)) return; //判断是否可添加..
                w.setTitle(GTP.AppFrameV2.Res.AppFrame_New);
                w.apf_entityview.AP_setAllControlReadOnly(false);
                w.apf_ds.addRecord();
            }
            else if (addMode == "edit") {
                if (!_this.__Ap_GridView_selectRowValidate(gridView, false)) {
                    return;
                }
                w.setTitle(GTP.AppFrameV2.Res.Edit);
                var selectedId = gridView.AP_selectRows()[0].id;
                w.apf_entityview.AP_setAllControlReadOnly(false);
                w.apf_ds.AP_loadDataById(selectedId);
            }
            else {
                if (!_this.__Ap_GridView_selectRowValidate(gridView, false)) {
                    return;
                }
                w.setTitle(GTP.AppFrameV2.Res.View);
                var selectedId = gridView.AP_selectRows()[0].id;
                w.apf_entityview.AP_setAllControlReadOnly(true);
                w.apf_ds.AP_loadDataById(selectedId);
            }
            //修改按钮名称，如果是查看时，【保存】按钮文本应该是【编辑】
            Ext.ComponentMgr.all.each(function (cmp) {
                var xtype = cmp.getXType();
                if (xtype == "button") {
                    if (cmp.action == "Ap_GridEditor_actSaveAndAdd") cmp.setVisible(addMode == "add");
                    else if (cmp.action == "Ap_GridEditor_actSaveAndClose") {
                        if (!cmp.first) {
                            cmp._defaultActionText = cmp.getText();
                            cmp.first = true;
                        }

                        if (addMode == "view") cmp.setText("编辑");
                        else if (addMode == "onlyview") cmp.setVisible(false);
                        else {
                            cmp.setVisible(true);
                            cmp.setText(cmp._defaultActionText);
                        }
                    }
                }
            });

            if (w.apf_ds.apf_addMode != addMode) {
                w.apf_ds.apf_addMode = addMode;
                if (w.AP_changeMode && Ext.isFunction(w.AP_changeMode)) w.AP_changeMode(addMode);
            }

            return true;
        },

        __Ap_GridView_showPageEditor: function (showMode, initialConfig, gridView) {
            var editPageFullPath = initialConfig.editPageFullPath;
            var editPageTarget = initialConfig.editPageTarget || "_extwin";
            var extwinDialogWidth = initialConfig.dialogWidth || "800px";
            var extwinHeight = initialConfig.dialogHeight || "800px"


            var mode = "STATE_" + showMode.toUpperCase();
            // 不是增加状态需验证
            if (mode != "STATE_ADD" && !_this.__Ap_GridView_selectRowValidate(gridView, false)) {
                return;
            }

            var backFun = function (ret) {
                if (ret) {
                    gridView.AP_loadData();
                }
            };

            var title;
            switch (showMode) {
                case "add":
                    title = "新建";
                    break;
                case "edit":
                    title = "编辑";
                    break;
                case "view":
                    title = "查看";
                    break;
            }

            var openConfig = {
                url: $G.getPageURLByFullName(editPageFullPath),
                title: title,
                target: editPageTarget,
                //todo:parameters需要扩展
                parameters: {
                    id: gridView.AP_selectRows()[0].id,
                    state: mode
                }
            };

            if (initialConfig.params) openConfig.parameters = Ext.apply(openConfig.parameters, initialConfig.params);

            if (editPageTarget == "_extwin" || editPageTarget == "_modal") {
                openConfig.features = {
                    dialogWidth: extwinDialogWidth,
                    dialogHeight: extwinHeight
                }
            }
            if (editPageTarget == "_extwin") {
                openConfig.callback = function (ret) {
                    backFun(ret);
                }
            }
            var ret = $G.open(openConfig);
            if (editPageTarget == "_extwin" || editPageTarget == "_modal") {
                backFun(ret);
            }
        },

        // edit 派发
        __Ap_GridView_showEditWindowDispather: function (sender, initialConfig, showMode) {
            var gridView = _this.__Ap_GridView_getGridView(sender, initialConfig);
            if (!gridView) return;
            var ret = ret = gridView.fireEvent("beforecu", gridView, showMode); //弹窗之前进行判断..
            if (ret) {
                var config = {};
                if (gridView.AP_getEditorConfig && Ext.isFunction(gridView.AP_getEditorConfig)) config = gridView.AP_getEditorConfig();
                if (!config.editPageFullPath && !gridView.windowViewName) {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.ConfigError, "windowViewName Or editPageFullPath"));
                    return false;
                }
                if (((showMode == "edit" || showMode == "view" || showMode == "onlyview") && gridView.AP_selectRows().length > 0) || showMode == "add") {
                    if (config.editPageFullPath)
                        _this.__Ap_GridView_showPageEditor(showMode, config, gridView);
                    else
                        _this.__Ap_GridView_showWindowViewEditor(showMode, initialConfig, gridView);
                }
                else {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord); //没有选择节点
                }
            }
        },


        Ap_GridView_actNew_Handler: function (sender) {
            ///<summary>GridView新建</summary>
            _this.__Ap_GridView_showEditWindowDispather(sender, this.initialConfig, "add");
        },

        Ap_GridView_actEdit_Handler: function (sender) {
            ///<summary>GridView更改</summary>
            _this.__Ap_GridView_showEditWindowDispather(sender, this.initialConfig, "edit");
        },

        Ap_GridView_actView_Handler: function (sender) {
            ///<summary>GridView查看</summary>
            _this.__Ap_GridView_showEditWindowDispather(sender, this.initialConfig, "view");
        },

        Ap_GridView_actOnlyView_Handler: function (sender) {
            ///<summary>GridView查看</summary>
            _this.__Ap_GridView_showEditWindowDispather(sender, this.initialConfig, "onlyview");
        },

        Ap_GridView_actDelete_Handler: function (sender) {
            ///<summary>GridView删除</summary>
            var gridView = _this.__Ap_GridView_getGridView(sender, this.initialConfig);
            if (!!gridView) {
                if (!_this.__Ap_GridView_selectRowValidate(gridView, true)) {
                    return;
                }
                gridView.AP_deleteRecords(gridView.AP_selectRows());
            }
        },


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


        __Ap_GridEditor_doSave: function (entityView, isContinueAdd) {
            if (entityView.AP_isValid()) { //先判断是否有效..
                var ds = entityView.dataLink.dataSource;
                var rec = ds.getDataRecord();
                var isNew = false;
                if (rec.id < 0) isNew = true;
                var windowView = _this.__getWindowViewOwner(entityView);
                var successFunction = function (result) {
                    if (!!windowView) {
                        if (isNew)
                            entityView._grid.AP_loadData();
                        else {
                            entityView._grid.apf_ds.AP_refreshNodeData(entityView._grid, function (result) { });
                        }
                    }
                    ds.removeRecord(0);
                    ds.commitChanges(true);
                    if (isContinueAdd) {
                        ds.addRecord();
                        $G.Page._haveChange = true;
                    } else {
                        !!windowView ? windowView.hide() : Gtp.net.Global.close(true);
                    }
                }
                entityView.dataLink.dataSource.AP_saveChanges({
                    success: [successFunction]
                });
                return true;
            }
            else return false;
        },

        Ap_GridEditor_actSaveAndAdd_Handler: function (sender) {
            ///<summary>windowView 保存并继续</summary>
            var entityView = _this.__Ap_GridView_getEntityView(sender, this.initialConfig);
            if (!!entityView) {
                entityView.stopEditing();
                _this.__Ap_GridEditor_doSave(entityView, true);
            }
        },

        Ap_GridEditor_actSaveAndClose_Handler: function (sender) {
            ///<summary>windowView 保存并关闭</summary>
            var entityView = _this.__Ap_GridView_getEntityView(sender, this.initialConfig);
            if (!!entityView) {
                entityView.stopEditing();
                if (sender.getText() == "编辑") {
                    sender.setText(sender._defaultActionText);
                    entityView.AP_setAllControlReadOnly(false);
                } else
                    _this.__Ap_GridEditor_doSave(entityView, false);
            }
        },

        Ap_GridEditor_actCancel_Handler: function (sender) {
            ///<summary>windowView 关闭取消</summary>
            var entityView = _this.__Ap_GridView_getEntityView(sender, this.initialConfig);
            if (!!entityView) {
                var windowView = _this.__getWindowViewOwner(entityView);
                !!windowView ? windowView.hide() : Gtp.net.Global.close($G.Page._haveChange);
            }
        }

    });
})();