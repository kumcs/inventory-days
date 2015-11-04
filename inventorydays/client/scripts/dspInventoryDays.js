include("inventoryDays");

var _month = new Array();
var _hdr = "Sales ";

mywindow.setWindowTitle(qsTr("Inventory Days of Sales"));
mywindow.setListLabel(qsTr("Inventory Days"));
mywindow.setMetaSQLOptions('inventoryDays','detail');
mywindow.setQueryOnStartEnabled(false);
mywindow.setSearchVisible(false);
mywindow.setReportName("InventoryDays");

//mywindow.setUseAltId(true);

// Get Month Headings
for (var i = 1; i < 13; i++)
{
  var _sql = "SELECT to_char((current_date - INTERVAL '"+ i +" mon')::date, 'Mon-YYYY') as month;";
  var data = toolbox.executeQuery(_sql, {});
  if (data.first())
    _month[i] = _hdr + data.value("month");
}

// Add in the columns
var _list = mywindow.list();

if (metrics.value("MultiWhs") == 't')
  _list.addColumn(qsTr("Site"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "warehous_code");
_list.addColumn(qsTr("Class Code"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "classcode_code");
_list.addColumn(qsTr("Item Number"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "item_number");
_list.addColumn(qsTr("Item Description"), -1, Qt.AlignLeft, true, "item_descrip1");
_list.addColumn(qsTr("ABC Class"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "itemsite_abcclass");
_list.addColumn(_month[3], XTreeWidget.qtyColumn, Qt.AlignRight, true, "month3_qty");
_list.addColumn(_month[2], XTreeWidget.qtyColumn, Qt.AlignRight, true, "month2_qty");
_list.addColumn(_month[1], XTreeWidget.qtyColumn, Qt.AlignRight, true, "month1_qty");
_list.addColumn(_hdr + qsTr("MTD"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "current_month_qty");
_list.addColumn(qsTr("QOH"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "qoh");
_list.addColumn(qsTr("On Order"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "qtyonorder");
if (privileges.check("ViewInventoryValue"))
  _list.addColumn(qsTr("Inventory Value"), XTreeWidget.moneyColumn, Qt.AlignRight, true, "inventory_value");
_list.addColumn(qsTr("Inventory Days"), -1, Qt.AlignRight, true, "inventorydays");

// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);

var sql = "SELECT classcode_id, classcode_code||' - '||classcode_descrip FROM classcode";
var abcSql = "SELECT 'A', '" + qsTr("A Class") + "' UNION "
           + "SELECT 'B', '" + qsTr("B Class") + "' UNION "
           + "SELECT 'C', '" + qsTr("C Class") + "' ORDER BY 1;";

mywindow.parameterWidget().appendComboBox(qsTr("Class Code"), "classcode", sql,null,false,null); 
mywindow.parameterWidget().append(qsTr("Item"), "item_id",   ParameterWidget.Item);
mywindow.parameterWidget().append(qsTr("Cutoff Date"), "cutoff",   ParameterWidget.Date);
mywindow.parameterWidget().append(qsTr("Show Obsolete"), "showObsolete",   ParameterWidget.Exists);
mywindow.parameterWidget().append(qsTr("Show 12 Months History"), "show12months", ParameterWidget.Exists);
mywindow.parameterWidget().append(qsTr("ABC Class"), "abc_class", ParameterWidget.Multiselect, null, false, abcSql);

function inventoryDaysQuery()
{
// If "Show 12 Months" is selected we have to add list columns
  var params = mywindow.parameterWidget().parameters();
  _list.setColumnCount(0);
  _colCount = (params.show12months) ? 12 : 3;
  
  with (_list)
  {
    if (metrics.value("MultiWhs") == 't')
      addColumn(qsTr("Site"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "warehous_code");
    addColumn(qsTr("Class Code"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "classcode_code");
    addColumn(qsTr("Item Number"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "item_number");
    addColumn(qsTr("Item Description"), -1, Qt.AlignLeft, true, "item_descrip1");
    addColumn(qsTr("ABC Class"), XTreeWidget.itemColumn, Qt.AlignLeft, true, "itemsite_abcclass");
    for (var i = _colCount; i > 0; i--)
    {
      var _col = "month" + i + "_qty";
      addColumn(_month[i], XTreeWidget.qtyColumn, Qt.AlignRight, true, _col);
    }
    addColumn(_hdr + qsTr("MTD"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "current_month_qty");
    addColumn(qsTr("QOH"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "qoh");
    addColumn(qsTr("On Order"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "qtyonorder");
    if (privileges.check("ViewInventoryValue"))
      addColumn(qsTr("Inventory Value"), XTreeWidget.moneyColumn, Qt.AlignRight, true, "inventory_value");
    addColumn(qsTr("Inventory Days"), -1, Qt.AlignRight, true, "inventorydays");  
  }
  mywindow.sFillList();
}

toolbox.coreDisconnect(mywindow.queryAction(), "triggered()", mywindow, "sFillList()");
mywindow.queryAction().triggered.connect(inventoryDaysQuery);

