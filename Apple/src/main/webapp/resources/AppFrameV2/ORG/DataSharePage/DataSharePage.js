//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.Org");
    var _class = Ext.extend(GTP.AppFrameV2.Org.DeptLookupBasePage,
	{
	    //</Top>

	    //[Start]
	    _GetShareType: function () {

	        var shareType = $G.Params["ShareType"]; //2表示下发，1表示上报
	        if (Ext.isEmpty(shareType) || shareType == "0") {
	            shareType = "3";
	        }
	        return shareType;
	    },
	    //[End]


	    //[Start]
	    _getConfig: function () {
	        if ($G.Params.dataSourceType == undefined || $G.Params.EntityID == undefined || $G.Params.ShareType == undefined) {
	            Gtp.net.MessageBox.info("提示", "缺少参数:dataSourceType或者EntityID或者ShareType");
	            return;
	        }
	        if ($G.Params.title) document.title = $G.Params.title;
	        var selectoredNode = $G.Params["selectoredNode"] || null; // [{ Id: 1002, ObjType: 0, IncludeChild: 0}];
	        var ShareType = _this._GetShareType();

	        if (Ext.isEmpty(selectoredNode)) {
	            Gtp.net.Global.dispatcher({
	                controller: Gtp.net.Global.getPageController(),
	                async: false,
	                action: "GetPermissionOrgUnits",
	                args: [$G.Params.dataSourceType, $G.Params.EntityID, ShareType],
	                success: function (result) {
	                    selectoredNode = result;
	                },
	                failure: function () {
	                    return;
	                }
	            });
	        }

	        if (ShareType == 2) {
	            $G.Params["direction"] = "2";
	        }
	        else if (ShareType == 1) {
	            $G.Params["direction"] = "0";
	        } else {
	            $G.Params["deployFrame"] = false;
	        }

	        var config = _super._getConfig();
	        if (config) {
	            config.selectoredNode = selectoredNode; //已选节点 
	        }
	        return config;

	    },
	    //[End]

	    //[Start]
	    actOK_Handler: function (sender) {

	        var re = [];
	        var nodes = $G.Page._selector.getSelectNodes();
	        //  if (Ext.isEmpty(nodes)) {
	        //     Gtp.net.MessageBox.success(GTP.Org.WebResource.Act_Prompt, String.format(GTP.Org.WebResource.Alt_Select, GTP.Org.WebResource.Cpt_Object));
	        //     return;
	        //  }
	        var pers = [];
	        Ext.each(nodes, function (n) {
	            pers.push({
	                OrgUnitID: n.get('Id'),
	                OrgUnitType: n.get('ObjType'),
	                OrgUnitCode: n.get('FullId'),
	                TargetID: $G.Params.EntityID,
	                TargetEntityFullName: $G.Params.dataSourceType, //注意需要在服务端进行转换..
	                ContainType: 1 //
	            });
	        });
	        Gtp.net.Global.dispatcher({
	            controller: Gtp.net.Global.getPageController(),
	            async: false,
	            action: "RegPermission",
	            args: [pers, _this._GetShareType(), $G.Params.dataSourceType, [$G.Params.EntityID]],
	            success: function (result) {
	                window.returnValue = result;
	                window.close();
	            },
	            failure: function () {

	            }
	        });

	    }
	    //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.Org.DataSharePage = _class;
})();
//</Bottom>