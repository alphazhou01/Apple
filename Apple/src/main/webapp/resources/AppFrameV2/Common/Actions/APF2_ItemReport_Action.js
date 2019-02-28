////////////////////////////////////////////////////////////////  
// 功能名称：数据集的相关操作
// 功能说明：过滤，加载，保存，提交等
//[注意]：使用当前Action库时，必须在页面中添加JavaScript引用 ~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;

    Ext.apply(_p.prototype, {

        actSinglePrintPreview_Handler: function (sender) {
            ///<summary>单条记录打印预览</summary>
            var preview = true;
            var reportType = "Single";
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },

        actSinglePrint_Handler: function (sender) {
            ///<summary>单条记录打印</summary>
            var preview = false;
            var reportType = "Single";
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },

        actSinglePrintImportExcel_Handler: function (sender) {
            ///<summary>打印表单</summary>
            var preview = 1; //1：导出excel，2：导出pdf，3：导出word
            var reportType = "Single";
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },
        actSinglePrintImportPDF_Handler: function (sender) {
            ///<summary>打印表单</summary>
            var preview = 2; //1：导出excel，2：导出pdf，3：导出word
            var reportType = "Single";
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },
        actSinglePrintImportWord_Handler: function (sender) {
            ///<summary>打印表单</summary>
            var preview = 3; //1：导出excel，2：导出pdf，3：导出word
            var reportType = "Single";
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.Print);
        },

        actSinglePrintWindowView_Handler: function (sender) {
            ///<summary>单条记录打印预览</summary>
            var preview = true;
            var reportType = "Single";
            sender.dialogWidth = 800;
            sender.dialogHeight = 500;
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.PrintWinowView);
        },
        actSinglePrintModelView_Handler: function (sender) {
            ///<summary>单条记录打印预览</summary>
            var preview = true;
            var reportType = "Single";
            sender.dialogWidth = 800;
            sender.dialogHeight = 500;
            _this._singlePrint_Handle(sender, preview, reportType, Ext.ux.AppFrameV2.ReportService.PrintModelView);
        },

        _singlePrint_Handle: function (sender, preview, reportType, callback) {
            ///<summary>打印表单</summary>
            /*动态加载*/
            var loadjsFiles = [];
            loadjsFiles.push($G.getAppName() + "/GTP/Report/ReportMain.js");
            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);

            Ext.AppFrame.Util.LoadJS(jsFileList);

            var initcfg = sender; //this.initialConfig;
            var dataSource;
            var extendArr;
            var reportArgs;
            var extendqueryPlans;

            if (!initcfg.dataSourceName) {
                dataSource = $G.DataContext.getDataSource(initcfg.dataSourceName || 0);
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
                    if (paramList.dataSourceName)
                        dataSource = paramList.dataSourceName;
                    if (paramList.extendArr)
                        extendArr = paramList.extendArr;
                    if (paramList.reportArgs)
                        reportArgs = paramList.reportArgs;
                }
            }

            var record = dataSource.getDataRecord();
            var entityType = dataSource.type;

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

                var width = initcfg.dialogWidth;
                callback(sender, record.id, null, preview, reportType, extendArr, reportArgs, extendqueryPlans, width, height);
            }
        }
    });
})();