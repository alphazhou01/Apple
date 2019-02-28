////////////////////////////////////////////////////////////////  
// 功能名称：上报下发的相关操作

////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {
        //</Top>
        APF2_Report_Issue_actReport_Handler: function (sender) {
            ///<summary>上报</summary>
            sender.shareType = 1;
            $G.Page.APF2_Report_Issue_actShare_Handler(sender);
        },

        APF2_Report_Issue_actIssue_Handler: function (sender) {
            ///<summary>下发</summary>
            sender.shareType = 2;
            $G.Page.APF2_Report_Issue_actShare_Handler(sender);
        },

        APF2_Report_Issue_DoShareByParams: function (dataSourceType, id, shareType, title, deptBizType, otherParams) {
            var url = $G.getPageURLByFullName("GTP.AppFrameV2.Org.DataSharePage");

            var params = Ext.apply(otherParams || {},
            {
                dataSourceType: dataSourceType,
                EntityID: id,
                ShareType: shareType,
                typeCode: deptBizType ? deptBizType : ""
            }
            );

            $G.open({
                url: url,
                title: title,
                target: "_modal",
                scope: _this,
                features: { dialogWidth: "796px", dialogHeight: "508px" },
                parameters: params,
                callback: function (data) {
                    if (data.state) {
                        var msg = title + "成功";
                        Gtp.net.MessageBox.info(GTP.AppFrameV2.Res.Hint, msg);
                    }
                }
            });
        },

        APF2_Report_Issue_DoShare: function (dataSourceType, id, shareType, title, deptBizType) {
            return $G.Page.APF2_Report_Issue_DoShareByParams(dataSourceType, id, shareType, title, deptBizType, {});
        },


        APF2_Report_Issue_actShare_Handler: function (sender) {
            ///<summary>共享</summary>
            var dataSource;
            var id = 0;

            var shareType = sender.shareType ? sender.shareType : 2;
            var title = sender.text ? sender.text : "共享";
            var params = sender.params || {};


            if (sender.findParentByType("gtpgridpanel") || sender.findParentByType("gtptreegridpanel")) {
                var dsName;
                var grid;
                if (sender.findParentByType("gtpgridpanel")) {
                    dsName = sender.findParentByType("gtpgridpanel").dataSource;
                    grid = sender.findParentByType("gtpgridpanel")
                }
                else {
                    dsName = sender.findParentByType("gtptreegridpanel").dataSource;
                    grid = sender.findParentByType("gtptreegridpanel")
                }

                dataSource = $G.DataContext.getDataSource(dsName);
                var selectedRows = grid.AP_selectRows();
                if (selectedRows.length > 0) id = selectedRows[0].id;
            } else if (sender.findParentByType("gtpformpanel")) {
                var dsName = sender.findParentByType("gtpformpanel").dataSource;
                dataSource = $G.DataContext.getDataSource(dsName);
                id = dataSource.getDataRecord().id;
            } else if (sender.findParentByType("gtptoolbar")) {
                var dsName = sender.findParentByType("gtptoolbar").dataSource;
                dataSource = $G.DataContext.getDataSource(dsName);
                id = dataSource.getDataRecord().id;
            }



            if (id != 0)
                $G.Page.APF2_Report_Issue_DoShareByParams(dataSource.entityType, id, shareType, title, sender.deptBizType ? sender.deptBizType : "", params);

        }
        //<Bottom>	
    });
})();