import React, { useState, useEffect } from 'react';
import { generateDirections } from './services/gemini';
import { DirectionCard } from './components/DirectionCard';
import { SettingsModal } from './components/SettingsModal';
import { AnalysisResponse, AISettings, DEFAULT_SETTINGS } from './types';

function App() {
  const [academicAssets, setAcademicAssets] = useState('');
  const [marketAnalysis, setMarketAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);

  // UI State
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('academicPivotSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSaveSettings = (newSettings: AISettings) => {
    setSettings(newSettings);
    localStorage.setItem('academicPivotSettings', JSON.stringify(newSettings));
  };

  const handleSubmit = async () => {
    if (!academicAssets.trim() || !marketAnalysis.trim()) {
      setError("请填写学术积累和前序分析结果。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateDirections(academicAssets, marketAnalysis, settings);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "生成失败，请检查设置或稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setAcademicAssets(`我的研究核心资产是“光响应纳米材料的合成与表征”。
1. 掌握多种稀土上转换纳米粒子的可控合成方法；
2. 拥有光动力疗法（PDT）在细胞层面的评价体系数据；
3. 发表过 3 篇 JACS/Angew 级别的关于无机纳米材料结构设计的文章；
4. 缺点：缺乏活体实验经验，对复杂的生物免疫机制了解不深。`);
    
    setMarketAnalysis(`[学术战略大师分析]
当前生物医学领域的热点蓝海：
1. 神经调控（Neuromodulation）：利用非侵入式手段调控深部脑区，治疗抑郁症或帕金森。需要高精度的刺激源。
2. 肿瘤微环境重塑（TME Remodeling）：单纯杀伤肿瘤细胞效果有限，现在的趋势是激活免疫系统。缺氧环境的改善是关键。
3. 可穿戴生物传感器：实时监测汗液或皮下组织液的生物标志物。
4. 植物光合作用增强：农业领域的合成生物学方向，利用纳米材料提高作物光能利用率。`);
  };

  const formatAsMarkdown = (data: AnalysisResponse) => {
    const date = new Date().toISOString().split('T')[0];
    let md = `# 学术方向筛选器分析报告\n生成日期: ${date}\n\n`;
    
    data.directions.forEach((d, i) => {
      md += `## 方向 ${i + 1}: ${d.title}\n\n`;
      md += `**迁移逻辑**: ${d.logicType}\n\n`;
      
      md += `### 组合公式\n\`${d.combinationFormula}\`\n\n`;
      
      md += `### 迁移逻辑详解\n${d.migrationLogicDescription}\n\n`;
      
      md += `### 资源匹配度\n${d.resourceMatch}\n\n`;
      
      md += `### 基金申报话术\n> ${d.grantPitch}\n\n`;
      
      md += `### 四维平衡评价\n`;
      md += `- **创新性**: ${d.evaluation.innovationScore}/10\n`;
      md += `- **可行性**: ${d.evaluation.feasibilityScore}/10\n`;
      md += `- **延续性**: ${d.evaluation.continuityScore}/10\n`;
      md += `- **逻辑性**: ${d.evaluation.logicalityScore}/10\n`;
      md += `- **简评**: ${d.evaluation.analysis}\n\n`;
      
      md += `---\n\n`;
    });
    
    return md;
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = formatAsMarkdown(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const text = formatAsMarkdown(result);
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic-pivot-${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">学术方向筛选器 <span className="text-slate-400 font-normal text-sm ml-1">Academic Pivot</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleFillDemo}
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors hidden sm:block"
            >
              加载示例数据
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              title="设置 / Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mr-2">1</span>
                输入背景信息
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    学术积累（核心资产）
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    列出您的论文方向、掌握的数据集、独特实验技术等。
                  </p>
                  <textarea
                    value={academicAssets}
                    onChange={(e) => setAcademicAssets(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
                    placeholder="例如：我长期从事钙钛矿太阳能电池研究，拥有大量缺陷态表征数据..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    前序分析结果
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    粘贴“学术战略大师”生成的蓝海/无人区分析结果。
                  </p>
                  <textarea
                    value={marketAnalysis}
                    onChange={(e) => setMarketAnalysis(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
                    placeholder="例如：战略分析指出，柔性电子皮肤在极端环境下的稳定性是一个未被充分解决的蓝海..."
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all
                    ${isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-blue-200'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      运行 6维学术迁移分析...
                    </>
                  ) : (
                    '生成申请方向'
                  )}
                </button>
                {settings.mode === 'custom' && (
                  <p className="text-xs text-center text-slate-400 mt-2">
                    正在使用自定义 API: {settings.customModelName}
                  </p>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results Panel */}
          <div className="lg:col-span-8">
            {!result && !isLoading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-lg font-medium">等待输入分析数据</p>
                <p className="text-sm mt-2 max-w-xs text-center">
                  在左侧输入您的学术核心资产和前序分析结果，AI 将为您规划最佳转型路径。
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-800">正在构建逻辑闭环...</h3>
                <div className="w-full max-w-md mt-4 space-y-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 px-1">
                    <span>谱系延伸</span>
                    <span>方法论入侵</span>
                    <span>范式升级</span>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">推荐申请方向</h2>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full hidden sm:inline-block">
                      基于 6维学术迁移逻辑
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button 
                      onClick={handleCopy}
                      className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      title="复制 Markdown"
                    >
                      {copyStatus === 'copied' ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-600">已复制</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          复制结果
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleDownload}
                      className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      title="下载 Markdown 文件"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {result.directions.map((direction, idx) => (
                    <DirectionCard key={idx} data={direction} index={idx} />
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mt-8">
                  <strong>💡 专家提示：</strong> 建议选择“迁移逻辑”最清晰且“资源匹配度”最高的 1-2 个方向进行深入调研。在撰写基金本子时，请直接复用生成的“组合公式”和“申报话术”来强化立项依据。
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;