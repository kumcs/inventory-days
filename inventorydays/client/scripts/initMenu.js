var inventoryReportsMenu = mainwindow.findChild("menu.im.reports");

function sInventoryDays()
{
  toolbox.newDisplay("dspInventoryDays");
}

tmpaction = inventoryReportsMenu.addAction(qsTr("Inventory Days..."));
tmpaction.objectName = "in.inventorydays";
tmpaction.setData("ViewInventoryHistory");
tmpaction.enabled = privileges.value("ViewInventoryHistory");
tmpaction.triggered.connect(sInventoryDays);
inventoryReportsMenu.removeAction(tmpaction);
inventoryReportsMenu.insertAction(mainwindow.findChild("im.dspItemUsageStatistics"), tmpaction);