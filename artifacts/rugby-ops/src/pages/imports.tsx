import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Label, Input } from '@/components/ui/core';
import { Upload, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function Imports() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      // Randomly succeed or fail for demo purposes
      setResult(Math.random() > 0.3 ? 'success' : 'error');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">データ取込 (CSV)</h1>
        <p className="text-muted-foreground mt-1">外部システムからの登録データ、試合結果などをシステムに取り込みます。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>月次登録データ インポート</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>対象年月</Label>
            <Input type="month" defaultValue="2024-04" className="w-48" />
          </div>

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/10 transition-colors">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <Label htmlFor="csv-upload" className="cursor-pointer">
                <span className="text-primary font-medium hover:underline">ファイルを選択</span>
                <span className="text-muted-foreground"> またはドラッグ＆ドロップ</span>
              </Label>
              <Input 
                id="csv-upload" 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            {file && (
              <p className="text-sm font-medium mt-4 text-foreground bg-muted inline-block px-3 py-1 rounded">
                選択中: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-4 rounded-md text-sm">
            <span className="font-bold block mb-1">注意事項</span>
            <ul className="list-disc list-inside space-y-1">
              <li>フォーマットは指定のテンプレート（v2.1）を使用してください。</li>
              <li>同一月のデータを再度取り込んだ場合、既存データは上書きされます。</li>
            </ul>
          </div>

          <Button 
            className="w-full h-12 text-base" 
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                インポート中...
              </span>
            ) : (
              <><Upload className="w-5 h-5 mr-2" /> データをインポート</>
            )}
          </Button>

          {result === 'success' && (
            <div className="p-4 bg-success/10 text-success rounded-md flex items-start gap-3 border border-success/20">
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">インポートが完了しました。</p>
                <p className="text-sm mt-1">正常に取り込まれた件数: 1,245件</p>
              </div>
            </div>
          )}

          {result === 'error' && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-start gap-3 border border-destructive/20">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">インポート中にエラーが発生しました。</p>
                <p className="text-sm mt-1">3行目: 「生年月日」の形式が正しくありません。</p>
                <p className="text-sm">ファイルを修正して再度アップロードしてください。</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
