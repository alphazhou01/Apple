////////////////////////////////////////////////////////////////  
// 功能名称：Excel导入导出相关功能
// 功能说明：Excel导入,Excel导出等
//[注意]：使用当前Action库时，必须在页面中添加JavaScript引用 ~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite
////////////////////////////////////////////////////////////////

(function () {
    var _p = Gtp.net.BasePage;
    Ext.apply(_p.prototype, {
        //导入操作
        //导入到页面
        actImportExcelToPage_Handler: function (sender) {
            var cmp = $G.getViewObject(sender);
            var initcfg = this.initialConfig;

            //业务控制按钮是否生效
            if (initcfg.checkCurrentStateFun) {
                var checkCurrentStateFun = eval("_this." + initcfg.checkCurrentStateFun + ";");
                var tips = checkCurrentStateFun();
                if (tips) {
                    sender.hideMenu();
                    Gtp.net.MessageBox.info("提示", tips || "当前状态无法使用Excel相关功能");
                    return;
                }
            }

            if (sender.actionHandler) {
                sender.actionHandler();
                return;
            }
            if (sender.menu)
                return;

            /*动态加载*/
            var loadjsFiles = [];
            loadjsFiles.push($G.getAppName() + "/GTP/AppFrame/Common/JS/AppFrame.ExcelIO.js");
            loadjsFiles.push($G.getAppName() + "/Services/FileService/js/GTPFileClient.js");
            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);
            Ext.AppFrame.Util.LoadJS(jsFileList);

            //数据容器控件参数,若数据来源为页面数据,该参数必须有效,若选择容器样式覆盖模板样式,该参数有效才会生效,默认为null
            var gridControl = initcfg.gridControlId ? initcfg.gridControlId : null;
            if (gridControl)
                gridControl = $G.getCmp(gridControl);
            if (!gridControl) {
                cmpXType = cmp.getXType();
                if (cmpXType == "gtpgridpanel" || cmpXType == "gtptreegridpanel" || cmpXType == "gtpformpanel") {
                    gridControl = cmp;
                }
            }
            if (!gridControl) {
                Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.Hint, '未配置gridControlId参数');
                return;
            }

            //模板参数,选择设置模板参数时生效,若该参数为null,同样会使用业务组全名称获取所有模板,
            //支持字符串和js方法名两种参数,js方法返回值为字符串,默认为null
            //参数格式
            //todo:参数格式介绍
            var templateParams = null;
            templateParams = initcfg.templateParams ? initcfg.templateParams : null;
            if (templateParams && templateParams.indexOf(';') == -1) {
                var templateFun = eval("_this." + templateParams + ";");
                if (templateParams && typeof (templateFun) == "function")
                    templateParams = templateFun();
            }
            //对应实体全名称,未设置模板参数时应该保证该参数的有效性,否则导出操作无法完成,默认为null
            //            var entityName = initcfg.entityName ? initcfg.entityName : null;

            //            var menuText = initcfg.menuText ? initcfg.menuText : null;
            var treeStyle = _this.switchTreeStyle(initcfg.treeStyle);

            //开启属性列映射
            var needMatchExcel = (initcfg.needMatchExcel == "true" || initcfg.needMatchExcel == "True") ? true : false;

            //忽略字典是否存在
            var ignoreDictExist = (initcfg.ignoreDictExist == "false" || initcfg.ignoreDictExist == "False") ? false : true;

            //需要导出错误数据
            var needExportErrorData = (initcfg.needExportErrorData == "true" || initcfg.needExportErrorData == "True") ? true : false;

            //取消严格列校验  
            var isCancelStrictValidate = (initcfg.isCancelStrictValidate == "true" || initcfg.isCancelStrictValidate == "True") ? true : false;

            //设置开启列匹配后严格校验的配置信息
            var strictValidateSetting = initcfg.strictValidateSetting;
            if (strictValidateSetting && strictValidateSetting.indexOf(',') == -1 && typeof (eval("_this." + initcfg.strictValidateSetting + ";")) == "function")
                strictValidateSetting = eval("_this." + initcfg.strictValidateSetting + ";");

            //自定义导入文件获取方法
            var supportFileFun = initcfg.supportFileFun ? eval("_this." + initcfg.supportFileFun + ";") : null;
            if (typeof (supportFileFun) != "function")
                supportFileFun = null;

            //导入前执行的方法
            var beforeImportFun = initcfg.beforeImportFun ? eval("_this." + initcfg.beforeImportFun + ";") : null;

            //导入后执行的方法
            var afterImportFun = initcfg.afterImportFun ? eval("_this." + initcfg.afterImportFun + ";") : null;

            //创建Excel导入对象
            var excelImport = new Ext.ux.GTP.AppFrame.ExcelIOImport({
                sender: sender,
                //                templateParams: templateParams,
                gridControl: gridControl,
                //                entityName: entityName,
                templateParams: templateParams,
                //                menuText: menuText,
                treeStyle: treeStyle,
                needMatchExcel: needMatchExcel,
                ignoreDictExist: ignoreDictExist,
                needExportErrorData: needExportErrorData,
                isCancelStrictValidate: isCancelStrictValidate,
                strictValidateSetting: strictValidateSetting,
                supportFileFun: supportFileFun,
                beforeImportFun: beforeImportFun,
                afterImportFun: afterImportFun,
                directToDataBase: false
            });
            //            excelImport.excelImport(null, false, null, entityName);
            excelImport.initImportButton();
        },

        //导入操作
        //导入到后台
        actImportExcelToDataBase_Handler: function (sender) {
            var cmp = $G.getViewObject(sender);
            var initcfg = this.initialConfig;

            //业务控制按钮是否生效
            if (initcfg.checkCurrentStateFun) {
                var checkCurrentStateFun = eval("_this." + initcfg.checkCurrentStateFun + ";");
                var tips = checkCurrentStateFun();
                if (tips) {
                    sender.hideMenu();
                    Gtp.net.MessageBox.info("提示", tips || "当前状态无法使用Excel相关功能");
                    return;
                }
            }

            if (sender.actionHandler) {
                sender.actionHandler();
                return;
            }
            if (sender.menu)
                return;

            /*动态加载*/
            var loadjsFiles = [];
            loadjsFiles.push($G.getAppName() + "/GTP/AppFrame/Common/JS/AppFrame.ExcelIO.js");
            loadjsFiles.push($G.getAppName() + "/Services/FileService/js/GTPFileClient.js");
            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);
            Ext.AppFrame.Util.LoadJS(jsFileList);


            //模板参数,选择设置模板参数时生效,若该参数为null,同样会使用业务组全名称获取所有模板,
            //支持字符串和js方法名两种参数,js方法返回值为字符串,默认为null
            //参数格式
            //todo:参数格式介绍
            var templateParams = null;
            templateParams = initcfg.templateParams ? initcfg.templateParams : null;
            if (templateParams && templateParams.indexOf(';') == -1) {
                var templateFun = eval("_this." + templateParams + ";");
                if (templateParams && typeof (templateFun) == "function")
                    templateParams = templateFun();
            }

            //数据容器控件参数,若数据来源为页面数据,该参数必须有效,若选择容器样式覆盖模板样式,该参数有效才会生效,默认为null
            //            var gridControl = initcfg.gridControlId ? initcfg.gridControlId : null;
            //            if (gridControl)
            //                gridControl = $G.getCmp(gridControl);
            //            if (!gridControl) {
            //                cmpXType = cmp.getXType();
            //                if (cmpXType == "gtpgridpanel" || cmpXType == "gtptreegridpanel" || cmpXType == "gtpformpanel") {
            //                    gridControl = cmp;
            //                }
            //            }
            //            if (!gridControl) {
            //                Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.Hint, '未配置gridControlId参数');
            //                return;
            //            }


            //业务组件全名称,未设置模板参数时应该保证该参数的有效性,否则导出操作无法完成,默认为null
            var moduleName = initcfg.moduleName ? initcfg.moduleName : null;

            //            var menuText = initcfg.menuText ? initcfg.menuText : null;
            var treeStyle = _this.switchTreeStyle(initcfg.treeStyle);

            //开启属性列映射
            var needMatchExcel = (initcfg.needMatchExcel == "true" || initcfg.needMatchExcel == "True") ? true : false;

            //忽略字典是否存在
            var ignoreDictExist = (initcfg.ignoreDictExist == "false" || initcfg.ignoreDictExist == "False") ? false : true;

            //需要导出错误数据
            var needExportErrorData = (initcfg.needExportErrorData == "true" || initcfg.needExportErrorData == "True") ? true : false;

            //取消严格列校验  
            var isCancelStrictValidate = (initcfg.isCancelStrictValidate == "true" || initcfg.isCancelStrictValidate == "True") ? true : false;

            //设置开启列匹配后严格校验的配置信息
            var strictValidateSetting = initcfg.strictValidateSetting;
            if (strictValidateSetting && strictValidateSetting.indexOf(',') == -1 && typeof (eval("_this." + initcfg.strictValidateSetting + ";")) == "function")
                strictValidateSetting = eval("_this." + initcfg.strictValidateSetting + ";");

            //自定义导入文件获取方法
            var supportFileFun = initcfg.supportFileFun ? eval("_this." + initcfg.supportFileFun + ";") : null;
            if (typeof (supportFileFun) != "function")
                supportFileFun = null;

            //导入前执行的方法
            var beforeImportFun = initcfg.beforeImportFun ? eval("_this." + initcfg.beforeImportFun + ";") : null;

            //导入后执行的方法
            var afterImportFun = initcfg.afterImportFun ? eval("_this." + initcfg.afterImportFun + ";") : null;

            //创建Excel导入对象
            var excelImport = new Ext.ux.GTP.AppFrame.ExcelIOImport({
                sender: sender,
                templateParams: templateParams,
                //                gridControl: gridControl,
                moduleName: moduleName,
                //                menuText: menuText,
                treeStyle: treeStyle,
                needMatchExcel: needMatchExcel,
                ignoreDictExist: ignoreDictExist,
                needExportErrorData: needExportErrorData,
                isCancelStrictValidate: isCancelStrictValidate,
                strictValidateSetting: strictValidateSetting,
                supportFileFun: supportFileFun,
                beforeImportFun: beforeImportFun,
                afterImportFun: afterImportFun,
                directToDataBase: true
            });

            excelImport.initImportButton();
        },


        //Excel导出操作
        //数据来源:后台数据
        actExportExcelFromDataBase_Handler: function (sender) {
            var cmp = $G.getViewObject(sender);
            var initcfg = this.initialConfig;

            //业务控制按钮是否生效
            if (initcfg.checkCurrentStateFun) {
                var checkCurrentStateFun = eval("_this." + initcfg.checkCurrentStateFun + ";");
                var tips = checkCurrentStateFun();
                if (tips) {
                    sender.hideMenu();
                    Gtp.net.MessageBox.info("提示", tips || "当前状态无法使用Excel相关功能");
                    return;
                }
            }

            if (sender.actionHandler) {
                sender.actionHandler();
                return;
            }
            if (sender.menu)
                return;

            /*动态加载*/
            var loadjsFiles = [];
            loadjsFiles.push($G.getAppName() + "/GTP/AppFrame/Common/JS/AppFrame.ExcelIO.js");
            loadjsFiles.push($G.getAppName() + "/Services/FileService/js/GTPFileClient.js");
            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);
            Ext.AppFrame.Util.LoadJS(jsFileList);

            //todo:初始化参数,对空值操作赋予默认值
            //是否设置模板参数,若该参数为空,则使用业务组件全名称获取模板,默认为false
            //            var hasTemplateParam = initcfg.hasTemplateParam;
            //            hasTemplateParam = hasTemplateParam && (hasTemplateParam == "true" || hasTemplateParam == "True") ? true : false;

            //模板参数,选择设置模板参数时生效,若该参数为null,同样会使用业务组全名称获取所有模板,
            //支持字符串和js方法名两种参数,js方法返回值为字符串,默认为null
            //参数格式
            //todo:参数格式介绍
            var templateParams = null;
            templateParams = initcfg.templateParams ? initcfg.templateParams : null;
            if (templateParams && templateParams.indexOf(';') == -1) {
                var templateFun = eval("_this." + templateParams + ";");
                if (templateParams && typeof (templateFun) == "function")
                    templateParams = templateFun();

            }
            //数据容器控件参数,若数据来源为页面数据,该参数必须有效,若选择容器样式覆盖模板样式,该参数有效才会生效,默认为null
            var gridControl = initcfg.gridControlId ? initcfg.gridControlId : null;
            if (gridControl) {
                gridControl = $G.getCmp(gridControl);
                if (!gridControl) {
                    Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.Hint, '未配置gridControlId参数');
                    return;
                }
            }
            //            if (!gridControl) {
            //                cmpXType = cmp.getXType();
            //                if (cmpXType == "gtpgridpanel" || cmpXType == "gtptreegridpanel" || cmpXType == "gtpformpanel") {
            //                    gridControl = cmp;
            //                }
            //            }
            //            //是否使用页面表格样式覆盖模板设置,未设置数据容器控件时无效,默认为false
            //            var useGridStyle = initcfg.useGridStyle;
            //            useGridStyle = useGridStyle && (useGridStyle == "true" || useGridStyle == "True") ? true : false;

            //queryPlan的id,如果想要导出的数据在页面中设置了过滤条件,并且需要使用过滤条件对导出数据进行过滤,则需要使用该参数,默认为null
            var queryPlan = initcfg.queryPlanId ? initcfg.queryPlanId : null;
            if (queryPlan) {
                queryPlan = $G.QueryPlans.getQueryPlan(queryPlan);
                if (!queryPlan) {
                    //                queryPlan = queryPlan.getQueryParam();
                    //            else {
                    Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.Hint, 'queryPlanId参数配置不正确');
                    return;
                }
            }
            //业务组件全名称,未设置模板参数时应该保证该参数的有效性,否则导出操作无法完成,默认为null
            var moduleName = initcfg.moduleName ? initcfg.moduleName : null;
            //
            var setParamsFun = initcfg.setParamsFun ? eval("_this." + initcfg.setParamsFun + ";") : null;

            var treeStyle = _this.switchTreeStyle(initcfg.treeStyle);

            var pageController = initcfg.pageController ? initcfg.pageController : null;

            var selectAllPage = (initcfg.selectAllPage == "true" || initcfg.selectAllPage == "true") ? true : false;

            var closeWizard = (initcfg.closeWizard == "true" || initcfg.closeWizard == "true") ? true : false;

            //            var completeEnum = (initcfg.completeEnum == "false" || initcfg.completeEnum == "False") ? "0" : "1";
            //            var menuText = initcfg.menuText ? initcfg.menuText : null;
            //todo:创建Excel导出对象
            var excelExport = new Ext.ux.GTP.AppFrame.ExcelIOExport({
                sender: sender,
                templateParams: templateParams,
                gridControl: gridControl,
                dataType: "0",
                treeStyle: treeStyle,
                //                useGridStyle: useGridStyle,
                queryPlan: queryPlan,
                setParamsFun: setParamsFun,
                moduleName: moduleName,
                pageController: pageController,
                selectAllPage: selectAllPage,
                closeWizard: closeWizard
                //                completeEnum: completeEnum
            });

            //todo:导出操作
            excelExport.initExprotButton();
        },

        //Excel导出操作
        //数据来源:页面容器
        actExportExcelFromPage_Handler: function (sender) {
            var cmp = $G.getViewObject(sender);
            var initcfg = this.initialConfig;

            //业务控制按钮是否生效
            if (initcfg.checkCurrentStateFun) {
                var checkCurrentStateFun = eval("_this." + initcfg.checkCurrentStateFun + ";");
                var tips = checkCurrentStateFun();
                if (tips) {
                    Gtp.net.MessageBox.info("提示", tips || "当前状态无法使用Excel相关功能");
                    return;
                }
            }

            if (sender.menu)
                return;

            /*动态加载*/
            var loadjsFiles = [];
            loadjsFiles.push($G.getAppName() + "/GTP/AppFrame/Common/JS/AppFrame.ExcelIO.js");
            loadjsFiles.push($G.getAppName() + "/Services/FileService/js/GTPFileClient.js");
            var jsFileList = Ext.AppFrame.Util.CheckJS(loadjsFiles);
            Ext.AppFrame.Util.LoadJS(jsFileList);

            //todo:初始化参数,对空值操作赋予默认值
            //是否设置模板参数,若该参数为空,则使用业务组件全名称获取模板,默认为false
            //            var hasTemplateParam = initcfg.hasTemplateParam;
            //            hasTemplateParam = hasTemplateParam && (hasTemplateParam == "true" || hasTemplateParam == "True") ? true : false;

            //模板参数,选择设置模板参数时生效,若该参数为null,同样会使用业务组全名称获取所有模板,
            //支持字符串和js方法名两种参数,js方法返回值为字符串,默认为null
            //参数格式
            //todo:参数格式介绍
            //            var templateParams = null;
            //            templateParams = initcfg.templateParams ? initcfg.templateParams : null;
            //            var templateFun = eval("_this." + templateParams + ";");
            //            if (templateParams && typeof (templateFun) == "function")
            //                templateParams = templateFun();

            //数据容器控件参数,若数据来源为页面数据,该参数必须有效,若选择容器样式覆盖模板样式,该参数有效才会生效,默认为null
            var gridControl = initcfg.gridControlId ? initcfg.gridControlId : null;
            if (gridControl)
                gridControl = $G.getCmp(gridControl);
            if (!gridControl) {
                cmpXType = cmp.getXType();
                if (cmpXType == "gtpgridpanel" || cmpXType == "gtptreegridpanel" || cmpXType == "gtpformpanel") {
                    gridControl = cmp;
                }
            }
            if (!gridControl) {
                Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.Hint, '未配置gridControlId参数');
                return;
            }
            var treeStyle = _this.switchTreeStyle(initcfg.treeStyle);
            var pageController = initcfg.pageController ? initcfg.pageController : null;
            var customFormatDataFun = initcfg.customFormatDataFun ? eval("_this." + initcfg.customFormatDataFun + ";") : null;

            var closeWizard = (initcfg.closeWizard == "true" || initcfg.closeWizard == "true") ? true : false;

            //是否使用页面表格样式覆盖模板设置,未设置数据容器控件时无效,默认为false
            var useGridStyle = initcfg.useGridStyle;
            useGridStyle = useGridStyle && (useGridStyle == "true" || useGridStyle == "True") ? true : false;
            //            var completeEnum = (initcfg.completeEnum == "false" || initcfg.completeEnum == "False") ? "0" : "1";
            //业务组件全名称,未设置模板参数时应该保证该参数的有效性,否则导出操作无法完成,默认为null
            //            var moduleName = initcfg.moduleName ? initcfg.moduleName : null;

            //todo:创建Excel导出对象
            var excelExport = new Ext.ux.GTP.AppFrame.ExcelIOExport({
                sender: sender,
                //                templateParams: templateParams,
                templateParams: "导出当前页:1,0,0;",
                gridControl: gridControl,
                dataType: "1",
                treeStyle: treeStyle,
                useGridStyle: useGridStyle,
                pageController: pageController,
                customFormatDataFun: customFormatDataFun,
                closeWizard: closeWizard
                //                completeEnum: completeEnum
                //                moduleName: moduleName
            });

            //todo:导出操作
            //            excelExport.initExprotButton();
            excelExport.exportSelect(1);
        },

        switchTreeStyle: function (treeStyle) {
            switch (treeStyle) {
                case "CodeLevel":
                    return 0;
                case "FullCode":
                    return 1;
                case "Tile":
                    return 2;
                case "CompactTile":
                    return 3;
                default:
                    return 4;
            }
        }
    });
})();