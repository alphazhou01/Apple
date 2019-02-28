//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
	Ext.ns("GTP.AppFrameV2.DynaBizComp");
	var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	//[Start]
	    _init: function () {
	        _this._initData();

	        _this._initDataContext();

	        _this._initSetting();
	    },
	//[End]

	//[Start]
	    _initData: function () {
	        $G.Page._categoryData = [{
	            CategoryName: "常用函数"
	        }, {
	            CategoryName: "字符处理"
	        }, {
	            CategoryName: "数学计算"
	        }, {
	            CategoryName: "日期时间"
	        }, {
	            CategoryName: "聚合统计"
	        }, {
	            CategoryName: "运算符"
	        }];

	        $G.Page._foundationData = [
	        //常用函数
            [{
                MethodName: "Root",
                MethodParams: null,
                ReturnValue: "实体根对象",
                Description: "获取实体根对象"
            }, {
                MethodName: "Parent",
                MethodParams: null,
                ReturnValue: "父实体对象",
                Description: "获取当前实体的父实体对象，如果当前为根则获取自己"
            }, {
                MethodName: "RecNo",
                MethodParams: null,
                ReturnValue: "索引号",
                Description: "获取当前实体的父实体对象，如果当前为根则获取自己"
            }, {
                MethodName: "IfNull",
                MethodParams: "undefined, undefined",
                ReturnValue: "第一个参数或第二个参数",
                Description: "空值判断函数，如果第一个参数为null，则获取第二个参数，否则获取第一个参数"
            }, {
                MethodName: "IIf",
                MethodParams: "boolean, undefined, undefined",
                ReturnValue: "第二个参数或第三个参数",
                Description: "条件判断函数，如果第一个参数为true，则获取第二个参数，否则获取第三个参数"
            }, {
                MethodName: "Now",
                MethodParams: null,
                ReturnValue: "本地当前日期时间",
                Description: "获取本地当前日期时间"
            }, {
                MethodName: "FieldName",
                MethodParams: null,
                ReturnValue: "字段唯一标识",
                Description: "获取当前字段唯一标识"
            }, {
                MethodName: "FieldDisplayName",
                MethodParams: null,
                ReturnValue: "字段别名（显示名称)",
                Description: "获取当前字段别名"
            }, {
                MethodName: "PageParam",
                MethodParams: "String",
                ReturnValue: "undefined",
                Description: "获取页面参数"
            }, {
                MethodName: "PageState",
                MethodParams: null,
                ReturnValue: "状态标识",
                Description: "获取页面当前状态"
            }, {
                MethodName: "PropValue",
                MethodParams: "undefined, string",
                ReturnValue: "获取对象属性值",
                Description: "参数1:对象或数组(获取数组第一个元素) 参数2:属性名 返回:属性值"
            }],
	        //字符处理
             [{
                 MethodName: "ToString",
                 MethodParams: null,
                 ReturnValue: "字符串",
                 Description: "转换字符串类型为字符串"
             }, {
                 MethodName: "ToNumber",
                 MethodParams: null,
                 ReturnValue: "数字",
                 Description: "转换字符串类型为数字"
             }, {
                 MethodName: "ToDate",
                 MethodParams: null,
                 ReturnValue: "日期时间",
                 Description: "转换字符串类型为日期时间"
             }, {
                 MethodName: "Length",
                 MethodParams: null,
                 ReturnValue: "字符串长度",
                 Description: "获取字符串长度"
             }, {
                 MethodName: "Upper",
                 MethodParams: null,
                 ReturnValue: "大写字符串",
                 Description: "转换字符串为大写"
             }, {
                 MethodName: "Lower",
                 MethodParams: null,
                 ReturnValue: "小写字符串",
                 Description: "转换字符串为小写"
             }, {
                 MethodName: "Trim",
                 MethodParams: null,
                 ReturnValue: "字符串",
                 Description: "去除字符串两端空格"
             }, {
                 MethodName: "TrimLeft",
                 MethodParams: null,
                 ReturnValue: "字符串",
                 Description: "去除字符串左端空格"
             }, {
                 MethodName: "TrimRight",
                 MethodParams: null
            , ReturnValue: "字符串",
                 Description: "去除字符串右端空格"
             }, {
                 MethodName: "SubString",
                 MethodParams: "number, number",
                 ReturnValue: "子字符串",
                 Description: "获取字符串的子字符串，指定开始位置和长度"
             }, {
                 MethodName: "LeftString",
                 MethodParams: "number",
                 ReturnValue: "子字符串",
                 Description: "获取字符串的左子字符串，指定长度"
             }, {
                 MethodName: "RightString",
                 MethodParams: "number",
                 ReturnValue: "子字符串",
                 Description: "获取字符串的右子字符串，指定长度"
             }, {
                 MethodName: "Pos",
                 MethodParams: "string",
                 ReturnValue: "位置索引",
                 Description: "检索字符串，获取子字符串在字符串中的起始位置"
             }],
	        //数学函数
              [{
                  MethodName: "ToString",
                  MethodParams: null,
                  ReturnValue: "字符串",
                  Description: "转换数字类型为字符串"
              },
            {
                MethodName: "Abs",
                MethodParams: null,
                ReturnValue: "绝对值",
                Description: "获取数的绝对值"
            },
            {
                MethodName: "Ceil",
                MethodParams: null,
                ReturnValue: "数值",
                Description: "对数进行上舍入"
            },
            {
                MethodName: "Floor",
                MethodParams: null,
                ReturnValue: "数值",
                Description: "对数进行下舍入"
            },
            {
                MethodName: "Cos",
                MethodParams: null,
                ReturnValue: "数值",
                Description: "获取数的余弦"
            },
            {
                MethodName: "Exp",
                MethodParams: null,
                ReturnValue: "指数",
                Description: "获取 e 的指数"
            },
            {
                MethodName: "Ln",
                MethodParams: null,
                ReturnValue: "自然对数",
                Description: "获取数的自然对数（底为 e）"
            },
            {
                MethodName: "Log",
                MethodParams: "number",
                ReturnValue: "对数",
                Description: "获取数的指定底数的对数"
            },
            {
                MethodName: "Power",
                MethodParams: "number",
                ReturnValue: "幂次",
                Description: "获取数的指定指数的次幂"
            },
            {
                MethodName: "Round",
                MethodParams: "number",
                ReturnValue: "数值",
                Description: "根据保留的小数位数对数四舍五入"
            },
            {
                MethodName: "Sin",
                MethodParams: null,
                ReturnValue: "正弦",
                Description: "获取数的正弦"
            },
            {
                MethodName: "Sqrt",
                MethodParams: null,
                ReturnValue: "平方根",
                Description: "获取数的平方根"
            },
            {
                MethodName: "Tan",
                MethodParams: null,
                ReturnValue: "正切值",
                Description: "获取数的正切值"
            },
            {
                MethodName: "Trunc",
                MethodParams: "number",
                ReturnValue: "数值",
                Description: "根据保留的小数位数对数进行截断"
            }],
	        //日期时间
             [{
                 MethodName: "ToString",
                 MethodParams: null,
                 ReturnValue: "字符串",
                 Description: "转换日期时间类型为字符串"
             },
            {
                MethodName: "DateOf",
                MethodParams: null,
                ReturnValue: "返回 Date 对象的日期部分",
                Description: "获取 Date 对象的日期部分"
            },
            {
                MethodName: "DayOf",
                MethodParams: null,
                ReturnValue: "数值(1-31)",
                Description: "从 Date 对象获取一个月中的某一天（1 ~ 31）"
            },
            {
                MethodName: "DayOfWeek",
                MethodParams: null,
                ReturnValue: "周 （0 ~ 6）",
                Description: "得到一周中的星期几（0 ~ 6）"
            },
            {
                MethodName: "DaysBetween",
                MethodParams: "date",
                ReturnValue: "两个日期间隔的天数",
                Description: "获取日期差"
            },
            {
                MethodName: "HourOf",
                MethodParams: null,
                ReturnValue: "一天中的第几个小时",
                Description: "从 Date 对象获取一天中的第几个小时"
            },
            {
                MethodName: "HoursBetween",
                MethodParams: "date",
                ReturnValue: "两个日期间隔的小时数",
                Description: "获取小时差"
            },
            {
                MethodName: "IncDay",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的天数"
            },
            {
                MethodName: "IncHour",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的小时数"
            },
            {
                MethodName: "IncMinute",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的分钟数"
            },
            {
                MethodName: "IncMonth",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的月数"
            },
            {
                MethodName: "IncSecond",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的秒数"
            },
            {
                MethodName: "IncWeek",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的周数"
            },
            {
                MethodName: "IncYear",
                MethodParams: "number",
                ReturnValue: "日期时间",
                Description: "增加指定的年数"
            },
            {
                MethodName: "MilliSecondOf",
                MethodParams: null,
                ReturnValue: "毫秒",
                Description: "从 Date 对象获取毫秒"
            },
            {
                MethodName: "MilliSecondsBetween",
                MethodParams: "date",
                ReturnValue: "毫秒差",
                Description: "获取毫秒差"
            },
            {
                MethodName: "MinuteOf",
                MethodParams: null,
                ReturnValue: "分",
                Description: "从 Date 对象获取分钟（0 ~ 59）"
            },
            {
                MethodName: "MinutesBetween",
                MethodParams: "date",
                ReturnValue: "分差",
                Description: "获取分钟差"
            },
            {
                MethodName: "MonthOf",
                MethodParams: null,
                ReturnValue: "月",
                Description: "从 Date 对象获取月份（1 ~ 12）"
            },
            {
                MethodName: "MonthsBetween",
                MethodParams: "date",
                ReturnValue: "月差",
                Description: "获取月份差"
            },
            {
                MethodName: "SecondOf",
                MethodParams: null,
                ReturnValue: "秒",
                Description: "从 Date 对象获取秒数（0 ~ 59）"
            },
            {
                MethodName: "SecondsBetween",
                MethodParams: "date",
                ReturnValue: "秒差",
                Description: "获取秒差"
            },
            {
                MethodName: "TimeOf",
                MethodParams: null,
                ReturnValue: "时间",
                Description: "从 Date 对象获取时间"
            },
            {
                MethodName: "WeekOf",
                MethodParams: null,
                ReturnValue: "周",
                Description: "从 Date 对象获取一年中的第几周（1 ~ 53）"
            },
            {
                MethodName: "WeeksBetween",
                MethodParams: "date",
                ReturnValue: "周差",
                Description: "获取周差"
            },
            {
                MethodName: "YearOf",
                MethodParams: null,
                ReturnValue: "年",
                Description: "从 Date 对象获取年份"
            },
            {
                MethodName: "YearsBetween",
                MethodParams: "date",
                ReturnValue: "年差",
                Description: "获取年差"
            }],
	        //聚合统计
            [
            {
                MethodName: "Sum",
                MethodParams: "expr/-",
                ReturnValue: "合计值",
                Description: "获取集合元素的合计值"
            },
            {
                MethodName: "Max",
                MethodParams: "expr/-",
                ReturnValue: "最大值",
                Description: "获取集合元素的最大值"
            },
            {
                MethodName: "Min",
                MethodParams: "expr/-",
                ReturnValue: "最小值",
                Description: "获取集合元素的最小值"
            },
            {
                MethodName: "Average",
                MethodParams: "expr/-",
                ReturnValue: "平均值",
                Description: "获取集合元素的平均值"
            },
            {
                MethodName: "Distinct",
                MethodParams: "expr/-",
                ReturnValue: "集合",
                Description: "获取集合中唯一元素的集合"
            },
            {
                MethodName: "Where",
                MethodParams: "expr/-",
                ReturnValue: "集合",
                Description: "获取集合中唯一元素的集合"
            }
            ]];

	        $G.Page._eVariableData = [{
	            VariablesName: "$C.userId",
	            Description: "用户的id"
	        }, {
	            VariablesName: "$C.userName",
	            Description: "用户的名称"
	        }, {
	            VariablesName: "$C.userCode",
	            Description: "用户的编码"
	        }, {
	            VariablesName: "$C.deptId",
	            Description: "用户部门的id"
	        }, {
	            VariablesName: "$C.deptName",
	            Description: "用户部门的名称"
	        }, {
	            VariablesName: "$C.deptFullName",
	            Description: "用户部门的层级"
	        }];

	    },
	//[End]

	//[Start]
	    _initDataContext: function () {
	        if (!$G.Page._categorySource)
	            $G.Page._categorySource = $G.DataContext.getDataSource('FoundationCategory');
	        if (!$G.Page._foundationSource)
	            $G.Page._foundationSource = $G.DataContext.getDataSource('FoundationItem');
	        if (!$G.Page._dynaPropertySource)
	            $G.Page._dynaPropertySource = $G.DataContext.getDataSource('DynaPropertyInfo');
	        if (!$G.Page._ePropertySource)
	            $G.Page._ePropertySource = $G.DataContext.getDataSource('EnvironmentVariables');
	        if (!$G.Page._expressionSource)
	            $G.Page._expressionSource = $G.DataContext.getDataSource('ExpressionInfo');
	    },
	//[End]

	//[Start]
	    _initSetting: function () {
	        $G.Page._hasInitPropertyTree = false;

	        $G.Page._hasInitExpressionText = false;

	        $G.Page._expressionSource.addRecord();

	        //	        $G.getCmp("Efd_btnClear").setWidth(71);
	        $G.getCmp("Efd_ExpressionValue").setValue($G.Params.ExpressionText || ""); ;
	    },
	//[End]

	//[Start]
	    _initTextArea: function () {
	        var expressionField = document.getElementById('Efd_ExpressionValue');
	        //当前选中的TextRange
	        expressionRange = expressionField.createTextRange();
	        //	        //复制一个TextRange
	        //	        expressionRange = range.duplicate();
	        //	        //定位到Textarea
	        //	        expressionRange.moveToElementText(expressionField);

	        $G.Page._hasInitExpressionText = true;
	    },
	//[End]

	//[Start]
	    _initPropertyTree: function () {
	        _this.entityName = $G.Params.EntityName;
	        _this.moduleCode = $G.Params.ModuleCode;
	        var alias;
	        $G.dispatcher({
	            async: false,
	            controller: 'GTP.AppFrame.PropertyTreeLookupPage',
	            action: "GetEntityInfo",
	            args: [_this.entityName],
	            success: function (result) {
	                alias = result;
	            }
	        });
	        var tree = new Ext.ux.tree.GtpTreePanel({
	            id: "treeView",
	            autoScroll: true,
	            height: 480,
	            rootVisible: true,
	            title: "业务属性",
	            useArrows: true,
	            enableDD: false, // 不允许子节点拖动
	            // dataSource: "ModuleTree",
	            keyField: "ID",
	            parentKeyField: "PID",
	            displayField: "Name",
	            fullCodeField: "FullCode",
	            codeField: "Code",
	            leafField: "IsLeaf",
	            oTypeField: "OType",
	            orderField: "OrderNo",
	            levelField: "Level",
	            root: {
	                id: " ",
	                text: _this.entityName + '(' + alias + ')',
	                entityName: _this.entityName,
	                nodeType: "async",
	                code: alias
	            },
	            listeners: {
	                beforeload: _this.treeView_BeforeLoad,
	                click: _this.treeView_DBClick,
	                initloader: _this.treeView_InitLoader
	            }
	        });
	        var panel1 = $G.getCmp("layoutPanel4");
	        panel1.add(tree);
	        panel1.doLayout();

	        var root = tree.getRootNode();
	        root.expand();
	    },
	//[End]

	//[Start]
	    treeView_BeforeLoad: function (node) {
	        var array = new Array();
	        var parentNode = null;
	        for (var i = 0, parentNode = node; parentNode.parentNode; i++) {
	            parentNode = parentNode.parentNode;
	            array[i] = parentNode.attributes.fullcode ? parentNode.attributes.fullcode : parentNode.attributes.entityName;
	        }

	        node.ownerTree.loader.dispatcher = new Gtp.net.GtpDispatcher({
	            dispatchArgs: {
	                controller: 'GTP.AppFrame.PropertyTreeLookupPage',
	                action: 'GetDynaChildrenNodes',
	                args: [_this.entityName, _this.moduleCode, node.attributes.id, array]
	            }
	        });

	    },
	//[End]

	//[Start]
	    treeView_InitLoader: function (tree) {
	        tree.loader = new Ext.ux.tree.GtpTreeLoader({
	            listeners: {
	                load: function (scope, node, response) {
	                    var result = Ext.util.JSON.decode(response.responseText);
	                }
	            }
	        });

	    },
	//[End]

	//[Start]
	    _initLoadData: function () {
	        _this._loadCategoryData();

	        //	        _this._initPropertyTree();

	        _this._loadDynaProperty();

	        _this._loadEnvironmentVariable();
	    },
	//[End]

	//[Start]
	    _loadCategoryData: function () {
	        $G.Page._categorySource.loadData($G.Page._categoryData);
	        _this._loadFoundationData(0);
	    },
	//[End]

	//[Start]
	    _loadFoundationData: function (index) {
	        $G.Page._foundationSource.loadData($G.Page._foundationData[index]);
	    },
	    //[Start]

	    //[Start]
	    _loadDynaProperty: function () {
	        var dataSource = $G.Page._dynaPropertySource;
	        if ($G.Params.ExtensionId) {
	            $G.dispatcher({
	                controller: "GTP.AppFrameV2.DynaBizComp.DynaPropertyManagePage",
	                action: "GetPropertyListByProjectId",
	                args: [$G.Params.ExtensionId],
	                success: function (data) {
	                    dataSource.loadData(data);
	                }
	            });
	        }
	        else {
	            var data = [];
	            if (!Ext.isEmpty($G.Params.PropertyInfos)) {
	                var propertyInfos = $G.Params.PropertyInfos.split(';');
	                propertyInfos.forEach(function (propertyInfo) {
	                    if (Ext.isEmpty(propertyInfo))
	                        return;
	                    property = propertyInfo.split(',');
	                    data.push({
	                        PropertyName: property[0],
	                        PropertyAlias: property[1],
	                        DataType: property[2]
	                    });
	                });
	            }
	            dataSource.loadData(data);
	        }
	    },
	//[End]

	//[Start]
	    _loadEnvironmentVariable: function () {
	        $G.Page._ePropertySource.loadData($G.Page._eVariableData);
	    },
	//[End]

	//[Start]
	    Page_DocumentReady: function () {
	        _this._init();

	        _this._initLoadData();
	    },
	//[End]

	//[Start]
	    _getSelectRecord: function (grid, needTip) {
	        if (!grid)
	            return null;
	        var grid = $G.getCmp(grid);
	        var records = grid.getSelectionModel().getSelections();
	        if (records && records.length) {
	            return records[0];
	        }
	        else if (needTip) {
	            Gtp.net.MessageBox.info(GTP.AppFrame.WebResource.Hint, "当前没有选中记录");
	        }

	    },
	//[End]

	//[Start]
	    actAccept_Handler: function (sender) {
	        ///<summary>确定:actAccept</summary>
	        var expressionInfo = $G.getCmp("Efd_ExpressionValue");
	        var value = expressionInfo.el.dom.value;
	        $G.setReturnValue("OutExpressionText", value);
	        $G.close(true);
	    },
	//[End]

	//[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        $G.close(false);
	    },
	//[End]

	//[Start]
	    categoryView_Click: function (e) {
	        ///<summary>Click</summary>
	        var record = _this._getSelectRecord("categoryView");
	        var grid = $G.getCmp("categoryView");
	        var index = grid.store.indexOf(record);
	        _this._loadFoundationData(index);
	    },
	//[End]

	//[Start]
	    foundationView_DblClick: function (e) {
	        ///<summary>DblClick</summary>
	        var record = _this._getSelectRecord("foundationView");
	        _this._insertExpressionText(record.data.MethodName + "()");
	    },
	//[End]

	//[Start]
	    eVariablesView_DblClick: function (e) {
	        ///<summary>DblClick</summary>
	        var record = _this._getSelectRecord("eVariablesView");
	        _this._insertExpressionText(record.data.VariablesName);
	    },
	//[End]

	//[Start]
	    dynaPropertyView_DblClick: function (e) {
	        ///<summary>DblClick</summary>
	        var record = _this._getSelectRecord("dynaPropertyView");
	        _this._insertExpressionText(record.data.PropertyName);
	    },
	//[End]

	//[Start]
	    treeView_DBClick: function (node, e) {
	        _this._insertExpressionText(node.id);
	    },
	//[End]

	//[Start]
	    _setCaretTo: function (obj, pos) {
	        if (obj.createTextRange) {
	            var range = obj.createTextRange();
	            range.move('character', pos);
	            range.select();
	        } else if (obj.selectionStart) {
	            obj.focus();
	            obj.setSelectionRange(pos, pos);
	        }
	    },
	//[End]

	//[Start]
	    _insertExpressionText: function (text) {
	        //	        function setCaretTo(obj, pos) {
	        //	            if (obj.createTextRange) {
	        //	                var range = obj.createTextRange();
	        //	                range.move('character', pos);
	        //	                range.select();
	        //	            } else if (obj.selectionStart) {
	        //	                obj.focus();
	        //	                obj.setSelectionRange(pos, pos);
	        //	            }
	        //	        }

	        //	        	        function insertAtCaret(obj, text) {
	        obj = document.getElementById("Efd_ExpressionValue");
	        if (document.selection) {
	            obj.focus();
	            var orig = obj.value.replace(/\r\n/g, "\n");
	            var range = document.selection.createRange();

	            if (range.parentElement() != obj) {
	                return false;
	            }
	            range.text = "###";
	            start = obj.value.indexOf("###");
	            range.moveStart('character', -3);
	            //	            range.moveEnd('character', start + 3);
	            //	            range.select();
	            range.text = text;

	            var actual = tmp = obj.value.replace(/\r\n/g, "\n");

	            //	            for (var diff = 0; diff < orig.length; diff++) {
	            //	                if (orig.charAt(diff) != actual.charAt(diff)) break;
	            //	            }

	            //	            for (var index = 0, start = 0; tmp.match(text) && (tmp = tmp.replace(text, "")) && index <= diff; index = start + text.length) {
	            //	                start = actual.indexOf(text, index);
	            //	            }
	        } else if (obj.selectionStart) {
	            var start = obj.selectionStart;
	            var end = obj.selectionEnd;

	            obj.value = obj.value.substr(0, start) + text + obj.value.substr(end, obj.value.length);
	        }

	        if (start != null) {
	            _this._setCaretTo(obj, start + text.length);
	        } else {
	            obj.value += text;
	        }
	        //	        }


	        //	        if (!$G.Page._hasInitExpressionText)
	        //	            _this._initTextArea();
	        //	        var expressionField = $G.getCmp("Efd_ExpressionValue");
	        //	        var expressionFieldDom = expressionField.el.dom;
	        //	        expressionFieldDom.focus();
	        //	        if (Ext.isIE) {
	        //	            insertAtCaret(expressionFieldDom, 'xxx');
	        //	            var range = expressionFieldDom.createTextRange();
	        //	            //range.text = value;
	        //	            //range.moveEnd('character', value.length);
	        //	            //var l = range.moveStart('character', value.length);
	        //	            //alert(l)
	        //	            range.collapse(true);
	        //	            range.moveStart("character", 0);
	        //	            range.moveEnd("character", 4);

	        //	            range.select();
	        //	            alert(range.text)
	        //	            var start = expressionFieldDom.selectionStart || 0;
	        //	            var end = expressionFieldDom.selectionEnd || 0;
	        //	            var expressionText = expressionField.getValue() || "";
	        //	            expressionField.setValue(expressionText.substring(0, start) + value + expressionText.substring(end));
	        //	            expressionFieldDom.moveStart('character', -value.length);
	        //	        }
	        //	        expressionFieldDom.selectionStart = expressionFieldDom.selectionEnd = start + value.length;


	    },
	//[End]

	//[Start]
	    actReset_Handler: function (sender) {
	        ///<summary>重置:actReset</summary>
	        $G.getCmp("Efd_ExpressionValue").setValue($G.Params.ExpressionText);
	    },
	//[End]

	//[Start]
	    actClear_Handler: function (sender) {
	        ///<summary>清空:actClear</summary>
	        $G.getCmp("Efd_ExpressionValue").setValue("");
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
	    tabView_TabChange: function (item, tab, index) {
	        ///<summary>TabChange</summary>
	        if (tab.title == "业务属性" && !$G.Page._hasInitPropertyTree) {
	            _this._initPropertyTree();
	            $G.Page._hasInitPropertyTree = true;
	        }
	        if ($G.getCmp("Efd_ExpressionValue").rendered) {
	            obj = document.getElementById("Efd_ExpressionValue");
	            obj.focus();
	        }
	    }
	//[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.DynaBizComp.DynaExpressionPage = _class;
})();
//</Bottom>