//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseDict");
    var _class = Ext.extend(GTP.AppFrameV2.BaseDict.DictViewPage,
	{
	    //</Top>

        //[Start]
	    _init: function () {
	        _super._init();
	        var ds = $G.DataContext.getDataSource("Dict");
	        ds.on("afteradd", function (rec) {
	            rec.set("Category.ID", parseInt($G.Params.CatId));
	        }, this);
	    }
        //[End]



	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseDict.CategoryDictViewPage = _class;
})();
//</Bottom>