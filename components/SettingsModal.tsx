import React, { useState, useEffect } from 'react';
import { AISettings, DEFAULT_SETTINGS } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState<AISettings>(settings);

  // Reset form data when modal opens with current settings
  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                  API 设置 (API Settings)
                </h3>
                <div className="mt-4 space-y-4">
                  
                  {/* Mode Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">服务提供商</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${formData.mode === 'gemini' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="mode" 
                            value="gemini"
                            checked={formData.mode === 'gemini'}
                            onChange={() => setFormData({...formData, mode: 'gemini'})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm font-medium text-slate-900">Google Gemini</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 ml-6">使用内置环境变量 (默认)</p>
                      </label>
                      <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${formData.mode === 'custom' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="mode" 
                            value="custom"
                            checked={formData.mode === 'custom'}
                            onChange={() => setFormData({...formData, mode: 'custom'})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm font-medium text-slate-900">自定义 / 第三方</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 ml-6">OpenAI 格式 (如硅基流动)</p>
                      </label>
                    </div>
                  </div>

                  {/* Custom API Fields */}
                  {formData.mode === 'custom' && (
                    <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fade-in">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Base URL
                        </label>
                        <input
                          type="text"
                          value={formData.customBaseUrl}
                          onChange={(e) => setFormData({...formData, customBaseUrl: e.target.value})}
                          placeholder="https://api.openai.com/v1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">例如: https://api.siliconflow.cn/v1</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={formData.customApiKey}
                          onChange={(e) => setFormData({...formData, customApiKey: e.target.value})}
                          placeholder="sk-..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Model Name
                        </label>
                        <input
                          type="text"
                          value={formData.customModelName}
                          onChange={(e) => setFormData({...formData, customModelName: e.target.value})}
                          placeholder="gpt-4o"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">推荐: deepseek-ai/DeepSeek-V3 或 Qwen/Qwen2.5-72B-Instruct</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              保存设置
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};