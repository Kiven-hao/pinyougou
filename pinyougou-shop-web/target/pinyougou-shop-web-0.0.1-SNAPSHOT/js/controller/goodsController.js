 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
	$scope.itemCatList=[];//商品分类列表
	//查询出所有的商品分类
	$scope.findItemCatList=function(){
		itemCatService.findAll().success(
			function(response){
				for(var i=0;i<response.length;i++) {
					$scope.itemCatList[response[i].id]=response[i].name;
				}
			}
		);
	}
	
	//设置商品状态数组
	$scope.status=['未审核','已审核','审核未通过','关闭'];
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
		var id= $location.search()['id'];//获取参数值
		if(id==null){
			return ;
		}
		goodsService.findOne(id).success(
				function(response){
					$scope.entity= response;
					
					editor.html($scope.entity.goodsDesc.introduction );//商品介绍 
					//商品图片
					$scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
					//扩展属性
					if($location.search()['id']==null){
					$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.entity.goodsDesc.customAttributeItems);
				}
					//规格选择
					$scope.entity.goodsDesc.specificationItems= JSON.parse($scope.entity.goodsDesc.specificationItems);
					for(var i=0;i< $scope.entity.itemList.length;i++ ){
						$scope.entity.itemList[i].spec=  JSON.parse($scope.entity.itemList[i].spec);					
					}
			}
		);				
	}
	
	//根据规格名称和选项名称判断是否是勾选
	$scope.checkAttributeValue=function(specName,optionName){
		var items= $scope.entity.goodsDesc.specificationItems;
		var object=$scope.searchObjectByKey(items,'attributeName',specName);
		if(object==null) {
			return false;
		}else{
			if(object.attributeValue.indexOf(optionName)>=0) {
				return true;
			}else{
				return false;
			}
		}
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	$scope.add=function(){
		$scope.entity.goodsDesc.introduction=editor.html();
		goodsService.add($scope.entity).success(
				function(response){
					if(response.success) {
						alert("保存成功");
						$scope.entity={};
						editor.html('');//清空富文本编辑器
					}else{
						alert(response.message);
					}
				}
			);
	}
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(
			function(response){
				if(response.success){
					$scope.image_entity.url= response.message;
				}else{
					alert(response.message);					
				}
			}		
		);
	}
	
	
	$scope.entity={goods:{},goodsDesc:{itemImages:[]}};//定义页面实体结构
	//添加图片列表
	$scope.add_image_entity=function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);			
	}
	
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}
	
	$scope.selectItemCat1List=function(){
		itemCatService.findByParentId(0).success(
				function(response){
					$scope.itemCat1List=response;
				}
			);
	}
	//给category1Id绑定动态监测,一旦其值发生改变,调用方法
	$scope.$watch('entity.goods.category1Id',function(newValue,oldValue){
		//alert(newValue);
		itemCatService.findByParentId(newValue).success(
			function(response){
				$scope.itemCat2List=response;
			}
		)
	})
	$scope.$watch('entity.goods.category2Id',function(newValue,oldValue){
		itemCatService.findByParentId(newValue).success(
			function(response){
				$scope.itemCat3List=response;
			}
		)
	})
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue){
		itemCatService.findOne(newValue).success(
			function(response){
				$scope.entity.goods.typeTemplateId=response.typeId;
			}
		)
	})
	$scope.$watch('entity.goods.typeTemplateId',function(newValue,oldValue){
		typeTemplateService.findOne(newValue).success(
			function(response){
				$scope.typeTemplate=response;// 模板对象 
								
				$scope.typeTemplate.brandIds= JSON.parse($scope.typeTemplate.brandIds);//品牌列表类型转换
				//扩展属性
				$scope.entity.goodsDesc.customAttributeItems= JSON.parse($scope.typeTemplate.customAttributeItems);
			}
		);
		//读取规格列表
		typeTemplateService.findSpecList(newValue).success(
			function(response){
				$scope.specList=response;
			}
		);		
		
	});
	
	$scope.entity={ goodsDesc:{itemImages:[],specificationItems:[]}};
	$scope.updateSpecAttribute=function($event,name,value){
		var object= $scope.searchObjectByKey(
			$scope.entity.goodsDesc.specificationItems ,'attributeName', name);
		if(object!=null) {
			if($event.target.checked ){
				object.attributeValue.push(value);//勾选
		}else{
				object.attributeValue.splice( object.attributeValue.indexOf(value) ,1);//取消勾选
				if(object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice(
							$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
			}
		}else{
			$scope.entity.goodsDesc.specificationItems.push(
					{"attributeName":name,"attributeValue":[value]});
		}
		
	}
	
	//创建SKU表
	$scope.createItemList=function(){
		$scope.entity.itemList=[{spec:{},price:0,status:'0',num:9999,idDefault:'0'}]//创建初始化表
		var items= $scope.entity.goodsDesc.specificationItems;
		for(var i=0;i<items.length;i++) {
			$scope.entity.itemList=addColumn( $scope.entity.itemList,items[i].attributeName,items[i].attributeValue );
		}
	}
     addColumn=function(list,columnName,columnValues){
		
		var newList=[];		
		for(var i=0;i< list.length;i++){
			var oldRow=list[i];			
			for(var j=0;j<columnValues.length;j++){
				var newRow=JSON.parse(JSON.stringify(oldRow));//深克隆
				newRow.spec[columnName]=columnValues[j];
				newList.push(newRow);
			}			
		}		
		return newList;
	}
	
    
});	
