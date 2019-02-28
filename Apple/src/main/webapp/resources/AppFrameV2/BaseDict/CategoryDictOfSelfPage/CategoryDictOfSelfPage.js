//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.CategoryDictListPage,
	{
	    //</Top>


	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);

	        var ds = $G.DataContext.getDataSource("DictQuery");
	        //数据加载后触发
	        ds.on("beforeloaddata", function (data) {
	            _this._setUpdateState(false);
	        });
	        ds.on("aftersave", function (ds, result) {

	            $G.getCmp("btnSave").setDisabled(true);

	            _this.actQueryDict(null, true);
	        });
	        ds.on("beforedelete", function (ds, result) {
	            _this._setUpdateState(true);
	        });
	        ds.on("beforeadd", function (ds, result) {
	            _this._setUpdateState(true);
	        });

	        ds.on("beforeupdate", function (sender, store, record, operation) {
	            if (operation == Ext.data.Record.EDIT) {
	                _this._setUpdateState(true);
	            }
	        });

	        ds.on("update", function (sender, store, record, operation) {
	            if (operation == Ext.data.Record.EDIT) {
	                var oldValue = record.lastValue[record.lastModifiedFieldName];
	                if (Ext.isEmpty(oldValue)) oldValue = "";
	                var newValue = record.data[record.lastModifiedFieldName];
	                if (Ext.isEmpty(newValue)) newValue = "";
	                if (oldValue == newValue) {
	                    _this._setUpdateState(false);
	                }
	            }
	        });
	        ds.on("add", function (sender, store, record, index) {
	            if (store.data.length > 0) {
	                $G.States.setCurrentState("STATE_SELECT");
	            }
	        });
	        ds.on("afteradd", function (result) {
	            var treeView = $G.getCmp("treeView");
	            var records = treeView.getSelectionModel().getSelections();
	            if (records.length == 0) {
	                return;
	            }
	            result.set("C_ID", records[0].data[treeView.keyField]);
	        });


	        var treeView = $G.getCmp("treeView");
	        treeView.getSelectionModel().on("beforerowselect", function (item, index, keepExisting, node) {

	            var selectRow = function (config) {

	                var item = config[0], index = config[1], keepExisting = config[2], node = config[3];

	                var selectModel = $G.getCmp("treeView").getSelectionModel();
	                var r = selectModel.grid.store.getAt(index);
	                if (r) {
	                    if (!keepExisting || selectModel.singleSelect) {
	                        selectModel.clearSelections();
	                    }
	                    selectModel.selections.add(r);
	                    selectModel.last = selectModel.lastActive = index;

	                    selectModel.grid.getView().onRowSelect(index);

	                    if (!selectModel.silent) {
	                        selectModel.fireEvent('rowselect', selectModel, index, r);
	                        selectModel.fireEvent('selectionchange', selectModel);
	                    }
	                }

	            };
	            _this._saveRightDictChange(selectRow, [item, index, keepExisting, node]);

	            return false;
	        });

	        var paging = $G.getCmp("dictView_pagingbar");

	        var doLoad = paging.doLoad;
	        paging.doLoad = function (start) {
	            _this._saveRightDictChange(doLoad, start, paging);
	        };

	    },
	    //[End]

	    //[Start]
	    actSave_Handler: function (sender) {
	        ///<summary>保存:actSave</summary>
	        var ds = $G.DataContext.getDataSource("DictQuery");

	        var grid = $G.getCmp("dictView");
	        if (grid.validate() == false) {
	            //Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.NoValid);
	            return false;
	        }
	        else {
	            var deleteKeys = new Array();
	            var changeSummary = ds.getChangeSummary();
	            if (!!changeSummary) {
	                for (var i = 0; i < changeSummary.length; i++) {
	                    if (changeSummary[i].__state == "deleted" && changeSummary[i][ds.primaryKey[0]] > 0)
	                        deleteKeys.push(changeSummary[i][ds.primaryKey[0]]);
	                }
	                var config = { action: "SaveChangesQuery", args: [changeSummary, deleteKeys] };
	                ds.AP_saveChangeList(ds.type, config);
	            }
	            else {
	                _this.actQueryDict({}, true);
	            }
	        }
	    },
	    //[End]



	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AbortSave), function (e) {
	            if (e == "yes") {
	                _this.actQueryDict({}, true);
	            }
	        });
	    },
	    //[End]

	    //[Start]
	    actAdd_Handler: function (sender) {
	        ///<summary>添加:actAdd</summary>
	        _this._setUpdateState(true);
	        var ds = $G.DataContext.getDataSource("DictQuery");
	        ds.addRecord();
	    },
	    //[End]

	    //[Start]
	    actRemove_Handler: function (sender) {
	        ///<summary>删除:actRemove</summary>
	        var records = $G.getCmp("dictView").AP_selectRows();
	        if (records.length == 0) {
	            Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
	        }
	        else {
	            var ds = $G.DataContext.getDataSource("DictQuery");

	            if (records.length > 0) {
	                _this._setUpdateState(true);

	                for (var i = 0; i < records.length; i++) {
	                    ds.removeRecord(records[i]);
	                }
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    _setUpdateState: function (state) {
	        ///<summary>设置状态</summary>
	        if (state) {
	            _this._dataChanged = true;
	            var rule1 = Ext.getCmp("viewRule_NoUpdate");
	            rule1.disable();
	            var rule2 = Ext.getCmp("viewRule_Update");
	            rule2.enable();
	        }
	        else {
	            _this._dataChanged = false;
	            var rule1 = Ext.getCmp("viewRule_NoUpdate");
	            rule1.enable();
	            var rule2 = Ext.getCmp("viewRule_Update");
	            rule2.disable();
	        }
	    },
	    //[End]

	    //[Start]
	    _saveRightDictChange: function (callback, args, paging) {
	        ///<summary>左侧数据有更新，返回true表示没有更改内容；返回false表示异步处理，返回值时还没有保存数据，根据弹出框的返回值处理</summary>
	        var docallback = function () {
	            if (paging) callback.call(paging, args);
	            else {
	                callback(args);
	            }
	        }

	        var actSave = $G.getCmp("btnSave");
	        if (actSave.disabled == false) {
	            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.DataChanged, function (e) {//数据有更新,是否继续?
	                if (e == "yes") {
	                    var state = _this.actSave_Handler();
	                    if (state == false) {
	                        return;
	                    }
	                } else {
	                    $G.getCmp("btnSave").setDisabled(true);
	                }
	                docallback();
	            });
	        }
	        else {
	            docallback();
	        }

	    },
	    //[End]

	    //[Start]
	    actQueryTree: function (sender) {
	        ///<summary>查询:actQueryLeftTree</summary>
	        _this._saveRightDictChange(_super.actQueryTree, sender);
	    },
	    //[End]

	    //[Start]
	    actQueryDict: function (config, forceFresh) {

	        var loadData = function (config) {
	            _super.actQueryDict(config);
	        };
	        if (forceFresh) {
	            loadData(config);
	        }
	        else {
	            _this._saveRightDictChange(loadData, config);
	        }
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.CategoryDictOfSelfPage = _class;
})();
//</Bottom>