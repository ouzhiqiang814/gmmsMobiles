var db;

function fnInitDB() {
    db = api.require('db');
};

var DATABASE = 'database_gmms';
function fnOpenDatabase() {
    fnInitDB();

    db.openDatabase({
        name: DATABASE
    }, function(ret, err) {
		if(ret.status){
//	  		alert("打开数据库成功！");
//			fnRemoveAllTabel();
        	fnCreateMessageGroup();
        } else
        	alert(JSON.stringify(err));
    });
};

function fnRemoveAllTabel() {
	db.executeSql({
        name: DATABASE,
        sql: 'DROP TABLE ' + MSG_GROUP
    }, function(ret, err) {});
    
    db.executeSql({
        name: DATABASE,
        sql: 'DROP TABLE ' + MSG_REMIND
    }, function(ret, err) {});
    
    db.executeSql({
        name: DATABASE,
        sql: 'DROP TABLE ' + PERMISSION_ITEM
    }, function(ret, err) {});
    
    db.executeSql({
        name: DATABASE,
        sql: 'DROP TABLE ' + BUSINESS_TODO
    }, function(ret, err) {});
    
    db.executeSql({
        name: DATABASE,
        sql: 'DROP TABLE ' + BUSINESS
    }, function(ret, err) {});
}

/** 创建消息组表 **/
var MSG_GROUP = 'bd_msg_remind_group';
function fnCreateMessageGroup() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE IF NOT EXISTS ' + MSG_GROUP + '(group_name VARCHAR(64),module VARCHAR(2),accepter_id INTEGER,content VARCHAR(200),read_num INTEGER,edit_time DATETIME)'
    }, function(ret, err) {
    	if(ret.status){
	        fnCreateMessageGroupIndex();
    	} else{
    		alert(JSON.stringify(err));
    	}
    });
};
function fnCreateMessageGroupIndex() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX IF NOT EXISTS ' + MSG_GROUP + '_unique_index on ' + MSG_GROUP + '(group_name,accepter_id)'
    }, function(ret, err){
    	if(ret.status)
    		fnCreateMessage();
    	else
    		alert(JSON.stringify(err));
    });
};

/** 创建消息表 **/
var MSG_REMIND = 'bd_msg_remind';
function fnCreateMessage() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE IF NOT EXISTS ' + MSG_REMIND + '(id VARCHAR(64),module VARCHAR(64),module_name VARCHAR(64),user_id INTEGER,user_name VARCHAR(64),key_id VARCHAR(100), content VARCHAR(200), accepter_id INTEGER, deal_status VARCHAR(1),open_flag VARCHAR(1),create_time DATETIME)'
    }, function(ret, err) {
    	if(ret.status)
        	fnCreateMessageIndex();
        else
        	alert(JSON.stringify(err));
    });
};
function fnCreateMessageIndex() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX IF NOT EXISTS ' + MSG_REMIND + '_unique_index on ' + MSG_REMIND + '(id)'
    }, function(ret, err){
    	if(ret.status)
	    	fnCreatePermissionItem();
        else
        	alert(JSON.stringify(err));
    });
};

/** 创建事务项目表 **/
var PERMISSION_ITEM = 'ps_permissionitem';
function fnCreatePermissionItem() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE IF NOT EXISTS ' + PERMISSION_ITEM + '(id INTEGER, item_name VARCHAR(100), key_name VARCHAR(100), icon VARCHAR(200), is_outline VARCHAR(1))'
    }, function(ret, err) {
    	if(ret.status)
	        fnCreatePermissionItemIndex();
        else
        	alert(JSON.stringify(err));
    });
};
function fnCreatePermissionItemIndex() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX IF NOT EXISTS ' + PERMISSION_ITEM + '_unique_index on ' + PERMISSION_ITEM + '(id)'
    }, function(ret, err){
    	if(ret.status)
	    	fnCreateBusiness();
        else
        	alert(JSON.stringify(err));
    });
};

/** 创建事务业务表 **/
var BUSINESS = 'bs_business';
function fnCreateBusiness() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE IF NOT EXISTS ' + BUSINESS + '(bsnum VARCHAR(100), flowId VARCHAR(100), name VARCHAR(100), create_time DATETIME, end_time DATETIME, author_id INTEGER,author_name VARCHAR(50), status VARCHAR(1),lesseeId VARCHAR(20))'
    }, function(ret, err) {
    	if(ret.status)
	        fnCreateBusinessIndex();
        else
        	alert(JSON.stringify(err));
    });
};
function fnCreateBusinessIndex() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX IF NOT EXISTS ' + BUSINESS + '_unique_index on ' + BUSINESS + '(bsnum)'
    }, function(ret, err){
		if(ret.status)
			fnCreateBusinesstodo();
        else
        	alert(JSON.stringify(err));
    });
};

/** 创建待办事务表 **/
var BUSINESS_TODO = 'bs_businesstodo';
function fnCreateBusinesstodo() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE IF NOT EXISTS ' + BUSINESS_TODO + '(todoid VARCHAR(100), flowId VARCHAR(100), item_id INTEGER, pname VARCHAR(100), bsnum VARCHAR(100), create_time DATETIME, current_node VARCHAR(100),current_node_name VARCHAR(64),prev_node VARCHAR(100),prev_actor INTEGER,handler INTEGER,status VARCHAR(1),open_flag VARCHAR(1),tempidea VARCHAR(200),remark VARCHAR(200),beback VARCHAR(1),lesseeId VARCHAR(50))'
    }, function(ret, err) {
    	if(ret.status)
	        fnCreateBusinesstodoIndex();
        else
        	alert(JSON.stringify(err));
    });
};
function fnCreateBusinesstodoIndex() {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX IF NOT EXISTS ' + BUSINESS_TODO + '_unique_index on ' + BUSINESS_TODO + '(todoid)'
    }, function(ret, err){
		if(ret.status){
        
        }else
        	alert(JSON.stringify(err));
    });
};

/**
 * 查询语句
 */
function fnSelectSync(sqlStr){
	var ret = db.selectSqlSync({
        name: DATABASE,
        sql: sqlStr
    });
    return ret;
}