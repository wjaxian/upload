#Upload上传插件使用说明

/*****************************************

  Title : 文件上传插件

  Author: wujia

  Finish Date : 2017-09-01

 *****************************************/

#提示：插件无任何依赖，使用纯原生js手工打造。任何问题欢迎踊跃提出 ~

说明：PHP接口是本人写的一个测试接口，如项目使用还请慎重！！！
	
	  测试需在服务器环境下运行，否则无法体验完整上传功能的效果。

#插件使用方法：

	第一步：前提需你把upload.js引入项目资源目录内，如：js/目录

	第二步：打开所需上传功能的网页html文件，在head部分引入上方存放的upload.js文件

	第三步：调用有upload.js文件暴露出来的全局方法，Upload()

	第四步: 依照项目要求，填入参数实现上传功能

	参数介绍：

		Upload方法可传入两个参数：

			第一个参数：用来创建上传功能的元素（节点）对象，元素需设置一个ID，然后填把ID值填入到第一参位置即可。

			第二个参数：功能配置项，传入一个JSON对象，按要求配置即可

		配置项详解：

			path  请求地址

			data  往后端传递的参数
				savePath 保存文件的目录名字

			type  请求方式

			addBtnName  添加文件的按钮名字

			uploadBtnName  上传文件的按钮名字

			delIcon   删除已选择文件的图标或按钮名字（可传入字符串式节点）

			autoUpload   是否自动上传

			fileNum      上传文件的数量

			fileSize     上传文件的大小，以MB为单位

			isRepeat     是否可以重复选择文件（false代表不可以）

			fileType     上传文件的类型，以数组方式设置

			showImgList   是否显示缩略图

			uploadSuccess  上传成功的回调函数

			uploadError    上传出错的回调函数

			delImgFn       删除文件前的回调函数


	delImgFn 回调函数的参数说明:

		_this    Upload对象

		parentNode  点击删除按钮的父节点

		delFile   删除文件对象的序列化

		fileSrc	  已选择文件的src，数组存放

		fileList  需上传文件的序列化

		filterFile  是否重复选择的序列化

		index   当前删除图片的索引


	delImg   删除一张图片的函数，内置Upload对象内，需传入delImgFn内的所有参数，为了用户需提示后确认删除




#调用演示：

		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				<title></title>
				<script src="Upload.js"></script>
			</head>
			<body>
				<dev id="uploadimg"></dev>
				<div id="imgBox"></div>
				<script>
				var upload = Upload("imgBox",{
						path:"/upload/upload.php",
			            data:{
			                savePath:"public"
			            },
			            type:"post",
			            addBtnName:"添加图片",
			            uploadBtnName:"上传图片",
			            delIcon:"删除",
			            autoUpload:false,
			            fileNum:5,
			            fileSize:1,
			            isRepeat:false,
			            fileType:['jpg','png','gif','jpeg'],
			            showImgList:true,
			            uploadSuccess:function(results){
							console.log(results)
			            },
			            uploadError:function(xhr,status){
							console.log(status)
			            },
			            delImgFn:function(_this,parentNode,delFile,fileSrc,fileList,filterFile,index){
			                upload.delImg(parentNode,delFile,fileSrc,fileList,filterFile,index);
			            }
					});
			</script>
			</body>
		</html>

