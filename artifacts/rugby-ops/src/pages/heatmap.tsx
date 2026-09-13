import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core';

export default function Heatmap() {
  // Mock data for heatmap visualization
  const prefectures = ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川', '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'];
  
  const generateMockData = () => {
    return prefectures.map(pref => {
      // Create weighted random based on real population approx
      const isUrban = ['東京', '神奈川', '大阪', '愛知', '埼玉', '千葉', '兵庫', '福岡'].includes(pref);
      const isRugbyStrong = ['東京', '大阪', '福岡', '京都', '神奈川'].includes(pref);
      
      const base = isUrban ? 2000 : 300;
      const multiplier = isRugbyStrong ? 2.5 : 1;
      const total = Math.floor(base * multiplier + Math.random() * (base * 0.5));
      const newReg = Math.floor(total * (0.05 + Math.random() * 0.1));
      
      return {
        name: pref,
        total,
        new: newReg,
        yoy: (Math.random() * 10 - 3).toFixed(1), // -3% to +7%
      };
    });
  };

  const data = generateMockData().sort((a, b) => b.total - a.total);

  const getIntensityColor = (value: number, max: number) => {
    const intensity = Math.min(1, value / max);
    // Use primary color (red) with varying opacity
    return `rgba(211, 47, 47, ${0.1 + intensity * 0.9})`;
  };

  const maxTotal = Math.max(...data.map(d => d.total));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">都道府県別 登録分布ヒートマップ</h1>
        <p className="text-muted-foreground mt-1">地域別の登録者数や増減率を可視化します。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>総登録者数 マップ（モック）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {data.map(item => (
              <div 
                key={item.name} 
                className="p-3 rounded border flex flex-col items-center justify-center transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: getIntensityColor(item.total, maxTotal),
                  color: item.total > maxTotal * 0.5 ? 'white' : 'inherit'
                }}
                title={`総数: ${item.total.toLocaleString()} / 新規: ${item.new.toLocaleString()}`}
              >
                <span className="font-bold text-sm">{item.name}</span>
                <span className="text-xs font-mono mt-1 opacity-90">{item.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>低</span>
            <div className="w-32 h-2 bg-gradient-to-r from-[rgba(211,47,47,0.1)] to-[rgba(211,47,47,1)] rounded"></div>
            <span>高</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
