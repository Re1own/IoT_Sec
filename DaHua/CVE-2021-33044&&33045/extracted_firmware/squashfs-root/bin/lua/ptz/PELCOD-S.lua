local Protocol = {};

-- 表示数值可以用16或10进制(最小值，最大值)
Protocol.Attr =
{
	-- 协议的显示名称,不能超过16字符，目前暂不支持中文
	Name = "PELCOD-S",

	-- 指明是云台协议还是矩阵协议，使用"PTZ", "MATRIX"表示
	Type = "PTZ",

	-- 以ms为单位
	Internal = 200,

	-- 没有对应的地址范围，请都设成0xff
	-- 云台地址范围
	CamAddrRange 		= {0x00, 0x1F},
	-- 监视地址范围
	MonAddrRange		= {0x00, 0xFF},
	-- 预置点范围
	PresetRange 		= {0x01, 0xFF},
	-- 自动巡航线路范围
	TourRange		= {0x00, 0xff},
	-- 轨迹线路范围
	PatternRange		= {0x00, 0xff},
	-- 垂直速度范围
	TileSpeedRange 		= {0x00, 0x3F},
	-- 水平速度范围
	PanSpeedRange 		= {0x00, 0x3F},
	-- 自动扫描范围
	ScanRange 			= {0x01, 0x05},
	-- 辅助范围
	AuxRange 		= {0x01, 0x08},
}

Protocol.CommandAttr =
{
	-- 协议中需要更改的位置，用LUA下标表示，即下标从１开始,用10进制表示
	AddrPos 		= 2,
	PresetPos 		= 6,
	TileSpeedPos 		= 6,
	PanSpeedPos 		= 5,
	AuxPos 			= 6,
        TileUp   = {bytePos = 4, bitPos = 3},
	TileDown = {bytePos = 4, bitPos = 4},
	PanLeft  = {bytePos = 4, bitPos = 2},
	PanRight = {bytePos = 4, bitPos = 1},
	ZoomWide = {bytePos = 4, bitPos = 6},
	ZoomTele = {bytePos = 4, bitPos = 5},
	FocusFar = {bytePos = 4, bitPos = 7},
	FocusNear = {bytePos = 3, bitPos = 0},
	IrisLarge = {bytePos = 3, bitPos = 1},
	IrisSmall = {bytePos = 3, bitPos = 2},
}

Protocol.Command =
{
	-- 写具体协议时只能用16进制或字符表示,没有的话就注释掉
	Start=
	{
		--写上下左右, 左上，左下，右上，右下
		STANDARD = "0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00",
	},
	Stop =
	{
		STANDARD = "0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00",
	},
}

Protocol.Checksum = function (s)
	s[7] = math.mod((s[2] + s[3] + s[4] + s[5] + s[6]), 256);

	return s;
end;

Protocol.CamAddrProcess = function(s, addr)
	local addr = math.mod(addr,256);
		s[2] = addr;
	return s;
end;

Protocol.SpeedProcess = function(s, ver, hor)
	if s[4] ~= 0x00 then
		s[6] = ver;
		s[5] = hor;
	end;

	return s;
end;

return Protocol;