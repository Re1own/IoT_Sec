-- LTM8230C的温湿度控制器
local Protocol = {};

Protocol.Attr = 
{
	-- 这儿的名字不能更改，否则会导致应用程序出错
	Name = "BANKNOTE",	
	Type = "PTZ",
	Internal = 200,
	AlarmLen = 3,
	CamAddrRange 		= {0x00, 0x0f}, 
	MonAddrRange		= {0xff, 0xFF},	
	PresetRange 		= {0xff, 0xff},
	TourRange			= {0xff, 0xff},
	PatternRange		= {0xff, 0xff},
	TileSpeedRange 		= {0xff, 0x3F},
	PanSpeedRange 		= {0xff, 0x3F},
	ScanRange 			= {0x01, 0x05},
	AuxRange 			= {0xff, 0xff},
}

Protocol.CommandAttr =
{
	AddrPos 			= 1, 
	PresetPos 		= 6, 
	TileSpeedPos 	= 6,
	PanSpeedPos 	= 5,
	AuxPos 				= 6,
}

Protocol.Command = 
{
	Start= 
	{
		AlarmSearch 	= "0",
	},
	Stop = 
	{

	},
}

Protocol.SearchProcess = function(s, arg)
	-- 最多支持８个通道
	if (arg >= 0) and (arg < 8) then
		s[1] = bits.lshift(arg, 5) + bits.lshift(7, 2);
	end;
	 
	return s;
end;

Protocol.Checksum = function (s)
	return s;
end;

return Protocol;