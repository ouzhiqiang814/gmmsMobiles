var db;

function fnInitDB() {
    db = api.require('db');
};

var DATABASE = 'database_gmms';

//bd_msg_remind_group
var MSG_GROUP = 'bd_msg_remind_group'
function fnAddMessageGroup(msgGroup) {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'REPLACE INTO ' + MSG_GROUP + '(group_name,module,content,accepter_id,read_num,edit_time) VALUES("' + msgGroup.groupName + '","' + msgGroup.module + '","' + msgGroup.content + '","' + msgGroup.accepterId + '","' + msgGroup.readNum + '","' + msgGroup.createTime + '")'
    });
    
    return ret;
};
function fnRemoveMessageGroup(group_name) {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'DELETE FROM ' + MSG_GROUP + ' WHERE group_name="' + group_name + '"'
    });
    
    return ret;
};
function fnRemoveAllGroup() {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'DELETE FROM ' + MSG_GROUP 
    });
     
    return ret;
};
function fnSelectALLGroup() {
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: 'SELECT * FROM ' + MSG_GROUP 
    });
     
    return ret;
};
function fnSelectMessageGroup(condition) {
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: 'SELECT * FROM ' + MSG_GROUP + ' WHERE ' + condition + ' order by edit_time desc'
    });
     
    return ret;
};
function fnSetMessageGroupReaded(group_name) {
    var ret = db.executeSql({
        name: DATABASE,
        sql: 'UPDATE ' + MSG_GROUP + ' SET read_num = 0 WHERE group_name="' + group_name + '"'
    });
//	alert(JSON.stringify(ret));
    return ret;
};

//bd_msg_remind
var MSG_REMIND = 'bd_msg_remind';
function fnAddMessage(msgRemind) {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'REPLACE INTO ' + MSG_REMIND + '(id,module,module_name,user_id,user_name,key_id,content,accepter_id,deal_status,open_flag,create_time)  VALUES ("' + msgRemind.id + '","' + msgRemind.module + '","' + msgRemind.moduleName + '","' + msgRemind.userId + '","' + msgRemind.userName + '","' + msgRemind.keyId + '","'  + msgRemind.msgContent + '","' + msgRemind.accepterId + '","' + msgRemind.dealStatus + '","0","' + msgRemind.createTime + '")'
    });
 ret;
};
function fnRemoveAllMessage() {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'DELETE FROM ' + MSG_REMIND 
    });
    
    return ret;
};
function fnSelectALLMessage() {
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: 'SELECT * FROM ' + MSG_REMIND 
    });
    
    return ret;
};
function fnFindMsgRemindByModuleName(moduleName,accepterId,skip,limit) {
	var sql = "SELECT m.* FROM " + MSG_REMIND + " m "
		+ " WHERE m.module_name = '" + moduleName + "' and m.accepter_id = '" + accepterId + "'"
		+ " ORDER BY m.open_flag,m.create_time desc LIMIT " + limit + " OFFSET " + skip;
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: sql
    });
     
    return ret;
};
function fnSetRemindForOpen(id) {
	var sql = "UPDATE " + MSG_REMIND + " SET open_flag = '1' WHERE id = '" + id + "'";
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: sql
    });

};

//ps_permissionitem
var PERMISSION_ITEM = 'ps_permissionitem';
function fnAddPermissionItem(item) {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'REPLACE INTO ' + PERMISSION_ITEM + ' (id, item_name, key_name, icon, is_outline) VALUES ("' + item.id + '","' + item.itemName + '","' + item.keyName + '","' + item.icon + '","' + item.isOutline + '")'
    });
    
    return ret;
};
function fnRemoveAllPermissionItem() {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'DELETE FROM ' + PERMISSION_ITEM 
    });
    
    return ret;
};
function fnSelectALLPermissionItem() {
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: 'SELECT * FROM ' + PERMISSION_ITEM 
    });
    
    return ret;
};

//bs_business
var BUSINESS = 'bs_business';
function fnAddBusiness(bs) {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'REPLACE INTO ' + BUSINESS + '(bsnum, flowId, name, create_time, end_time ,author_id, author_name ,status,lesseeId)  VALUES ("' + bs.bsnum + '","' + bs.flowId + '","' +  bs.name + '","' + bs.createTime + '","' + bs.endTime + '","' + bs.authorId + '","' + bs.authorName + '","' + bs.status + '","'  + bs.lesseeId + '")'
    });
    return ret;
};
function fnRemoveAllBusiness() {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'DELETE FROM ' + BUSINESS 
    });
    
    return ret;
};
function fnSelectALLBusiness() {
   var ret = db.selectSqlSync({
        name: DATABASE,
        sql: 'SELECT * FROM ' + BUSINESS
    });
    
    return ret;
};

//bs_businesstodo
var BUSINESS_TODO = 'bs_businesstodo';
function fnAddBusinessTodo(todo) {
	var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'REPLACE INTO ' + BUSINESS_TODO + '(todoid, flowId, item_id, pname, bsnum, create_time, current_node ,current_node_name ,prev_node ,prev_actor,handler,status,open_flag,tempidea,remark,beback,lesseeId)  VALUES '+
        	 '("' + todo.todoid + '","' + todo.flowId + '","' + todo.item.id + '","' + todo.pname + '","' + todo.bsnum + '","' + todo.createTime + '","' + todo.currentNode + '","' + todo.currentNodeName + '","' + todo.prevNode + '","' 
        	 + todo.prevActor + '","' + todo.handler + '","' + todo.status + '","' + todo.openFlag + '","' + todo.tempidea + '","' + todo.remark + '","' + todo.beback + '","' + todo.lesseeId + '")'
    });
	return ret;
};
function fnRemoveAllBusinessTodo() {
    var ret = db.executeSqlSync({
        name: DATABASE,
        sql: 'DELETE FROM ' + BUSINESS_TODO 
    });
    
    return ret;
};
function fnSelectALLBusinessTodo() {
   var ret = db.selectSqlSync({
        name: DATABASE,
        sql: 'SELECT * FROM ' + BUSINESS_TODO 
    });
    
    return ret;
};
function fnFindBusinessTodoByModuleName(moduleName,handler,skip,limit) {
	var sql = "SELECT DISTINCT t.*,b.author_name,b.create_time as start_time FROM " + BUSINESS_TODO + " t INNER JOIN " + MSG_REMIND + " m ON 'bsnum:'||t.bsnum||';' = m.key_id " 
		+ " INNER JOIN " + BUSINESS + " b ON b.bsnum = t.bsnum " 
		+ " WHERE m.module_name = '" + moduleName + "' and t.handler = '" + handler + "'"
		+ " ORDER BY t.status,t.create_time desc LIMIT " + limit + " OFFSET " + skip;
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: sql
    });
    return ret;
};
//更新事务已处理状态
function fnSetBusinessTodoForHandle(bsnum) {
	var sql = "UPDATE " + BUSINESS_TODO + " SET status = '1' WHERE bsnum = '" + bsnum + "'";
    var ret = db.selectSqlSync({
        name: DATABASE,
        sql: sql
    });

};

//事务处理
function fnBeginTransaction() {
	var ret = db.transactionSync({
    	name: DATABASE,
    	operation: 'begin'
	});
	
	return ret;
};
function fnCommitTransaction() {
	var ret = db.transactionSync({
    	name: DATABASE,
    	operation: 'commit'
	});
	
	return ret;
};
function fnRollbackTransaction() {
	var ret = db.transactionSync({
    	name: DATABASE,
    	operation: 'rollback'
	});
	
	return ret;
};

function fnSelectItemByName(itemName){
	var sql = "SELECT * FROM "+PERMISSION_ITEM+" t WHERE t.item_name='"+itemName+"' AND t.icon is not null AND t.icon!=''";
	var ret = db.selectSqlSync({
		name:DATABASE,
		sql:sql
	});
	return ret;
}