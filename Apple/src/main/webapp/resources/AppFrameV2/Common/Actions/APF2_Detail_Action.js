////////////////////////////////////////////////////////////////  
/* 
[功能名称]：单据流程的相关操作
[功能说明]：查看审批历史，发送.
**/
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;

    Ext.apply(_p.prototype, {

        actAddRecord_Handler: function (sender) {
            ///<summary>添加一条记录</summary>
            var cmp;
            if (sender.grid && sender.grid.dataSource) cmp = sender.grid;
            else cmp = $G.getViewObject(sender);

            _this._detailGrid_SelectFirstRow(cmp);

            var ds = $G.DataContext.getDataSource(cmp.dataSource);
            var rec = ds.addRecord();
            cmp.getSelectionModel().selectRow(ds.currentStore.indexOf(rec), false);
            var d = cmp.getView().scroller.dom;
            d.scrollTop = d.scrollHeight;
        },

        actRemoveRecord_Handler: function (sender) {
            ///<summary>删除当前记录---注意：只是从数据集中移除当前记录</summary>
            var cmp;
            if (sender.grid && sender.grid.dataSource) cmp = sender.grid;
            else cmp = $G.getViewObject(sender);

            _this._detailGrid_SelectFirstRow(cmp);

            // var ds = $G.DataContext.getDataSource(cmp.dataSource);
            var records = cmp.getSelectionModel().getSelections();
            if (records && records.length > 0) {
                Ext.MessageBox.confirm(GTP.AppFrameV2.Res.Hint, String.format(GTP.AppFrameV2.Res.OptSelectedRecord, GTP.AppFrameV2.Res.AppFrame_Delete), function (e) {
                    if (e == "yes") {
                        //2013-12-16 删除时，页面呈现规则不起作用，钢子提供方法
                        //                        for (var i = 0; i < records.length; i++) {
                        //                            cmp.getStore().remove(records[i]);
                        //                        }
                        cmp.apf_ds.removeRecord(records);
                    }
                });
            }
            else {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, "当前没有选中记录");
            }
        },

        actCopyRecord_Handler: function (sender) {
            ///<summary>复制当前记录</summary>
            var cmp;
            if (sender.grid && sender.grid.dataSource) cmp = sender.grid;
            else cmp = $G.getViewObject(sender);

            _this._detailGrid_SelectFirstRow(cmp);

            var ds = $G.DataContext.getDataSource(cmp.dataSource);
            if (ds) {
                var record = ds.getDataRecord();
                if (record != null) {
                    ds.addRecord();
                    Gtp.util.DataSource.setFieldValue(ds, record.data);
                }
                else {
                    Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.PleaseSelectRecord);
                }
            } else {
                Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, GTP.AppFrameV2.Res.SelectDataSource);
            }

        },

        _detailGrid_SelectFirstRow: function (grid) {
            ///<summary>复制当前记录</summary>
            if (grid && !grid._setDetailSelectRowEvent) {

                grid._setDetailSelectRowEvent = true;

                var ds = $G.DataContext.getDataSource(grid.dataSource);
                ds.on("add", function () {
                    if (ds.getCount() == 1) {
                        grid.getSelectionModel().selectFirstRow(); //默认选中第一条记录
                        grid.fireEvent("rowclick", grid, 0);
                    }
                });
                ds.on("remove", function () {
                    //UI 处理的逻辑是，removeRecord之后会定位到最后一条
					  Ext.defer(function () {
					     grid.fireEvent("rowclick", grid, ds.currentIndex);
					  }, 500)
                    
                });
            }
        }


    });
})();