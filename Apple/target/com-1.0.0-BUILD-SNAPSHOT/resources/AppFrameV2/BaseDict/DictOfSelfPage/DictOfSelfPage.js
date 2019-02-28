//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.DictListPage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary>初始化数据</summary>
	        _super._init.apply(this, arguments);
	        var grid = Ext.getCmp("dictView");
	        grid.on("afteredit", function (cell) {
	            var columns = this.getColumnModel().columns;
	            Ext.each(columns, function (column) {
	                if (column.dataIndex == cell.field) {
	                    if (column instanceof Ext.grid.CheckColumn && column.editable == true && column.xtype == "checkcolumn") {
	                        $G.Page.actSelectRow(this, cell.row);
	                    }
	                }
	            }, grid);
	        });

	        var ds = $G.DataContext.getDataSource("DictQuery");
	        //数据加载后触发
	        ds.on("beforeloaddata", function (data) {
	            _this._setUpdateState(false);
	        });
	        ds.on("aftersave", function (ds, result) {
	            var actSave = Gtp.net.Global.Actions.getAction("actSave");
	            actSave.setDisabled(true);
	            $G.Page.actQuery(_this._getLoadConfigAfterSave());
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

	        var paging = $G.getCmp("dictView_pagingbar");

	        var doLoad = paging.doLoad;
	        paging.doLoad = function (start) {
	            var actSave = Gtp.net.Global.Actions.getAction("actSave");
	            if (actSave.isDisabled() == false) {
	                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "数据有更新，是否继续执行该操作？", function (e) {
	                    if (e == "yes") {
	                        doLoad.call(paging, start);
	                    }
	                });
	            }
	            else {
	                doLoad.call(paging, start);
	            }
	        };

	    },
	    //[End]

	    //[Start]
	    actSelectRow: function (grid, index) {
	        ///<summary></summary>
	        var model = grid.getSelectionModel();
	        model.selectRow(index);
	        grid.fireEvent("rowclick", grid, index);
	    },
	    //[End]

	    //[Start]    
	    _getLoadConfigAfterSave: function () {
	        ///<summary>保存后加载数据的config</summary>
	        return {};
	    },
	    //[End]

	    //[Start]
	    actSave_Handler: function (sender) {
	        ///<summary>保存:actSave</summary>
	        var ds = $G.DataContext.getDataSource("DictQuery");
	        var grid = $G.getCmp("dictView")
	        grid.stopEditing();
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
	                _this.actQuery({});
	            }
	        }
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AbortSave), function (e) {
	            if (e == "yes") {
	                _this.actQuery({}, true);
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
	            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
	                if (e == "yes") {
	                    var ds = $G.DataContext.getDataSource("DictQuery");
	                    //先启用规则，再移除
	                    _this._setUpdateState(true);
	                    ds.removeRecord(records);
	                }
	            });
	        }
	    },
	    //[End]

	    //[Start]
	    _setUpdateState: function (state) {
	        ///<summary>设置状态</summary>
	        if (state) {
	            var rule1 = Ext.getCmp("viewRule_NoUpdate");
	            rule1.disable();
	            var rule2 = Ext.getCmp("viewRule_Update");
	            rule2.enable();
	        }
	        else {
	            var rule1 = Ext.getCmp("viewRule_NoUpdate");
	            rule1.enable();
	            var rule2 = Ext.getCmp("viewRule_Update");
	            rule2.disable();
	        }
	    },
	    //[End]

	    //[Start]
	    dictView_BeforeEdit: function (e) {
	        ///<summary>BeforeEdit</summary>
	        if (!_this._isAuthAction("actSave")) return false;
	        //与数据源事件类似ds.on("beforeupdate", function (sender, store, record, operation) {
	        //改成使用数据源事件方式
	        //_this._setUpdateState(true);
	    },
	    //[End]


	    //[Start]
	    actQuery: function (config, forceFresh) {
	        var actSave = Gtp.net.Global.Actions.getAction("actSave");
	        if (!forceFresh && actSave.isDisabled() == false) {
	            Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, "数据有更新，是否继续执行该操作？", function (e) {
	                if (e == "yes") {
	                    _super.actQuery(config);
	                }
	            });
	        }
	        else {
	            _super.actQuery(config);
	        }
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.DictOfSelfPage = _class;
})();
//</Bottom>