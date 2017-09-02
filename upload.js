/*****************************************
  Title : 文件上传插件
  Author: wujia
  Finish Date : 2017-09-01
 *****************************************/

;(function(win,dom){
    function Upload(id,config){
        this.oWrap = dom.querySelector("#"+id);
        this.init();
        this.fileList = [];
        this.fileSrc = [];
        this.fileRepeat = [];
        var _this = this;
        this.imgNum = 0;
        this.filterFile = [];
        this.addNum = 0;
        this.delFile = [];

        //传进来的参数覆盖默认参数
        for(var i in config) {
            if(config.hasOwnProperty(i)) {
                this.config[i] = config[i];
            };
        };

        !this.config.autoUpload&&this.uploadBtn();

        //添加文件
        this.oFile.addEventListener("change",function(){
            _this.addUploadImg(this,_this);
        });

        //上传事件
        this.oUploadBtn&&(this.oUploadBtn.addEventListener("click",function(){
            _this.startUpload();
        }));

        //文件删除操作
        this.oImgBox.addEventListener("click",function(ev){
            var target = ev.target;
            var delImgBtn = this.querySelectorAll(".delimg-btn");
            for(var i = 0;i<delImgBtn.length;i++){
                if(target.getAttribute("index")===delImgBtn[i].getAttribute("index")){
                    var parentNode = delImgBtn[i].parentNode;
                    var index = i;
                    if(_this.config.delImgFn){
                        _this.config.delImgFn(_this,parentNode,_this.delFile,_this.fileSrc,_this.fileList,_this.filterFile,index);
                        return false;
                    }
                    _this.delFile.splice(index,1);
                    _this.fileSrc.splice(index,1);
                    _this.filterFile.splice(index,1);
                    parentNode.parentNode.removeChild(parentNode);
                    _this.delFile.forEach(function(item){
                        _this.fileList.push(item);
                    });
                }
            }
        });
    }

    Upload.prototype = {
        //初始化
        init:function(){
            this.oBtnBox = this.createNode("div","upload-btn-box",false,this.oWrap);
            this.oImgBox = this.createNode("div","upload-img-box",false,this.oWrap);
            this.inputFile();
        },

        //参数配置项
        config:{
            path:"",//请求的地址
            data:{//往后台传递的参数
                savePath:"public",
                img:"1"
            },
            type:"post",//请求方式
            addBtnName:"添加图片",//添加文件按钮名字
            uploadBtnName:"上传图片",//上传文件按钮名字
            delIcon:"删除",//删除已选择文件的图标或按钮名字
            autoUpload:false,//是否自动上传
            fileNum:5,//上传文件数量
            fileSize:1,//上传文件的大小，以MB为单位
            isRepeat:false,//是否可以重复选择文件
            fileType:['jpg','png','gif','jpeg'],//上传文件的类型
            showImgList:true,//是否显示缩略图
            uploadSuccess:function(results){//上传成功的回调

            },
            uploadError:function(xhr,status){
                console.log(status)
                //上传出错的回调
            },
            delImgFn:function(_this,parentNode,delFile,fileSrc,fileList,filterFile,index){
                //删除文件前的回调
                //下方是删除图片的操作，如需弹窗确定，可在本处执行并复制下列代码至确定事件内
                _this.delImg(parentNode,delFile,fileSrc,fileList,filterFile,index);
            }
        },

        //上传方法
        startUpload:function(){
            if(this.filterFile.length<1){
                //alert("请选择文件后再上传");
                return false;
            };
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            var _this = this;
            var datas = '?';
            for(var data in this.config.data){
                datas += (data+"="+ this.config.data[data]+"&");
            };
            datas = datas.replace(/&$/,"");

            this.fileList.forEach(function(item,i){
                formData.append('file'+i,item);
                //_this.filterFile.push(item);
            });
            //console.log(_this.fileList,_this.filterFile)
            xhr.open(this.config.type,this.config.path+datas,true);
            xhr.send(formData);
            xhr.onreadystatechange=function(){
                if (xhr.readyState == 4) {
                    if (xhr.status>=200 &&xhr.status<300||xhr.status==304) {
                         var data = JSON.parse(xhr.responseText);
                         _this.config.uploadSuccess&&_this.config.uploadSuccess(data);
                         _this.fileList = [];
                         formData = null;
                    }else{
                        _this.config.uploadError&&_this.config.uploadError(xhr,xhr.status);
                    }
                }
            };
        },

        //添加文件方法
        addUploadImg:function(_self,_this){
            _this.imgNum +=_self.files.length;

            if((_this.fileList.length+1)>_this.config.fileNum||_this.imgNum>_this.config.fileNum||_this.oImgBox.children.length>_this.config.fileNum){
                alert('对不起，最多只能上传'+_this.config.fileNum+'张图片，您可以删除几张后重新选择！');
                _this.oFile.value = "";
                _this.imgNum = _this.oImgBox.children.length;
                return false;
            }else if(_self.files.length!=0){
                    var str='';
                    var isSize = 0;
                    for(var i = 0;i<_self.files.length;i++){

                            if(!_this.config.fileSize){
                                addFile(_self.files,i,isSize,str);
                            }else{
                                if(_self.files[i].size>(_this.config.fileSize*1048576)){
                                    isSize = 1;
                                }else{
                                    addFile(_self.files,i,isSize,str);
                                }
                            };

                            function addFile(_self,i,isSize,str){
                                var regTxt = _this.config.fileType.join(",");
                                if(new RegExp(_self[i].name.split(".")[1],"i").test(regTxt)){
                                    var src= window.URL.createObjectURL(_self[i]);
                                    if(!_this.config.isRepeat){
                                        var isRepeat = false;
                                        for(var j = 0; j < _this.filterFile.length; j++){
                                            var name = _this.filterFile[j].name;
                                            if(name == _self[i].name){
                                                isRepeat = true;
                                                alert("请不要选择重复文件！")
                                                break;
                                            }
                                        };
                                        if(!isRepeat){
                                            _this.fileList.push(_self[i]);
                                            _this.fileSrc.push(src);
                                            _this.filterFile.push(_self[i]);
                                            _this.delFile.push(_self[i]);
                                        }
                                    }else{
                                        _this.fileList.push(_self[i]);
                                        _this.fileSrc.push(src);
                                        _this.delFile.push(_self[i]);
                                    }
                                }else{
                                    alert("你选择的第"+(i+1)+"个文件格式不对！");
                                };
                            };

                        isSize&&(alert("您选择的文件大于"+_this.config.fileSize+"MB"));
                    }
                    console.log(_this.delFile);

                    //自动上传
                    _this.config.autoUpload&&_this.startUpload();
                    _this.oFile.value = "";

            };

            _this.config.showImgList&&_this.addImgList(_this.fileSrc);
        },

        //删除图片的回调
        delImg:function(parentNode,delFile,fileSrc,fileList,filterFile,index){
            delFile.splice(index,1);
            fileSrc.splice(index,1);
            filterFile.splice(index,1);
            parentNode.parentNode.removeChild(parentNode);
            delFile.forEach(function(item){
               fileList.push(item);
            });
            console.log(fileList,delFile,fileSrc);
        },

        //图片缩略图方法
        addImgList:function(fileSrc){
            var _this = this;
            _this.oImgBox.innerHTML = "";
            fileSrc.forEach(function(item,index){
                _this.oUploadImgItem = _this.createNode("div","upload-img-item",false,_this.oImgBox);
                _this.oDelBtn = _this.createNode("span","delimg-btn",false,_this.oUploadImgItem,_this.config.delIcon);
                _this.oDelBtn.setAttribute("index",index);
                var oImg = _this.createElement("img");
                oImg.src = item;
                _this.oUploadImgItem.appendChild(_this.oDelBtn);
                _this.oUploadImgItem.appendChild(oImg);
            });
            _this.imgNum = _this.oImgBox.children.length;
        },

        //多形式元素动态创建方法
        createNode:function(createElement,className,children,parentNode,txt){
            className = className||"";
            txt = txt||"";
            this.oImgWrap = this.createElement(createElement);
            this.oImgWrap.className = className;
            this.oImgWrap.innerHTML = txt;
            children&&this.oImgWrap.appendChild(children);

            if(parentNode){
                parentNode.appendChild(this.oImgWrap);
            }

            return this.oImgWrap;
        },

        //创建file对象方法
        inputFile:function(){
            this.oFile = this.createElement("input");
            this.oFile.name = "file";
            this.oFile.multiple="multiple";
            this.oFile.type = "file";
            this.oFile.accept = "image/png, image/jpeg, image/gif, image/jpg";
            this.createNode("div","upload-addimg-btn",this.oFile,this.oBtnBox,this.config.addBtnName);
        },

        //创建上传图片按钮方法
        uploadBtn:function(){
            this.oUploadBtn = this.createElement("input");
            this.oUploadBtn.type = "button";
            this.oUploadBtn.value = this.config.uploadBtnName
            this.createNode("div","upload-addimg-btn",this.oUploadBtn,this.oBtnBox);
        },

        //创建元素方法
        createElement:function(elementName){
            return document.createElement(elementName);
        }
    };

    win.Upload = function(id,config){
        return new Upload(id,config);
    }
}(window?window:this,document));
