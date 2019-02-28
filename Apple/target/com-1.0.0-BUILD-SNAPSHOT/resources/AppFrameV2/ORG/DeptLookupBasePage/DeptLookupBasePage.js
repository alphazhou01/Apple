//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.Org");
    var _class = Ext.extend(GTP.AppFrameV2.Common.BasePage,
	{
	    //</Top>

	    //[Start]
	    //将string转换为boolean
	    _convertStringToBoolean: function (str, defaultvalue) {
	        var ret = defaultvalue;
	        if (!Ext.isEmpty(str)) {
	            if (Ext.isString(str)) {
	                str = str.toLowerCase();
	                if (str == "true") return true;
	                else if (str == "false") return false;
	            } else if (Ext.isBoolean(str)) ret = str;
	        }
	        return ret;
	    },
	    //[End]

	    //[Start]
	    _getConfig: function () {
	        if (!$G.Page._deptConfig) {
	            var _direction = $G.Params["direction"] || "2";          //选择部门方向，默认本下，0：上级，1：本上，2：本下。（取消3下级）
	            var _deployIsRoot = $G.Params["deployIsRoot"];
	            var _deployDeptId = $G.Params["deployDeptId"] || null;   //依赖部门结点，当前部门节点的直系节点   优先级 1 
	            var _fixedNodeIds = $G.Params["fixedNodeIds"];           //固定节点 [{Id:,ObjType:类型0:部门 1：用户 2：角色 3：角色组,IncludeChild:1}]  优先级 2

	            var _bizTypeCode = $G.Params["typeCode"] || null;       //业务类型 优先级 2
	            var _levelTypeCode = $G.Params["levelTypeCode"] || null; //级别类型 优先级 2

	            //依赖于门户，并且以来的项目节点为空，如果项目节点存在，依赖门户不起作用
	            if ($G.Params["deployFrame"] && !_deployDeptId) {
	                _deployDeptId = Ext.AppFrame.Common.getDeptId(); //统一入口
	            }

	            var _selectedDeptIds;
	            if ($G.Params["SelectedIdList"]) _selectedDeptIds = $G.Params["SelectedIdList"].toString();


	            Ext.applyIf($G.Params, window.dialogArguments);
	            var config = {
	                multiSelect: $G.Params["multiSelect"] || false,          //是否可多选，默认单选
	                dummySelectAble: $G.Params["dummySelect"] || false,      //是否选择虚部门
	                postSelectAble: $G.Params["postSelect"] || false,        //是否选择岗位
	                postVisible: $G.Params["postVisible"] || false,          //岗位是否可见
	                dummyVisible: $G.Params["dummyVisible"] || false,        //虚部门是否可见
	                authCode: $G.Params["authCode"],                         //部门权限Code            优先级 3
	                userAuthCode: $G.Params["userAuthCode"] || "",           //人员权限Code            优先级 3
	                fixedNodeIds: $G.Params["fixedNodeIds"],                 //固定节点 [{Id:,ObjType:类型0:部门 1：用户 2：角色 3：角色组,IncludeChild:1}]  优先级 1
	                vt: $G.Params["viewType"] || 0,                          //应用视图0:单树视图、1左右多选视图
	                selectMode: "Dept",                                      //树显示视图 Dept(组织)、User(用户)、Role(角色)、DeptUser(部门用户)、DeptRole(部门角色)、DeptUserRole(部门用户角色)
	                border: false,
	                bizTypeCode: $G.Params["typeCode"] || null,              //业务类别          优先级 2
	                levelTypeCode: $G.Params["levelTypeCode"] || "",         //级别类型          优先级 2

	                selectedIdList: _selectedDeptIds || null,     //已选节点

	                selectoredNode: $G.Params["selectoredNode"] || null,     //左右选择视图回填数据 格式：[{ Id: 1, ObjType: 0, IncludeChild: 1 },                                 //已选节点 
	                excludeNodeIds: $G.Params["excludeNodeIds"] || null,     //树排除显示的节点

	                queryHidden: false,

	                autoSelectFirstNode: $G.Params["autoSelectFirstNode"] || null, //是否选中第一个节点
	                commonlyObjectVisible: $G.Params["commonlyObjectVisible"] || null, //常用联系部门、用户是否显示

	                includeMapOrg: $G.Params["includeMapOrg"],  //是否显示互信组织
	                showIncChild: $G.Params["showIncChild"] || null,    //是否显示包含下级
	                fullPathColumnHidden: $G.Params["fullPathColumnHidden"] || null, //是否显示全名称
	                onlyDeptUser: $G.Params["onlyDeptUser"] || null, //是否只显示主部门用户
	                showIncSuperAndLowerDept: $G.Params["showIncSuperAndLowerDept"] || null, //是否只显示主部门用户

	                showIncSuperAndLowerDept: $G.Params["showIncSuperAndLowerDept"] || null, //左右选择列表，是否显示含上下级选项
	                isCommonlyUsrGrpSelect: $G.Params["isCommonlyUsrGrpSelect"] || null,     //常用联系人分组是否可以选择
	                dynamicVblePost: $G.Params["dynamicVblePost"] || null,                   //动态控制岗位显示
	                autoSelectUserDept: $G.Params["autoSelectUserDept"] || null,             //是否自动选中当前用户部门
	                //authAndFixNodes: _this._convertStringToBoolean($G.Params["authAndFixNodes"] || false), //值为true：authCode和fixedNodeIds的交集，值为false：只识别一项，优先fixedNodeIds，fixedNodeIds为空，使用权限项authCode

	                //以下参数为应用框架所加
	                height: 400,                                             //缺省高度
	                searchText: $G.Params["matchValue"],                //需要搜的字符串,用于快速参照

	                //如果partTree=false,那么要构建完整组织树，所以上级节点自动带出来。如果onlySelectInCondition为true，那么因构建完整树而显示的上级节点不能选择。如果为false，则可以选择。
	                onlySelectInCondition: _this._convertStringToBoolean($G.Params["onlySelectInCondition"], true),   //单选时，是否只能选择范围内组织。
	                flipFullName: _this._convertStringToBoolean($G.Params["flipFullName"], false)
	            };
	            if (config.onlySelectInCondition == true) {
	                config.authAndFixNodes = true;
	            }
	            else {
	                config.authAndFixNodes = false;
	            }
	            if ((_deployIsRoot == true || _deployIsRoot == 'true') && _direction == "2") config.partTree = true;
	            else config.partTree = false;

	            if (!_fixedNodeIds && _deployDeptId) {
	                _fixedNodeIds = Ext.AppFrame.DeptCommon.getFixedNodes(_deployDeptId, _bizTypeCode, _levelTypeCode, _direction, _deployIsRoot);
	                if (_fixedNodeIds && Ext.isArray(_fixedNodeIds)) {
	                    config.fixedNodeIds = _fixedNodeIds;
	                    var isRoot = false;
	                    for (var i = 0; i < config.fixedNodeIds.length; i++) {
	                        if (!!config.fixedNodeIds[i].Root) {
	                            config.partTree = true;
	                            isRoot = true;
	                            break;
	                        }
	                    }
	                    if (!isRoot) config.partTree = false;
	                }
	            }
	            $G.Page._deptConfig = config;
	        }
	        return $G.Page._deptConfig;
	    },
	    //[End]

	    //[Start]
	    Page_DocumentReady: function () {
	        ///<summary>DocumentReady</summary>
	        //振华提供，解决IE11下调整参照框大小，页面内容没有调整的bug
	        _super.Page_DocumentReady.apply(this, arguments);
	        if (Ext.isIE11) {
	            window.onresize = function () {
	                console.log(window.innerWidth);
	                Ext.getBody().dom.style.width = window.innerWidth + 'px';
	                Ext.getBody().dom.style.height = window.innerHeight + 'px'
	            };
	        }
	        $webAppPath = "/org/";
	        var cfg = $G.Page._getConfig();
	        if (cfg) {
	            $G.Page._selector = (cfg.vt == 0) ? Org.View.OrgTreeSelector.create(cfg) : Org.View.OrgTwoSideSelector.create(cfg);
	            if (cfg.vt == 1 && Ext.isEmpty(cfg.selectoredNode) && !Ext.isEmpty(cfg.selectedIdList)) {
	                var objType = "";
	                if (cfg.selectMode == "Dept") objType = "0";
	                else if (cfg.selectMode == "User") objType = "1";
	                if (objType != "") {
	                    var idList = cfg.selectedIdList.split(',');
	                    cfg.selectoredNode = new Array();
	                    for (var i = 0; i < idList.length; i++) {
	                        cfg.selectoredNode.push({ Id: idList[i], ObjType: objType });
	                    }
	                }
	            }
	            if (cfg.vt == 1 && cfg.selectoredNode) {
	                var nodes = new Array();
	                if (Ext.isArray(cfg.selectoredNode))
	                    nodes = cfg.selectoredNode;
	                else {
	                    var ns = cfg.selectoredNode.split("|");
	                    for (var i = 0; i < ns.length; i++) {
	                        var n = ns[i].split(",");
	                        nodes.push({ Id: n[0], ObjType: n[1] });
	                    }
	                }
	                $G.Page._selector.setSelectedNodes(nodes, false, true);
	            }

	            if (cfg.vt == 0 && !cfg.multiSelect && cfg.onlySelectInCondition) {
	                var setChildNodeDisable = function (node) {
	                    if (node && node.get("permissions") && node.get("permissions").self == false) {
	                        node.getUI().disabled = true;
	                    }
	                };
	                $G.Page._selector.on("appendnodes", function (nodes, store, apptype, initData) {
	                    for (var i = 0; i < nodes.childNodes.length; i++) {
	                        setChildNodeDisable(nodes.childNodes[i]);
	                    }
	                });
	            }
	            var dblclick = function (node) {
	                var cfg = $G.Page._getConfig();
	                if (Ext.isEmpty(node)) {
	                    return;
	                }
	                else if (node && node.data && node.get("permissions") && node.get("permissions").self == false) {
	                    return;
	                }
	                else if ((!cfg.dummyVisible || !cfg.dummySelectAble) && node.get("ObjType") == 0 && node.get("SubType") == 2) {
	                    return;
	                }
	                else if ((!cfg.postVisible || !cfg.postSelectAble) && node.get("ObjType") == 0 && node.get("SubType") == 1) {
	                    return;
	                }
	                else if (cfg.selectMode == "User" && (node.get("ObjType") != 1 || node.get("SubType") != 0)) {
	                    return;
	                }
	                else if (cfg.multiSelect) { //如果为多选模式的话
	                    return;
	                }
	                else {
	                    var id = "Id";
	                    var rid = "RId";
	                    var hid = "HId";
	                    var name = "Name";
	                    var code = "Code";
	                    var subtype = "SubType";
	                    var objtype = "ObjType";
	                    var fullname = "FullName";
	                    var fullid = "FullId";

	                    $G.setReturnValue("OutEntity", {
	                        Id: node.get(id),
	                        RID: node.get(rid),
	                        HId: node.get(hid),
	                        Code: node.get(code),
	                        Name: node.get(name),
	                        Type: node.get(objtype),
	                        SubType: node.get(subtype),
	                        FullID: node.get(fullid),
	                        FullName: node.get(fullname),
	                        EmployeeCode: node.get("Propertys") ? node.get("Propertys")["EmployeeCode"] : "",
	                        Propertys: node.get("Propertys")
	                    });
	                    $G.close(true);
	                }
	            };
	            $G.Page._selector.items.items[0].on("dblclick", dblclick);

	            $G.Page._selector.items.items[1].items.items[1].on("rowdblclick", dblclick);

	            _this._attachOrgTreeToPanel();

	        }
	    },
	    //[End]

	    //[Start]
	    _checkPermission: function (node, deptConfig) {
	        ///<summary></summary>
	        var isPermission = true;
	        if (node.attributes && node.attributes.Id) {
	            var fixedNodeIds = deptConfig.fixedNodeIds;
	            var bizTypeCode = deptConfig.bizTypeCode;
	            var levelTypeCode = deptConfig.levelTypeCode;
	            if (fixedNodeIds && Ext.isArray(fixedNodeIds) && fixedNodeIds.length > 0) {
	                Ext.each(deptConfig.fixedNodeIds, function (fixedNode) {
	                    if (fixedNode) {
	                        if (fixedNode.Id == node.attributes.Id) {
	                            if (node.attributes)
	                                return;
	                        }
	                    }
	                });

	            }
	        }
	        return isPermission;
	    },
	    //[End]

	    //[Start]
	    _attachOrgTreeToPanel: function () {
	        //便于派生类重写
	        var panel1 = $G.getCmp("layoutPanel1");
	        panel1.add($G.Page._selector);
	        panel1.doLayout();
	    },
	    //[End]

	    //[Start]
	    actOK_Handler: function (sender) {
	        ///<summary>确定:actOK</summary>
	        var cfg = $G.Page._getConfig();

	        var re = [];
	        var n = $G.Page._selector.getSelectNodes();
	        if (Ext.isEmpty(n)) {

	            Gtp.net.MessageBox.success(GTP.Org.WebResource.Act_Prompt, String.format(GTP.Org.WebResource.Alt_Select, GTP.Org.WebResource.Cpt_Object));
	            return;
	        }
	        var id = "Id";
	        var rid = "RId";
	        var hid = "HId";
	        var name = "Name";
	        var code = "Code";
	        var subtype = "SubType";
	        var objtype = "ObjType";
	        var fullname = "FullName";
	        var fullid = "FullId";

	        if (cfg.multiSelect) { //如果为多选模式的话
	            var re = [];
	            for (var i = 0; i < n.length; i++) {
	                re.push({ Id: n[i].get(id),
	                    RID: n[i].get(rid),
	                    HId: n[i].get(hid),
	                    Code: n[i].get(code),
	                    Name: n[i].get(name),
	                    Type: n[i].get(objtype),
	                    SubType: n[i].get(subtype),
	                    FullID: n[i].get(fullid),
	                    FullName: n[i].get(fullname),
	                    EmployeeCode: n[i].get("Propertys") ? n[i].get("Propertys")["EmployeeCode"] : "",
	                    Propertys: n[i].get("Propertys")
	                });
	            }
	            $G.setReturnValue("OutEntity", re);
	        } else {
	            $G.setReturnValue("OutEntity", {
	                Id: n[0].get(id),
	                RID: n[0].get(rid),
	                HId: n[0].get(hid),
	                Code: n[0].get(code),
	                Name: n[0].get(name),
	                Type: n[0].get(objtype),
	                SubType: n[0].get(subtype),
	                FullID: n[0].get(fullid),
	                FullName: n[0].get(fullname),
	                EmployeeCode: n[0].get("Propertys") ? n[0].get("Propertys")["EmployeeCode"] : "",
	                Propertys: n[0].get("Propertys")
	            });
	        }
	        $G.close(true);
	    },
	    //[End]

	    //[Start]
	    actCancel_Handler: function (sender) {
	        ///<summary>取消:actCancel</summary>
	        $G.close(false);
	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.Org.DeptLookupBasePage = _class;
})();
//</Bottom>