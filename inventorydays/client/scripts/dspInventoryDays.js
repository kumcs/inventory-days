include("inventoryDays");

var _month1;
var _month2;
var _month3;
var _hdr = "Sales ";

mywindow.setWindowTitle(qsTr("Inventory Days of Sales"));
mywindow.setListLabel(qsTr("Inventory Days"));

//mywindow.setUseAltId(true);

// Specifiy which query to use
mywindow.setMetaSQLOptions('inventoryDays','detail');
 
// Set automatic query on start
mywindow.setQueryOnStartEnabled(false);
 
// Make the search visible/ not visible
mywindow.setSearchVisible(false);

// Set the Report
mywindow.setReportName("InventoryDays");

// Get Month Headings
var _sql = "SELECT to_char((current_date - INTERVAL '1 mon')::date, 'Mon-YYYY') as month1, "
	+ " to_char((current_date - INTERVAL '2 mon')::date, 'Mon-YYYY') as month2, "
	+ " to_char((current_date - INTERVAL '3 mon')::date, 'Mon-YYYY') as month3 "
var data = toolbox.executeQuery(_sql, new Object());
if (data.first())
 {
   _month1 = _hdr + data.value("month1");
   _month2 = _hdr + data.value("month2");
   _month3 = _hdr + data.value("month3");
 }

// Add in the columns
var _list = mywindow.list();

if (metrics.value("MultiWhs") == 't')
  _list.addColumn(qsTr("Site"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "warehous_code");
_list.addColumn(qsTr("Class Code"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "classcode_code");
_list.addColumn(qsTr("Item Number"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "item_number");
_list.addColumn(qsTr("Item Description"), -1, Qt.AlignLeft, true, "item_descrip1");
_list.addColumn(_month3, XTreeWidget.qtyColumn, Qt.AlignRight, true, "month3_qty");
_list.addColumn(_month2, XTreeWidget.qtyColumn, Qt.AlignRight, true, "month2_qty");
_list.addColumn(_month1, XTreeWidget.qtyColumn, Qt.AlignRight, true, "month1_qty");
_list.addColumn(_hdr + qsTr("MTD"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "current_month_qty");
_list.addColumn(qsTr("QOH"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "qoh");
_list.addColumn(qsTr("On Order"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "qtyonorder");
if (privileges.check("ViewInventoryValue"))
  _list.addColumn(qsTr("Inventory Value"), XTreeWidget.moneyColumn, Qt.AlignRight, true, "inventory_value");
_list.addColumn(qsTr("Inventory Days"), -1, Qt.AlignRight, true, "inventorydays");

// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);

var sql = "SELECT classcode_id, classcode_code||' - '||classcode_descrip FROM classcode";

mywindow.parameterWidget().appendComboBox(qsTr("Class Code"), "classcode", sql,null,false,null); 
mywindow.parameterWidget().append(qsTr("Item"), "item_id",   ParameterWidget.Item);
mywindow.parameterWidget().append(qsTr("Cutoff Date"), "cutoff",   ParameterWidget.Date);
mywindow.parameterWidget().append(qsTr("Show Obsolete"), "showObsolete",   ParameterWidget.Exists);
