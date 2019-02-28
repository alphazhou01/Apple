<html lang="en">
<head>
    <title id='Description'>In this demo jqxGrid uses a virtualized paging which enables you to handle very large data sets without any impact on client side performance.</title>
    <link rel="stylesheet" href="resources/jqwidgets/styles/jqx.base.css" type="text/css" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1 minimum-scale=1" />	
    <script type="text/javascript" src="resources/scripts/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxcore.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxdata.js"></script> 
    <script type="text/javascript" src="resources/jqwidgets/jqxbuttons.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxscrollbar.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxmenu.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxlistbox.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxdropdownlist.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxgrid.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxgrid.pager.js"></script>
    <script type="text/javascript" src="resources/jqwidgets/jqxgrid.selection.js"></script> 
    <script type="text/javascript" src="resources/scripts/demos.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {            
            // prepare the data
            var data = new Array();

            var firstNames =
            [
                "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene"
            ];

            var lastNames =
            [
                "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier"
            ];

            var productNames =
            [
                "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Cramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist"
            ];

            var priceValues =
            [
                "2.25", "1.5", "3.0", "3.3", "4.5", "3.6", "3.8", "2.5", "5.0", "1.75", "3.25", "4.0"
            ];

            //generate sample data.
            var generatedata = function (startindex, endindex) {
                var data = {};
                for (var i = startindex; i < endindex; i++) {
                    var row = {};
                    var productindex = Math.floor(Math.random() * productNames.length);
                    var price = parseFloat(priceValues[productindex]);
                    var quantity = 1 + Math.round(Math.random() * 10);

                    row["id"] = i;
                    row["firstname"] = firstNames[Math.floor(Math.random() * firstNames.length)];
                    row["lastname"] = lastNames[Math.floor(Math.random() * lastNames.length)];
                    row["productname"] = productNames[productindex];
                    row["price"] = price;
                    row["quantity"] = quantity;
                    row["total"] = price * quantity;

                    data[i] = row;
                }
                return data;
            }

            var source =
            {
                datatype: "array",
                localdata: {},
                totalrecords: 1000000
            };

            // load virtual data.
            var rendergridrows = function (params) {
                var data = generatedata(params.startindex, params.endindex);
                return data;
            }

            var totalcolumnrenderer = function (row, column, cellvalue) {
                var cellvalue = $.jqx.dataFormat.formatnumber(cellvalue, 'c2');
                return '<span style="margin: 6px 3px; font-size: 12px; float: right; font-weight: bold;">' + cellvalue + '</span>';
            }

            var dataAdapter = new $.jqx.dataAdapter(source);

            $("#grid").jqxGrid(
            {
                width: getWidth('Grid'),
                autoheight: true,
                source: dataAdapter,                
                virtualmode: true,
                pageable: true,
                rendergridrows: rendergridrows,
                columns: [
                    { text: 'Id', datafield: 'id', width: 50 },
                    { text: 'First Name', datafield: 'firstname', width: 120 },
                    { text: 'Last Name', datafield: 'lastname', width: 120 },
                    { text: 'Product', datafield: 'productname', width: 180 },
                    { text: 'Quantity', datafield: 'quantity', width: 100, cellsalign: 'right' },
                    { text: 'Unit Price', datafield: 'price', width: 100, cellsalign: 'right', cellsformat: 'c2' },
                    { text: 'Total', datafield: 'total', cellsrenderer: totalcolumnrenderer, cellsalign: 'right' }
                ]
            });
        });
    </script>
</head>
<body class='default'>
        <div id="grid"></div>
</body>
</html>