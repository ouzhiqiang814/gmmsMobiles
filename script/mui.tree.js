/**
 * 创建mui树形列表
 * varstion 1.0.0
 * by lsk
 */
(function($, window, document) {
	$.MyTree = $.Class.extend({
		init:function(options){
			var self = this;
			self.body = document.getElementById(options.id);
			var htmlStr = '';
			$.each(options.data,function(i,item){
				htmlStr += self.__queryChild(item);
			});
			self.body.innerHTML = htmlStr;
			self.body.classList.add('mui-table-view');
			self.nodeClick = options.nodeClick;//点击事件
			var aele = self.body.getElementsByTagName("a");
			var treeicon = self.body.getElementsByClassName("tree-item-icon");
			for(var i=0;i<aele.length;i++){
				//列表点击事件
				aele[i].addEventListener('tap',function(e){
					var node = {};
					node.id = this.getAttribute("fieldId");
					node.name = this.getAttribute("fieldName");
					node.itemNum = this.getAttribute("itemNum");
					if(typeof self.nodeClick == "function"){
						var callBack = self.nodeClick;
						callBack(node);
					}
				});
			}
			for(var i=0;i<treeicon.length;i++){
				//元素展开与隐藏事件
				treeicon[i].addEventListener('tap',function(e){
					var ns=this.nextElementSibling;
					var classStr = ns.getAttribute('class');
					if(classStr.indexOf('my-down')>-1){
						var nss = ns.nextElementSibling;
						nss.style.display = 'block';
						ns.classList.remove('my-down');
						ns.classList.add('my-up');
					}else if(classStr.indexOf('my-up')>-1){
						var nss = ns.nextElementSibling;
						nss.style.display = 'none';
						ns.classList.remove('my-up');
						ns.classList.add('my-down');
					}
				});
			}
		},
		__queryChild:function(item){
			var self = this;
			var childStr = '';
			if(item.children!=null&&item.children!=''&&item.children.length>0){
				var childrenStr = '';
				$.each(item.children,function(i,child){
					childrenStr += self.__queryChild(child);
				});
				childStr = '<li class="mui-table-view-cell" style="height: auto;">'+
							(item.iconCls!=null?'<span class="tree-item-icon '+item.iconCls+'"></span> ':'<span class="tree-item-icon mui-icon mui-icon-plusempty"></span> ')+
							'	<a style="margin-left:25px;padding-left:5px;" fieldId="'+item.id+'" fieldName="'+item.name+'" itemNum="'+item.itemNum+'" class="my-down tree-item mui-navigate-right">'+
							item.name+
							(item.itemNum!=null?'<span class="mui-badge mui-badge-primary">'+item.itemNum+'</span>':'')+
							'	</a>'+
							'	<ul class="mui-table-view my-child">'+
								childrenStr+
							'	</ul>'+
							'</li>';
			}else{
				childStr = '<li class="mui-table-view-cell">'+
							(item.iconCls!=null?'<span class="tree-item-icon '+item.iconCls+'"></span> ':'<span class="tree-item-icon mui-icon mui-icon-plusempty"></span> ')+
							'	<a style="margin-left:25px;padding-left:5px;" fieldId="'+item.id+'" fieldName="'+item.name+'" itemNum="'+item.itemNum+'" class="tree-item mui-navigate-right">'+
							item.name+
							(item.itemNum!=null?'<span class="mui-badge mui-badge-primary">'+item.itemNum+'</span>':'')+
							'	</a>'+
						    '</li>';
			}
			return childStr;
		},
		reload:function(data){
			var self = this;
			var htmlStr = '';
			$.each(data,function(i,item){
				htmlStr += self.__queryChild(item);
			});
			self.body.innerHTML = htmlStr;
			var aele = self.body.getElementsByTagName("a");
			var treeicon = self.body.getElementsByClassName("tree-item-icon");
			for(var i=0;i<aele.length;i++){
				//列表点击事件
				aele[i].addEventListener('tap',function(e){
					var node = {};
					node.id = this.getAttribute("fieldId");
					node.name = this.getAttribute("fieldName");
					node.itemNum = this.getAttribute("itemNum");
					if(typeof self.nodeClick == "function"){
						var callBack = self.nodeClick;
						callBack(node);
					}
				});
			}
			for(var i=0;i<treeicon.length;i++){
				//元素展开与隐藏事件
				treeicon[i].addEventListener('tap',function(e){
					var ns=this.nextElementSibling;
					var classStr = ns.getAttribute('class');
					if(classStr.indexOf('my-down')>-1){
						var nss = ns.nextElementSibling;
						nss.style.display = 'block';
						ns.classList.remove('my-down');
						ns.classList.add('my-up');
					}else if(classStr.indexOf('my-up')>-1){
						var nss = ns.nextElementSibling;
						nss.style.display = 'none';
						ns.classList.remove('my-up');
						ns.classList.add('my-down');
					}
				});
			}
		}
	});
})(mui, window, document);