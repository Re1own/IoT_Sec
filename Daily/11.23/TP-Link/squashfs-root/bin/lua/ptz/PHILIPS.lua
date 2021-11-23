--[[
这是PHILIPS的云台控制协议.
PAN/TILE/ZOOM有速度控制, 停止的时候把速度设置成0; IRIS/FOCUS没有速度控制, 停止的时候把命令BIT置0.
--]]
local Protocol = {};
Protocol.Attr = 
{
	Name = "PHILIPS",	
	Type = "PTZ",
	Internal = 200,
	CamAddrRange 		= {1, 16384}, 
	MonAddrRange		= {0x00, 0xFF},	
	PresetRange 		= {0x00, 0xFF},
	TourRange		= {0xFF, 0xFF},
	PatternRange		= {0xFF, 0xFF},
	TileSpeedRange 		= {0x01, 0x0F},
	PanSpeedRange 		= {0x01, 0x0F},
	ScanRange 			= {0x01, 0x05},
	AuxRange 		= {0x01, 0x08},
}

Protocol.CommandAttr =
{
	AddrPos 		= 2, 
	PresetPos 		= 5, 
	TileSpeedPos 		= 5,
	PanSpeedPos 		= 6,
	AuxPos 			= 5,
}

Protocol.Command = 
{
	Start= 
	{
		TileUp 		= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x08, 0x01",
		TileDown 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x04, 0x01",
		PanLeft 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x02, 0x01",
		PanRight 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x01, 0x01",
		LeftUp 		= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x0A, 0x01",
		LeftDown 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x06, 0x01",
		RightUp		= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x09, 0x01",
		RightDown 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x05, 0x01",
		ZoomWide 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x20, 0x01",
		ZoomTele 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x10, 0x01",
		FocusNear	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x40, 0x01",
		FocusFar 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x01, 0x00, 0x01",
		IrisSmall 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x02, 0x00, 0x01",
		IrisLarge 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x04, 0x00, 0x01",
		SetPreset 	= "0x86, 0x00, 0x00, 0x07, 0x04, 0x00, 0x00",
		GoToPreset 	= "0x86, 0x00, 0x00, 0x07, 0x05, 0x00, 0x00",
		AutoPanOn	= "0x86, 0x00, 0x00, 0x02, 0x00, 0x10, 0x00",
		AutoPanOff	= "0x86, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00",
		AuxOn 		= "0x86, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00",
		AuxOff 		= "0x86, 0x00, 0x00, 0x07, 0x02, 0x00, 0x00",
	},
	Stop = 
	{
		TileUp 		= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x08, 0x00",
		TileDown 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x04, 0x00",
		PanLeft 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x02, 0x00",
		PanRight 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x01, 0x00",
		LeftUp 		= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x0A, 0x00",
		LeftDown 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x06, 0x00",
		RightUp		= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x09, 0x00",
		RightDown 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x05, 0x00",
		ZoomWide 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x20, 0x00",
		ZoomTele 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x10, 0x00",
		FocusNear	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00",
		FocusFar 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00",
		IrisSmall 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00",
		IrisLarge 	= "0x87, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00",
	},
}

Protocol.Checksum = function (s)
	if s[1] == 0x87 then
		s[8] = bits.band((s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7]), 0x7F);
	elseif s[1] == 0x86 then
		s[7] = bits.band((s[1] + s[2] + s[3] + s[4] + s[5] + s[6]), 0x7F);
	end;
	return s;
end;

Protocol.CamAddrProcess = function(s, addr)
	local low_7 = bits.band(addr, 0x7F);
	local high_7 = bits.rshift(addr, 7);
	s[Protocol.CommandAttr.AddrPos] = high_7;
	s[Protocol.CommandAttr.AddrPos + 1] = low_7;
	return s;
end;

Protocol.SpeedProcess = function(s, ver, hor)
	if s[8] == 0x01 then
		if ver ~= 0x00 then
			s[Protocol.CommandAttr.TileSpeedPos] = bits.bor(s[Protocol.CommandAttr.TileSpeedPos], ver);
		end;
		if hor ~= 0x00 then
			local newhor = bits.lshift(hor, 3);
			s[Protocol.CommandAttr.PanSpeedPos] = bits.bor(s[Protocol.CommandAttr.PanSpeedPos], newhor);
		end;
	end;
	return s;
end;

Protocol.MultipleProcess = function(s, multiple)
	local newspeed;
	if (s[7] == 0x20 or s[7] == 0x10) and s[8] == 0x01 then
		if multiple ~= 1 then
			print(multiple - 1);
			newspeed = bits.lshift(multiple - 1, 4);
			s[5] = bits.bor(s[5], newspeed);
		else
			print(multiple);
			newspeed = bits.lshift(multiple, 4);
			s[5] = bits.bor(s[5], newspeed);
		end;
	end;
	return s;
end;

Protocol.PresetProcess = function(s, arg)
	local low_7 = bits.band(arg, 0x7F);
	local high_3 = bits.rshift(arg, 7);
	s[Protocol.CommandAttr.PresetPos + 1] = low_7;
	high_3 = bits.lshift(high_3, 4);
	s[Protocol.CommandAttr.PresetPos] = bits.bor(s[Protocol.CommandAttr.PresetPos], high_3);
	return s;
end;

Protocol.AuxProcess = function(opttable, num)
	local low_7 = bits.band(num, 0x7F);
	local high_3 = bits.rshift(num, 7);
	opttable[Protocol.CommandAttr.AuxPos + 1] = low_7;
	high_3 = bits.lshift(high_3, 4);
	opttable[Protocol.CommandAttr.AuxPos] = bits.bor(opttable[Protocol.CommandAttr.AuxPos], high_3);
	return opttable;	
end;

return Protocol;