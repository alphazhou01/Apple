//<Top>
/// <reference name="GTP.Runtime.WebControls.Build.Gtp.Net.gtpnet.gtpnet-intellisense.js" assembly="GTP.Runtime.WebControls" />
(function () {
    Ext.ns("GTP.AppFrameV2.BaseBill");
    var _class = Ext.extend(GTP.AppFrameV2.BaseBill.BillEditPage,
	{
	    //</Top>

	    //[Start]
	    _init: function () {
	        ///<summary>页面初始化，发生在加载数据之前</summary>
	        _super._init();

	        var ds = $G.DataContext.getDataSource("Bill");

	        //初始化数据..
	        ds.on("afteradd", function (record) {
	            record.set("Category.ID", $G.Params.categoryId);
	            record.set("Category.Name", $G.Params.CategoryName);
	        });
	    }
	    //[End]
	    //<Bottom>
	});
    var _self = _class.prototype;
    var _super = _class.superclass;
    GTP.AppFrameV2.BaseBill.CategoryBillEditPage = _class;
})();
//</Bottom>