//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.Org");
    var _class = Ext.extend(GTP.AppFrameV2.Org.DeptLookupBasePage,
	{
	    //</Top>

        //[Start]
        _getConfig: function () {
	        var config = _super._getConfig();
	        config.userAuthCode = $G.Params["userAuthCode"];
	        config.selectMode = "User";
	        return config;
	    }
        //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.Org.UserLookupPage = _class;
})();
//</Bottom>