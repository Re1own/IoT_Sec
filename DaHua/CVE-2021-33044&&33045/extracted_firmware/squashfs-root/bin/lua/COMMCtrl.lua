--   "$Id: PTZCtrl.lua 1136 2008-08-02 06:05:52Z yang_bin $"
--   (c) Copyright 1992-2005, ZheJiang Dahua Information Technology Stock CO.LTD.
--                            All Rights Reserved
--
--	文 件 名： COMMCtrl.lua
--	描    述:  RS２３２和RS 485串口协议脚本
--   
local AllCOMMProtocol = {}; 		-- 保存序列号和对应的文件名
local SelectedCOMM = {}; 		-- 保存将要操作的协议
local CamAddr = nil; 			-- 保存协议的串口地址
local MonAddr = nil; 			-- 保存监视地址

local COMMCtrl = {};
COMMCtrl.PathSet = {};

-- 加载所有的串口协议脚本
local function buildCommList(PathSet)
	local COMMProtocols = {};
	
	-- 用于加载单个的串口协议文件
	local function loadCommFile(filename)
		local f,err = loadfile(filename);
		if f then
			local ret, protocol;
			ret, protocol = pcall(f);
			if( ret ) then
				COMMProtocols[protocol.Attr.Name] = protocol;
			else 
				err = protocol;
			end
		end
		
		if err then
			print(
				string.format("Error while loading COMM protocol:%s",err)
			);
		end;
	end	
	
	-- 用于加载指定目录下的文件
	local function LoadCommProtocol(commPath)
		local ret, iter = pcall(lfs.dir, commPath);
		if ret then
			for filename in iter do
				if string.find(filename, ".lua") then
					loadCommFile(commPath .. '/' .. filename);
				end;
			end;
		end;
	end	
	
	-- 加载路径集合下的所有文件
	for _, path in pairs(PathSet) do 
		LoadCommProtocol(path);
	end

	-- 根据串口协议的名称进行排序
	local t1 = {};
	for k,_ in pairs(COMMProtocols) do 
		table.insert(t1, k);
	end
	
	table.sort(t1);
	
	-- 把按字母排序的串口协议放到AllCOMMProtocol并打印协议清单
	
	local commList = '';
	for k, v in pairs(t1) do 
		AllCOMMProtocol[k] = COMMProtocols[v];
		if(commList ~= '') then
			commList = commList .. ',';
		end
		commList = commList .. v ;
	end
	print(string.format("The following COMM protocols have been loaded:\n\t%s", commList));
	
	-- 计算总的串口协议个数
	COMMCtrl.ProtocolCount = table.getn(AllCOMMProtocol);
end


-- 分析字符串，把字符串里的16进制转化成字符数组，
local function str2chr(str)
	local retStr = "";

	-- 输入字符的话，先转化成16进制
	str = string.gsub(str, "'(.)'+", function(h)	return string.format("0x%02X", string.byte(h))end);
	
	-- 把16进制转化成字符
	for w in string.gfind(str, "(%w+)(,?)") do
		retStr = retStr .. string.char(tonumber(w, 16));		
	end;
	--printstr(retStr);
	return retStr;
end;



-- 把字符串按字节转化成表格处理，主要是为了利用下标直接使用，执行校验处理
local function str2table(str)
	local RetTable = {};
	if string.len(str) <= 0 then
		return nil;
	end;
	
	str = str2chr(str);
	for i = 1, string.len(str) do
		RetTable[i] = string.byte(string.sub(str, i, i + 1));
	end;
	
	return RetTable;	
end;


-- 得到支持的协议个数
local function GetCommProtocolNum()
	return table.getn(AllCOMMProtocol);
end;

--[[
得到指定协议的属性
param:
	index:协议的索引，从下标1开始
--]]
local function GetCommProtocolAttr(index)
	local tmpCOMM = {};
	local Attr = {}; 
	if (index > 0) and (index <= table.getn(AllCOMMProtocol)) then
		tmpCOMM = AllCOMMProtocol[index];
		Attr = tmpCOMM.Attr;
	end;
	
	--[[ 下面的是C中数据结构取值时用，不得随意更改名称
	local RetSeq = {"Name", "Type"};		
	--]]
		
	-- 顺序不更改
	local commtype = {"RS232","RS485"};
	local revtype ={};
	for k, v in pairs(commtype) do
		revtype[v] = k;
	end;
	
	local RetAttr = {};	

	RetAttr["Name"] 			= string.sub(Attr.Name, 1, 15);
	RetAttr["Type"] 			= revtype[Attr.Type];
		
	return RetAttr;
end;

local function CamAddrProcess(opttable, addr)
	if not opttable then
		print("opttable is nill");
	end;
	-- 先尝试特殊处理
	if SelectedCOMM.CamAddrProcess then
		return SelectedCOMM.CamAddrProcess(opttable, addr);
	else
		-- 开始通常处理
		local addr = math.mod(addr,256);
		opttable[SelectedCOMM.CommandAttr.AddrPos] = addr;
		--printtable(OperateTable[key][k]);
		return opttable;
	end;
end;

--[[
设置协议信息，即对应的协议内容
param:
	index：指出哪个协议，从下标1开始
	addr:	设置的地址内容,直接是16进制值
--]]
local function SetCommProtocol(index, camaddr, monaddr)
	-- 获得协议
	if (index <= 0) or (index > table.getn(AllCOMMProtocol)) or not camaddr then
		print("the Procotol isn't exist or the Camera's addr isn't exist");
		SelectedCOMM = nil;
		return;
	end;
		
	SelectedCOMM = AllCOMMProtocol[index];

	
	-- 得到操作表
	OperateTable = SelectedCOMM.Command;	
	
	CamAddr = math.abs(camaddr);
	if monaddr then
		MonAddr = math.abs(monaddr);
	end;

end;

--[[
处理操作命令值
--]]
local function GetCMDTable(cmd)
	local RetTable = {};
	--print(cmd);
	if type(cmd) == "string" then
		RetTable = str2table(cmd);
	elseif type(cmd) == "table" then
		RetTable = cmd;
	else
		return nil;
	end;
	
	-- 处理串口地址信息
	RetTable = CamAddrProcess(RetTable, CamAddr);

	return RetTable;
	
end;


--[[
从所有命令中找出对应的命令，并且设置参数
param:
	OpeTable:所有命令集合
	cmd:	指定的命令下标
	arg1:
	arg2:见文档
--]]
local function Parse(opttable, cmd, arg1, arg2, arg3)
	local COMMCommand = nil;
	if (cmd <= 0) or (cmd > table.getn(COMMOperateCommand)) then
		print("out of command\n");
		return nil;
	end;

	--print(COMMOperateCommand[cmd]);
	if not opttable[COMMOperateCommand[cmd]] then
		return nil;
	end;

local function test()
print("Protocol Num = " .. GetCommProtocolNum());
for i = 1, GetCommProtocolNum() do
	local attr = GetCommProtocolAttr(i);
--	SetCommProtocol(i,1);
	end;
end;
end;

local function LoadCommProtocols()
	buildCommList(COMMCtrl.PathSet);
end

COMMCtrl.LoadCommProtocols   = LoadCommProtocols;
COMMCtrl.GetCommProtocolNum  = GetCommProtocolNum;
COMMCtrl.GetCommProtocolAttr = GetCommProtocolAttr;
COMMCtrl.SetCommProtocol     = SetCommProtocol;
COMMCtrl.COMMProtocol     = AllCOMMProtocol;
COMMCtrl.buildCommList    = buildCommList;

return COMMCtrl;

--
-- "$Id: PTZCtrl.lua 1136 2008-08-02 06:05:52Z yang_bin $"
--

