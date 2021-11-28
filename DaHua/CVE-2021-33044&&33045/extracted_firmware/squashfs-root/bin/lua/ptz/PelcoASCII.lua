-- PELCO矩阵协议
local Protocol = {};

Protocol.Attr = 
{
	Name = "PELCOASCII",	
	Type = "MATRIX",
	Internal = 200,
	CamAddrRange 		= {1, 9999}, 
	MonAddrRange		= {1, 9999},	
	PresetRange 		= {1, 9999},
	TourRange			= {0x01, 0xff},
	PatternRange		= {1, 99},
	TileSpeedRange 		= {1, 63},
	PanSpeedRange 		= {1, 64},
	ScanRange 			= {0x01, 0x05},
	AuxRange 			= {1, 65536},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 2, 
	PresetPos 		= 6, 
	TileSpeedPos 	= 6,
	PanSpeedPos 	= 5,
	AuxPos 			= 6,
}

local monitordata ={}
local cameradata = {};
local middletable= {};

Protocol.Command = 
{
	Start= 
	{
		TileUp 		= "'U', 'a'",
		TileDown 	= "'D', 'a'",
		PanLeft 	= "'L', 'a'", 
		PanRight 	= "'R', 'a'",
		LeftUp 		= "'L', 'a', 'U', 'a'",
		LeftDown 	= "'L', 'a', 'D', 'a'",
		RightUp		= "'R', 'a', 'U', 'a'",
		RightDown = "'R', 'a', 'D', 'a'",
		
		ZoomWide 	= "'W', 'a'",
		ZoomTele 	= "'T', 'a'",
		FocusNear	= "'N', 'a'",
		FocusFar 	= "'F', 'a'",
		IrisSmall = "'C', 'a'",
		IrisLarge = "'O', 'a'",
			
		SetPreset 	= "'^', 'a'",
		GoToPreset 	= "'\\', 'a'",			
			
		SetPatternStart = "'/', 'a'",
		SetPatternStop 	= "'n', 'a'",
		StartPattern 		= "'p', 'a'",
                StopPattern     = "'s', 'a'",

		AuxOn 	= "'A', 'a'",
		AuxOff 	= "'B', 'a'",
		
		MatrixSwitch ="'M', 'a', '#', 'a'";
			
	},
	Stop = 
	{
		TileUp 		= "'s', 'a'",
		TileDown 	= "'s', 'a'",
		PanLeft 	= "'s', 'a'", 
		PanRight 	= "'s', 'a'",
		LeftUp 		= "'s', 'a'",
		LeftDown 	= "'s', 'a'",
		RightUp		= "'s', 'a'",
		RightDown = "'s', 'a'",

		ZoomWide 	= "'s', 'a'",
		ZoomTele 	= "'s', 'a'",
		FocusNear	= "'s', 'a'",
		FocusFar 	= "'s', 'a'",
		IrisSmall = "'s', 'a'",
		IrisLarge = "'s', 'a'",
		
	},
}

local function conver(opttable , value)
	local tmptable = {};
	middletable = {};
	if type(opttable) ~= "table" then
		return optable;
	end;
	
	local i = 1;
	
	while value > 0 do
		tmptable[i] = math.mod(value, 10);
		value = (value - tmptable[i])/10;
		i = i+1;		
	end;
	
	local len = table.getn(tmptable);
	for j = 1, len do
		middletable[j] = tmptable[len - j + 1] + 0x30;
	end;
	
	for j = 1, table.getn(opttable) do
		middletable[len + j] = opttable[j];
	end;
	
	return middletable;
end;
 
Protocol.Checksum = function (s)
	local restr = {};
	local i = 1;
	for j = 1, table.getn(monitordata) do
		restr[i] = monitordata[j];
		i = i + 1;
	end;
	
	for j = 1, table.getn(cameradata) do
		restr[i] = cameradata[j];
		i = i + 1;
	end;
	
	if s[1] ~= string.byte('M') then
		for j = 1, table.getn(s) do
			restr[i] = s[j];
			i = i + 1;
		end;
	end;
	
	return restr;
end;


Protocol.CamAddrProcess = function(s, addr)
  local addr = math.mod(addr,256);
	local tmptable = {string.byte('#'), string.byte('a')};
	cameradata = {};
  cameradata = conver(tmptable, addr);
  
	return s;
end;

Protocol.MonAddrProcess = function(s, addr)
	local addr = math.mod(addr,256);
	local tmptable = {string.byte('M'), string.byte('a')};
	monitordata = {};
	monitordata = conver(tmptable, addr);
	
	return s;
end;

Protocol.SpeedProcess = function(s, arg1, arg2)
	if s[1] == string.byte('s') then
		return s;
	end;
	
	local retstr = {};
	local retstr1 = {};
	local retstr2 = {};

	if table.getn(s) > 2 then
		retstr1[1] = s[1];
		retstr1[2] = s[2];
		retstr2[1] = s[3];
		retstr2[2] = s[4];
		retstr1 = conver(retstr1, arg2);
		local len = table.getn(retstr1);
		for i = 1, len do
			retstr[i] = retstr1[i];
		end;
		
		retstr2 = conver(retstr2, arg1);
		for i = 1, table.getn(retstr2) do
			retstr[len + i] = retstr2[i];
		end;
		
	else
		retstr1[1] = s[1];
		retstr1[2] = s[2];
		local value;
		if arg1 ~= 0 then
			value = arg1;
		else
			value = arg2;
		end;
		retstr = conver(retstr1, value);
	end; 
	
	return retstr;
end;

Protocol.PresetProcess = function(s, preset)
	local retstr = {};
	retstr = conver(s, preset);
	
	return retstr; 
end;

Protocol.PatternProcess = function(s, arg)
	local retstr = {};
	retstr = conver(s, arg);
	
	return retstr; 
end;

Protocol.AuxProcess = function(s, num)
	local retstr = {};
	retstr = conver(s, num);
	
	return retstr; 
end;

return Protocol;