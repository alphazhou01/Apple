<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserFilesUploadDialog.aspx.cs"
    Inherits="GTP.Services.FileService.UserFiles.UserFilesUploadDialog" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <base target="_self" />
    <title>上传</title>
    <link href="css/dialog.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="js/UserFilesUpload.js"></script>
    <script type="text/javascript">
        function btnSubmitClick() {
            if (document.getElementById("FileData1").value == "") {
                alert("请选择要上传的文件！");
                return;
            }

            if (UFU_ProcessBeforeFormSubmit(document.getElementById("form1")))
                document.getElementById("form1").submit();
        }
        function btnCancelClick() {
            if (parent && parent.UFU_UploadFrameCancel)
                parent.UFU_UploadFrameCancel();
            if (opener && opener.UFU_UploadDialogCancel) {
                opener.UFU_UploadDialogCancel();
            }
            else
                window.close();
        }
    </script>
</head>
<body>
    <form id="form1" runat="server" method="post" enctype="multipart/form-data" onsubmit="javascript: return UFU_ProcessBeforeFormSubmit(this);">
    <div id="div_form">
        <table style="table-layout: fixed">
            <tr id="trTop">
                <td width="80">
                    &nbsp;
                </td>
                <td width="400">
                </td>
            </tr>
            <tr id="trFile">
                <td>
                    &nbsp;&nbsp;上传文件：
                </td>
                <td>
                    <input id="FileData1" name="FileData1" type="file" style="width: 95%" />
                </td>
            </tr>
            <tr id="trBreak">
                <td colspan="2">
                    &nbsp;
                </td>
            </tr>
            <tr id="trButton">
                <td colspan="2" align="center">
                    <input id="btnSubmit" type="button" value="上传" onclick="btnSubmitClick();" />
                    &nbsp;&nbsp;&nbsp;<input id="btnCancel" type="button" value="取消" onclick="btnCancelClick();" />
                </td>
            </tr>
            <tr id="trBottom">
                <td colspan="2">
                </td>
            </tr>
        </table>
        <input id="successUrl" name="successUrl" type="hidden" value="UserFilesUploadDialogResult.htm" />
        <input id="failUrl" name="failUrl" type="hidden" value="UserFilesUploadDialogResult.htm" />
        <asp:HiddenField ID="destDir" runat="server" />
        <asp:HiddenField ID="key" runat="server" />
        <asp:HiddenField ID="destFilename" runat="server" />
        <asp:HiddenField ID="overWrite" runat="server" />
        <asp:HiddenField ID="DialogType_80363B9A5231433EB63943337B32A63" runat="server" />
    </div>
    </form>
</body>
</html>
