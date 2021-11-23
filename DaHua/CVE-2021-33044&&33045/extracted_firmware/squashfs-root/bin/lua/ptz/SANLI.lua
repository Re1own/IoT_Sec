-- 这是大华协议，已经调好，不用更改
local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr = 
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文
	Name = "SANLI",	
		
	-- 指明是云台协议还是矩阵协议，使用"PTZ", "MATRIX"表示
	Type = "PTZ",
	
	-- 以ms为单位
	Internal = 200,
				
	-- 没有对应的地址范围，请都设成0xff
	-- 云台地址范围
	CamAddrRange 		= {0x01, 0xFF}, 
	-- 监视地址范围
	MonAddrRange		= {0x00, 0xFF},	
	-- 预置点范围
	PresetRange 		= {0x01, 80},
	-- 自动巡航线路范围
	TourRange			= {0x00, 7},
	-- 轨迹线路范围
	PatternRange		= {0x00, 4},
	-- 垂直速度范围
	TileSpeedRange 		= {0x01, 0x0f},
	-- 水平速度范围
	PanSpeedRange 		= {0x01, 0x0f},
	-- 自动扫描范围
	ScanRange 			= {0x01, 0x05},
	
	-- 辅助范围
	AuxRange 			= {0x01, 0x34},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 1, 
	PresetPos 		= 4, 
	TileSpeedPos 	= 4,
	PanSpeedPos 	= 4,
	AuxPos 			= 3,
}

Protocol.Command = 
{
	-- 写具体协议时只能用16进制或字符表示,没有的话就注释掉
	Start= 
	{
		--写上下左右, 左上，左下，右上，右下
		TileUp 		= "0x00, 0x00, 0x50, 0x00, 0x00,",
		TileDown 	= "0x00, 0x00, 0x51, 0x00, 0x00,",
		PanLeft 	= "0x00, 0x00, 0x52, 0x00, 0x00,",
		PanRight 	= "0x00, 0x00, 0x53, 0x00, 0x00,",


		ZoomWide 	= "0xA5, 0x00, 0x0c, 0x00",
		ZoomTele 	= "0xA5, 0x00, 0x0d, 0x00",
		FocusNear	= "0xA5, 0x00, 0x0A, 0x00",
		FocusFar 	= "0xA5, 0x00, 0x0B, 0x00",
		IrisSmall 	= "0xA5, 0x00, 0x09, 0x00",
		IrisLarge 	= "0xA5, 0x00, 0x08, 0x00",
			
		-- 灯光
		LightOn		= "0x00, 0x00, 0x1c, 0x00",
		LightOff  	= "0x00, 0x01, 0x1d, 0x00",
			
		-- 预置点操作（设置，清除，转置)
		SetPreset 	= "0x00, 0x00, 0x58, 0x00, 0x00",
		ClearPreset	= "0x00, 0x00, 0x5a, 0x00, 0x00",
		GoToPreset 	= "0x00, 0x00, 0x59, 0x00, 0x00",			
			
		AutoPanOn		= "0x00, 0x00, 0x34, 0x00",
		AutoPanOff		= "0x00, 0x00, 0x31, 0x00",


			
		-- 轨迹巡航, 一般指模式(设置开始，设置结束，运行，停止，清除模式
		SetPatternStart = "0x00, 0x00, 0x64, 0x00, 0x00",
		SetPatternStop 	= "0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x22,0x00",
		StartPattern 	= "0x00, 0x00, 0x60, 0x00, 0x00",
		StopPattern	= "0x00, 0x00, 0x62, 0x00, 0x00",
		ClearPattern 	= "0x00, 0x00, 0x63, 0x00, 0x00",
		
		AuxOn 	= "0x00, 0x00, 0x00, 0x00",
		AuxOff 	= "0x00, 0x00, 0x00, 0x00",

	},
	Stop = 
	{
		TileUp 		= "0x00, 0x00, 0x01, 0x00",
		TileDown 	= "0x00, 0x00, 0x01, 0x00",
		PanLeft 	= "0x00, 0x00, 0x02, 0x00",
		PanRight 	= "0x00, 0x00, 0x02, 0x00,",
		
		ZoomWide 	= "0x00, 0x00, 0x05, 0x00,",
		ZoomTele 	= "0x00, 0x00, 0x05, 0x00,",
		FocusNear 	= "0x00, 0x00, 0x04, 0x00,",
		FocusFar 	= "0x00, 0x00, 0x04, 0x00,",
		IrisSmall 	= "0x00, 0x00, 0x03, 0x00,",
		IrisLarge 	= "0x00, 0x00, 0x03, 0x00,",
	},
}

Protocol.Checksum = function (s)

	if table.getn(s) == 5 then
		local sum = math.mod(0xFFFF - (s[1] + s[2] + s[3] + s[4] ),256);
		s[5] = math.mod(sum ,128);
	elseif table.getn(s) == 4 then
		local sum = math.mod(0xFFFF - (s[1] + s[2] + s[3] ),256);
		s[4] = math.mod(sum ,128);
	else
		local sum1 = math.mod(0xFFFF - (s[1] + s[2] + s[3] ),256);
		s[4] =  math.mod(sum1 ,128);
		local sum2 = math.mod(0xFFFF - (s[5] + s[6] + s[7] ),256);
		s[8] =  math.mod(sum2 ,128);
	end;

	return s;
end;


Protocol.CamAddrProcess = function(s, addr)
	if table.getn(s) == 4 or table.getn(s) == 5 then
		local addr = math.mod(addr,256);
		s[1] = 0xc0 + math.floor(addr/64)
		s[2] = math.mod(addr,64) + 128;
	else
		local addr = math.mod(addr,256);
		s[1] = 0xc0 + math.floor(addr/64);
		s[5] = 0xc0 + math.floor(addr/64);
		s[2] = math.mod(addr,64) + 128;
		s[6] = math.mod(addr,64) + 128;
	end;
	return s;
end;


Protocol.SpeedProcess = function(s, arg1, arg2)
	if arg1 ~= 0x00 then
		s[4] = arg1;
	end;
	if arg2 ~= 0x00 then
		s[4] = arg2;
	end;
	return s;
end;
Protocol.PatternProcess = function(s, num)
	s[4] = num;
	return s;	
end;





return Protocol;