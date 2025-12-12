import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export const Subscription: React.FC = () => {
  const [showCancelGuide, setShowCancelGuide] = useState(false);

  return (
    <div className="pb-24 px-4 pt-6">
      <h2 className="text-heading-1 font-bold text-primary mb-6">升級會員</h2>
      
      {/* Warning Banner - Crucial for elderly apps */}
      <div className="bg-yellow-50 border-l-8 border-secondary p-4 rounded-r-lg mb-8 shadow-sm">
        <div className="flex items-start gap-3">
            <AlertTriangle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
            <div>
                <h3 className="text-xl font-bold text-yellow-800">付款重要提醒</h3>
                <p className="text-lg text-yellow-800 mt-1">
                    此訂閱為<strong>自動續費</strong>。每個月會自動從您的帳戶扣款。
                    若您不想繼續使用，請務必手動取消訂閱。
                </p>
            </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-primary mb-8 relative">
        <div className="bg-primary p-6 text-center text-white">
            <h3 className="text-3xl font-bold mb-2">黃金樂齡方案</h3>
            <div className="flex justify-center items-baseline gap-1">
                <span className="text-4xl font-bold">$150</span>
                <span className="text-xl">/ 月</span>
            </div>
        </div>
        <div className="p-6">
            <ul className="space-y-4 mb-8">
                {[
                    '無限次查看配對對象',
                    '每天可發送 10 次打招呼',
                    '專屬社團優先報名',
                    '去除所有廣告'
                ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xl text-gray-700">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
            <button className="w-full bg-secondary hover:bg-yellow-500 text-white text-2xl font-bold py-5 rounded-2xl shadow-lg transform transition active:scale-95">
                確認訂閱 ($150/月)
            </button>
            <p className="text-center text-gray-500 mt-4 text-lg">
                可隨時取消，下個月生效
            </p>
        </div>
      </div>

      {/* Cancellation Guide */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <button 
            onClick={() => setShowCancelGuide(!showCancelGuide)}
            className="w-full flex justify-between items-center text-left"
        >
            <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-gray-500" />
                <span className="text-xl font-bold text-gray-700">如何取消訂閱 / 解除扣款？</span>
            </div>
            <span className="text-2xl text-gray-400">{showCancelGuide ? '−' : '+'}</span>
        </button>
        
        {showCancelGuide && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-lg text-gray-600">
                <p>1. 點擊畫面右下角的「我的帳戶」</p>
                <p>2. 選擇「訂閱管理」</p>
                <p>3. 點擊紅色的「取消訂閱」按鈕</p>
                <p>4. 看到「已取消」畫面即代表成功</p>
                <div className="bg-gray-100 p-3 rounded-lg mt-2">
                    如有任何問題，請點擊下方的「客服」按鈕，我們會協助您。
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
