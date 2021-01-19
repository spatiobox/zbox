
<%@ Page Title="" Language="C#" MasterPageFile="~/Templets/Default/index.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>


<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <div class="main">
        <!--#include file="topNav.aspx"-->
        
        
        <div style="margin: 40px 120px;" class="upfile">
            <div id="fileQueue">
            </div>
            <input type="hidden" id="rollpic" />
            <input type="file" name="uploadify" id="uploadify" />
            <div class="paperfile" style="width: 240px; float: left;">
            </div>
            <div style="text-align: right;">
                <input type="button" value="保存并返回" class="btn btnSave" />
                <input type="button" value="下一步" class="btn btnNext" />
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        .main
        {
            margin-top: 50px;
        }
        
        .div_mune
        {
            width: 120px;
            height: 25px;
            text-align: center;
            font-size: 12px;
            line-height: 25px;
            overflow: hidden;
        }
        
        .tag1
        {
            background-image: url('../../images/paper/1.jpg');
            color: #FFF;
        }
        .tag2
        {
            background-image: url('../../images/paper/2.jpg');
        }
        .tag3
        {
            background-image: url('../../images/paper/3.jpg');
        }
        .tag4
        {
            background-image: url('../../images/paper/4.jpg');
            color: #FFF;
        }
        
        
        .fl
        {
            float: left;
        }
        
        .btn
        {
            height: 30px;
            width: 110px;
            cursor: pointer;
            display: none;
        }
        
        .uploadify-queue
        {
            border: 1px solid #666;
            background-color: #EEE;
            width: 400px;
            min-height: 300px;
        }
        .uploadify-queue-item
        {
            margin-left: 5px;
            margin-top: 10px;
        }
    </style>
    <link href="../../Js/uploadify-v3.1/uploadify.css" rel="stylesheet" type="text/css" />
    <link href="/js/uploadifive/uploadifive.css" rel="stylesheet" type="text/css" />
    <script src="../../Js/uploadify-v3.1/jquery-1.4.1-vsdoc.js" type="text/javascript"></script>
    <script src="../../Js/uploadify-v3.1/jquery.uploadify-3.1.js" type="text/javascript"></script>
    <script src="/js/uploadifive/jquery.uploadifive.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {


            setNavStyle(4);

            $('.logo_bar').css("display", "none");


            var flag = getUrlParam("flag");
            if (flag == null || flag == "") {
                $('.btnNext').css("display", "inline");
            } else {
                $('.btnSave').css("display", "inline");
            }

            
			$('#uploadify').uploadifive({
				'auto'             : true,
				//'checkScript'      : 'check-exists.php',
				// 'fileType'         : 'image/png',
                'fileType': 'application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf',
                'formData': { 'someKey': getUrlParam("author") },
				//'queueID'          : 'queue',
                'buttonText': $.mymova.upload_papers || '上传论文',
                'fileTypeExts': '*.pdf; *.doc; *.docx;*.ppt',
				'uploadScript'     : '/js/uploadify-v3.1/uploadfile.ashx',
				'onUploadComplete' :  function (file, data, response) {
                    var _filename = $('#rollpic').val();
                    if (_filename != "" && _filename != null) {
                        _filename = _filename + ",";
                    }
                    var _arry = file.name.split('.');

                    //累加
                    _filename = _filename + _arry[0] + '_' + getUrlParam('author') + '.' + _arry[1] + '&nbsp;&nbsp;' + parseInt(file.size / 1024) + "KB";
                    $('#rollpic').val(_filename);
                }
			});

            /*$("#uploadify").uploadify({
                //指定swf文件
                'swf': '../../Js/uploadify-v3.1/uploadify.swf',
                //后台处理的页面
                'uploader': '../../Js/uploadify-v3.1/uploadfile.ashx',
                //按钮显示的文字
                'buttonText': '上传论文',
                //显示的高度和宽度，默认 height 30；width 120
                //'height': 15,
                //'width': 80,
                //上传文件的类型  默认为所有文件    'All Files'  ;  '*.*'
                //在浏览窗口底部的文件类型下拉菜单中显示的文本
                'fileTypeDesc': 'Files',
                //允许上传的文件后缀
                'fileTypeExts': '*.pdf; *.doc; *.docx;*.ppt',

                //设置上传完成后是否显示进度条
                'removeCompleted': false,
                //发送给后台的其他参数通过formData指定
                'formData': { 'someKey': getUrlParam("author") },
                //上传文件页面中，你想要用来作为文件队列的元素的id, 默认为false  自动生成,  不带#
                //'queueID': 'fileQueue',
                //选择文件后自动上传
                'auto': true,
                //设置为true将允许多文件上传
                'multi': true,
                'onUploadSuccess': function (file, data, response) {
                    var _filename = $('#rollpic').val();
                    if (_filename != "" && _filename != null) {
                        _filename = _filename + ",";
                    }
                    var _arry = file.name.split('.');

                    //累加
                    _filename = _filename + _arry[0] + '_' + getUrlParam('author') + '.' + _arry[1] + '&nbsp;&nbsp;' + parseInt(file.size / 1024) + "KB";
                    $('#rollpic').val(_filename);
                } //当单个文件上传成功后激发的事件
            });*/

            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]); return null; //返回参数值
            }


            $('.btnSave').click(function () {
                sava_file();
            });

            $('.btnNext').click(function () {
                sava_file();
            });

            $('.paperfile .deletefile').live("click", function () {
                alert($(this).attr('data'));
            });

            function sava_file() {
                var _filename = $('#rollpic').val();
                var _id = getUrlParam("author");
                if (_filename == null || _filename == "") {
                    alert("请选择文件");
                    return;
                } else {

                    $.ajax({
                        url: '<%= Url.Action("SaveFile") %>',
                        data: { 'id': (_id), 'filename': (_filename) },
                        dataType: 'post',
                        success: function (d) {
                            if (d) {
                                window.location.href = "Preview?author=" + _id;
                            }
                            else {
                                alert(d);
                            }
                        }
                    });
                }
            }

            deletefile();

            function deletefile() {
                var _id = getUrlParam("author");
                $.ajax({
                    url: '<%= Url.Action("DeleteFile") %>',
                    data: { 'id': (_id), 'aid': (getUrlParam('author')) },
                    dataType: 'post',
                    success: function (d) {
                        //
                    }
                });
            }

        });


    </script>
</asp:Content>
