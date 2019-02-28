////////////////////////////////////////////////////////////////  
// 功能名称：数据集的相关操作
// 功能说明：过滤，加载，保存，提交等
//[注意]：使用当前Action库时，必须在页面中添加JavaScript引用 ~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;

    Ext.apply(_p.prototype, {
        actListPrintPreview_Handler: function (sender) {
            ///<summary>单条记录打印预览</summary>
            var preview = true;
            var reportType = "List";
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },

        actListPrint_Handler: function (sender) {
            ///<summary>单条记录打印</summary>
            var preview = false;
            var reportType = "List";
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },

        actListPrintImportExcel_Handler: function (sender) {
            ///<summary>打印表单</summary>
            var preview = 1; //1：导出excel，2：导出pdf，3：导出word
            var reportType = "List";
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },
        actListPrintImportPDF_Handler: function (sender) {
            ///<summary>打印表单</summary>
            var preview = 2; //1：导出excel，2：导出pdf，3：导出word
            var reportType = "List";
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },
        actListPrintImportWord_Handler: function (sender) {
            ///<summary>打印表单</summary>
            var preview = 3; //1：导出excel，2：导出pdf，3：导出word
            var reportType = "List";
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },

        actListPrintWindowView_Handler: function (sender) {
            ///<summary>单条记录打印预览</summary>
            var preview = true;
            var reportType = "List";
            sender.dialogWidth = 800;
            sender.dialogHeight = 500;
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.PrintWinowView);
        },

        actListPrintModelView_Handler: function (sender) {
            ///<summary>单条记录打印预览</summary>
            var preview = true;
            var reportType = "List";
            sender.dialogWidth = 800;
            sender.dialogHeight = 500;
            _this._listPrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.PrintModelView);
        },


        _listPrint_Handle: function (sender, preview, reportType, callback) {
            /*动态加载*/
            var loadjsFiles = [];
            loadjsFiles.push($G.getAppName() + "/GTP/Report/ReportMain.js");
            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);

            Ext.AppFrame.Util.LoadJS(jsFileList);

            var initcfg = sender;
            var tempQueryParam;
            var extendArr;
            var reportArgs;
            var extendqueryPlans;
            if ($G.Page.__sessionQueryBoxParam) {

                tempQueryParam = $G.Page.__sessionQueryBoxParam;
            }
            else {
                if (!initcfg.queryPlan && !!$G.QueryPlans) {
                    var tempQueryPlan = $G.QueryPlans.getQueryPlan(initcfg.queryPlan || 0);
                    if (tempQueryPlan) {
                        tempQueryParam = tempQueryPlan.getQueryParam();
                    }
                }

                if ($G.Page._queryBox) {
                    if (!tempQueryParam) {
                        tempQueryParam = $G.Page._queryBox.getQueryParam();
                    }
                    else {
                        var queryBoxParam = $G.Page._queryBox.getQueryParam();

                        //开始合并查询方案..
                        tempQueryParam = Ext.AppFrame.Util.mergeQueryPlanParam(tempQueryParam, queryBoxParam);

                    }
                }
            }


            if (!!initcfg.extendArr) {
                extendArr = eval(initcfg.extendArr);
            }
            if (!!initcfg.reportArgs) {
                reportArgs = eval(initcfg.reportArgs);
            }

            var inputFunc = eval("$G.Page." + initcfg.initParamFunc);
            if (inputFunc && Ext.isFunction(inputFunc)) {
                var paramList = inputFunc.call();
                if (!paramList) { return; }
                if (paramList) {
                    if (paramList.queryPlan)
                        tempQueryParam = paramList.queryPlan;
                    if (paramList.extendArr)
                        extendArr = paramList.extendArr;
                    if (paramList.reportArgs)
                        reportArgs = paramList.reportArgs;
                }
            }
            if (!extendArr || !Ext.isArray(extendArr)) {
                extendArr = new Array();
            }

            var extendqueryPlansFunc = eval("$G.Page." + initcfg.extendqueryPlansFunc);
            if (extendqueryPlansFunc && Ext.isFunction(extendqueryPlansFunc)) {
                extendqueryPlans = extendqueryPlansFunc.call();
            }

            if (callback) {
                var width = parseInt(initcfg.dialogWidth);
                if (isNaN(width)) {
                    width = 0;
                }
                var height = parseInt(initcfg.dialogHeight);
                if (isNaN(height)) {
                    height = 0;
                }
                callback(sender, null, tempQueryParam, preview, reportType, extendArr, reportArgs, extendqueryPlans, width, height);
            }
        }
    });
})();