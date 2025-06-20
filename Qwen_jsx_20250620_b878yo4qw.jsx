import { useState, useEffect } from "react";

export default function App() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updateResult, setUpdateResult] = useState("");
  const [currentView, setCurrentView] = useState("TRACKING"); // TRACKING | ADMIN_LOGIN | ADMIN_PANEL | SHIPPING_COST | SCHEDULE
  
  // 运费查询相关状态
  const [shippingForm, setShippingForm] = useState({
    postalCode: "",
    weight: "",
    length: "",
    width: "",
    height: ""
  });
  const [shippingResult, setShippingResult] = useState(null);
  
  // 班期查询相关状态
  const [scheduleType, setScheduleType] = useState("AIR");
  const [scheduleSubType, setScheduleSubType] = useState("B2B");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // 使用useState管理物流数据，确保状态持久化
  const [mockDatabase, setMockDatabase] = useState({
    "9400100000000001234567": [
      { date: "2025-04-05", time: "14:20", status: "已签收，签收人：前台代收" },
      { date: "2025-04-05", time: "08:15", status: "【北京市】快件已到达北京朝阳三里屯网点" },
      { date: "2025-04-04", time: "22:40", status: "【北京市】快件从北京总部发出，下一站上海转运中心" },
      { date: "2025-04-04", time: "10:30", status: "【上海市】快件已揽收，快递员：张伟" },
    ],
    "9400100000000007654321": [
      { date: "2025-04-06", time: "10:10", status: "【深圳市】快件已到达深圳南山区科技园网点" },
      { date: "2025-04-05", time: "18:30", status: "【广州市】快件从广州白云分拨中心发出" },
      { date: "2025-04-05", time: "09:00", status: "【佛山市】快件已揽收，快递员：李娜" },
    ],
  });

  // 模拟班期数据
  const scheduleData = {
    AIR: {
      B2B: [
        { day: 1, note: "每周一、三、五发运" },
        { day: 3, note: "每周一、三、五发运" },
        { day: 5, note: "每周一、三、五发运" },
        { day: 8, note: "每周一、三、五发运" },
        { day: 10, note: "每周一、三、五发运" },
        { day: 12, note: "每周一、三、五发运" },
        { day: 15, note: "每周一、三、五发运" },
        { day: 17, note: "每周一、三、五发运" },
        { day: 19, note: "每周一、三、五发运" },
        { day: 22, note: "每周一、三、五发运" },
        { day: 24, note: "每周一、三、五发运" },
        { day: 26, note: "每周一、三、五发运" },
        { day: 29, note: "每周一、三、五发运" },
      ],
      B2C: [
        { day: 1, note: "每日发运" },
        { day: 2, note: "每日发运" },
        { day: 3, note: "每日发运" },
        { day: 4, note: "每日发运" },
        { day: 5, note: "每日发运" },
        { day: 6, note: "每日发运" },
        { day: 7, note: "每日发运" },
        { day: 8, note: "每日发运" },
        { day: 9, note: "每日发运" },
        { day: 10, note: "每日发运" },
        { day: 11, note: "每日发运" },
        { day: 12, note: "每日发运" },
        { day: 13, note: "每日发运" },
        { day: 14, note: "每日发运" },
        { day: 15, note: "每日发运" },
        { day: 16, note: "每日发运" },
        { day: 17, note: "每日发运" },
        { day: 18, note: "每日发运" },
        { day: 19, note: "每日发运" },
        { day: 20, note: "每日发运" },
        { day: 21, note: "每日发运" },
        { day: 22, note: "每日发运" },
        { day: 23, note: "每日发运" },
        { day: 24, note: "每日发运" },
        { day: 25, note: "每日发运" },
        { day: 26, note: "每日发运" },
        { day: 27, note: "每日发运" },
        { day: 28, note: "每日发运" },
        { day: 29, note: "每日发运" },
        { day: 30, note: "每日发运" },
      ],
      DOCUMENT: [
        { day: 2, note: "每周二、四发运" },
        { day: 4, note: "每周二、四发运" },
        { day: 9, note: "每周二、四发运" },
        { day: 11, note: "每周二、四发运" },
        { day: 16, note: "每周二、四发运" },
        { day: 18, note: "每周二、四发运" },
        { day: 23, note: "每周二、四发运" },
        { day: 25, note: "每周二、四发运" },
        { day: 30, note: "每周二、四发运" },
      ]
    },
    LAND: {
      B2B: [
        { day: 1, note: "每周一、三发运" },
        { day: 3, note: "每周一、三发运" },
        { day: 8, note: "每周一、三发运" },
        { day: 10, note: "每周一、三发运" },
        { day: 15, note: "每周一、三发运" },
        { day: 17, note: "每周一、三发运" },
        { day: 22, note: "每周一、三发运" },
        { day: 24, note: "每周一、三发运" },
        { day: 29, note: "每周一、三发运" },
      ],
      B2C: [
        { day: 1, note: "每日发运" },
        { day: 2, note: "每日发运" },
        { day: 3, note: "每日发运" },
        { day: 4, note: "每日发运" },
        { day: 5, note: "每日发运" },
        { day: 6, note: "每日发运" },
        { day: 7, note: "每日发运" },
        { day: 8, note: "每日发运" },
        { day: 9, note: "每日发运" },
        { day: 10, note: "每日发运" },
        { day: 11, note: "每日发运" },
        { day: 12, note: "每日发运" },
        { day: 13, note: "每日发运" },
        { day: 14, note: "每日发运" },
        { day: 15, note: "每日发运" },
        { day: 16, note: "每日发运" },
        { day: 17, note: "每日发运" },
        { day: 18, note: "每日发运" },
        { day: 19, note: "每日发运" },
        { day: 20, note: "每日发运" },
        { day: 21, note: "每日发运" },
        { day: 22, note: "每日发运" },
        { day: 23, note: "每日发运" },
        { day: 24, note: "每日发运" },
        { day: 25, note: "每日发运" },
        { day: 26, note: "每日发运" },
        { day: 27, note: "每日发运" },
        { day: 28, note: "每日发运" },
        { day: 29, note: "每日发运" },
        { day: 30, note: "每日发运" },
      ]
    }
  };

  const handleTrack = () => {
    if (mockDatabase[trackingNumber]) {
      setResult(mockDatabase[trackingNumber]);
    } else {
      setResult("未找到该单号的物流信息，请确认单号是否正确。");
    }
  };

  const handleUpdate = () => {
    if (!trackingNumber || !newStatus) {
      setUpdateResult("请输入有效的单号和状态内容");
      return;
    }

    setMockDatabase(prevDb => {
      const updatedDb = { ...prevDb };
      
      if (!updatedDb[trackingNumber]) {
        updatedDb[trackingNumber] = [];
      }

      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().slice(0, 5);

      // 创建新的物流轨迹数组
      const newTracking = [
        { date, time, status: newStatus },
        ...updatedDb[trackingNumber]
      ];
      
      // 更新数据库
      updatedDb[trackingNumber] = newTracking;
      
      // 如果当前查询的是正在更新的单号，同步更新查询结果
      if (trackingNumber in updatedDb) {
        setResult(updatedDb[trackingNumber]);
      }
      
      return updatedDb;
    });
    
    setUpdateResult(`状态更新成功！单号 ${trackingNumber} 已添加新状态`);
    setNewStatus("");
  };

  const handleAdminLogin = () => {
    if (adminPassword === "admin123") {
      setIsAdminLoggedIn(true);
      setCurrentView("ADMIN_PANEL");
      setUpdateResult("登录成功");
    } else {
      setUpdateResult("密码错误");
    }
  };

  const handleShippingCalculate = () => {
    // 简单的运费计算逻辑（示例）
    const { postalCode, weight, length, width, height } = shippingForm;
    
    if (!postalCode || !weight || !length || !width || !height) {
      setShippingResult({ error: "请填写所有必填字段" });
      return;
    }
    
    // 模拟计算
    const baseRate = 15; // 基础运费
    const weightRate = 3; // 重量单价
    const volumeRate = 0.5; // 体积单价
    
    const weightCost = parseFloat(weight) * weightRate;
    const volume = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000;
    const volumeCost = volume * volumeRate;
    
    const total = baseRate + weightCost + volumeCost;
    
    setShippingResult({
      base: baseRate.toFixed(2),
      weightCost: weightCost.toFixed(2),
      volumeCost: volumeCost.toFixed(2),
      total: total.toFixed(2)
    });
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderScheduleEntries = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthNow = today.getMonth();
    const currentYearNow = today.getFullYear();
    
    const entries = scheduleData[scheduleType]?.[scheduleSubType] || [];
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const entry = entries.find(e => e.day === day);
      
      const isPast = 
        (currentYear < currentYearNow) ||
        (currentYear === currentYearNow && currentMonth < currentMonthNow) ||
        (currentYear === currentYearNow && currentMonth === currentMonthNow && day < currentDay);
      
      return (
        <div 
          key={day} 
          className={`p-2 border rounded-md mb-2 ${
            entry ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className={`font-medium ${isPast ? 'text-gray-500' : ''}`}>{day}日</span>
            {entry && (
              <span className="text-sm text-green-600">{entry.note}</span>
            )}
            {!entry && (
              <span className="text-sm text-gray-400">无班期</span>
            )}
          </div>
        </div>
      );
    });
  };

  const renderHeader = () => (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo placeholder */}
          <div className="h-8 w-8 mr-3">
            <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5L35 15V25L20 35L5 25V15L20 5Z" fill="#33CC00"/>
              <path d="M20 10L25 15V25L20 30L15 25V15L20 10Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#33CC00' }}>CDEK Logistics</h1>
        </div>
      </div>
    </header>
  );

  const renderTrackingView = () => (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Tracking Form */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">查询快递信息</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="输入快递单号"
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
          />
          <button
            onClick={handleTrack}
            className="px-4 py-2 bg-[#33CC00] text-white rounded hover:bg-[#2fb800] transition-colors"
          >
            查询
          </button>
        </div>
      </section>

      {/* Result Display */}
      {result !== null && (
        <section className="p-6 bg-white rounded-lg shadow-md">
          {typeof result === "string" ? (
            <p className="text-red-500">{result}</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">物流轨迹</h2>
              <ul className="space-y-4">
                {result.map((item, index) => (
                  <li key={index} className="relative pl-6 border-l-2" style={{ borderColor: '#33CC00' }}>
                    <span className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#33CC00' }}>
                      {index + 1}
                    </span>
                    <p className="font-medium">{item.status}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.date} {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      
      <div className="mt-8 flex justify-center space-x-6">
        <button
          onClick={() => setCurrentView("SHIPPING_COST")}
          className="px-6 py-3 bg-[#33CC00] text-white rounded-lg hover:bg-[#2fb800] transition-colors shadow-md flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>运费查询</span>
        </button>
        
        <button
          onClick={() => setCurrentView("SCHEDULE")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>班期查询</span>
        </button>
        
        <button
          onClick={() => setCurrentView("ADMIN_LOGIN")}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2667 15 19.1333 15 19 15C15.686 15 13 12.314 13 9C13 5.686 15.686 3 19 3C22.314 3 25 5.686 25 9C25 12.314 22.314 15 19 15H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>管理员登录</span>
        </button>
      </div>
    </main>
  );

  const renderScheduleView = () => (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">本月班期安排</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="px-4 py-1 font-medium">
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* 运输类型选项卡 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setScheduleType("AIR")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                scheduleType === "AIR"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              空运
            </button>
            <button
              onClick={() => setScheduleType("LAND")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                scheduleType === "LAND"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              陆运
            </button>
          </nav>
        </div>
        
        {/* 子类型选项卡 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {scheduleType === "AIR" && (
              <>
                <button
                  onClick={() => setScheduleSubType("B2B")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scheduleSubType === "B2B"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  B2B
                </button>
                <button
                  onClick={() => setScheduleSubType("B2C")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scheduleSubType === "B2C"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  B2C
                </button>
                <button
                  onClick={() => setScheduleSubType("DOCUMENT")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scheduleSubType === "DOCUMENT"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  文件
                </button>
              </>
            )}
            
            {scheduleType === "LAND" && (
              <>
                <button
                  onClick={() => setScheduleSubType("B2B")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scheduleSubType === "B2B"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  B2B
                </button>
                <button
                  onClick={() => setScheduleSubType("B2C")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scheduleSubType === "B2C"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  B2C
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* 班期日历 */}
        <div className="mt-6">
          <h3 className="font-medium mb-4">
            {scheduleType === "AIR" ? "空运" : "陆运"} - {scheduleSubType}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {["日", "一", "二", "三", "四", "五", "六"].map(day => (
              <div key={day} className="text-center text-sm text-gray-500 font-medium py-2">
                {day}
              </div>
            ))}
            
            {/* 渲染空格填充第一个日期前的空白 */}
            {(() => {
              const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
              const emptySlots = Array(firstDayOfMonth).fill(null);
              return emptySlots.map((_, index) => (
                <div key={`empty-${index}`} className="p-2"></div>
              ));
            })()}
            
            {/* 渲染班期条目 */}
            {renderScheduleEntries()}
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              setCurrentView("TRACKING");
              // 重置班期查询状态
              setScheduleType("AIR");
              setScheduleSubType("B2B");
              setCurrentMonth(new Date().getMonth());
              setCurrentYear(new Date().getFullYear());
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            返回首页
          </button>
          
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-50 border border-green-200 mr-2"></div>
              <span className="text-sm text-gray-600">有班期</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-200 mr-2"></div>
              <span className="text-sm text-gray-600">无班期</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 mr-2"></div>
              <span className="text-sm text-gray-600">已过期</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  const renderShippingCost = () => (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">运费计算</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">收件城市邮编</label>
            <input
              type="text"
              value={shippingForm.postalCode}
              onChange={(e) => setShippingForm({...shippingForm, postalCode: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
              placeholder="请输入邮政编码"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">货物重量（kg）</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={shippingForm.weight}
              onChange={(e) => setShippingForm({...shippingForm, weight: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
              placeholder="请输入重量"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">货物尺寸（cm）</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="0"
                value={shippingForm.length}
                onChange={(e) => setShippingForm({...shippingForm, length: e.target.value})}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
                placeholder="长"
              />
              <input
                type="number"
                min="0"
                value={shippingForm.width}
                onChange={(e) => setShippingForm({...shippingForm, width: e.target.value})}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
                placeholder="宽"
              />
              <input
                type="number"
                min="0"
                value={shippingForm.height}
                onChange={(e) => setShippingForm({...shippingForm, height: e.target.value})}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
                placeholder="高"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleShippingCalculate}
            className="px-6 py-2 bg-[#33CC00] text-white rounded hover:bg-[#2fb800] transition-colors"
          >
            计算运费
          </button>
          <button
            onClick={() => {
              setCurrentView("TRACKING");
              setShippingResult(null);
              setShippingForm({
                postalCode: "",
                weight: "",
                length: "",
                width: "",
                height: ""
              });
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            返回首页
          </button>
        </div>
        
        {shippingResult && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">运费计算结果</h3>
            {shippingResult.error ? (
              <p className="text-red-500">{shippingResult.error}</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>基础运费:</span>
                  <span className="font-medium">¥{shippingResult.base}</span>
                </div>
                <div className="flex justify-between">
                  <span>重量费用:</span>
                  <span className="font-medium">¥{shippingResult.weightCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>体积费用:</span>
                  <span className="font-medium">¥{shippingResult.volumeCost}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold">总费用:</span>
                  <span className="font-bold text-lg">¥{shippingResult.total}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );

  const renderAdminLogin = () => (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">管理员登录</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
              placeholder="输入管理员密码"
            />
          </div>
          <button
            onClick={handleAdminLogin}
            className="w-full px-4 py-2 bg-[#33CC00] text-white rounded hover:bg-[#2fb800] transition-colors"
          >
            登录
          </button>
          {updateResult && (
            <p className={`text-sm text-center ${updateResult.startsWith('密码') ? 'text-red-500' : 'text-green-600'}`}>
              {updateResult}
            </p>
          )}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setCurrentView("TRACKING");
              setAdminPassword("");
              setUpdateResult("");
            }}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            返回首页
          </button>
        </div>
      </div>
    </main>
  );

  const renderAdminPanel = () => (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">手动更新物流信息</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">快递单号</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
              placeholder="输入快递单号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">新增物流状态</label>
            <textarea
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#33CC00]"
              placeholder="例如：【杭州市】快件已到达杭州转运中心"
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-[#33CC00] text-white rounded hover:bg-[#2fb800] transition-colors"
            >
              更新物流信息
            </button>
            <button
              onClick={() => {
                setCurrentView("TRACKING");
                setAdminPassword("");
                setUpdateResult("");
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              返回查询界面
            </button>
          </div>
        </div>
        {updateResult && <p className="mt-4 text-sm text-green-600">{updateResult}</p>}
      </section>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      {currentView === "TRACKING" && renderTrackingView()}
      {currentView === "SHIPPING_COST" && renderShippingCost()}
      {currentView === "ADMIN_LOGIN" && renderAdminLogin()}
      {currentView === "ADMIN_PANEL" && renderAdminPanel()}
      {currentView === "SCHEDULE" && renderScheduleView()}

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>CDEK SHANGHAI ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  );
}